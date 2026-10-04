import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkDeliveryServiceability } from '@/lib/geo';
import { createRazorpayOrder } from '@/lib/razorpay';
import { emitOrderEvent } from '@/lib/events';
import { z } from 'zod';

const createOrderSchema = z.object({
  addressId: z.string().min(1, 'Address is required'),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      size: z.string().optional().nullable(),
      quantity: z.number().int().positive(),
      selectedAddons: z
        .array(
          z.object({
            id: z.string().optional(),
            name: z.string(),
            price: z.number(),
          })
        )
        .optional()
        .default([]),
    })
  ).min(1, 'Cart cannot be empty'),
  paymentMethod: z.enum(['RAZORPAY', 'COD']),
  couponCode: z.string().optional().nullable(),
  deliveryInstructions: z.string().optional().nullable(),
  kitchenNotes: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Please login to place an order' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      addressId,
      items,
      paymentMethod,
      couponCode,
      deliveryInstructions,
      kitchenNotes,
    } = result.data;

    // 1. Fetch and verify Address
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id },
    });

    if (!address) {
      return NextResponse.json(
        { success: false, message: 'Delivery address not found or unauthorized' },
        { status: 404 }
      );
    }

    // 2. Fetch Restaurant Settings
    const restaurant = await prisma.restaurant.findFirst();
    const taxRate = (restaurant?.taxPercentage ?? 5.0) / 100;
    const packagingFee = restaurant?.packagingFee ?? 25.0;

    // 3. Backend Price Verification & Item Calculation
    const menuItemIds = items.map((i) => i.menuItemId);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      include: { addons: true },
    });

    const itemMap = new Map(dbMenuItems.map((item) => [item.id, item]));

    let calculatedSubtotal = 0;
    const preparedOrderItems: any[] = [];

    for (const clientItem of items) {
      const dbItem = itemMap.get(clientItem.menuItemId);
      if (!dbItem || !dbItem.isAvailable) {
        return NextResponse.json(
          {
            success: false,
            message: `Item "${dbItem?.name || 'Item'}" is currently unavailable.`,
          },
          { status: 400 }
        );
      }

      // Determine base item price based on selected size
      let unitPrice = dbItem.discountedPrice || dbItem.price;
      if (clientItem.size && dbItem.sizesJson) {
        try {
          const sizes = JSON.parse(dbItem.sizesJson);
          const matchedSize = sizes.find((s: any) => s.name === clientItem.size);
          if (matchedSize && typeof matchedSize.price === 'number') {
            unitPrice = matchedSize.price;
          }
        } catch (e) {
          // Fallback to base unitPrice
        }
      }

      // Add verified addons
      let addonsSubtotal = 0;
      const validAddons: any[] = [];
      if (clientItem.selectedAddons && clientItem.selectedAddons.length > 0) {
        for (const addon of clientItem.selectedAddons) {
          const dbAddon = dbItem.addons.find((a) => a.name === addon.name);
          const addonPrice = dbAddon ? dbAddon.price : addon.price;
          addonsSubtotal += addonPrice;
          validAddons.push({ name: addon.name, price: addonPrice });
        }
      }

      const itemTotalPrice = (unitPrice + addonsSubtotal) * clientItem.quantity;
      calculatedSubtotal += itemTotalPrice;

      preparedOrderItems.push({
        menuItemId: dbItem.id,
        name: dbItem.name,
        size: clientItem.size || 'Standard',
        price: unitPrice,
        quantity: clientItem.quantity,
        addOnsJson: validAddons.length > 0 ? JSON.stringify(validAddons) : null,
        subtotal: itemTotalPrice,
      });
    }

    if (calculatedSubtotal < (restaurant?.minOrderAmount || 200)) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order value is ₹${restaurant?.minOrderAmount || 200}. Current subtotal is ₹${calculatedSubtotal}.`,
        },
        { status: 400 }
      );
    }

    // 4. Verify Delivery Serviceability & calculate fee
    const serviceability = await checkDeliveryServiceability(
      address.latitude,
      address.longitude,
      calculatedSubtotal
    );

    if (!serviceability.isServiceable) {
      return NextResponse.json(
        {
          success: false,
          message: serviceability.reason || 'Sorry, Arabian Mandi does not deliver to this location.',
        },
        { status: 400 }
      );
    }

    // 5. Coupon calculation
    let discount = 0;
    let verifiedCouponCode: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        if (!coupon.expiresAt || new Date(coupon.expiresAt) >= new Date()) {
          if (calculatedSubtotal >= coupon.minOrderAmount) {
            if (coupon.discountType === 'PERCENTAGE') {
              discount = (calculatedSubtotal * coupon.discountValue) / 100;
              if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
              }
            } else {
              discount = coupon.discountValue;
            }
            if (discount > calculatedSubtotal) discount = calculatedSubtotal;
            verifiedCouponCode = coupon.code;

            // Increment usage
            await prisma.coupon.update({
              where: { id: coupon.id },
              data: { timesUsed: { increment: 1 } },
            });
          }
        }
      }
    }

    // 6. Tax & Grand Total
    const taxableAmount = Math.max(0, calculatedSubtotal - discount);
    const tax = Math.round(taxableAmount * taxRate * 100) / 100;
    const deliveryFee = serviceability.deliveryFee;
    const totalAmount = Math.round((taxableAmount + tax + deliveryFee + packagingFee) * 100) / 100;

    // 7. Unique Order Number & Delivery OTP
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AM-${dateStr}-${randomSuffix}`;
    const deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));

    // 8. Create Order in Database (Transaction-safe)
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: user.id,
          addressId: address.id,
          status: paymentMethod === 'COD' ? 'PLACED' : 'PLACED',
          subtotal: calculatedSubtotal,
          discount,
          deliveryFee,
          tax,
          packagingFee,
          totalAmount,
          appliedCoupon: verifiedCouponCode,
          deliveryInstructions: deliveryInstructions || address.deliveryInstructions,
          kitchenNotes,
          deliveryOtp,
          estimatedDeliveryMin: serviceability.estimatedDeliveryMin,
          items: {
            create: preparedOrderItems,
          },
        },
        include: {
          items: true,
          address: true,
        },
      });

      // Create Payment record
      await tx.payment.create({
        data: {
          orderId: order.id,
          paymentMethod,
          status: 'PENDING',
          amount: totalAmount,
        },
      });

      return order;
    });

    // 9. Razorpay Order Creation if applicable
    let razorpayOrder = null;
    if (paymentMethod === 'RAZORPAY') {
      razorpayOrder = await createRazorpayOrder({
        amountInPaisa: totalAmount * 100,
        receipt: newOrder.orderNumber,
        notes: {
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          customerEmail: user.email,
        },
      });

      // Update payment record with razorpayOrderId
      await prisma.payment.update({
        where: { orderId: newOrder.id },
        data: {
          razorpayOrderId: razorpayOrder.id,
        },
      });
    }

    // 10. Emit Real-time Notification
    emitOrderEvent('ORDER_CREATED', {
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      totalAmount: newOrder.totalAmount,
      customerName: user.name,
      paymentMethod,
      targetRole: 'KITCHEN_STAFF',
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
      razorpayOrder,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const where: any = {};

    // If customer, only own orders
    if (user.role === 'CUSTOMER') {
      where.customerId = user.id;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        address: true,
        payment: true,
        deliveryAssignment: {
          include: {
            deliveryPartner: {
              select: { id: true, name: true, phone: true, profileImage: true },
            },
          },
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

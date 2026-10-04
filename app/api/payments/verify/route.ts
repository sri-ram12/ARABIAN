import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { emitOrderEvent } from '@/lib/events';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, message: 'Missing payment verification credentials' },
        { status: 400 }
      );
    }

    // 1. Fetch Order and Payment from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order || !order.payment) {
      return NextResponse.json(
        { success: false, message: 'Order or payment record not found' },
        { status: 404 }
      );
    }

    // 2. Prevent duplicate payment verification
    if (order.payment.status === 'PAID') {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified and marked as PAID',
        order,
      });
    }

    // 3. Cryptographic Signature Verification
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: { status: 'FAILED' },
      });

      emitOrderEvent('PAYMENT_FAILED', {
        orderId: order.id,
        orderNumber: order.orderNumber,
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Payment verification failed: invalid cryptographic signature',
        },
        { status: 400 }
      );
    }

    // 4. Update Database: mark Payment as PAID and Order as CONFIRMED
    const paymentId = order.payment.id;
    const updatedOrder = await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'PAID',
          razorpayPaymentId,
          razorpaySignature,
          paidAt: new Date(),
        },
      });

      return await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'CONFIRMED',
        },
        include: {
          items: true,
          payment: true,
          address: true,
        },
      });
    });

    // 5. Emit Real-time Events to Kitchen and Admin
    emitOrderEvent('ORDER_CONFIRMED', {
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      totalAmount: updatedOrder.totalAmount,
      targetRole: 'KITCHEN_STAFF',
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Order confirmed!',
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error('Payment verification exception:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

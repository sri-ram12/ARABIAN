import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { emitOrderEvent } from '@/lib/events';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: {
              select: { image: true, slug: true },
            },
          },
        },
        address: true,
        payment: true,
        customer: {
          select: { id: true, name: true, phone: true, email: true },
        },
        deliveryAssignment: {
          include: {
            deliveryPartner: {
              select: { id: true, name: true, phone: true, profileImage: true },
            },
          },
        },
        review: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Role check: customer can only view own order
    if (user.role === 'CUSTOMER' && order.customerId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    // If OUT_FOR_DELIVERY, fetch latest live location of delivery partner
    let latestLocation = null;
    if (order.status === 'OUT_FOR_DELIVERY' && order.deliveryAssignment?.deliveryPartnerId) {
      latestLocation = await prisma.deliveryLocation.findFirst({
        where: {
          deliveryPartnerId: order.deliveryAssignment.deliveryPartnerId,
          orderId: order.id,
        },
        orderBy: { timestamp: 'desc' },
      });

      // If no location specific to order, fallback to partner's latest location
      if (!latestLocation) {
        latestLocation = await prisma.deliveryLocation.findFirst({
          where: { deliveryPartnerId: order.deliveryAssignment.deliveryPartnerId },
          orderBy: { timestamp: 'desc' },
        });
      }
    }

    return NextResponse.json({
      success: true,
      order,
      latestLocation,
    });
  } catch (error) {
    console.error('Fetch order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve order' },
      { status: 500 }
    );
  }
}

// Order cancellation by customer (if before PREPARING)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { action, reason } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (action === 'CANCEL') {
      // Check customer permission
      if (user.role === 'CUSTOMER' && order.customerId !== user.id) {
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
      }

      // Check cancellation rules
      if (user.role === 'CUSTOMER' && !['PLACED', 'CONFIRMED'].includes(order.status)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Order is already being prepared or out for delivery. Cancellation is no longer permitted.',
          },
          { status: 400 }
        );
      }

      const updated = await prisma.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          kitchenNotes: reason ? `Cancelled by customer: ${reason}` : 'Cancelled by customer',
        },
      });

      // If paid online, initiate refund record
      if (order.payment && order.payment.status === 'PAID') {
        await prisma.payment.update({
          where: { id: order.payment.id },
          data: {
            status: 'REFUNDED',
            refundId: `rfnd_${Date.now()}`,
            refundAmount: order.totalAmount,
          },
        });
      }

      emitOrderEvent('ORDER_CANCELLED', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        targetRole: 'ADMIN',
      });

      return NextResponse.json({
        success: true,
        message: 'Order cancelled successfully',
        order: updated,
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update order' },
      { status: 500 }
    );
  }
}

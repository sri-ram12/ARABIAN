import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { emitOrderEvent } from '@/lib/events';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { status, deliveryPartnerId, action, reason } = body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        payment: true,
        deliveryAssignment: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // 1. Assign Delivery Partner
    if (action === 'ASSIGN_RIDER' && deliveryPartnerId) {
      const rider = await prisma.user.findFirst({
        where: { id: deliveryPartnerId, role: 'DELIVERY_PARTNER' },
      });

      if (!rider) {
        return NextResponse.json({ success: false, message: 'Delivery partner not found' }, { status: 404 });
      }

      const assignment = await prisma.deliveryAssignment.upsert({
        where: { orderId: order.id },
        update: {
          deliveryPartnerId: rider.id,
          status: 'ASSIGNED',
          assignedAt: new Date(),
        },
        create: {
          orderId: order.id,
          deliveryPartnerId: rider.id,
          status: 'ASSIGNED',
          earnings: 60.0,
          distanceKm: 3.5,
        },
      });

      emitOrderEvent('DELIVERY_ASSIGNED', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        deliveryPartnerId: rider.id,
        deliveryPartnerName: rider.name,
      });

      return NextResponse.json({
        success: true,
        message: `Assigned order to ${rider.name}`,
        assignment,
      });
    }

    // 2. Refund action
    if (action === 'REFUND') {
      if (!order.payment || order.payment.status !== 'PAID') {
        return NextResponse.json(
          { success: false, message: 'Cannot refund an unpaid order' },
          { status: 400 }
        );
      }

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: order.payment.id },
          data: {
            status: 'REFUNDED',
            refundId: `rfnd_${Date.now()}`,
            refundAmount: order.totalAmount,
          },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { status: 'CANCELLED' },
        }),
      ]);

      emitOrderEvent('ORDER_CANCELLED', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        refunded: true,
      });

      return NextResponse.json({
        success: true,
        message: 'Refund recorded and order cancelled',
      });
    }

    // 3. Status Transition
    if (status) {
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: {
          status,
          ...(status === 'DELIVERED' ? { updatedAt: new Date() } : {}),
        },
        include: {
          payment: true,
          items: true,
          address: true,
        },
      });

      // If status is DELIVERED and COD, mark payment as PAID
      if (status === 'DELIVERED' && updated.payment?.paymentMethod === 'COD' && updated.payment.status !== 'PAID') {
        await prisma.payment.update({
          where: { id: updated.payment.id },
          data: { status: 'PAID', paidAt: new Date() },
        });
      }

      emitOrderEvent(`ORDER_${status}`, {
        orderId: updated.id,
        orderNumber: updated.orderNumber,
        status: updated.status,
      });

      return NextResponse.json({
        success: true,
        message: `Order status updated to ${status}`,
        order: updated,
      });
    }

    return NextResponse.json({ success: false, message: 'No valid action provided' }, { status: 400 });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order' },
      { status: 500 }
    );
  }
}

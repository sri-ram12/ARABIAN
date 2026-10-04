import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { emitOrderEvent } from '@/lib/events';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'DELIVERY_PARTNER' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { assignmentId, action, otp } = await req.json();

    const assignment = await prisma.deliveryAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        order: {
          include: { payment: true },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, message: 'Delivery assignment not found' },
        { status: 404 }
      );
    }

    // Role check: Rider can only act on own assignment unless Admin
    if (user.role === 'DELIVERY_PARTNER' && assignment.deliveryPartnerId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    if (action === 'ACCEPT') {
      await prisma.deliveryAssignment.update({
        where: { id: assignment.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        },
      });

      emitOrderEvent('DELIVERY_ACCEPTED', {
        orderId: assignment.orderId,
        deliveryPartnerName: user.name,
      });

      return NextResponse.json({ success: true, message: 'Delivery accepted' });
    }

    if (action === 'REJECT') {
      await prisma.deliveryAssignment.update({
        where: { id: assignment.id },
        data: { status: 'REJECTED' },
      });

      emitOrderEvent('DELIVERY_REJECTED', {
        orderId: assignment.orderId,
        targetRole: 'ADMIN',
      });

      return NextResponse.json({ success: true, message: 'Delivery rejected' });
    }

    if (action === 'ARRIVED_AT_RESTAURANT') {
      await prisma.deliveryAssignment.update({
        where: { id: assignment.id },
        data: { status: 'ARRIVED_AT_RESTAURANT' },
      });

      emitOrderEvent('RIDER_ARRIVED', {
        orderId: assignment.orderId,
        targetRole: 'KITCHEN_STAFF',
      });

      return NextResponse.json({ success: true, message: 'Arrived at restaurant updated' });
    }

    if (action === 'START_DELIVERY') {
      // Transition order status to OUT_FOR_DELIVERY
      await prisma.$transaction([
        prisma.deliveryAssignment.update({
          where: { id: assignment.id },
          data: {
            status: 'PICKED_UP',
            pickedUpAt: new Date(),
          },
        }),
        prisma.order.update({
          where: { id: assignment.orderId },
          data: { status: 'OUT_FOR_DELIVERY' },
        }),
      ]);

      emitOrderEvent('OUT_FOR_DELIVERY', {
        orderId: assignment.orderId,
        deliveryPartnerName: user.name,
      });

      return NextResponse.json({
        success: true,
        message: 'Order picked up! Delivery started and live tracking enabled.',
      });
    }

    if (action === 'DELIVER') {
      // Require OTP verification
      if (!otp) {
        return NextResponse.json(
          { success: false, message: 'Customer Delivery OTP is required to complete delivery' },
          { status: 400 }
        );
      }

      if (assignment.order.deliveryOtp !== otp.trim()) {
        return NextResponse.json(
          { success: false, message: 'Invalid OTP! Please ask customer for correct 4-digit code.' },
          { status: 400 }
        );
      }

      // Mark delivered and if COD, update payment to PAID
      await prisma.$transaction([
        prisma.deliveryAssignment.update({
          where: { id: assignment.id },
          data: {
            status: 'DELIVERED',
            deliveredAt: new Date(),
          },
        }),
        prisma.order.update({
          where: { id: assignment.orderId },
          data: { status: 'DELIVERED' },
        }),
        ...(assignment.order.payment?.paymentMethod === 'COD' && assignment.order.payment.status !== 'PAID'
          ? [
              prisma.payment.update({
                where: { id: assignment.order.payment.id },
                data: { status: 'PAID', paidAt: new Date() },
              }),
            ]
          : []),
      ]);

      emitOrderEvent('ORDER_DELIVERED', {
        orderId: assignment.orderId,
        deliveredAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Order verified and delivered successfully! Earnings added.',
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid delivery action' }, { status: 400 });
  } catch (error) {
    console.error('Delivery action error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process delivery action' },
      { status: 500 }
    );
  }
}

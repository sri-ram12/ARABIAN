import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { emitOrderEvent } from '@/lib/events';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'KITCHEN_STAFF' && user.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    // Kitchen is concerned with active cooking workflow: PLACED, CONFIRMED, PREPARING, READY_FOR_PICKUP
    const activeKitchenOrders = await prisma.order.findMany({
      where: {
        status: { in: ['PLACED', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'] },
      },
      include: {
        items: true,
        customer: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: 'asc' }, // FIFO: oldest orders first
    });

    return NextResponse.json({
      success: true,
      orders: activeKitchenOrders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch kitchen orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'KITCHEN_STAFF' && user.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const { orderId, targetStatus } = await req.json();

    if (!['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(targetStatus)) {
      return NextResponse.json(
        { success: false, message: 'Invalid kitchen status transition' },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: targetStatus },
    });

    emitOrderEvent(`ORDER_${targetStatus}`, {
      orderId: updated.id,
      orderNumber: updated.orderNumber,
      status: targetStatus,
    });

    return NextResponse.json({
      success: true,
      message: `Order transitioned to ${targetStatus}`,
      order: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update kitchen order status' },
      { status: 500 }
    );
  }
}

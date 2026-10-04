import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'KITCHEN_STAFF')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search')?.trim();
    const dateRange = searchParams.get('dateRange'); // 'today', 'last7', 'last30', 'all'

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (paymentStatus && paymentStatus !== 'ALL') {
      where.payment = { status: paymentStatus };
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } },
        { address: { area: { contains: search } } },
      ];
    }

    if (dateRange === 'today') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      where.createdAt = { gte: start };
    } else if (dateRange === 'last7') {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      where.createdAt = { gte: start };
    } else if (dateRange === 'last30') {
      const start = new Date();
      start.setDate(start.getDate() - 30);
      where.createdAt = { gte: start };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, phone: true, email: true } },
        address: true,
        items: true,
        payment: true,
        deliveryAssignment: {
          include: {
            deliveryPartner: { select: { id: true, name: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error('Admin fetch orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admin orders' },
      { status: 500 }
    );
  }
}

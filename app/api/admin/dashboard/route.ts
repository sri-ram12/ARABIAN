import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      allOrders,
      todayOrders,
      totalCustomers,
      activeRiders,
      menuItemCount,
      allPayments,
    ] = await Promise.all([
      prisma.order.findMany({
        select: {
          id: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          items: {
            select: { name: true, quantity: true, subtotal: true },
          },
          payment: { select: { paymentMethod: true, status: true } },
        },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: startOfToday } },
        include: { payment: true },
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.findMany({
        where: { role: 'DELIVERY_PARTNER' },
        select: { id: true, name: true, phone: true },
      }),
      prisma.menuItem.count(),
      prisma.payment.findMany({
        where: { status: 'PAID' },
        select: { paymentMethod: true, amount: true },
      }),
    ]);

    // Metric Calculations
    const todayRevenue = todayOrders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalRevenue = allOrders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrdersCount = allOrders.filter((o) =>
      ['PLACED', 'CONFIRMED'].includes(o.status)
    ).length;

    const preparingOrdersCount = allOrders.filter((o) => o.status === 'PREPARING').length;
    const readyOrdersCount = allOrders.filter((o) => o.status === 'READY_FOR_PICKUP').length;
    const outForDeliveryCount = allOrders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length;
    const completedOrdersCount = allOrders.filter((o) => o.status === 'DELIVERED').length;
    const cancelledOrdersCount = allOrders.filter((o) => o.status === 'CANCELLED').length;

    // Popular Items Aggregation
    const itemSalesMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const ord of allOrders) {
      if (ord.status === 'CANCELLED') continue;
      for (const it of ord.items) {
        const existing = itemSalesMap.get(it.name) || {
          name: it.name,
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += it.quantity;
        existing.revenue += it.subtotal;
        itemSalesMap.set(it.name, existing);
      }
    }

    const popularDishes = Array.from(itemSalesMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);

    // Payment Distribution
    const paymentMethods = {
      RAZORPAY: allPayments.filter((p) => p.paymentMethod === 'RAZORPAY').length,
      COD: allPayments.filter((p) => p.paymentMethod === 'COD').length,
    };

    // Last 7 days revenue trend
    const last7Days: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

      const dayOrders = allOrders.filter(
        (o) =>
          new Date(o.createdAt) >= dayStart &&
          new Date(o.createdAt) <= dayEnd &&
          o.status !== 'CANCELLED'
      );

      const dayRev = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      last7Days.push({
        date: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        revenue: Math.round(dayRev),
        orders: dayOrders.length,
      });
    }

    return NextResponse.json({
      success: true,
      metrics: {
        todayOrders: todayOrders.length,
        todayRevenue: Math.round(todayRevenue),
        totalOrders: allOrders.length,
        totalRevenue: Math.round(totalRevenue),
        pendingOrders: pendingOrdersCount,
        preparingOrders: preparingOrdersCount,
        readyOrders: readyOrdersCount,
        outForDelivery: outForDeliveryCount,
        completedOrders: completedOrdersCount,
        cancelledOrders: cancelledOrdersCount,
        activeRiders: activeRiders.length,
        totalCustomers,
        menuItemCount,
      },
      popularDishes,
      paymentMethods,
      revenueTrends: last7Days,
      riders: activeRiders,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load dashboard metrics' },
      { status: 500 }
    );
  }
}

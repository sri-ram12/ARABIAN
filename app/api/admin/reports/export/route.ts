import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'orders'; // 'orders', 'sales', 'customers', 'products'

    if (type === 'orders') {
      const orders = await prisma.order.findMany({
        include: {
          customer: { select: { name: true, phone: true, email: true } },
          address: { select: { area: true, city: true } },
          payment: { select: { paymentMethod: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const header = 'Order Number,Date,Customer Name,Phone,Area,Status,Payment Method,Payment Status,Subtotal (INR),Delivery Fee,Tax,Packaging,Total Amount (INR)\n';
      const rows = orders.map((o) => {
        const dateStr = new Date(o.createdAt).toISOString().split('T')[0];
        const custName = `"${o.customer.name.replace(/"/g, '""')}"`;
        const phone = o.customer.phone;
        const area = `"${(o.address?.area || 'Thagarapuvalasa').replace(/"/g, '""')}"`;
        const payMethod = o.payment?.paymentMethod || 'COD';
        const payStatus = o.payment?.status || 'PENDING';

        return `${o.orderNumber},${dateStr},${custName},${phone},${area},${o.status},${payMethod},${payStatus},${o.subtotal},${o.deliveryFee},${o.tax},${o.packagingFee},${o.totalAmount}`;
      });

      const csv = header + rows.join('\n');
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="arabian_mandi_orders_${Date.now()}.csv"`,
        },
      });
    }

    if (type === 'customers') {
      const customers = await prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        include: {
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const header = 'Customer Name,Email,Phone,Total Orders,Registered Date\n';
      const rows = customers.map((c) => {
        const dateStr = new Date(c.createdAt).toISOString().split('T')[0];
        return `"${c.name.replace(/"/g, '""')}","${c.email}",${c.phone},${c._count.orders},${dateStr}`;
      });

      const csv = header + rows.join('\n');
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="arabian_mandi_customers_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid export type' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ success: false, message: 'Failed to export report' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'DELIVERY_PARTNER' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Delivery partner access only.' },
        { status: 403 }
      );
    }

    // 1. Find Current Active Delivery for this partner
    const activeAssignment = await prisma.deliveryAssignment.findFirst({
      where: {
        deliveryPartnerId: user.id,
        status: { notIn: ['DELIVERED', 'REJECTED'] },
      },
      include: {
        order: {
          include: {
            items: true,
            address: true,
            customer: { select: { name: true, phone: true } },
            payment: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    // 2. Available / Pending Deliveries (Ready for pickup or unassigned)
    const availableAssignments = await prisma.deliveryAssignment.findMany({
      where: {
        deliveryPartnerId: user.id,
        status: 'ASSIGNED',
      },
      include: {
        order: {
          include: {
            items: true,
            address: true,
            customer: { select: { name: true, phone: true } },
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    // 3. Completed Deliveries
    const completedAssignments = await prisma.deliveryAssignment.findMany({
      where: {
        deliveryPartnerId: user.id,
        status: 'DELIVERED',
      },
      include: {
        order: {
          include: {
            address: true,
          },
        },
      },
      orderBy: { deliveredAt: 'desc' },
      take: 20,
    });

    // 4. Calculate total earnings
    const totalEarnings = completedAssignments.reduce(
      (acc, curr) => acc + (curr.earnings || 50),
      0
    );

    return NextResponse.json({
      success: true,
      activeDelivery: activeAssignment,
      availableDeliveries: availableAssignments,
      completedDeliveries: completedAssignments,
      stats: {
        totalDelivered: completedAssignments.length,
        totalEarnings,
      },
    });
  } catch (error) {
    console.error('Delivery fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch delivery dashboard data' },
      { status: 500 }
    );
  }
}

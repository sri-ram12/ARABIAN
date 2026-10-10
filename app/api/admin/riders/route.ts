import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { z } from 'zod';

const riderCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  email: z.string().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// GET /api/admin/riders - List all delivery partners with delivery stats
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const rawRiders = await prisma.user.findMany({
      where: { role: 'DELIVERY_PARTNER' },
      include: {
        deliveries: {
          include: {
            order: {
              include: {
                address: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const riders = rawRiders.map((rider) => {
      const completedDeliveries = (rider.deliveries || []).filter((d) => d.status === 'DELIVERED');
      const activeDelivery = (rider.deliveries || []).find(
        (d) => d.status !== 'DELIVERED' && d.status !== 'CANCELLED'
      );
      const totalEarnings = completedDeliveries.reduce((sum, d) => sum + (d.earnings || 0), 0);

      return {
        id: rider.id,
        name: rider.name,
        email: rider.email,
        phone: rider.phone,
        profileImage: rider.profileImage,
        createdAt: rider.createdAt,
        totalCompletedDeliveries: completedDeliveries.length,
        totalEarnings,
        activeDelivery: activeDelivery
          ? {
              assignmentId: activeDelivery.id,
              orderId: activeDelivery.orderId,
              orderNumber: activeDelivery.order?.orderNumber,
              status: activeDelivery.status,
              address: activeDelivery.order?.address,
            }
          : null,
        isAvailable: !activeDelivery,
      };
    });

    return NextResponse.json({ success: true, riders });
  } catch (error) {
    console.error('Error fetching delivery riders:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch riders' }, { status: 500 });
  }
}

// POST /api/admin/riders - Onboard a new delivery partner
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const result = riderCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, phone, email, password } = result.data;

    // Check for duplicate phone or email
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { phone }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            existing.phone === phone
              ? 'A user with this phone number already exists'
              : 'A user with this email address already exists',
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const newRider = await prisma.user.create({
      data: {
        name,
        phone,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'DELIVERY_PARTNER',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Delivery partner "${newRider.name}" onboarded successfully!`,
      rider: {
        ...newRider,
        totalCompletedDeliveries: 0,
        totalEarnings: 0,
        activeDelivery: null,
        isAvailable: true,
      },
    });
  } catch (error) {
    console.error('Error creating delivery rider:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to onboard delivery partner' },
      { status: 500 }
    );
  }
}

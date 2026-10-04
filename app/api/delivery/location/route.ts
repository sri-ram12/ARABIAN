import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { emitOrderEvent } from '@/lib/events';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'DELIVERY_PARTNER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const { orderId, latitude, longitude, heading, speed } = await req.json();

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Valid coordinates required' },
        { status: 400 }
      );
    }

    // Verify order is OUT_FOR_DELIVERY if orderId is specified
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true },
      });

      if (order && order.status !== 'OUT_FOR_DELIVERY') {
        // Privacy rule: Do not track/broadcast if not out for delivery
        return NextResponse.json({
          success: true,
          message: 'Location received but not broadcast (order not out for delivery)',
        });
      }
    }

    // Save location to database
    const loc = await prisma.deliveryLocation.create({
      data: {
        deliveryPartnerId: user.id,
        orderId,
        latitude,
        longitude,
        heading: heading || 0,
        speed: speed || 0,
      },
    });

    // Real-time broadcast to customer tracking screen
    emitOrderEvent('DELIVERY_LOCATION_UPDATED', {
      orderId,
      deliveryPartnerId: user.id,
      latitude,
      longitude,
      heading,
      speed,
      timestamp: loc.timestamp.toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Location updated',
      location: loc,
    });
  } catch (error) {
    console.error('Location update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update location' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const restaurant = await prisma.restaurant.findFirst();
    const zones = await prisma.deliveryZone.findMany({ orderBy: { minDistanceKm: 'asc' } });
    return NextResponse.json({ success: true, restaurant, zones });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();

    const restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) {
      return NextResponse.json({ success: false, message: 'Restaurant profile not found' }, { status: 404 });
    }

    const updated = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.tagline !== undefined ? { tagline: body.tagline } : {}),
        ...(body.address !== undefined ? { address: body.address } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.email !== undefined ? { email: body.email } : {}),
        ...(body.openingHours !== undefined ? { openingHours: body.openingHours } : {}),
        ...(body.closingHours !== undefined ? { closingHours: body.closingHours } : {}),
        ...(body.isOpen !== undefined ? { isOpen: Boolean(body.isOpen) } : {}),
        ...(body.deliveryRadiusKm !== undefined ? { deliveryRadiusKm: Number(body.deliveryRadiusKm) } : {}),
        ...(body.minOrderAmount !== undefined ? { minOrderAmount: Number(body.minOrderAmount) } : {}),
        ...(body.baseDeliveryFee !== undefined ? { baseDeliveryFee: Number(body.baseDeliveryFee) } : {}),
        ...(body.freeDeliveryThreshold !== undefined ? { freeDeliveryThreshold: Number(body.freeDeliveryThreshold) } : {}),
        ...(body.taxPercentage !== undefined ? { taxPercentage: Number(body.taxPercentage) } : {}),
        ...(body.packagingFee !== undefined ? { packagingFee: Number(body.packagingFee) } : {}),
        ...(body.codEnabled !== undefined ? { codEnabled: Boolean(body.codEnabled) } : {}),
        ...(body.estimatedPrepTimeMin !== undefined ? { estimatedPrepTimeMin: Number(body.estimatedPrepTimeMin) } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Restaurant business settings saved successfully',
      restaurant: updated,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update settings' }, { status: 500 });
  }
}

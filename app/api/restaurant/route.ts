import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) {
      restaurant = await prisma.restaurant.create({
        data: {
          id: 'arabian-mandi-main',
          name: 'Arabian Mandi',
          address: 'NH16 National Highway, Opposite Sangivalasa Bus Stop, Thagarapuvalasa, Andhra Pradesh 531162',
        },
      });
    }

    const zones = await prisma.deliveryZone.findMany({
      where: { isActive: true },
      orderBy: { minDistanceKm: 'asc' },
    });

    return NextResponse.json({
      success: true,
      restaurant,
      zones,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch restaurant details' },
      { status: 500 }
    );
  }
}

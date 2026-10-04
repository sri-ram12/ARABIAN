import { NextRequest, NextResponse } from 'next/server';
import { checkDeliveryServiceability } from '@/lib/geo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude, subtotal = 0 } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Valid latitude and longitude coordinates are required' },
        { status: 400 }
      );
    }

    const result = await checkDeliveryServiceability(latitude, longitude, subtotal);

    return NextResponse.json({
      success: true,
      serviceability: result,
    });
  } catch (error) {
    console.error('Serviceability check error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify location serviceability' },
      { status: 500 }
    );
  }
}

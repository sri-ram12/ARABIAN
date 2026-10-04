import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const addressSchema = z.object({
  addressLine: z.string().min(3, 'Address line is required'),
  landmark: z.string().optional().nullable(),
  area: z.string().min(2, 'Area is required'),
  city: z.string().default('Thagarapuvalasa'),
  state: z.string().default('Andhra Pradesh'),
  pincode: z.string().default('531162'),
  latitude: z.number(),
  longitude: z.number(),
  addressType: z.enum(['HOME', 'WORK', 'OTHER']).default('HOME'),
  deliveryInstructions: z.string().optional().nullable(),
  isDefault: z.boolean().default(false),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = addressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // If default, reset other addresses
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        addressLine: data.addressLine,
        landmark: data.landmark,
        area: data.area,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        latitude: data.latitude,
        longitude: data.longitude,
        addressType: data.addressType,
        deliveryInstructions: data.deliveryInstructions,
        isDefault: data.isDefault,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Address saved successfully',
      address,
    });
  } catch (error) {
    console.error('Create address error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save address' },
      { status: 500 }
    );
  }
}

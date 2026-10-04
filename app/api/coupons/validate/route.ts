import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Coupon code and cart subtotal are required' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired coupon code' },
        { status: 404 }
      );
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: 'This coupon has expired' },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, message: 'Coupon usage limit has been reached' },
        { status: 400 }
      );
    }

    if (subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order amount of ₹${coupon.minOrderAmount} required for coupon ${cleanCode}`,
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      // FLAT discount
      discount = coupon.discountValue;
    }

    // Discount cannot exceed subtotal
    if (discount > subtotal) {
      discount = subtotal;
    }

    discount = Math.round(discount * 100) / 100;

    return NextResponse.json({
      success: true,
      message: `Coupon ${cleanCode} applied successfully!`,
      coupon: {
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        calculatedDiscount: discount,
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

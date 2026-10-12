import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      include: {
        user: { select: { name: true, profileImage: true } },
        order: { select: { orderNumber: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const { orderId, rating, foodRating, deliveryRating, comment } = await req.json();

    if (!orderId || typeof rating !== 'number') {
      return NextResponse.json({ success: false, message: 'Rating is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { review: true },
    });

    if (!order || order.customerId !== user.id) {
      return NextResponse.json({ success: false, message: 'Order not found or unauthorized' }, { status: 404 });
    }

    if (order.status !== 'DELIVERED') {
      return NextResponse.json(
        { success: false, message: 'You can only review delivered orders' },
        { status: 400 }
      );
    }

    if (order.review) {
      return NextResponse.json({ success: false, message: 'Order already reviewed' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        orderId: order.id,
        userId: user.id,
        rating: Math.min(5, Math.max(1, rating)),
        foodRating: typeof foodRating === 'number' ? Math.min(5, Math.max(1, foodRating)) : rating,
        deliveryRating: typeof deliveryRating === 'number' ? Math.min(5, Math.max(1, deliveryRating)) : rating,
        comment: comment?.trim() || 'Delicious and authentic Arabian Mandi feast!',
        isApproved: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your review!',
      review,
    });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit review' }, { status: 500 });
  }
}

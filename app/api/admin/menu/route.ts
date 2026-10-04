import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const items = await prisma.menuItem.findMany({
      include: {
        category: true,
        addons: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      categoryId,
      description,
      image,
      price,
      discountedPrice,
      isVeg,
      isBestseller,
      isFeatured,
      preparationTimeMin,
      spiceLevel,
      servingSize,
      ingredients,
      sizesJson,
    } = body;

    if (!name || !categoryId || typeof price !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Name, Category, and Price are required' },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        slug,
        categoryId,
        description: description || '',
        image:
          image ||
          'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop',
        price,
        discountedPrice: discountedPrice ? Number(discountedPrice) : null,
        isVeg: Boolean(isVeg),
        isBestseller: Boolean(isBestseller),
        isFeatured: Boolean(isFeatured),
        preparationTimeMin: preparationTimeMin ? Number(preparationTimeMin) : 25,
        spiceLevel: spiceLevel || 'MEDIUM',
        servingSize: servingSize || 'SERVES_1_2',
        ingredients: ingredients || '',
        sizesJson: sizesJson || null,
      },
      include: {
        category: true,
        addons: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Menu item created successfully',
      item: newItem,
    });
  } catch (error: any) {
    console.error('Create menu item error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create item' },
      { status: 500 }
    );
  }
}

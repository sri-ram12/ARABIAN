import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();
    const vegOnly = searchParams.get('vegOnly') === 'true';
    const bestseller = searchParams.get('bestseller') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const sort = searchParams.get('sort'); // price_asc, price_desc, name_asc

    // Build filter
    const where: any = { isAvailable: true };

    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug };
    }

    if (vegOnly) {
      where.isVeg = true;
    }

    if (bestseller) {
      where.isBestseller = true;
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { ingredients: { contains: search } },
      ];
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name_asc') {
      orderBy = { name: 'asc' };
    }

    const [categories, items] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.menuItem.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          addons: {
            where: { isAvailable: true },
          },
        },
        orderBy,
      }),
    ]);

    return NextResponse.json({
      success: true,
      categories,
      items,
      count: items.length,
    });
  } catch (error) {
    console.error('Menu fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

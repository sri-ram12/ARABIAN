import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const { name, description, image, displayOrder } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        displayOrder: displayOrder ? Number(displayOrder) : 0,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to create category' }, { status: 500 });
  }
}

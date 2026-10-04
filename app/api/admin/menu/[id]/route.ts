import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.price !== undefined ? { price: Number(body.price) } : {}),
        ...(body.discountedPrice !== undefined
          ? { discountedPrice: body.discountedPrice ? Number(body.discountedPrice) : null }
          : {}),
        ...(body.isAvailable !== undefined ? { isAvailable: Boolean(body.isAvailable) } : {}),
        ...(body.isBestseller !== undefined ? { isBestseller: Boolean(body.isBestseller) } : {}),
        ...(body.isFeatured !== undefined ? { isFeatured: Boolean(body.isFeatured) } : {}),
        ...(body.image !== undefined ? { image: body.image } : {}),
        ...(body.spiceLevel !== undefined ? { spiceLevel: body.spiceLevel } : {}),
        ...(body.sizesJson !== undefined ? { sizesJson: body.sizesJson } : {}),
      },
      include: {
        category: true,
        addons: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
      item: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    await prisma.menuItemAddon.deleteMany({ where: { menuItemId: id } });
    await prisma.menuItem.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 });
  }
}

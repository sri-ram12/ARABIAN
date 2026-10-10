import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// DELETE /api/admin/riders/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    const rider = await prisma.user.findFirst({
      where: { id, role: 'DELIVERY_PARTNER' },
      include: {
        deliveries: {
          where: {
            status: { notIn: ['DELIVERED', 'CANCELLED'] },
          },
        },
      },
    });

    if (!rider) {
      return NextResponse.json({ success: false, message: 'Delivery partner not found' }, { status: 404 });
    }

    if (rider.deliveries && rider.deliveries.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot remove this rider because they currently have an active delivery in progress.',
        },
        { status: 400 }
      );
    }

    // Delete or decouple
    await prisma.deliveryAssignment.deleteMany({
      where: { deliveryPartnerId: id },
    });
    await prisma.deliveryLocation.deleteMany({
      where: { deliveryPartnerId: id },
    });
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Delivery partner "${rider.name}" removed successfully.`,
    });
  } catch (error) {
    console.error('Error deleting rider:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete delivery partner' },
      { status: 500 }
    );
  }
}

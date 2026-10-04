import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profileImage: true,
        addresses: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({ success: true, user: fullUser });
  } catch (error) {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const { orderId, issueType, subject, message } = await req.json();

    if (!issueType || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Issue type, subject, and details are required' },
        { status: 400 }
      );
    }

    const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketId,
        customerId: user.id,
        orderId: orderId || null,
        issueType,
        subject,
        message,
        status: 'OPEN',
        priority: issueType === 'MISSING_ITEM' || issueType === 'WRONG_ITEM' ? 'HIGH' : 'MEDIUM',
      },
      include: {
        order: { select: { orderNumber: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Support ticket ${ticketId} created. Our Thagarapuvalasa team will assist you promptly.`,
      ticket,
    });
  } catch (error) {
    console.error('Support ticket error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: user.role === 'ADMIN' ? {} : { customerId: user.id },
      include: {
        order: { select: { orderNumber: true, totalAmount: true } },
        customer: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch tickets' }, { status: 500 });
  }
}

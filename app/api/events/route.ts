import { NextRequest } from 'next/server';
import { eventBroker } from '@/lib/events';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId') || undefined;
  const role = searchParams.get('role') || undefined;

  const encoder = new TextEncoder();
  const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  let unsubscribe: (() => void) | null = null;
  let keepAliveTimer: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: 'connected', subId })}\n\n`)
      );

      // Register subscriber
      unsubscribe = eventBroker.subscribe({
        id: subId,
        orderId,
        role,
        callback: (data) => {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          } catch (e) {
            // Stream closed
          }
        },
      });

      // Keep-alive heartbeat every 15 seconds to prevent browser or proxy disconnect
      keepAliveTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch (e) {
          if (keepAliveTimer) clearInterval(keepAliveTimer);
        }
      }, 15000);
    },
    cancel() {
      if (unsubscribe) unsubscribe();
      if (keepAliveTimer) clearInterval(keepAliveTimer);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

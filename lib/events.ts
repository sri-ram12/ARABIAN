type EventCallback = (data: any) => void;

interface Subscription {
  id: string;
  orderId?: string;
  role?: string;
  callback: EventCallback;
}

class EventBroker {
  private subscriptions: Map<string, Subscription> = new Map();

  subscribe(sub: Subscription): () => void {
    this.subscriptions.set(sub.id, sub);
    return () => {
      this.subscriptions.delete(sub.id);
    };
  }

  emit(eventType: string, payload: any) {
    for (const [, sub] of this.subscriptions) {
      try {
        // If subscribed to specific order, match orderId
        if (sub.orderId && payload.orderId && sub.orderId !== payload.orderId) {
          continue;
        }
        // If subscribed to specific role (ADMIN, KITCHEN_STAFF, etc.)
        if (sub.role && payload.targetRole && sub.role !== payload.targetRole && sub.role !== 'ADMIN') {
          continue;
        }

        sub.callback({
          type: eventType,
          timestamp: new Date().toISOString(),
          data: payload,
        });
      } catch (err) {
        console.error('Event dispatch error:', err);
      }
    }
  }
}

// Global singleton to persist across requests in Next.js development
const globalForEvents = global as unknown as { eventBroker: EventBroker };
export const eventBroker = globalForEvents.eventBroker || new EventBroker();
if (process.env.NODE_ENV !== 'production') globalForEvents.eventBroker = eventBroker;

export function emitOrderEvent(eventType: string, payload: any) {
  eventBroker.emit(eventType, payload);
}

'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Flame,
  Volume2,
  VolumeX,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  Printer,
  CheckSquare,
  Square,
} from 'lucide-react';

export default function KitchenDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItemCheck = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handlePrintKOT = (ord: any) => {
    const printWindow = window.open('', '_blank', 'width=380,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>KOT - ${ord.orderNumber}</title>
          <style>
            body { font-family: monospace; font-size: 13px; padding: 12px; color: #000; line-height: 1.4; }
            h2, h3 { margin: 2px 0; text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .item-row { display: flex; justify-content: space-between; margin: 6px 0; font-size: 14px; font-weight: bold; }
            .note { background: #eee; padding: 6px; font-weight: bold; margin-top: 6px; border: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <h2>*** KITCHEN TICKET (KOT) ***</h2>
          <h3>ARABIAN MANDI</h3>
          <div class="divider"></div>
          <div><strong>Order:</strong> ${ord.orderNumber}</div>
          <div><strong>Time:</strong> ${new Date(ord.createdAt).toLocaleTimeString()}</div>
          <div><strong>Customer:</strong> ${ord.customer?.name || 'Walk-in / Online'}</div>
          <div class="divider"></div>
          <div><strong>ITEMS TO PREPARE:</strong></div>
          ${ord.items
            .map(
              (it: any) => `
            <div class="item-row">
              <span>[ ] ${it.quantity}x ${it.name} ${it.size ? `(${it.size})` : ''}</span>
            </div>
          `
            )
            .join('')}
          ${
            ord.kitchenNotes
              ? `<div class="divider"></div><div class="note">NOTE: ${ord.kitchenNotes}</div>`
              : ''
          }
          <div class="divider"></div>
          <div style="text-align:center;">*** KITCHEN FIFO DISPATCH ***</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Protect route
  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'KITCHEN_STAFF' && user.role !== 'ADMIN'))) {
      router.push('/kitchen/login');
    }
  }, [user, authLoading, router]);

  // Keep a 1-second interval to update elapsed cooking timers live
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const playKitchenChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  const fetchKitchenOrders = async () => {
    try {
      const res = await fetch('/api/admin/kitchen');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Kitchen orders error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();

    // SSE connection for live kitchen events
    const eventSource = new EventSource('/api/events?role=KITCHEN_STAFF');
    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'ORDER_CREATED' || payload.type === 'ORDER_CONFIRMED') {
          playKitchenChime();
        }
        fetchKitchenOrders();
      } catch (err) {}
    };

    const interval = setInterval(fetchKitchenOrders, 6000);

    return () => {
      eventSource.close();
      clearInterval(interval);
    };
  }, [soundEnabled]);

  const updateOrderStatus = async (orderId: string, targetStatus: string) => {
    try {
      const res = await fetch('/api/admin/kitchen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, targetStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchKitchenOrders();
      }
    } catch (e) {
      alert('Failed to update kitchen status');
    }
  };

  // Helper to format elapsed time in MM:SS
  const getElapsedString = (createdAt: string) => {
    const elapsedMs = Math.max(0, now - new Date(createdAt).getTime());
    const totalSecs = Math.floor(elapsedMs / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070809] text-white p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="bg-mandi-card border border-mandi-border rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <NextLink
            href="/"
            className="p-2 rounded-xl bg-mandi-surface hover:bg-mandi-elevated text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </NextLink>
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight">
              Arabian Mandi • Kitchen Display (KDS)
            </h1>
            <p className="text-xs text-slate-400">
              Thagarapuvalasa Kitchen • Live FIFO Preparation Queue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              soundEnabled
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                : 'bg-mandi-surface text-slate-400 border-mandi-border'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Chime Active' : 'Muted'}</span>
          </button>

          <button
            onClick={fetchKitchenOrders}
            className="p-2.5 rounded-xl bg-mandi-surface hover:bg-mandi-elevated border border-mandi-border text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {user?.role === 'ADMIN' && (
            <NextLink
              href="/admin"
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30"
            >
              Admin Dashboard
            </NextLink>
          )}
        </div>
      </div>

      {/* Active Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-24 bg-mandi-card border border-mandi-border rounded-3xl space-y-4">
          <ChefHat className="w-16 h-16 text-slate-600 mx-auto" />
          <h2 className="font-heading text-2xl font-bold text-white">All Kitchen Orders Clear!</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No pending cooking tickets in the queue. New orders from Thagarapuvalasa customers will appear here automatically with audio alert.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((ord) => {
            const elapsed = getElapsedString(ord.createdAt);
            const isPreparing = ord.status === 'PREPARING';
            const isReady = ord.status === 'READY_FOR_PICKUP';

            return (
              <div
                key={ord.id}
                className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-2xl transition-all ${
                  isReady
                    ? 'bg-emerald-950/20 border-emerald-500/50'
                    : isPreparing
                    ? 'bg-amber-950/20 border-amber-500/50'
                    : 'bg-mandi-card border-mandi-border'
                }`}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-mandi-border/80 flex items-center justify-between bg-black/40">
                  <div>
                    <span className="font-mono text-base font-black text-gold-400">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs text-slate-300 block">
                      Customer: <strong className="text-white">{ord.customer?.name}</strong>
                    </span>
                  </div>

                  {/* Elapsed Live Timer & KOT Print */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrintKOT(ord)}
                      className="p-1.5 rounded-lg bg-mandi-surface hover:bg-mandi-elevated text-slate-300 hover:text-white transition-colors"
                      title="Print Kitchen Ticket (KOT)"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-black/60 text-amber-400 border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5 animate-pulse" />
                        <span>{elapsed}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 uppercase tracking-wider font-semibold">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items & Portion Sizes with Packing Checklist */}
                <div className="p-5 space-y-3 flex-1">
                  <div className="space-y-1.5 divide-y divide-mandi-border/30">
                    {ord.items.map((it: any) => {
                      let addons = [];
                      if (it.addOnsJson) {
                        try {
                          addons = JSON.parse(it.addOnsJson);
                        } catch (e) {}
                      }
                      const isChecked = !!checkedItems[it.id];

                      return (
                        <div
                          key={it.id}
                          onClick={() => toggleItemCheck(it.id)}
                          className={`pt-2 first:pt-0 cursor-pointer p-2 rounded-xl transition-colors ${
                            isChecked ? 'bg-emerald-950/40 opacity-75' : 'hover:bg-mandi-surface/50'
                          }`}
                          title="Click to check off as packed"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
                              )}
                              <span className={`font-heading font-black text-base ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                                <span className="text-gold-400 mr-2">{it.quantity}×</span>
                                {it.name}
                              </span>
                            </div>
                            {it.size && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gold-500/10 text-gold-300 border border-gold-500/20 uppercase whitespace-nowrap">
                                {it.size}
                              </span>
                            )}
                          </div>

                          {addons.length > 0 && (
                            <div className="mt-1 pl-6 text-xs text-amber-300/90 font-medium">
                              Sides: {addons.map((a: any) => a.name).join(', ')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Kitchen Special Notes */}
                  {ord.kitchenNotes && (
                    <div className="mt-3 p-3 rounded-xl bg-orange-950/40 border border-orange-500/30 text-xs text-orange-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span>Note: <strong>{ord.kitchenNotes}</strong></span>
                    </div>
                  )}
                </div>

                {/* Workflow Buttons */}
                <div className="p-4 bg-black/40 border-t border-mandi-border/80 grid grid-cols-2 gap-2">
                  {ord.status === 'PLACED' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'CONFIRMED')}
                        className="py-3 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-heading font-black text-xs tracking-wider text-white shadow-md"
                      >
                        ACCEPT ORDER
                      </button>
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'PREPARING')}
                        className="py-3 px-2 rounded-xl bg-amber-600 hover:bg-amber-500 font-heading font-black text-xs tracking-wider text-black shadow-md flex items-center justify-center gap-1"
                      >
                        <Flame className="w-3.5 h-3.5" /> PREPARING
                      </button>
                    </>
                  )}

                  {ord.status === 'CONFIRMED' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'PREPARING')}
                      className="col-span-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 font-heading font-black text-sm tracking-wider text-black shadow-md flex items-center justify-center gap-2"
                    >
                      <Flame className="w-4 h-4" /> START PREPARATION
                    </button>
                  )}

                  {ord.status === 'PREPARING' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'READY_FOR_PICKUP')}
                      className="col-span-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-heading font-black text-sm tracking-wider text-white shadow-md flex items-center justify-center gap-2"
                    >
                      <PackageCheck className="w-4 h-4" /> MARK READY FOR PICKUP
                    </button>
                  )}

                  {ord.status === 'READY_FOR_PICKUP' && (
                    <div className="col-span-2 py-2 text-center text-xs font-bold text-emerald-400 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                      ✓ Ready & Awaiting Delivery Partner
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

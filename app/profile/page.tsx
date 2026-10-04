'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  User,
  Clock,
  MapPin,
  ShoppingBag,
  RotateCcw,
  LifeBuoy,
  LogOut,
  ChevronRight,
  Shield,
  CheckCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'support'>('orders');

  // Support ticket form state
  const [supportIssue, setSupportIssue] = useState('LATE_DELIVERY');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportOrderId, setSupportOrderId] = useState('');
  const [supportStatus, setSupportStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders?status=ALL');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error('Failed to load user orders', e);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user]);

  const handleReorder = (order: any) => {
    for (const item of order.items) {
      let selectedAddons = [];
      if (item.addOnsJson) {
        try {
          selectedAddons = JSON.parse(item.addOnsJson);
        } catch (e) {}
      }
      addToCart({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        selectedAddons,
      });
    }
    router.push('/cart');
  };

  const handleCreateSupportTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportStatus(null);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: supportOrderId || null,
          issueType: supportIssue,
          subject: supportSubject,
          message: supportMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSupportStatus(data.message);
        setSupportSubject('');
        setSupportMessage('');
      } else {
        alert(data.message || 'Failed to submit ticket');
      }
    } catch (e) {
      alert('Failed to submit ticket');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Bar */}
      <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gold-gradient text-black font-heading font-black text-2xl flex items-center justify-center shadow-gold-sm">
            {user.name[0]}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{user.email} • {user.phone}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/10 text-gold-400 border border-gold-500/20">
              Role: {user.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'ADMIN' && (
            <NextLink
              href="/admin"
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" /> Admin Panel
            </NextLink>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-mandi-border gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'orders'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Order History ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'addresses'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Saved Addresses ({user.addresses?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'support'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Customer Support
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-mandi-card border border-mandi-border rounded-2xl space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm font-semibold text-white">No past orders yet</p>
              <NextLink
                href="/menu"
                className="inline-block px-6 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs"
              >
                Browse Menu
              </NextLink>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-mandi-card border border-mandi-border rounded-2xl p-5 space-y-4 hover:border-slate-600 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-mandi-border pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gold-400">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 block mt-0.5">
                      Destination: {ord.address?.area}, {ord.address?.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        ord.status === 'DELIVERED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : ord.status === 'CANCELLED'
                          ? 'bg-red-950 text-red-400 border border-red-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                    <span className="font-heading font-black text-base text-gold-400">
                      ₹{ord.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-1 text-xs text-slate-300">
                  {ord.items?.map((it: any) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.quantity} × {it.name} {it.size ? `(${it.size})` : ''}</span>
                      <span className="text-slate-400">₹{it.subtotal}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-mandi-border flex items-center justify-between gap-4">
                  <NextLink
                    href={`/orders/${ord.id}`}
                    className="text-xs font-semibold text-gold-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Tracking & Receipt</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </NextLink>

                  <button
                    onClick={() => handleReorder(ord)}
                    className="px-4 py-2 rounded-xl bg-mandi-surface hover:bg-mandi-elevated border border-mandi-border text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
                    <span>Order Again</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          {(!user.addresses || user.addresses.length === 0) ? (
            <div className="text-center py-12 bg-mandi-card border border-mandi-border rounded-2xl space-y-2">
              <MapPin className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-semibold text-white">No saved addresses</p>
              <p className="text-xs text-slate-400">Addresses you use during checkout will be saved here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((addr: any) => (
                <div
                  key={addr.id}
                  className="bg-mandi-card border border-mandi-border rounded-2xl p-5 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/20 text-gold-400">
                      {addr.addressType}
                    </span>
                    <span className="font-semibold text-xs text-white">
                      {addr.area}, {addr.city}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{addr.addressLine}</p>
                  {addr.landmark && (
                    <p className="text-[11px] text-slate-400">Landmark: {addr.landmark}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Customer Support */}
      {activeTab === 'support' && (
        <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 max-w-2xl space-y-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Create Support Ticket</h3>
            <p className="text-xs text-slate-400 mt-1">
              Have an issue with an order, missing item, payment, or delivery? Our Thagarapuvalasa team responds swiftly.
            </p>
          </div>

          {supportStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{supportStatus}</span>
            </div>
          )}

          <form onSubmit={handleCreateSupportTicket} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Select Issue Category *
              </label>
              <select
                value={supportIssue}
                onChange={(e) => setSupportIssue(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
              >
                <option value="LATE_DELIVERY">Late Delivery / Delay</option>
                <option value="MISSING_ITEM">Missing Item in Order</option>
                <option value="WRONG_ITEM">Wrong Dish Received</option>
                <option value="PAYMENT_ISSUE">Payment Issue or Refund Status</option>
                <option value="CANCELLATION">Order Cancellation</option>
                <option value="FEEDBACK">Feedback / Compliment</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Related Order (Optional)
              </label>
              <select
                value={supportOrderId}
                onChange={(e) => setSupportOrderId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
              >
                <option value="">Select Order (or leave blank)</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} (₹{o.totalAmount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                value={supportSubject}
                onChange={(e) => setSupportSubject(e.target.value)}
                placeholder="e.g. Order arrived cold or toum dip missing"
                className="w-full px-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Details & Message *
              </label>
              <textarea
                required
                rows={4}
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Please describe the issue in detail..."
                className="w-full p-3 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs tracking-wider shadow-gold-sm hover:brightness-110"
            >
              SUBMIT SUPPORT TICKET
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

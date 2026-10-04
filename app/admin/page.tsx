'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Clock,
  Bike,
  UtensilsCrossed,
  Users,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Search,
  Filter,
  ArrowUpRight,
  Eye,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'menu' | 'settings'>('analytics');
  const [metrics, setMetrics] = useState<any>(null);
  const [popularDishes, setPopularDishes] = useState<any[]>([]);
  const [revenueTrends, setRevenueTrends] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any>({ RAZORPAY: 0, COD: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [riders, setRiders] = useState<any[]>([]);

  // Filters state for Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderDateFilter, setOrderDateFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals & form state
  const [selectedOrderForAction, setSelectedOrderForAction] = useState<any | null>(null);
  const [showAssignRiderModal, setShowAssignRiderModal] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    categoryId: '',
    price: 350,
    discountedPrice: '',
    description: '',
    image: '',
    spiceLevel: 'MEDIUM',
    isVeg: false,
    isBestseller: false,
  });

  const [loading, setLoading] = useState(true);

  // Protect admin route
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login?redirect=/admin');
    }
  }, [user, authLoading, router]);

  // Load Dashboard Data
  const loadDashboard = async () => {
    try {
      const [dashRes, ordersRes, menuRes, settingsRes] = await Promise.all([
        fetch('/api/admin/dashboard'),
        fetch(`/api/admin/orders?status=${orderStatusFilter}&dateRange=${orderDateFilter}&search=${orderSearch}`),
        fetch('/api/admin/menu'),
        fetch('/api/admin/settings'),
      ]);

      const [dashData, ordersData, menuData, settingsData] = await Promise.all([
        dashRes.json(),
        ordersRes.json(),
        menuRes.json(),
        settingsRes.json(),
      ]);

      if (dashData.success) {
        setMetrics(dashData.metrics);
        setPopularDishes(dashData.popularDishes || []);
        setRevenueTrends(dashData.revenueTrends || []);
        setPaymentMethods(dashData.paymentMethods || { RAZORPAY: 0, COD: 0 });
        setRiders(dashData.riders || []);
      }

      if (ordersData.success) {
        setOrders(ordersData.orders || []);
      }

      if (menuData.success) {
        setMenuItems(menuData.items || []);
      }

      if (settingsData.success) {
        setSettings(settingsData.restaurant);
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [orderStatusFilter, orderDateFilter, orderSearch]);

  // Status Update Handler
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        loadDashboard();
      }
    } catch (e) {
      alert('Failed to update order');
    }
  };

  // Assign Rider Handler
  const handleAssignRider = async () => {
    if (!selectedOrderForAction || !selectedRiderId) return;
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrderForAction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ASSIGN_RIDER',
          deliveryPartnerId: selectedRiderId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAssignRiderModal(false);
        setSelectedOrderForAction(null);
        loadDashboard();
      }
    } catch (e) {
      alert('Failed to assign delivery partner');
    }
  };

  // Toggle Menu Item Availability
  const handleToggleItemAvailability = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/admin/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !current }),
      });
      loadDashboard();
    } catch (e) {
      alert('Failed to toggle availability');
    }
  };

  // Create Menu Item
  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMenuItem,
          price: Number(newMenuItem.price),
          discountedPrice: newMenuItem.discountedPrice ? Number(newMenuItem.discountedPrice) : null,
          categoryId: newMenuItem.categoryId || (menuItems[0]?.categoryId || ''),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddMenuModal(false);
        loadDashboard();
      } else {
        alert(data.message || 'Failed to create item');
      }
    } catch (e) {
      alert('Failed to create item');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        alert('Settings saved successfully!');
        loadDashboard();
      }
    } catch (e) {
      alert('Failed to save settings');
    }
  };

  // Print Order Receipt Helper
  const handlePrintReceipt = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${order.orderNumber}</title>
          <style>
            body { font-family: monospace; padding: 20px; width: 300px; margin: auto; }
            h2, h3 { text-align: center; margin: 4px 0; }
            .line { border-bottom: 1px dashed #000; margin: 8px 0; }
            .flex { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <h2>ARABIAN MANDI</h2>
          <h3>Thagarapuvalasa, AP</h3>
          <div class="line"></div>
          <div>Order: ${order.orderNumber}</div>
          <div>Date: ${new Date(order.createdAt).toLocaleString()}</div>
          <div>Customer: ${order.customer?.name} (${order.customer?.phone})</div>
          <div>Address: ${order.address?.area}, ${order.address?.city}</div>
          <div class="line"></div>
          ${order.items.map((i: any) => `
            <div class="flex">
              <span>${i.quantity}x ${i.name}</span>
              <span>Rs.${i.subtotal}</span>
            </div>
          `).join('')}
          <div class="line"></div>
          <div class="flex"><span>Subtotal:</span><span>Rs.${order.subtotal}</span></div>
          <div class="flex"><span>Delivery:</span><span>Rs.${order.deliveryFee}</span></div>
          <div class="flex"><span>Tax (5%):</span><span>Rs.${order.tax}</span></div>
          <div class="flex"><strong>Total:</strong><strong>Rs.${order.totalAmount}</strong></div>
          <div class="line"></div>
          <div style="text-align:center;">Payment: ${order.payment?.paymentMethod || 'COD'}</div>
          <div style="text-align:center; margin-top: 10px;">*** Shukran! Visit Again ***</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">
              Restaurant Admin Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              Arabian Mandi • Thagarapuvalasa Control Panel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NextLink
            href="/admin/kitchen"
            className="px-4 py-2 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 text-xs font-bold hover:bg-orange-600/30 flex items-center gap-1.5"
          >
            <UtensilsCrossed className="w-4 h-4" /> Kitchen Display (KDS)
          </NextLink>

          <a
            href="/api/admin/reports/export?type=orders"
            download
            className="px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV
          </a>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-mandi-border gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Business Analytics
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Orders Management ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'menu'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" /> Menu & Dishes ({menuItems.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-gold-500 text-gold-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" /> Restaurant Settings
        </button>
      </div>

      {/* 1. ANALYTICS TAB */}
      {activeTab === 'analytics' && metrics && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-mandi-card border border-mandi-border p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Today&apos;s Revenue
              </span>
              <span className="font-heading font-black text-xl text-gold-400 mt-1 block">
                ₹{metrics.todayRevenue}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{metrics.todayOrders} orders today</span>
            </div>

            <div className="bg-mandi-card border border-mandi-border p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Total Revenue
              </span>
              <span className="font-heading font-black text-xl text-white mt-1 block">
                ₹{metrics.totalRevenue}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{metrics.totalOrders} total orders</span>
            </div>

            <div className="bg-mandi-card border border-mandi-border p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Pending / Prep
              </span>
              <span className="font-heading font-black text-xl text-amber-400 mt-1 block">
                {metrics.pendingOrders + metrics.preparingOrders}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Kitchen in progress</span>
            </div>

            <div className="bg-mandi-card border border-mandi-border p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Out for Delivery
              </span>
              <span className="font-heading font-black text-xl text-blue-400 mt-1 block">
                {metrics.outForDelivery}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">On the road</span>
            </div>

            <div className="bg-mandi-card border border-mandi-border p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Completed
              </span>
              <span className="font-heading font-black text-xl text-emerald-400 mt-1 block">
                {metrics.completedOrders}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Successful</span>
            </div>

            <div className="bg-mandi-card border border-mandi-border p-4 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Total Diners
              </span>
              <span className="font-heading font-black text-xl text-purple-400 mt-1 block">
                {metrics.totalCustomers}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Registered users</span>
            </div>
          </div>

          {/* Revenue Chart & Popular Dishes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 7-Day Revenue Trend Bar Chart */}
            <div className="lg:col-span-8 bg-mandi-card border border-mandi-border rounded-2xl p-6 space-y-4">
              <h3 className="font-heading font-bold text-base text-white">
                Daily Sales Trend (Last 7 Days)
              </h3>
              <div className="h-64 flex items-end justify-between gap-2 pt-6">
                {revenueTrends.map((d, i) => {
                  const maxRev = Math.max(...revenueTrends.map((t) => t.revenue), 1000);
                  const heightPercent = Math.max(10, Math.round((d.revenue / maxRev) * 100));

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-bold text-gold-400">
                        ₹{d.revenue}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[42px] bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-lg transition-all"
                      />
                      <span className="text-[10px] text-slate-400 font-medium truncate max-w-[50px]">
                        {d.date.split(',')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular Dishes */}
            <div className="lg:col-span-4 bg-mandi-card border border-mandi-border rounded-2xl p-6 space-y-4">
              <h3 className="font-heading font-bold text-base text-white">
                Top Mandi Dishes
              </h3>
              <div className="space-y-3">
                {popularDishes.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block truncate max-w-[160px]">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {p.quantity} orders placed
                      </span>
                    </div>
                    <span className="font-bold text-gold-400">₹{p.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-mandi-card p-4 rounded-2xl border border-mandi-border text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-mandi-surface border border-mandi-border rounded-xl px-3 py-2 text-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="PLACED">Placed</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              {/* Date Filter */}
              <select
                value={orderDateFilter}
                onChange={(e) => setOrderDateFilter(e.target.value)}
                className="bg-mandi-surface border border-mandi-border rounded-xl px-3 py-2 text-white"
              >
                <option value="all">All Dates</option>
                <option value="today">Today Only</option>
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order #, customer, phone..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-mandi-card border border-mandi-border rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-mandi-surface/80 border-b border-mandi-border text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Area</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Rider</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mandi-border/60 text-slate-300">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-mandi-surface/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-white">
                        {ord.orderNumber}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-white block">{ord.customer?.name}</span>
                        <span className="text-[11px] text-slate-400">{ord.customer?.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-white block">{ord.address?.area}</span>
                        <span className="text-[10px] text-slate-400">OTP: {ord.deliveryOtp}</span>
                      </td>
                      <td className="p-4 font-bold text-gold-400">
                        ₹{ord.totalAmount}
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {ord.payment?.paymentMethod} ({ord.payment?.status})
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ord.status === 'DELIVERED'
                              ? 'bg-emerald-950 text-emerald-400'
                              : ord.status === 'CANCELLED'
                              ? 'bg-red-950 text-red-400'
                              : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        {ord.deliveryAssignment?.deliveryPartner ? (
                          <span className="font-medium text-emerald-400">
                            {ord.deliveryAssignment.deliveryPartner.name.split(' ')[0]}
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedOrderForAction(ord);
                              setShowAssignRiderModal(true);
                            }}
                            className="text-xs text-gold-400 hover:underline font-semibold"
                          >
                            + Assign Rider
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handlePrintReceipt(ord)}
                          className="p-1.5 rounded-lg bg-mandi-surface hover:bg-mandi-elevated text-slate-300 hover:text-white"
                          title="Print Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <NextLink
                          href={`/orders/${ord.id}`}
                          className="p-1.5 rounded-lg bg-mandi-surface hover:bg-mandi-elevated text-gold-400 inline-block"
                          title="Live Tracking Page"
                        >
                          <Eye className="w-4 h-4" />
                        </NextLink>

                        {/* Quick Status Action */}
                        {ord.status === 'PLACED' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'CONFIRMED')}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px]"
                          >
                            Confirm
                          </button>
                        )}
                        {ord.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'PREPARING')}
                            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px]"
                          >
                            Prep
                          </button>
                        )}
                        {ord.status === 'PREPARING' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'READY_FOR_PICKUP')}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                          >
                            Ready
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. MENU MANAGEMENT TAB */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white">
              Menu Items Catalog ({menuItems.length})
            </h3>
            <button
              onClick={() => setShowAddMenuModal(true)}
              className="px-4 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs flex items-center gap-1.5 shadow-gold-sm hover:brightness-110"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add New Mandi Dish
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-mandi-card border border-mandi-border rounded-2xl p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">{item.name}</h4>
                      <span className="text-[11px] text-gold-400 font-semibold">
                        ₹{item.price} {item.discountedPrice && `(Sale: ₹${item.discountedPrice})`}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.isAvailable
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-950 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-mandi-border flex items-center justify-between">
                  <button
                    onClick={() => handleToggleItemAvailability(item.id, item.isAvailable)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      item.isAvailable
                        ? 'bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900'
                    }`}
                  >
                    {item.isAvailable ? 'Disable Item' : 'Enable Item'}
                  </button>

                  <span className="text-[10px] text-slate-400">
                    {item.isBestseller ? '★ Bestseller' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SETTINGS TAB */}
      {activeTab === 'settings' && settings && (
        <form onSubmit={handleSaveSettings} className="bg-mandi-card border border-mandi-border rounded-2xl p-6 sm:p-8 max-w-3xl space-y-6">
          <h3 className="font-heading font-bold text-lg text-white border-b border-mandi-border pb-3">
            Thagarapuvalasa Restaurant Business Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Restaurant Name</label>
              <input
                type="text"
                value={settings.name || ''}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Phone Contact</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Delivery Radius (KM)</label>
              <input
                type="number"
                step="0.5"
                value={settings.deliveryRadiusKm || 15}
                onChange={(e) => setSettings({ ...settings, deliveryRadiusKm: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Minimum Order Amount (₹)</label>
              <input
                type="number"
                value={settings.minOrderAmount || 200}
                onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold || 599}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">GST Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.taxPercentage || 5}
                onChange={(e) => setSettings({ ...settings, taxPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-3 px-8 rounded-xl bg-gold-gradient text-black font-heading font-black text-xs tracking-wider shadow-gold-sm hover:brightness-110"
          >
            SAVE CONFIGURATION
          </button>
        </form>
      )}

      {/* Rider Assignment Modal */}
      {showAssignRiderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-heading font-bold text-base text-white">
              Assign Rider for {selectedOrderForAction?.orderNumber}
            </h3>
            <p className="text-xs text-slate-400">
              Select an active delivery partner operating in Thagarapuvalasa:
            </p>

            <select
              value={selectedRiderId}
              onChange={(e) => setSelectedRiderId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
            >
              <option value="">Select Delivery Rider</option>
              {riders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.phone})
                </option>
              ))}
            </select>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAssignRiderModal(false)}
                className="flex-1 py-2 rounded-xl bg-mandi-surface text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignRider}
                disabled={!selectedRiderId}
                className="flex-1 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs disabled:opacity-50"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Modal */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleCreateMenuItem} className="bg-mandi-card border border-mandi-border rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-lg text-white">
              Add New Arabian Mandi Dish
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  placeholder="e.g. Mutton Juicy Mandi Platter"
                  className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={newMenuItem.discountedPrice}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, discountedPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                  placeholder="Fragrant smoked basmati rice, tender roasted meat..."
                  className="w-full p-3 rounded-xl bg-mandi-surface border border-mandi-border text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={newMenuItem.image}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMenuItem.isBestseller}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, isBestseller: e.target.checked })}
                    className="rounded"
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMenuItem.isVeg}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, isVeg: e.target.checked })}
                    className="rounded"
                  />
                  <span>Vegetarian Dish</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-mandi-border">
              <button
                type="button"
                onClick={() => setShowAddMenuModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-mandi-surface text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs"
              >
                Create Dish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

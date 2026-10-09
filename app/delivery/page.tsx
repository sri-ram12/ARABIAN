'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Bike,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  Navigation,
  KeyRound,
  DollarSign,
  Package,
  ArrowRight,
  ShieldAlert,
  MessageCircle,
  Radio,
} from 'lucide-react';

export default function DeliveryPartnerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeDelivery, setActiveDelivery] = useState<any | null>(null);
  const [availableDeliveries, setAvailableDeliveries] = useState<any[]>([]);
  const [completedDeliveries, setCompletedDeliveries] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalDelivered: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  // OTP Verification state
  const [otpInput, setOtpInput] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // GPS broadcast states
  const [isBroadcastingGps, setIsBroadcastingGps] = useState(false);
  const [isLiveDeviceGpsActive, setIsLiveDeviceGpsActive] = useState(false);
  const [gpsWatchId, setGpsWatchId] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Protect route
  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'DELIVERY_PARTNER' && user.role !== 'ADMIN'))) {
      router.push('/login?redirect=/delivery');
    }
  }, [user, authLoading, router]);

  const fetchDeliveries = async () => {
    try {
      const res = await fetch('/api/delivery/deliveries');
      const data = await res.json();
      if (data.success) {
        setActiveDelivery(data.activeDelivery || null);
        setAvailableDeliveries(data.availableDeliveries || []);
        setCompletedDeliveries(data.completedDeliveries || []);
        setStats(data.stats || { totalDelivered: 0, totalEarnings: 0 });
      }
    } catch (e) {
      console.error('Delivery fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle Workflow Actions
  const handleDeliveryAction = async (action: string, assignmentId: string) => {
    setActionError(null);
    setActionLoading(true);

    try {
      const res = await fetch('/api/delivery/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          action,
          otp: action === 'DELIVER' ? otpInput : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOtpInput('');
        fetchDeliveries();
      } else {
        setActionError(data.message || 'Action failed');
      }
    } catch (e: any) {
      setActionError(e.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Broadcast GPS location to server
  const broadcastLocation = async (lat: number, lng: number, heading = 140, speed = 30) => {
    if (!activeDelivery?.orderId) return;
    try {
      await fetch('/api/delivery/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeDelivery.orderId,
          latitude: lat,
          longitude: lng,
          heading,
          speed,
        }),
      });
    } catch (e) {}
  };

  // Real Mobile GPS Tracker (Reads real device GPS sensor via browser)
  const toggleLiveDeviceGps = () => {
    if (isLiveDeviceGpsActive && gpsWatchId !== null) {
      navigator.geolocation.clearWatch(gpsWatchId);
      setGpsWatchId(null);
      setIsLiveDeviceGpsActive(false);
      return;
    }

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported on this browser.');
      return;
    }

    setGpsError(null);
    try {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setIsLiveDeviceGpsActive(true);
          broadcastLocation(
            position.coords.latitude,
            position.coords.longitude,
            position.coords.heading || 0,
            position.coords.speed ? Math.round(position.coords.speed * 3.6) : 25
          );
        },
        (err) => {
          console.error('Real GPS error:', err);
          setGpsError('GPS permission was denied or device location is off.');
          setIsLiveDeviceGpsActive(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 15000,
        }
      );
      setGpsWatchId(watchId);
    } catch (e) {
      setGpsError('Failed to access phone GPS.');
    }
  };

  // Clean up GPS watcher on unmount
  useEffect(() => {
    return () => {
      if (gpsWatchId !== null && typeof navigator !== 'undefined') {
        navigator.geolocation.clearWatch(gpsWatchId);
      }
    };
  }, [gpsWatchId]);

  // Simulated GPS Broadcast (Moves rider along NH16 towards customer)
  const toggleGpsSimulation = () => {
    if (isBroadcastingGps) {
      setIsBroadcastingGps(false);
      return;
    }

    setIsBroadcastingGps(true);
    let step = 0;
    // Route from Arabian Mandi NH16 to Sangivalasa
    const waypoints = [
      { lat: 17.9288, lng: 83.4350 },
      { lat: 17.9280, lng: 83.4356 },
      { lat: 17.9272, lng: 83.4364 },
      { lat: 17.9263, lng: 83.4372 },
      { lat: 17.9255, lng: 83.4380 },
      { lat: 17.9250, lng: 83.4385 },
    ];

    const gpsTimer = setInterval(() => {
      if (step >= waypoints.length) {
        clearInterval(gpsTimer);
        setIsBroadcastingGps(false);
        return;
      }
      broadcastLocation(waypoints[step].lat, waypoints[step].lng);
      step++;
    }, 4000);
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Rider Header Bar */}
      <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <Bike className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-xs text-slate-400">
              Arabian Mandi Partner • Thagarapuvalasa Delivery Fleet
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-center">
          <div className="p-3 rounded-xl bg-mandi-surface border border-mandi-border">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Delivered
            </span>
            <span className="font-heading font-black text-lg text-white">
              {stats.totalDelivered}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-mandi-surface border border-mandi-border">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Earnings
            </span>
            <span className="font-heading font-black text-lg text-emerald-400">
              ₹{stats.totalEarnings}
            </span>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* 1. ACTIVE DELIVERY CARD */}
      {activeDelivery ? (
        <div className="bg-mandi-card border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mandi-border pb-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                CURRENT ACTIVE ORDER
              </span>
              <h2 className="font-mono text-2xl font-black text-white mt-1">
                {activeDelivery.order?.orderNumber}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-semibold">Delivery Fee Payout</span>
              <span className="font-heading font-black text-xl text-emerald-400">
                ₹{activeDelivery.earnings}
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-mandi-surface border border-mandi-border space-y-2.5">
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider block">
                Customer Destination
              </span>
              <div className="font-semibold text-sm text-white">
                {activeDelivery.order?.customer?.name}
              </div>
              <p className="text-slate-300">
                {activeDelivery.order?.address?.addressLine}, {activeDelivery.order?.address?.area}
              </p>
              {activeDelivery.order?.address?.landmark && (
                <p className="text-[11px] text-slate-400">
                  Landmark: {activeDelivery.order.address.landmark}
                </p>
              )}
              {activeDelivery.order?.deliveryInstructions && (
                <p className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-500/20">
                  Note: {activeDelivery.order.deliveryInstructions}
                </p>
              )}

              <div className="pt-2 grid grid-cols-3 gap-2">
                <a
                  href={`tel:${activeDelivery.order?.customer?.phone}`}
                  className="py-2 px-2 rounded-xl bg-gold-gradient text-black font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <a
                  href={`https://wa.me/91${activeDelivery.order?.customer?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${activeDelivery.order?.customer?.name}, this is your Arabian Mandi delivery partner regarding order ${activeDelivery.order?.orderNumber}. I am on the way.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 rounded-xl bg-emerald-950 border border-emerald-500/40 hover:bg-emerald-900 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeDelivery.order?.address?.latitude || 17.9250},${activeDelivery.order?.address?.longitude || 83.4385}&travelmode=driving`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-2 rounded-xl bg-mandi-card border border-mandi-border hover:border-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1"
                  title="Turn-by-turn Navigation in Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-400" /> Navigate
                </a>
              </div>
            </div>

            {/* Order Items & Payment Info */}
            <div className="p-4 rounded-2xl bg-mandi-surface border border-mandi-border space-y-2.5">
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider block">
                Food Items & Payment
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {activeDelivery.order?.items?.map((it: any) => (
                  <div key={it.id} className="flex justify-between">
                    <span className="font-semibold text-white">
                      {it.quantity}× {it.name}
                    </span>
                    <span className="text-slate-400">₹{it.subtotal}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-mandi-border flex items-center justify-between font-semibold">
                <span className="text-slate-300">Payment Collection:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    activeDelivery.order?.payment?.paymentMethod === 'COD'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {activeDelivery.order?.payment?.paymentMethod === 'COD'
                    ? `COLLECT CASH: ₹${activeDelivery.order?.totalAmount}`
                    : 'PAID ONLINE (No cash)'}
                </span>
              </div>
            </div>
          </div>

          {/* Workflow Action Steps */}
          <div className="pt-4 border-t border-mandi-border space-y-4">
            <h4 className="font-heading font-bold text-sm text-white">
              Delivery Stage Actions
            </h4>

            {activeDelivery.status === 'ASSIGNED' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeliveryAction('ACCEPT', activeDelivery.id)}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-heading font-black text-sm tracking-wider text-white shadow-lg"
                >
                  ACCEPT DELIVERY (₹{activeDelivery.earnings})
                </button>
                <button
                  onClick={() => handleDeliveryAction('REJECT', activeDelivery.id)}
                  className="py-3.5 px-6 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 font-bold text-xs"
                >
                  REJECT
                </button>
              </div>
            )}

            {activeDelivery.status === 'ACCEPTED' && (
              <button
                onClick={() => handleDeliveryAction('ARRIVED_AT_RESTAURANT', activeDelivery.id)}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-heading font-black text-sm tracking-wider text-white shadow-lg"
              >
                ARRIVED AT ARABIAN MANDI RESTAURANT
              </button>
            )}

            {activeDelivery.status === 'ARRIVED_AT_RESTAURANT' && (
              <button
                onClick={() => handleDeliveryAction('START_DELIVERY', activeDelivery.id)}
                className="w-full py-4 rounded-xl bg-gold-gradient text-black font-heading font-black text-sm tracking-wider shadow-gold-sm hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Bike className="w-5 h-5 stroke-[2.5]" />
                <span>ORDER PICKED UP • START DELIVERY</span>
              </button>
            )}

            {activeDelivery.status === 'PICKED_UP' && (
              <div className="space-y-4 bg-mandi-surface p-5 rounded-2xl border border-mandi-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-heading font-bold text-xs text-white flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    <span>Live GPS Location Broadcasting</span>
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Real Device Phone GPS */}
                    <button
                      onClick={toggleLiveDeviceGps}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                        isLiveDeviceGpsActive
                          ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                          : 'bg-mandi-card border-mandi-border text-emerald-400 hover:border-emerald-500'
                      }`}
                      title="Broadcast phone's real GPS sensor via browser"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>{isLiveDeviceGpsActive ? 'Phone GPS Active' : 'Use Phone GPS'}</span>
                    </button>

                    {/* Simulation Route */}
                    <button
                      onClick={toggleGpsSimulation}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        isBroadcastingGps
                          ? 'bg-amber-600 text-white border-amber-400 animate-pulse'
                          : 'bg-mandi-card border-mandi-border text-slate-300 hover:border-gold-500'
                      }`}
                    >
                      {isBroadcastingGps ? 'Simulating Route...' : 'Simulate Test Route'}
                    </button>
                  </div>
                </div>

                {gpsError && (
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-[11px] text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <span>{gpsError}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-mandi-border space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Verify Customer 4-Digit Delivery OTP to Complete:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="e.g. 4821"
                      className="font-mono text-center tracking-widest text-lg font-black w-full sm:w-36 py-3 px-3 rounded-xl bg-mandi-card border border-mandi-border text-white focus:border-gold-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleDeliveryAction('DELIVER', activeDelivery.id)}
                      disabled={otpInput.length < 4 || actionLoading}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-heading font-black text-xs tracking-wider shadow-lg"
                    >
                      {actionLoading ? 'VERIFYING...' : 'VERIFY OTP & COMPLETE DELIVERY'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-mandi-card border border-mandi-border text-center space-y-2">
          <Package className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="font-heading font-bold text-base text-white">No Active Delivery Right Now</h3>
          <p className="text-xs text-slate-400">
            You are online and ready to receive assignments in the Thagarapuvalasa delivery zone.
          </p>
        </div>
      )}

      {/* 2. RECENT COMPLETED DELIVERIES */}
      <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 space-y-4">
        <h3 className="font-heading font-bold text-base text-white border-b border-mandi-border pb-3">
          Completed Deliveries History ({completedDeliveries.length})
        </h3>

        {completedDeliveries.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No completed deliveries yet.</p>
        ) : (
          <div className="space-y-3">
            {completedDeliveries.map((cd) => (
              <div
                key={cd.id}
                className="p-3.5 rounded-xl bg-mandi-surface border border-mandi-border flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-white block">
                    {cd.order?.orderNumber}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Delivered to {cd.order?.address?.area || 'Thagarapuvalasa'} • {new Date(cd.deliveredAt || cd.assignedAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="font-bold text-emerald-400 text-sm">
                  +₹{cd.earnings}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

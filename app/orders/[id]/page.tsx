'use client';

import React, { useEffect, useState, use } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  Clock,
  Bike,
  UtensilsCrossed,
  ChefHat,
  PackageCheck,
  Shield,
  Phone,
  AlertCircle,
  Star,
  MapPin,
  RotateCcw,
  Sparkles,
  MessageCircle,
  Share2,
  XCircle,
} from 'lucide-react';
import LiveTrackingMap from '@/components/LiveTrackingMap';
import { useCart } from '@/context/CartContext';
import confetti from 'canvas-confetti';

const STATUS_STEPS = [
  { key: 'PLACED', label: 'Order Placed', desc: 'Order received by restaurant', icon: Clock },
  { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Restaurant accepted your order', icon: CheckCircle },
  { key: 'PREPARING', label: 'Kitchen Preparing', desc: 'Chef Tariq is grilling & smoking your mandi', icon: ChefHat },
  { key: 'READY_FOR_PICKUP', label: 'Food Ready', desc: 'Packed in thermal insulated containers', icon: PackageCheck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Delivery partner picked up your food', icon: Bike },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your royal feast!', icon: UtensilsCrossed },
];

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();

  const [order, setOrder] = useState<any | null>(null);
  const [latestLocation, setLatestLocation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans / Ordered by mistake');
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch Order Details
  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        if (data.latestLocation) {
          setLatestLocation(data.latestLocation);
        }
      }
    } catch (e) {
      console.error('Fetch order error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Trigger celebratory confetti on initial visit
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    // Connect to Server-Sent Events (SSE) for Real-Time Updates
    const eventSource = new EventSource(`/api/events?orderId=${id}`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'DELIVERY_LOCATION_UPDATED' && payload.data) {
          setLatestLocation({
            latitude: payload.data.latitude,
            longitude: payload.data.longitude,
            heading: payload.data.heading,
            speed: payload.data.speed,
          });
        } else {
          // Status change event
          fetchOrder();
        }
      } catch (err) {}
    };

    // Fallback polling every 8 seconds
    const interval = setInterval(fetchOrder, 8000);

    return () => {
      eventSource.close();
      clearInterval(interval);
    };
  }, [id]);

  // Handle Review Submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          rating: reviewRating,
          foodRating: reviewRating,
          deliveryRating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSubmitted(true);
        fetchOrder();
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (e) {
      alert('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Quick Re-Order Feature
  const handleReorder = () => {
    if (!order) return;
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

  // Order Cancellation Handler (Allowed when PLACED or CONFIRMED)
  const handleCancelOrder = async () => {
    if (!order) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', reason: cancelReason }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCancelModal(false);
        fetchOrder();
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (e) {
      alert('Unable to cancel order right now. Please call restaurant directly.');
    } finally {
      setIsCancelling(false);
    }
  };

  // WhatsApp Order Sharing
  const handleShareOrder = () => {
    if (!order || typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    const text = `Tracking my Arabian Mandi Feast (#${order.orderNumber}): ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading order details & live tracking...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold text-white">Order Not Found</h2>
        <p className="text-xs text-slate-400">The requested order does not exist or you do not have permission to view it.</p>
        <NextLink href="/menu" className="inline-block px-6 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs">
          Return to Menu
        </NextLink>
      </div>
    );
  }

  // Calculate current status step index
  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-10 space-y-6 sm:space-y-8">
      {/* Top Banner / Order Info */}
      <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
              {order.orderNumber}
            </span>
            <span className="text-xs text-slate-400">
              Placed on {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
            {isCancelled ? 'Order Cancelled' : 'Order in Progress'}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Delivering to: <strong className="text-white">{order.address?.area}, {order.address?.city}</strong>
          </p>
        </div>

        {/* Delivery OTP Badge */}
        {!isCancelled && order.status !== 'DELIVERED' && (
          <div className="p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/40 text-center shadow-gold-sm">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
              DELIVERY CONFIRMATION OTP
            </span>
            <span className="font-mono text-2xl font-black text-gold-400 tracking-widest block">
              {order.deliveryOtp}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Share with delivery rider upon arrival
            </span>
          </div>
        )}
      </div>

      {/* Instant Support, WhatsApp & Cancellation Bar */}
      <div className="bg-mandi-card border border-mandi-border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp Restaurant Support */}
          <a
            href={`https://wa.me/918919234567?text=${encodeURIComponent(`Hi Arabian Mandi, I have a question regarding my order ${order.orderNumber}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Call Restaurant */}
          <a
            href="tel:+918919234567"
            className="px-3.5 py-2 rounded-xl bg-mandi-surface hover:bg-mandi-elevated border border-mandi-border text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gold-400" />
            <span>Call Restaurant</span>
          </a>

          {/* Share Live Tracking */}
          <button
            onClick={handleShareOrder}
            className="px-3.5 py-2 rounded-xl bg-mandi-surface hover:bg-mandi-elevated border border-mandi-border text-slate-300 font-semibold text-xs flex items-center gap-2 transition-colors"
            title="Share with family or friends"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Share Tracking</span>
          </button>
        </div>

        {/* Self-cancellation window if order is PLACED or CONFIRMED */}
        {['PLACED', 'CONFIRMED'].includes(order.status) && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-950 border border-red-500/30 text-red-300 font-semibold text-xs flex items-center gap-1.5 transition-colors ml-auto"
          >
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            <span>Cancel Order</span>
          </button>
        )}
      </div>

      {/* Main Grid: Interactive Map & Order Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real-Time Map & Rider Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-mandi-card border border-mandi-border rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  Live Delivery Route
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-400">
                {order.status === 'OUT_FOR_DELIVERY' ? '🟢 Live GPS Active' : '📍 Route Ready'}
              </span>
            </div>

            {/* Interactive Leaflet Map */}
            <LiveTrackingMap
              restaurantLat={17.9288}
              restaurantLng={83.4350}
              restaurantName="Arabian Mandi (NH16)"
              customerLat={order.address?.latitude || 17.9250}
              customerLng={order.address?.longitude || 83.4385}
              customerAddress={order.address?.addressLine}
              riderLat={latestLocation?.latitude}
              riderLng={latestLocation?.longitude}
              riderName={order.deliveryAssignment?.deliveryPartner?.name || 'Rider Raju'}
              status={order.status}
            />

            {/* Delivery Partner Details if Assigned */}
            {order.deliveryAssignment?.deliveryPartner && (
              <div className="p-4 rounded-xl bg-mandi-surface border border-mandi-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gold-500/20 text-gold-400 font-bold flex items-center justify-center border border-gold-500/30">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {order.deliveryAssignment.deliveryPartner.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Arabian Mandi Official Delivery Partner
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${order.deliveryAssignment.deliveryPartner.phone}`}
                  className="px-3 py-2 rounded-xl bg-gold-gradient text-black font-bold text-xs flex items-center gap-1.5 shadow-gold-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Rider
                </a>
              </div>
            )}
          </div>

          {/* Review & Rating Form (Visible when DELIVERED) */}
          {order.status === 'DELIVERED' && !order.review && !reviewSubmitted && (
            <div className="bg-mandi-card border border-gold-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-gold-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Rate Your Arabian Mandi Experience</span>
              </div>
              <p className="text-xs text-slate-300">
                How was the flavor of the smoked basmati, succulent meats, and prompt delivery?
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-slate-600 hover:text-gold-400 transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'fill-gold-400 text-gold-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gold-400 ml-2">
                    {reviewRating} of 5 Stars
                  </span>
                </div>

                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us what you loved about your Mandi..."
                  className="w-full p-3 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white focus:outline-none focus:border-gold-500"
                />

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs tracking-wider shadow-gold-sm hover:brightness-110"
                >
                  {isSubmittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                </button>
              </form>
            </div>
          )}

          {/* Review Submitted Banner */}
          {(order.review || reviewSubmitted) && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Thank you! Your verified review has been submitted to Arabian Mandi.</span>
            </div>
          )}
        </div>

        {/* Right Column: Order Timeline & Order Items Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Status Timeline */}
          <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="font-heading font-bold text-base text-white border-b border-mandi-border pb-3">
              Live Order Progress
            </h3>

            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-mandi-border">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        isCurrent
                          ? 'bg-gold-500 text-black ring-4 ring-gold-500/30 font-bold'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-mandi-surface text-slate-500 border border-mandi-border'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1">
                      <h4
                        className={`font-heading font-bold text-sm ${
                          isCurrent ? 'text-gold-400' : isPassed ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details & Items Card */}
          <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-mandi-border pb-3">
              <h3 className="font-heading font-bold text-base text-white">Items Ordered</h3>
              <button
                onClick={handleReorder}
                className="text-xs text-gold-400 font-semibold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Order Again</span>
              </button>
            </div>

            <div className="space-y-3">
              {order.items.map((it: any) => (
                <div key={it.id} className="flex justify-between items-start text-xs">
                  <div>
                    <span className="font-semibold text-white">
                      {it.quantity} × {it.name}
                    </span>
                    {it.size && (
                      <span className="text-[10px] text-gold-400 block">
                        Portion: {it.size}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-gold-400">₹{it.subtotal}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-mandi-border/80 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax & Packaging</span>
                <span>₹{Math.round((order.tax + order.packagingFee) * 100) / 100}</span>
              </div>
              <div className="pt-2 border-t border-mandi-border flex justify-between items-baseline text-sm">
                <span className="font-heading font-bold text-white">Total Amount</span>
                <span className="font-heading font-black text-xl text-gold-400">
                  ₹{order.totalAmount}
                </span>
              </div>
              <div className="pt-1 flex justify-between text-[11px] text-slate-400">
                <span>Payment Method</span>
                <span className="font-semibold uppercase text-slate-200">
                  {order.payment?.paymentMethod || 'COD'} ({order.payment?.status || 'PENDING'})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-mandi-card border border-mandi-border max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 font-bold text-base">
              <AlertCircle className="w-5 h-5" />
              <span>Cancel Order #{order.orderNumber}?</span>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to cancel this order? If you paid online, a full refund will be recorded to your account.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block">
                Please select a reason:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-mandi-surface border border-mandi-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                <option value="Change of plans / Ordered by mistake">Change of plans / Ordered by mistake</option>
                <option value="Need to change delivery address">Need to change delivery address</option>
                <option value="Forgot to apply coupon code">Forgot to apply coupon code</option>
                <option value="Delivery time is too long">Delivery time is too long</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl bg-mandi-surface hover:bg-mandi-elevated text-xs font-semibold text-slate-300"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-md disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

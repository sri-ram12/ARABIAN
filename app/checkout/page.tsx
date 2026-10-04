'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, Address } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  Phone,
  User as UserIcon,
} from 'lucide-react';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    items,
    clearCart,
    subtotal,
    discount,
    deliveryFee,
    tax,
    packagingFee,
    grandTotal,
    appliedCoupon,
    selectedAddress,
    setSelectedAddress,
    isServiceable,
    checkServiceabilityForAddress,
  } = useCart();

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine: '',
    landmark: '',
    area: 'Sangivalasa',
    city: 'Thagarapuvalasa',
    state: 'Andhra Pradesh',
    pincode: '531162',
    latitude: 17.9250,
    longitude: 83.4385,
    addressType: 'HOME' as 'HOME' | 'WORK' | 'OTHER',
    deliveryInstructions: '',
  });

  // Delivery & Kitchen Instructions
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');

  // Processing state
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch user addresses on mount
  useEffect(() => {
    async function loadAddresses() {
      if (!user) return;
      try {
        const res = await fetch('/api/addresses');
        const data = await res.json();
        if (data.success && data.addresses) {
          setSavedAddresses(data.addresses);
          if (!selectedAddress && data.addresses.length > 0) {
            setSelectedAddress(data.addresses[0]);
          }
        }
      } catch (e) {
        console.error('Failed to load addresses', e);
      }
    }
    loadAddresses();
  }, [user]);

  // If cart is empty, redirect to menu
  useEffect(() => {
    if (items.length === 0 && !isPlacingOrder) {
      router.push('/menu');
    }
  }, [items, isPlacingOrder, router]);

  // Handle saving new address
  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.addressLine || !newAddress.area) {
      alert('Please fill in address line and area');
      return;
    }

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      });
      const data = await res.json();
      if (data.success && data.address) {
        setSavedAddresses((prev) => [data.address, ...prev]);
        setSelectedAddress(data.address);
        setShowNewAddressForm(false);
        await checkServiceabilityForAddress(data.address);
      } else {
        alert(data.message || 'Failed to save address');
      }
    } catch (e) {
      alert('Failed to save address');
    }
  };

  // Place Order Handler
  const handlePlaceOrder = async () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!selectedAddress) {
      setErrorMessage('Please select or add a delivery address in Thagarapuvalasa.');
      return;
    }

    setErrorMessage(null);
    setIsPlacingOrder(true);

    try {
      // 1. Call Backend Order Placement API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddress.id,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            size: i.size,
            quantity: i.quantity,
            selectedAddons: i.selectedAddons,
          })),
          paymentMethod,
          couponCode: appliedCoupon?.code || null,
          deliveryInstructions,
          kitchenNotes,
        }),
      });

      const orderData = await res.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const createdOrder = orderData.order;

      // 2. Handle Payment Flow
      if (paymentMethod === 'COD') {
        // Cash on delivery: instant order confirmation
        clearCart();
        router.push(`/orders/${createdOrder.id}?success=true`);
        return;
      }

      // Online Razorpay Payment flow
      if (paymentMethod === 'RAZORPAY' && orderData.razorpayOrder) {
        const razorpayKey =
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_arabian_mandi_dummy';

        // Check if Razorpay script is loaded and key is live/test
        if (typeof window.Razorpay === 'function') {
          const options = {
            key: razorpayKey,
            amount: orderData.razorpayOrder.amount,
            currency: orderData.razorpayOrder.currency,
            name: 'Arabian Mandi',
            description: `Order ${createdOrder.orderNumber}`,
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100',
            order_id: orderData.razorpayOrder.id,
            prefill: {
              name: user.name,
              email: user.email,
              contact: user.phone,
            },
            theme: {
              color: '#D4AF37',
            },
            handler: async function (response: any) {
              // Server-side verification
              try {
                const verifyRes = await fetch('/api/payments/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderId: createdOrder.id,
                    razorpayOrderId: response.razorpay_order_id || orderData.razorpayOrder.id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  }),
                });

                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                  clearCart();
                  router.push(`/orders/${createdOrder.id}?paid=true`);
                } else {
                  alert(`Payment verification failed: ${verifyData.message}`);
                }
              } catch (err) {
                alert('Payment verification encountered an issue. Please contact support.');
              }
            },
            modal: {
              ondismiss: function () {
                setIsPlacingOrder(false);
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (failRes: any) {
            alert(`Payment Failed: ${failRes.error.description}`);
            setIsPlacingOrder(false);
          });
          rzp.open();
        } else {
          // In test/demo sandbox fallback if Razorpay SDK isn't loaded
          const mockPaymentId = `pay_${Date.now()}`;
          const mockSig = 'sig_mock_verified_signature_production';

          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: createdOrder.id,
              razorpayOrderId: orderData.razorpayOrder.id,
              razorpayPaymentId: mockPaymentId,
              razorpaySignature: mockSig,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            router.push(`/orders/${createdOrder.id}?paid=true`);
          }
        }
      }
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setErrorMessage(err.message || 'Unable to place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-heading text-3xl font-black text-white mb-2">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mb-8">
          Complete your delivery address and payment to send your order directly to our kitchen
        </p>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Multi-Step Forms */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact Confirmation */}
            <div className="bg-mandi-card border border-mandi-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-mandi-border pb-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-black font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-heading font-bold text-sm text-white">
                  Customer & Contact Details
                </h3>
              </div>

              {user ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-mandi-surface border border-mandi-border flex items-center gap-3">
                    <UserIcon className="w-4 h-4 text-gold-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Name</span>
                      <span className="font-semibold text-white">{user.name}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-mandi-surface border border-mandi-border flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gold-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Phone</span>
                      <span className="font-semibold text-white">{user.phone}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-mandi-surface border border-mandi-border text-center space-y-3">
                  <p className="text-xs text-slate-300">
                    Please log in or register to complete your order and track your delivery live.
                  </p>
                  <button
                    onClick={() => router.push('/login?redirect=/checkout')}
                    className="px-6 py-2 rounded-xl bg-gold-500 text-black font-bold text-xs shadow-gold-sm"
                  >
                    Login / Register
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Delivery Address Selection */}
            <div className="bg-mandi-card border border-mandi-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-mandi-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold-500 text-black font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-heading font-bold text-sm text-white">
                    Delivery Address in Thagarapuvalasa
                  </h3>
                </div>
                <button
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs text-gold-400 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showNewAddressForm ? 'Cancel' : 'Add New Address'}</span>
                </button>
              </div>

              {/* Saved Addresses List */}
              {!showNewAddressForm && (
                <div className="space-y-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddress(addr);
                          checkServiceabilityForAddress(addr);
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-gold-500/15 border-gold-500 text-white shadow-gold-sm'
                            : 'bg-mandi-surface border-mandi-border text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/40 text-gold-400 uppercase">
                              {addr.addressType}
                            </span>
                            <span className="font-semibold text-xs text-white">
                              {addr.area}, {addr.city}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-gold-400" />}
                          </div>
                          <p className="text-xs text-slate-300">{addr.addressLine}</p>
                          {addr.landmark && (
                            <p className="text-[11px] text-slate-400">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* New Address Form */}
              {showNewAddressForm && (
                <form onSubmit={handleSaveNewAddress} className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Area / Neighborhood *
                    </label>
                    <select
                      value={newAddress.area}
                      onChange={(e) => {
                        const area = e.target.value;
                        let lat = 17.9250;
                        let lng = 83.4385;
                        if (area === 'Chittivalasa') { lat = 17.9355; lng = 83.4312; }
                        if (area === 'Thagarapuvalasa Town') { lat = 17.9290; lng = 83.4345; }
                        if (area === 'Anandapuram') { lat = 17.9050; lng = 83.4150; }
                        if (area === 'Bheemili') { lat = 17.8920; lng = 83.4540; }
                        setNewAddress({ ...newAddress, area, latitude: lat, longitude: lng });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
                    >
                      <option value="Sangivalasa">Sangivalasa (NRI Hospital & College)</option>
                      <option value="Thagarapuvalasa Town">Thagarapuvalasa Main Town & Bus Stand</option>
                      <option value="Chittivalasa">Chittivalasa Jute Mill Quarters</option>
                      <option value="Anandapuram">Anandapuram NH16 Junction</option>
                      <option value="Bheemili">Bheemunipatnam (Bheemili Beach Road)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Flat / House No. & Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.addressLine}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                      placeholder="e.g. Flat 302, Royal Residency, NH16 Service Road"
                      className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Landmark
                      </label>
                      <input
                        type="text"
                        value={newAddress.landmark}
                        onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                        placeholder="Near Bus Stop, SBI"
                        className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Address Tag
                      </label>
                      <div className="flex gap-2">
                        {['HOME', 'WORK', 'OTHER'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setNewAddress({ ...newAddress, addressType: tag as any })}
                            className={`flex-1 py-2 text-[10px] font-bold rounded-lg border ${
                              newAddress.addressType === tag
                                ? 'bg-gold-500 text-black border-gold-500'
                                : 'bg-mandi-surface text-slate-400 border-mandi-border'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs tracking-wider shadow-gold-sm hover:brightness-110"
                  >
                    SAVE & USE THIS ADDRESS
                  </button>
                </form>
              )}
            </div>

            {/* Step 3: Instructions & Kitchen Notes */}
            <div className="bg-mandi-card border border-mandi-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-mandi-border pb-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-black font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="font-heading font-bold text-sm text-white">
                  Delivery & Cooking Notes
                </h3>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Delivery Partner Instructions
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Call when you arrive', 'Leave at gate', 'Don’t ring bell', 'Avoid horn'].map((txt) => (
                    <button
                      key={txt}
                      type="button"
                      onClick={() =>
                        setDeliveryInstructions((prev) =>
                          prev ? `${prev}, ${txt}` : txt
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-mandi-surface hover:bg-mandi-elevated border border-mandi-border text-[11px] text-slate-300"
                    >
                      + {txt}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Ring doorbell twice, 3rd floor"
                  className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Special Kitchen Instructions
                </label>
                <input
                  type="text"
                  value={kitchenNotes}
                  onChange={(e) => setKitchenNotes(e.target.value)}
                  placeholder="e.g. Medium spicy, extra toum sauce, pack cutlery"
                  className="w-full px-3 py-2 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
                />
              </div>
            </div>

            {/* Step 4: Payment Method Selection */}
            <div className="bg-mandi-card border border-mandi-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-mandi-border pb-3">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-black font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="font-heading font-bold text-sm text-white">
                  Select Payment Method
                </h3>
              </div>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'RAZORPAY'
                      ? 'bg-gold-500/15 border-gold-500 text-white shadow-gold-sm'
                      : 'bg-mandi-surface border-mandi-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-2">
                        <span>Pay Online via Razorpay</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        UPI (GPay, PhonePe, Paytm), Credit/Debit Card, Netbanking
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'RAZORPAY' && (
                    <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'COD'
                      ? 'bg-gold-500/15 border-gold-500 text-white shadow-gold-sm'
                      : 'bg-mandi-surface border-mandi-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Cash on Delivery (COD)</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Pay cash or UPI directly to our delivery partner at your doorstep
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'COD' && (
                    <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 space-y-4 shadow-2xl">
              <h3 className="font-heading font-bold text-base text-white border-b border-mandi-border pb-3">
                Order Summary ({items.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white">
                        {it.quantity} × {it.name}
                      </span>
                      {it.size && (
                        <span className="text-[10px] text-gold-400 block">
                          ({it.size})
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-gold-400">
                      ₹{it.price * it.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="pt-3 border-t border-mandi-border/80 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-white">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span className="font-semibold text-white">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thermal Packaging</span>
                  <span className="font-semibold text-white">₹{packagingFee}</span>
                </div>
                <div className="pt-3 border-t border-mandi-border flex justify-between items-baseline text-sm">
                  <span className="font-heading font-bold text-white text-base">Grand Total</span>
                  <span className="font-heading font-black text-2xl text-gold-400">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-4 rounded-xl bg-gold-gradient text-black font-heading font-black text-sm tracking-wide shadow-gold-sm hover:brightness-110 active:scale-98 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <span>PROCESSING ORDER...</span>
                ) : (
                  <>
                    <span>PLACE ORDER NOW (₹{grandTotal})</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Encrypted & Authenticated Order Transaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

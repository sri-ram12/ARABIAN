'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Percent,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import LocationModal from '@/components/LocationModal';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    deliveryFee,
    tax,
    packagingFee,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    selectedAddress,
    isServiceable,
    serviceabilityMessage,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponError(null);
    setCouponSuccess(null);
    setIsApplyingCoupon(true);

    const res = await applyCoupon(couponInput.trim());
    setIsApplyingCoupon(false);

    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-mandi-card border border-mandi-border flex items-center justify-center mx-auto text-gold-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-heading text-3xl font-black text-white">Your Cart is Empty</h1>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          You haven&apos;t added any delicious Arabian Mandi platters or grills to your order yet.
        </p>
        <NextLink
          href="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-gradient text-black font-heading font-black text-sm tracking-wide shadow-gold-sm hover:brightness-110 transition-all"
        >
          <span>EXPLORE OUR MENU</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </NextLink>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between border-b border-mandi-border pb-6 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-black text-white">Your Order Cart</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review your dishes, portion sizes, and delivery destination in Thagarapuvalasa
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item, index) => {
            const addonsSum = (item.selectedAddons || []).reduce((s, a) => s + a.price, 0);
            const itemUnitTotal = item.price + addonsSum;

            return (
              <div
                key={`${item.menuItemId}-${index}`}
                className="bg-mandi-card border border-mandi-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-600"
              >
                <div className="flex items-center gap-4 flex-1">
                  {item.image && (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border border-mandi-border">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-white">
                      {item.name}
                    </h3>
                    {item.size && (
                      <span className="inline-block mt-0.5 text-xs text-gold-400 font-medium">
                        Size: {item.size}
                      </span>
                    )}

                    {/* Addons preview */}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap gap-1">
                        {item.selectedAddons.map((a, i) => (
                          <span
                            key={i}
                            className="bg-mandi-surface px-1.5 py-0.5 rounded border border-mandi-border"
                          >
                            + {a.name} (₹{a.price})
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="font-heading font-black text-sm text-gold-400 mt-1.5">
                      ₹{itemUnitTotal} × {item.quantity} = ₹{itemUnitTotal * item.quantity}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-mandi-border/60">
                  <div className="flex items-center gap-1.5 bg-mandi-surface border border-mandi-border rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-mandi-card"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-mandi-card"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Delivery Destination Card */}
          <div className="bg-mandi-card border border-mandi-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400" /> Delivery Area
              </span>
              <button
                onClick={() => setLocationModalOpen(true)}
                className="text-xs font-semibold text-gold-400 hover:underline"
              >
                Change
              </button>
            </div>

            <div className="p-3 rounded-xl bg-mandi-surface border border-mandi-border flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">
                  {selectedAddress ? `${selectedAddress.area}, ${selectedAddress.city}` : 'Thagarapuvalasa Town (Default)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {serviceabilityMessage || 'Estimated delivery in 35-45 minutes'}
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Serviceable
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Coupons & Bill Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Apply Coupon Box */}
          <div className="bg-mandi-card border border-mandi-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-400">
              <Tag className="w-4 h-4" />
              <span>Have a Coupon or Promo Code?</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-gold-300">
                    {appliedCoupon.code} APPLIED
                  </span>
                  <p className="text-[11px] text-slate-300">
                    You saved ₹{appliedCoupon.calculatedDiscount}!
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. WELCOME50)"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border focus:border-gold-500 focus:outline-none text-xs text-white uppercase placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !couponInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs tracking-wider shadow-gold-sm hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {isApplyingCoupon ? '...' : 'APPLY'}
                </button>
              </form>
            )}

            {couponError && <p className="text-xs text-red-400">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-emerald-400">{couponSuccess}</p>}

            {/* Quick Suggestions */}
            {!appliedCoupon && (
              <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
                <button
                  onClick={() => setCouponInput('WELCOME50')}
                  className="px-2 py-1 rounded bg-mandi-surface border border-mandi-border hover:border-gold-500 text-slate-300"
                >
                  WELCOME50 (₹50 OFF)
                </button>
                <button
                  onClick={() => setCouponInput('MANDI100')}
                  className="px-2 py-1 rounded bg-mandi-surface border border-mandi-border hover:border-gold-500 text-slate-300"
                >
                  MANDI100 (₹100 OFF)
                </button>
                <button
                  onClick={() => setCouponInput('FREEDEL')}
                  className="px-2 py-1 rounded bg-mandi-surface border border-mandi-border hover:border-gold-500 text-slate-300"
                >
                  FREEDEL (Free Delivery)
                </button>
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-heading font-bold text-base text-white border-b border-mandi-border pb-3">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-semibold text-white">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee (Thagarapuvalasa Area)</span>
                <span className="font-semibold text-white">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Govt Taxes & GST (5%)</span>
                <span className="font-semibold text-white">₹{tax}</span>
              </div>

              <div className="flex justify-between">
                <span>Insulated Thermal Packaging Fee</span>
                <span className="font-semibold text-white">₹{packagingFee}</span>
              </div>

              <div className="pt-3 border-t border-mandi-border flex justify-between items-baseline text-sm">
                <span className="font-heading font-bold text-white text-base">To Pay</span>
                <span className="font-heading font-black text-xl text-gold-400">
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            <NextLink
              href="/checkout"
              className="block w-full py-3.5 rounded-xl bg-gold-gradient text-black font-heading font-bold text-sm tracking-wide text-center shadow-gold-sm hover:brightness-110 active:scale-98 transition-all"
            >
              PROCEED TO CHECKOUT
            </NextLink>

            <p className="text-[11px] text-center text-slate-400">
              Safe & secure checkout with Razorpay UPI, Cards & Cash on Delivery
            </p>
          </div>
        </div>
      </div>

      <LocationModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
    </div>
  );
}

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
  MapPin,
  X,
  Clock,
  ShieldCheck,
  ChevronRight,
  Crown,
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
  const [cookingNote, setCookingNote] = useState('');

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
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-[#18181f] border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37]">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fceda2]">Your Feast Cart is Empty</h1>
          <p className="text-sm text-[#a1a1aa] max-w-sm mx-auto mt-2 font-sans font-light">
            Indulge in authentic pit-smoked Arabian Mandi, crispy Faham grills, and melted cheese kunafa.
          </p>
        </div>
        <NextLink
          href="/menu"
          className="btn-royal-gold inline-flex items-center gap-2 px-8 py-3.5 text-xs sm:text-sm tracking-wide shadow-gold-sm"
        >
          <span>EXPLORE ROYAL MENU</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </NextLink>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-28 lg:pb-12 text-[#f4f4f5]">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#272730] gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#a1a1aa] mb-1 font-cinzel">
            <NextLink href="/" className="hover:text-[#fceda2]">Home</NextLink>
            <span>/</span>
            <NextLink href="/menu" className="hover:text-[#fceda2]">S & H Mandi</NextLink>
            <span>/</span>
            <span className="text-[#fceda2] font-semibold">Feast Cart</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fceda2]">Order Summary</h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            S & H Arabian Mandi • Sangivalasa, Thagarapuvalasa
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Empty Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items & Delivery Details */}
        <div className="lg:col-span-7 space-y-4">
          {/* Restaurant Card Header */}
          <div className="slate-plate-card rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="gold-seal-badge">
                <span>S&H</span>
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-sm text-[#fceda2]">S & H Arabian Mandi</h3>
                <p className="text-xs text-[#a1a1aa] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" /> Delivery in 30-40 mins
                </p>
              </div>
            </div>
            <NextLink
              href="/menu"
              className="text-xs font-cinzel text-[#d4af37] hover:underline"
            >
              + Add More Items
            </NextLink>
          </div>

          {/* Cart Items List */}
          <div className="slate-plate-card rounded-2xl divide-y divide-[#272730] overflow-hidden">
            {items.map((item, index) => {
              const addonsSum = (item.selectedAddons || []).reduce((s, a) => s + a.price, 0);
              const itemUnitTotal = item.price + addonsSum;

              return (
                <div
                  key={`${item.menuItemId}-${index}`}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-[#18181f]/40 transition-colors"
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="mt-1 flex-shrink-0">
                      <div className="zomato-nonveg-mark" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-cinzel font-bold text-sm sm:text-base text-[#fceda2] leading-snug">
                        {item.name}
                      </h4>
                      {item.size && (
                        <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#18181f] text-[#d4af37] border border-[#272730]">
                          Portion: {item.size}
                        </span>
                      )}

                      {/* Addons */}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="text-[11px] text-[#a1a1aa] mt-1 flex flex-wrap gap-1">
                          {item.selectedAddons.map((a, i) => (
                            <span key={i} className="bg-[#18181f] px-1.5 py-0.5 rounded text-[#d4d4d8] border border-[#272730]">
                              + {a.name} (₹{a.price})
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="font-mono font-bold text-sm text-white mt-2">
                        ₹{itemUnitTotal * item.quantity}
                        {item.quantity > 1 && (
                          <span className="text-xs font-normal text-[#a1a1aa] ml-1.5">
                            (₹{itemUnitTotal} × {item.quantity})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center bg-[#18181f] border border-[#272730] rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-[#22222a] text-[#d4af37] transition-colors"
                      >
                        <Minus className="w-3 h-3 stroke-[2.5]" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-[#fceda2] select-none min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-[#22222a] text-[#d4af37] transition-colors"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cooking Instructions Input */}
          <div className="slate-plate-card rounded-2xl p-4">
            <label className="text-xs font-cinzel font-bold text-[#fceda2] block mb-1.5 uppercase tracking-wider">
              Cooking or Delivery Notes (Optional)
            </label>
            <input
              type="text"
              value={cookingNote}
              onChange={(e) => setCookingNote(e.target.value)}
              placeholder="e.g. Extra spicy shatta, separate toum dip, call before arrival..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141419] border border-[#272730] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Delivery Address Card */}
          <div className="slate-plate-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-cinzel font-bold text-sm text-[#fceda2] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37]" /> Delivery Destination
              </span>
              <button
                onClick={() => setLocationModalOpen(true)}
                className="text-xs font-cinzel text-[#d4af37] hover:underline"
              >
                CHANGE
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141419] border border-[#272730] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  {selectedAddress ? `${selectedAddress.area}, ${selectedAddress.city}` : 'Thagarapuvalasa Town & Sangivalasa'}
                </span>
                <span className="text-[11px] text-[#a1a1aa] mt-0.5 block font-sans">
                  {serviceabilityMessage || 'Estimated delivery: 30-40 minutes'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Serviceable (15 KM)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Coupons & Bill Details */}
        <div className="lg:col-span-5 space-y-5">
          {/* Coupon Code Section */}
          <div className="slate-plate-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-cinzel font-bold uppercase tracking-wider text-[#d4af37]">
              <Tag className="w-4 h-4" />
              <span>Royal Offers & Coupons</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-emerald-300">
                    {appliedCoupon.code} APPLIED
                  </span>
                  <p className="text-[11px] text-emerald-200 mt-0.5">
                    You saved ₹{appliedCoupon.calculatedDiscount} on this royal feast!
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 rounded-lg text-emerald-300 hover:bg-emerald-900 transition-colors"
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
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141419] border border-[#272730] focus:border-[#d4af37] focus:outline-none text-xs text-white uppercase font-mono placeholder-neutral-500"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !couponInput.trim()}
                  className="btn-royal-gold px-5 py-2.5 text-xs disabled:opacity-50"
                >
                  {isApplyingCoupon ? '...' : 'APPLY'}
                </button>
              </form>
            )}

            {couponError && <p className="text-xs text-red-400 font-medium">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-emerald-400 font-medium">{couponSuccess}</p>}

            {!appliedCoupon && (
              <div className="pt-1 flex flex-wrap gap-2 text-[10px]">
                <button
                  onClick={() => setCouponInput('WELCOME50')}
                  className="px-2.5 py-1 rounded-lg border border-[#272730] hover:border-[#d4af37] text-[#d4d4d8] font-mono bg-[#141419]"
                >
                  WELCOME50 (₹50 OFF)
                </button>
                <button
                  onClick={() => setCouponInput('MANDI100')}
                  className="px-2.5 py-1 rounded-lg border border-[#272730] hover:border-[#d4af37] text-[#d4d4d8] font-mono bg-[#141419]"
                >
                  MANDI100 (₹100 OFF)
                </button>
                <button
                  onClick={() => setCouponInput('FREEDEL')}
                  className="px-2.5 py-1 rounded-lg border border-[#272730] hover:border-[#d4af37] text-[#d4d4d8] font-mono bg-[#141419]"
                >
                  FREEDEL (Free Delivery)
                </button>
              </div>
            )}
          </div>

          {/* Bill Details */}
          <div className="slate-plate-card rounded-2xl p-6 space-y-4">
            <h3 className="font-cinzel font-bold text-base text-[#fceda2] border-b border-[#272730] pb-3">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs text-[#d4d4d8]">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-mono font-bold text-white">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee (Thagarapuvalasa Area)</span>
                <span className="font-mono font-bold text-white">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Govt Taxes & GST (5%)</span>
                <span className="font-mono font-bold text-white">₹{tax}</span>
              </div>

              <div className="flex justify-between">
                <span>Insulated Thermal Packaging Fee</span>
                <span className="font-mono font-bold text-white">₹{packagingFee}</span>
              </div>

              <div className="pt-3 border-t border-[#272730] flex justify-between items-baseline">
                <div>
                  <span className="font-cinzel font-bold text-base text-[#fceda2]">Grand Total</span>
                  <p className="text-[10px] text-[#a1a1aa]">Inclusive of all taxes</p>
                </div>
                <span className="font-mono font-black text-2xl text-[#fceda2]">
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            {/* Proceed CTA */}
            <NextLink
              href="/checkout"
              className="btn-royal-gold block w-full py-3.5 text-xs sm:text-sm tracking-wider text-center shadow-gold-sm"
            >
              PROCEED TO SECURE CHECKOUT • ₹{grandTotal}
            </NextLink>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#a1a1aa] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safe & Secure UPI, Cards & Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Checkout Bar */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c10]/95 backdrop-blur-xl border-t border-[#d4af37]/30 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div>
            <span className="text-[10px] font-cinzel text-[#a1a1aa] block uppercase tracking-wider">Total</span>
            <span className="text-xl font-mono font-black text-[#fceda2]">₹{grandTotal}</span>
          </div>
          <NextLink
            href="/checkout"
            className="flex-1 btn-royal-gold py-3 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-gold-sm"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </NextLink>
        </div>
      </div>

      <LocationModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
    </div>
  );
}

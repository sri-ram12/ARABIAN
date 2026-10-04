'use client';

import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent, ShieldCheck } from 'lucide-react';
import NextLink from 'next/link';

const COUPONS = [
  {
    code: 'WELCOME50',
    title: 'Flat ₹50 OFF',
    desc: 'Get flat ₹50 off on your first authentic Arabian Mandi order in Thagarapuvalasa.',
    minOrder: '₹299',
    type: 'FLAT',
    expiry: 'Never expires for new users',
  },
  {
    code: 'MANDI100',
    title: 'Flat ₹100 OFF',
    desc: 'Enjoy ₹100 discount on our signature Faham Chicken Mandi or Mutton Juicy Mandi.',
    minOrder: '₹699',
    type: 'FLAT',
    expiry: 'Valid all 7 days',
  },
  {
    code: 'FESTIVE15',
    title: '15% Festive Feast',
    desc: 'Get 15% discount up to ₹150 on all Arabian grills, kebabs, and authentic platters.',
    minOrder: '₹499',
    type: 'PERCENTAGE',
    expiry: 'Limited time offer',
  },
  {
    code: 'SULTAN20',
    title: '20% Sultan Family Feast',
    desc: 'Grand 20% discount up to ₹250 on our 4-person Sultan and Sheikh feasting platters.',
    minOrder: '₹999',
    type: 'PERCENTAGE',
    expiry: 'Weekend & family special',
  },
  {
    code: 'FREEDEL',
    title: 'Free Delivery Across Thagarapuvalasa',
    desc: 'Zero delivery charges on any food order delivered to Sangivalasa, Chittivalasa, and nearby zones.',
    minOrder: '₹399',
    type: 'DELIVERY',
    expiry: 'Ongoing benefit',
  },
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold border border-gold-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROMOTIONAL DEALS & DISCOUNTS</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-white">
          Active Offers & Coupons
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Apply these verified promo codes at checkout to save on your favorite Arabian Mandi meals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COUPONS.map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          return (
            <div
              key={coupon.code}
              className="bg-mandi-card border border-mandi-border hover:border-gold-500/50 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30 uppercase tracking-wider">
                    {coupon.type}
                  </span>
                  <span className="text-xs text-slate-400">Min. {coupon.minOrder}</span>
                </div>

                <h3 className="font-heading font-black text-xl text-white">
                  {coupon.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{coupon.desc}</p>
              </div>

              {/* Coupon Code Strip */}
              <div className="pt-4 border-t border-mandi-border space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-mandi-surface border border-dashed border-gold-500/50">
                  <span className="font-mono font-black text-sm tracking-wider text-gold-400">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-mandi-card transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{coupon.expiry}</span>
                  <NextLink href="/menu" className="text-gold-400 font-semibold hover:underline">
                    Use Now →
                  </NextLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Bike, ArrowRight, Clock } from 'lucide-react';
import NextLink from 'next/link';

export default function TrackSearchPage() {
  const router = useRouter();
  const [orderQuery, setOrderQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setError(null);
    const cleanId = orderQuery.trim();

    try {
      const res = await fetch(`/api/orders?status=ALL&limit=100`);
      const data = await res.json();
      if (data.success && data.orders) {
        const found = data.orders.find(
          (o: any) =>
            o.orderNumber.toLowerCase() === cleanId.toLowerCase() ||
            o.id.toLowerCase() === cleanId.toLowerCase()
        );
        if (found) {
          router.push(`/orders/${found.id}`);
          return;
        }
      }
      setError('Order not found. Please verify the order number (e.g. AM-20261004-001)');
    } catch (e) {
      setError('Unable to track order right now. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-24 pb-28 sm:pb-24 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/30 flex items-center justify-center mx-auto shadow-gold-sm">
          <Bike className="w-7 h-7" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-white">
          Track Your Mandi Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Enter your Arabian Mandi order number to watch your food progress and see live delivery partner movement.
        </p>
      </div>

      <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Order Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="e.g. AM-20261004-001"
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-mandi-surface border border-mandi-border focus:border-gold-500 focus:outline-none text-sm text-white placeholder-slate-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gold-gradient text-black font-bold shadow-sm"
              >
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-heading font-bold text-sm tracking-wider shadow-gold-sm hover:brightness-110 transition-all"
          >
            TRACK LIVE STATUS
          </button>
        </form>

        <div className="pt-4 border-t border-mandi-border flex items-center justify-between text-xs text-slate-400">
          <span>Need help with your order?</span>
          <NextLink href="/contact" className="text-gold-400 font-semibold hover:underline">
            Contact Support
          </NextLink>
        </div>
      </div>
    </div>
  );
}

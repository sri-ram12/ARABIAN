'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UtensilsCrossed, Lock, User, ArrowRight, ArrowLeft, Mail, Phone } from 'lucide-react';

export default function KitchenLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();

  const [identifier, setIdentifier] = useState('kitchen@arabianmandi.in');
  const [password, setPassword] = useState('Kitchen@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);

    if (res.success) {
      if (res.user?.role !== 'KITCHEN_STAFF' && res.user?.role !== 'ADMIN') {
        await logout();
        setError(`Access Denied: This terminal is strictly for Kitchen Staff & Chefs. Your current role is "${res.user?.role}".`);
        return;
      }
      router.push('/admin/kitchen');
    } else {
      setError(res.message || 'Invalid kitchen staff credentials');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <NextLink
          href="/portals"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portals Hub</span>
        </NextLink>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center mx-auto shadow-gold-sm">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
            Kitchen Display Terminal
          </h1>
          <p className="text-xs text-slate-400">
            Chef & Kitchen Master Login • Live Cooking Queue & KOT
          </p>
        </div>

        {/* Card */}
        <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Kitchen Email or Mobile Number
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="kitchen@arabianmandi.in or 9876543211"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border focus:border-orange-500 focus:outline-none text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Terminal Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border focus:border-orange-500 focus:outline-none text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-heading font-black text-xs tracking-wider shadow-lg hover:brightness-110 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'LAUNCHING STATION...' : 'LAUNCH KITCHEN DISPLAY'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="pt-3 border-t border-mandi-border space-y-2 text-center">
            <p className="text-[11px] text-slate-400">Quick Fill Kitchen Credentials:</p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('kitchen@arabianmandi.in');
                  setPassword('Kitchen@123');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 text-[11px] text-orange-400 flex items-center gap-1 font-mono transition-all"
              >
                <Mail className="w-3 h-3" />
                <span>kitchen@arabianmandi.in</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('9876543211');
                  setPassword('Kitchen@123');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 text-[11px] text-orange-400 flex items-center gap-1 font-mono transition-all"
              >
                <Phone className="w-3 h-3" />
                <span>9876543211</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, Suspense } from 'react';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Flame, Lock, Mail, ArrowRight, Shield, Bike, UtensilsCrossed, User } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);

    if (res.success) {
      router.push(redirect);
    } else {
      setError(res.message || 'Invalid email/phone or password');
    }
  };

  // Quick Demo Login Helper
  const handleQuickLogin = async (userEmail: string, pass: string, targetRedirect?: string) => {
    setIdentifier(userEmail);
    setPassword(pass);
    setError(null);
    setLoading(true);

    const res = await login(userEmail, pass);
    setLoading(false);

    if (res.success) {
      router.push(targetRedirect || redirect);
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gold-gradient text-black font-heading font-black text-2xl flex items-center justify-center mx-auto shadow-gold-sm">
          AM
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
          Welcome to Arabian Mandi
        </h1>
        <p className="text-xs text-slate-400">
          Sign in to place orders, track live GPS deliveries, or manage restaurant operations
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Email Address or Phone Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="customer@arabianmandi.in or 9876543215"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border focus:border-gold-500 focus:outline-none text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border focus:border-gold-500 focus:outline-none text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs tracking-wider shadow-gold-sm hover:brightness-110 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'SIGNING IN...' : 'SIGN IN'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <NextLink
            href={`/register?redirect=${redirect}`}
            className="text-gold-400 font-bold hover:underline"
          >
            Sign up now
          </NextLink>
        </div>

        {/* Quick Customer Demo shortcut & link to Portals Hub */}
        <div className="pt-4 border-t border-mandi-border text-center space-y-2.5">
          <p className="text-[11px] text-slate-400">Quick Fill Customer Credentials:</p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@arabianmandi.in', 'Customer@123', '/profile')}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-gold-500/50 text-[11px] text-gold-400 flex items-center gap-1 font-mono transition-all"
            >
              <span>customer@arabianmandi.in</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('9876543215', 'Customer@123', '/profile')}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-gold-500/50 text-[11px] text-gold-400 flex items-center gap-1 font-mono transition-all"
            >
              <span>9876543215</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-xs text-slate-400">Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}

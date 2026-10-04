'use client';

import React, { useState, Suspense } from 'react';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    const res = await register({ name, email, phone, password });
    setLoading(false);

    if (res.success) {
      router.push(redirect);
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gold-gradient text-black font-heading font-black text-2xl flex items-center justify-center mx-auto shadow-gold-sm">
          AM
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
          Create Customer Account
        </h1>
        <p className="text-xs text-slate-400">
          Join Arabian Mandi to enjoy exclusive offers, faster checkout, and live order tracking
        </p>
      </div>

      <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Reddy"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border focus:border-gold-500 focus:outline-none text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@example.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border focus:border-gold-500 focus:outline-none text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Mobile Phone (for delivery OTP & updates) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border focus:border-gold-500 focus:outline-none text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
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
            <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <NextLink
            href={`/login?redirect=${redirect}`}
            className="text-gold-400 font-bold hover:underline"
          >
            Sign in
          </NextLink>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-xs text-slate-400">Loading Register...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

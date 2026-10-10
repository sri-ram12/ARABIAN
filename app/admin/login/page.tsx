'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Lock, User, ArrowRight, ArrowLeft, Phone, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuth();

  const [identifier, setIdentifier] = useState('admin@arabianmandi.in');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);

    if (res.success) {
      if (res.user?.role !== 'ADMIN') {
        await logout();
        setError(`Access Denied: This portal is strictly for Restaurant Administrators. Your current role is "${res.user?.role}".`);
        return;
      }
      router.push('/admin');
    } else {
      setError(res.message || 'Invalid administrator credentials');
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
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center mx-auto shadow-gold-sm">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
            Admin Command Center
          </h1>
          <p className="text-xs text-slate-400">
            Secure login for Arabian Mandi Restaurant Management & Operations
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
                Admin Email or Mobile Number
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@arabianmandi.in or 9876543210"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border focus:border-gold-500 focus:outline-none text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border focus:border-gold-500 focus:outline-none text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-black font-heading font-black text-xs tracking-wider shadow-gold-sm hover:brightness-110 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN TO ADMIN PANEL'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="pt-3 border-t border-mandi-border space-y-2 text-center">
            <p className="text-[11px] text-slate-400">Quick Fill Admin Credentials:</p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('admin@arabianmandi.in');
                  setPassword('Admin@123');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-gold-500/50 text-[11px] text-gold-400 flex items-center gap-1 font-mono transition-all"
              >
                <Mail className="w-3 h-3" />
                <span>admin@arabianmandi.in</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('9876543210');
                  setPassword('Admin@123');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-gold-500/50 text-[11px] text-gold-400 flex items-center gap-1 font-mono transition-all"
              >
                <Phone className="w-3 h-3" />
                <span>9876543210</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

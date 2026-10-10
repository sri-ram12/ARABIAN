'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import {
  Shield,
  UtensilsCrossed,
  Bike,
  User,
  ExternalLink,
  ArrowRight,
  Clock,
  CheckCircle2,
  Crown,
  KeyRound,
  Globe,
  Server,
  Cloud,
  Check,
  Copy,
} from 'lucide-react';

export default function PortalsHubPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const portals = [
    {
      id: 'customer',
      title: 'Customer Food Portal',
      badge: 'Public Storefront & PWA',
      badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
      description:
        'Interactive Arabian Mandi menu, portion customizations, coupon engine, Razorpay/COD checkout, and live Leaflet GPS delivery tracking.',
      icon: User,
      iconBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      subdomainUrl: 'https://arabianmandi.in',
      pathUrl: '/',
      dedicatedLogin: '/login',
      role: 'CUSTOMER',
      credentials: {
        email: 'customer@arabianmandi.in',
        phone: '9876543215',
        password: 'Customer@123',
      },
      keyFeatures: [
        'Authentic Yemeni Mandi & Grills Catalog',
        'Zonal distance verification (Haversine NH16)',
        'Live Leaflet map with moving GPS rider marker',
        '4-Digit secure Delivery OTP & Reviews',
      ],
      openLink: '/',
    },
    {
      id: 'admin',
      title: 'Restaurant Admin Console',
      badge: 'Executive Management',
      badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      description:
        'Real-time business analytics, revenue trends, live order queue with thermal receipt printing, full menu catalog manager, coupon engine, and fleet dispatch.',
      icon: Shield,
      iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      subdomainUrl: 'https://admin.arabianmandi.in',
      pathUrl: '/admin',
      dedicatedLogin: '/admin/login',
      role: 'ADMIN',
      credentials: {
        email: 'admin@arabianmandi.in',
        phone: '9876543210',
        password: 'Admin@123',
      },
      keyFeatures: [
        'Today’s revenue & payment method metrics',
        'Order management & thermal invoice printing',
        'Menu CRUD, pricing & instant stock toggles',
        'Onboard new delivery partners & assign orders',
      ],
      openLink: '/admin',
    },
    {
      id: 'kitchen',
      title: 'Kitchen Display System (KDS)',
      badge: 'Chef Tablet Station',
      badgeColor: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
      description:
        'Tablet/touchscreen-optimized live cooking queue with audible incoming order chimes, live elapsed preparation timers, item checklists, and KOT ticket printing.',
      icon: UtensilsCrossed,
      iconBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      subdomainUrl: 'https://kitchen.arabianmandi.in',
      pathUrl: '/admin/kitchen',
      dedicatedLogin: '/kitchen/login',
      role: 'KITCHEN_STAFF',
      credentials: {
        email: 'kitchen@arabianmandi.in',
        phone: '9876543211',
        password: 'Kitchen@123',
      },
      keyFeatures: [
        'FIFO live order queue with elapsed cooking timers',
        'Instant sound alert chimes on new orders',
        'Workflow: ACCEPT ➔ PREPARING ➔ READY FOR PICKUP',
        'Thermal Kitchen Order Ticket (KOT) printing',
      ],
      openLink: '/admin/kitchen',
    },
    {
      id: 'rider',
      title: 'Delivery Partner Portal',
      badge: 'Mobile Logistics & GPS',
      badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      description:
        'Mobile-ergonomic delivery partner interface. Order acceptance queue, navigation to restaurant, live HTML5 GPS broadcasting, and secure 4-digit OTP handover.',
      icon: Bike,
      iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      subdomainUrl: 'https://rider.arabianmandi.in',
      pathUrl: '/delivery',
      dedicatedLogin: '/rider/login',
      role: 'DELIVERY_PARTNER',
      credentials: {
        email: 'rider1@arabianmandi.in',
        phone: '9876543212',
        password: 'Rider@123',
      },
      keyFeatures: [
        'Accept/reject new delivery requests',
        'One-tap customer phone call & WhatsApp link',
        'Live GPS broadcaster + NH16 movement simulator',
        '4-Digit customer OTP verification to credit earnings',
      ],
      openLink: '/delivery',
    },
  ];

  const steps = [
    {
      step: '1',
      actor: 'Customer',
      title: 'Places Food Order',
      desc: 'Browses authentic Mandi dishes, configures portions & addons, enters Thagarapuvalasa delivery address, and places order via Razorpay or COD.',
      portal: 'Customer Portal',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    {
      step: '2',
      actor: 'Kitchen',
      title: 'Prepares Order & KOT',
      desc: 'Hears audible chime, checks ingredients on tablet KDS, prints KOT, changes status from ACCEPT ➔ PREPARING ➔ READY FOR PICKUP.',
      portal: 'Kitchen KDS',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    },
    {
      step: '3',
      actor: 'Admin',
      title: 'Dispatches Delivery Fleet',
      desc: 'Inspects real-time order queue, monitors revenue metrics, and assigns an onboarded delivery rider to the order.',
      portal: 'Admin Console',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      step: '4',
      actor: 'Rider',
      title: 'Picks Up & Broadcasts GPS',
      desc: 'Rider accepts assignment, arrives at restaurant, taps START DELIVERY, and broadcasts live GPS coordinates moving along NH16.',
      portal: 'Rider Portal',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      step: '5',
      actor: 'Customer',
      title: 'Tracks & Shares OTP',
      desc: 'Customer watches rider approaching on Leaflet map. Upon arrival, customer hands over the 4-digit Delivery OTP to conclude order & leaves a review.',
      portal: 'Customer Portal',
      badgeColor: 'bg-gold-500/20 text-gold-300 border-gold-500/40',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-gold-400" />
          <span>MULTI-SIDED PLATFORM ARCHITECTURE</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Arabian Mandi <span className="gold-gradient-text">Operational Portals</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          Access all four dedicated standalone panels of the platform. Each portal is purpose-built
          with its own dedicated login supporting <strong>Email OR Mobile Phone Number</strong> and real-time synchronization.
        </p>
      </div>

      {/* 4 Portals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portals.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="bg-mandi-card border border-mandi-border hover:border-gold-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl transition-all relative overflow-hidden group"
            >
              <div className="space-y-5">
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-bold ${p.iconBg}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-heading font-black text-lg sm:text-xl text-white">
                        {p.title}
                      </h2>
                      <span className="text-[11px] font-mono text-slate-400">Role: {p.role}</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${p.badgeColor}`}
                  >
                    {p.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>

                {/* URLs Configuration */}
                <div className="p-3.5 rounded-2xl bg-mandi-surface/70 border border-mandi-border/80 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                    <Globe className="w-3.5 h-3.5 text-gold-400" />
                    <span>Live URLs Online:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-300 bg-black/30 px-2.5 py-1.5 rounded-lg border border-white/5">
                      <span className="text-slate-500">Subdomain:</span>
                      <span className="text-gold-400">{p.subdomainUrl}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 bg-black/20 px-2.5 py-1 rounded-lg">
                      <span className="text-slate-500">Direct Path:</span>
                      <span>{p.pathUrl}</span>
                    </div>
                  </div>
                </div>

                {/* Key Features List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
                    Core Capabilities:
                  </span>
                  {p.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Credentials - Email OR Phone */}
                <div className="p-3.5 rounded-2xl bg-mandi-surface border border-mandi-border text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gold-400 font-bold text-[11px]">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Sign In with Email OR Phone:</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Pass: {p.credentials.password}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono">
                    <div
                      onClick={() => copyToClipboard(p.credentials.email)}
                      className="cursor-pointer flex items-center justify-between bg-black/40 hover:bg-black/60 px-2.5 py-1.5 rounded-lg border border-white/5 transition-colors"
                      title="Click to copy email"
                    >
                      <span className="text-slate-400 truncate">{p.credentials.email}</span>
                      {copiedText === p.credentials.email ? (
                        <Check className="w-3 h-3 text-emerald-400 ml-1 flex-shrink-0" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-500 ml-1 flex-shrink-0" />
                      )}
                    </div>
                    <div
                      onClick={() => copyToClipboard(p.credentials.phone)}
                      className="cursor-pointer flex items-center justify-between bg-black/40 hover:bg-black/60 px-2.5 py-1.5 rounded-lg border border-white/5 transition-colors"
                      title="Click to copy phone number"
                    >
                      <span className="text-emerald-400">{p.credentials.phone}</span>
                      {copiedText === p.credentials.phone ? (
                        <Check className="w-3 h-3 text-emerald-400 ml-1 flex-shrink-0" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-500 ml-1 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-mandi-border">
                <NextLink
                  href={p.dedicatedLogin}
                  className="py-2.5 px-4 rounded-xl bg-mandi-surface hover:bg-mandi-elevated border border-mandi-border hover:border-gold-500/40 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Portal Login</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                </NextLink>

                <NextLink
                  href={p.openLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-gold-gradient text-black font-heading font-black text-xs tracking-wider shadow-gold-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Launch Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                </NextLink>
              </div>
            </div>
          );
        })}
      </div>

      {/* Online Hosting Architecture Guide */}
      <div className="bg-gradient-to-br from-mandi-card via-mandi-surface to-mandi-card border border-gold-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-mandi-border pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
              <Server className="w-3.5 h-3.5" />
              <span>ONLINE HOSTING ARCHITECTURE</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
              How to Host with 4 Separate URLs Online
            </h2>
            <p className="text-xs text-slate-300">
              You do <strong>not</strong> need to pay for 4 separate hosting plans. A single deployment supports all 4 URLs automatically!
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-black/40 border border-white/10 px-3 py-2 rounded-xl text-emerald-400">
            <Cloud className="w-4 h-4" />
            <span>Next.js Subdomain Middleware Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-heading font-bold text-sm text-white">Deploy on Vercel / Render</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Push your repository to GitHub and import it into Vercel. Set your cloud PostgreSQL connection string in <code>DATABASE_URL</code> (e.g., Supabase or Neon).
            </p>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-heading font-bold text-sm text-white">Add 4 DNS Records</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In your domain registrar (GoDaddy, Namecheap, Cloudflare), point these 4 CNAME records to your Vercel project:
              <br />
              <span className="text-gold-400 font-mono text-[11px] block mt-1">
                @, admin, kitchen, rider
              </span>
            </p>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-heading font-bold text-sm text-white">Instant Subdomain Routing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our <code>middleware.ts</code> instantly detects the subdomain and routes requests to the proper portal without any code duplication!
            </p>
          </div>
        </div>
      </div>

      {/* Real-Time Lifecycle Flow Guide */}
      <div className="bg-mandi-card border border-mandi-border rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>STEP-BY-STEP REAL-TIME LIFECYCLE</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            End-to-End Order Flow in Real Time
          </h2>
          <p className="text-xs text-slate-400">
            Open the portals in separate browser tabs side by side to experience live synchronization across every step!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-mandi-surface border border-mandi-border rounded-2xl p-4 flex flex-col justify-between space-y-3 relative hover:border-gold-500/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-gold-500/20 text-gold-400 font-heading font-black text-xs flex items-center justify-center border border-gold-500/30">
                    {st.step}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${st.badgeColor}`}>
                    {st.actor}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-sm text-white">{st.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{st.desc}</p>
              </div>

              <div className="pt-2 border-t border-mandi-border/60 text-[10px] text-gold-400 font-semibold flex items-center gap-1">
                <span>Active on:</span>
                <span className="text-slate-300 font-normal">{st.portal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

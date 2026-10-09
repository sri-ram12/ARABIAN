'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { Flame, ArrowRight, Sparkles, UtensilsCrossed, ShieldCheck } from 'lucide-react';
import CulinaryShowcase from '@/components/CulinaryShowcase';
import FieryEmbers from '@/components/FieryEmbers';
import FoodModal from '@/components/FoodModal';

export default function ShowcasePage() {
  const [selectedFood, setSelectedFood] = useState<any | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-950 via-mandi-card to-amber-950 border border-orange-500/30 p-8 sm:p-12 text-center shadow-2xl">
        <FieryEmbers count={28} className="opacity-80" />
        <div className="relative z-20 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-flame" />
            <span>S & H AUTHENTIC KITCHEN CRAFT</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            The S & H <span className="fire-gradient-text">CULINARY SHOWCASE</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Discover the time-honored secrets of authentic Yemeni coal-dum smoking, 800°F clay pit kebab roasting,
            and flaming wok tosses. Watch our signature sizzlers come alive with spice that lingers and flavours that last.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <NextLink
              href="/menu"
              className="py-3 px-6 rounded-xl fire-btn text-white font-heading font-black text-xs tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 fire-glow"
            >
              <span>BROWSE FULL MENU & BOARD</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </NextLink>
          </div>
        </div>
      </div>

      {/* Interactive Culinary Showcase Component */}
      <CulinaryShowcase onSelectItem={(dish) => setSelectedFood(dish)} />

      {/* 4 Pillars of S & H Kitchen Craft */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-mandi-card border border-mandi-border hover:border-orange-500/40 transition-colors space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-xl text-orange-400">
            🪵
          </div>
          <h3 className="font-heading font-black text-base text-white">Natural Hardwood Lump Charcoal</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We strictly never use gas or artificial smoke liquids. Our Mandi rice and kebabs are smoked with genuine burning hardwood charcoal and pure desi ghee.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-mandi-card border border-mandi-border hover:border-orange-500/40 transition-colors space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-xl text-orange-400">
            🧂
          </div>
          <h3 className="font-heading font-black text-base text-white">Authentic Yemeni Hawaij Spices</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hand-ground cumin, black peppercorns, green cardamom, cloves, turmeric, and dried black Persian limes freshly blended every morning.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-mandi-card border border-mandi-border hover:border-orange-500/40 transition-colors space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-xl text-orange-400">
            👑
          </div>
          <h3 className="font-heading font-black text-base text-white">Solo to Squad Grand Platters</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Whether dining alone, with a partner, or hosting a family feast, every dish is portion-calibrated with abundant basmati, meats, toum, and dakkoos.
          </p>
        </div>
      </div>

      {/* Customization Modal */}
      <FoodModal item={selectedFood} onClose={() => setSelectedFood(null)} />
    </div>
  );
}

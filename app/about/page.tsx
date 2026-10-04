import React from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { Flame, ShieldCheck, Heart, Sparkles, UtensilsCrossed } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold border border-gold-500/30">
          <Sparkles className="w-4 h-4" />
          <span>AUTHENTIC CULINARY ARTISTRY</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-white leading-tight">
          The Story of <span className="gold-gradient-text">Arabian Mandi</span>
        </h1>
        <p className="text-base text-slate-300 leading-relaxed font-light">
          Bringing the royal flavors of Hadhramaut, Yemen, and the Persian Gulf directly to the dining tables of Thagarapuvalasa, Andhra Pradesh.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-mandi-border shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900&auto=format&fit=crop"
            alt="Slow Cooked Mandi Meat"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Rooted in Fire, Charcoal & Ancient Hawaij Spices
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Mandi originated in the ancient city of Shibam in Hadhramaut, Yemen. The word &apos;Mandi&apos; comes from the Arabic word &apos;nada&apos;, meaning dew, referencing the moist, tender, melt-in-mouth texture of meats slow-cooked inside deep clay pits.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            At Arabian Mandi Thagarapuvalasa, we uphold this tradition with authentic care: premium aged basmati rice smoked over charcoal with pure desi ghee, meats braised until succulent, and our celebrated garlic toum whipped fresh daily.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-mandi-card border border-mandi-border">
              <Flame className="w-5 h-5 text-gold-400 mb-2" />
              <h4 className="font-heading font-bold text-sm text-white">Charcoal Smoked</h4>
              <p className="text-[11px] text-slate-400 mt-1">Authentic deep-pit smoking method</p>
            </div>
            <div className="p-4 rounded-xl bg-mandi-card border border-mandi-border">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="font-heading font-bold text-sm text-white">100% Fresh & Halal</h4>
              <p className="text-[11px] text-slate-400 mt-1">Strict hygiene and quality checks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Statement */}
      <div className="bg-mandi-card border border-mandi-border rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4 shadow-xl">
        <h3 className="font-heading text-2xl font-bold text-white">
          Our Commitment to Thagarapuvalasa
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Whether you are hosting a family gathering in Sangivalasa, ordering lunch at Chittivalasa, or enjoying an evening dinner near Bheemili, our kitchen ensures your Mandi reaches you piping hot, aromatic, and sealed with tamper-proof packaging.
        </p>
        <div className="pt-4">
          <NextLink
            href="/menu"
            className="inline-block py-3 px-8 rounded-xl bg-gold-gradient text-black font-heading font-black text-xs tracking-wider shadow-gold-sm hover:brightness-110"
          >
            ORDER YOUR MANDI NOW
          </NextLink>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Flame,
  ArrowRight,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  ChevronRight,
  Plus,
  ShoppingBag,
  Play,
  Bike,
  Crown,
  Award,
  Phone,
} from 'lucide-react';
import FoodModal from '@/components/FoodModal';
import LocationModal from '@/components/LocationModal';
import SizzlerReelCard from '@/components/SizzlerReelCard';
import CulinaryShowcase from '@/components/CulinaryShowcase';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const { selectedAddress, addToCart } = useCart();
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const menuRes = await fetch('/api/menu?bestseller=true');
        const menuData = await menuRes.json();
        if (menuData.success) {
          setBestsellers(menuData.items || []);
        }
      } catch (e) {
        console.error('Home load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Quick fallback dishes for the zig-zag showcase if API is loading
  const signaturePlatters = [
    {
      id: 'faham-chicken-mandi',
      name: 'Special Faham Chicken Mandi',
      arabic: 'فحم دجاج مندي يمني',
      badge: 'Chef Signature',
      desc: 'Whole chicken marinated overnight in 14 secret Yemeni spices, slow-roasted over fragrant acacia charcoal. Served atop saffron-perfumed long-grain basmati, crowned with roasted cashews and crispy fried onions.',
      price: 280,
      sizes: [
        { name: 'Solo (1P)', price: 280 },
        { name: 'Duo (2P)', price: 540 },
        { name: 'Trio (3P)', price: 800 },
        { name: 'Squad (4P)', price: 1100 },
      ],
      image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?q=80&w=800',
    },
    {
      id: 'juicy-mutton-mandi',
      name: 'Juicy Mutton Ribs Mandi',
      arabic: 'لحم غنم مندي ملكي',
      badge: 'Royal Favorite',
      desc: 'Premium young spring goat ribs steamed to buttery tenderness inside the clay tandoor. The savory juices naturally baste the aromatic basmati rice below, creating an unforgettably rich culinary masterpiece.',
      price: 360,
      sizes: [
        { name: 'Solo (1P)', price: 360 },
        { name: 'Duo (2P)', price: 680 },
        { name: 'Trio (3P)', price: 999 },
        { name: 'Squad (4P)', price: 1350 },
      ],
      image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=800',
    },
    {
      id: 'shish-taouk-skewer',
      name: 'Shish Taouk & Faham Skewers',
      arabic: 'شيش طاووق على الفحم',
      badge: 'Charcoal Grilled',
      desc: 'Tender boneless chicken morsels soaked in Greek yogurt, sumac, garlic, and wild Arabian herbs, flame-blistered on iron skewers over glowing coals. Served with authentic garlic toum and pickled chilies.',
      price: 280,
      sizes: [
        { name: 'Standard Platter', price: 280 },
        { name: 'Family Platter', price: 520 },
      ],
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800',
    },
    {
      id: 'royal-cheese-kunafa',
      name: 'Royal Melted Cheese Kunafa',
      arabic: 'كنافة بالجبن الملكية',
      badge: 'Artisanal Dessert',
      desc: 'Golden spun kataifi pastry crisp-fried in pure desi ghee, filled with a thick layer of stretchy sweet Akawi cheese, bathed in hot rose-cardamom syrup and dusted with vibrant pistachio nibs.',
      price: 240,
      sizes: [
        { name: 'Solo Plate', price: 240 },
        { name: 'Grand Share', price: 420 },
      ],
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800',
    },
  ];

  return (
    <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen selection:bg-[#d4af37] selection:text-black">
      {/* =========================================================================
          1. HERO SECTION (Inspired by Image 1 & 2)
          ========================================================================= */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 border-b border-[#272730]/60 arabian-pattern">
        {/* Ambient Warm Embers Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#d4af37]/10 via-[#ff7828]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Majestic Serif Typography */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Eyebrow Label */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18181f] border border-[#d4af37]/40 text-[#fceda2] text-xs font-cinzel tracking-widest uppercase">
                <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Yemeni Royal Gastronomy</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <p className="font-cinzel text-xs sm:text-sm tracking-[0.25em] text-[#a1a1aa] uppercase">
                  AENA Y QY SOPRE
                </p>
                <h1 className="font-cinzel text-4xl sm:text-6xl font-bold tracking-tight text-[#fceda2] leading-[1.1]">
                  S & H <span className="gold-gradient-text">Arabian Mandi</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#d4d4d8] leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans font-light">
                Experience the timeless majesty of authentic Yemeni & Dum Mandi in Thagarapuvalasa.
                Long-grain basmati slowly smoked over sweet acacia charcoal, topped with fall-off-the-bone
                juicy mutton ribs, crisp faham chicken, and royal artisanal kunafa.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <NextLink
                  href="/menu"
                  className="btn-royal-gold w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2 group"
                >
                  <span>ORDER ROYAL FEAST</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                </NextLink>

                <NextLink
                  href="/menu?tab=board"
                  className="btn-royal-outline w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <span>VIEW SLATE MENU</span>
                </NextLink>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#272730] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#a1a1aa]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
                    <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                  </div>
                  <div>
                    <div className="font-cinzel font-bold text-white leading-none">4.8 / 5.0 RATED</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">500+ Verified Diners</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                    <Bike className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-cinzel font-bold text-white leading-none">15 KM DELIVERY</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Sangivalasa & Thagarapuvalasa</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Grand Circular Platter Presentation (Image 1 Style) */}
            <div className="lg:col-span-6 flex justify-center relative">
              {/* Decorative Circular Rim Frame */}
              <div className="relative w-[260px] h-[260px] min-[380px]:w-[300px] min-[380px]:h-[300px] sm:w-[440px] sm:h-[440px] md:w-[480px] md:h-[480px]">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#d4af37]/20 via-[#ff7828]/15 to-transparent blur-xl" />

                {/* Dark Ceramic Plate Container */}
                <div className="relative w-full h-full rounded-full overflow-hidden circular-plate-glow p-2 bg-[#0d0d11]">
                  <Image
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000"
                    alt="Authentic S & H Arabian Mandi Platter"
                    fill
                    priority
                    className="object-cover rounded-full hover:scale-105 transition-transform duration-700"
                  />

                  {/* Steam Wisp Element */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 h-40 bg-gradient-to-t from-transparent via-white/10 to-transparent rounded-full blur-xl steam-wisp" />
                  </div>
                </div>

                {/* Floating Gold Coin Emblem (Inspired by Image 1 & 4) */}
                <div className="absolute bottom-1 left-1 sm:bottom-4 sm:left-4 z-20 bg-[#121216]/95 border border-[#d4af37]/40 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md flex items-center gap-2.5 sm:gap-3 max-w-[calc(100%-1rem)]">
                  <div className="gold-seal-badge scale-90 sm:scale-100 flex-shrink-0">
                    <span>14</span>
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[9px] sm:text-[10px] font-cinzel text-[#a1a1aa] uppercase truncate">Ancestral Recipe</div>
                    <div className="text-[11px] sm:text-xs font-bold text-[#fceda2] truncate">14 Yemeni Secret Aromatics</div>
                  </div>
                </div>

                {/* Floating Price Seal */}
                <div className="absolute top-2 right-2 sm:top-8 sm:right-2 z-20 bg-[#121216]/95 border border-[#d4af37]/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-2xl backdrop-blur-md">
                  <span className="text-[10px] sm:text-xs font-cinzel text-[#a1a1aa] mr-1">From</span>
                  <span className="font-mono font-black text-xs sm:text-sm text-[#fceda2]">₹280</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SECTION: 3-COLUMN SIGNATURE INSIGNIA TILES (Inspired by Image 1 & 2)
          ========================================================================= */}
      <section className="py-16 sm:py-20 border-b border-[#272730]/60 bg-[#0c0c0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Divider & Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <p className="font-cinzel text-xs tracking-[0.3em] text-[#d4af37] uppercase">
              — TOBE SCW —
            </p>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#fceda2]">
              Three Pillars of Yemeni Heritage
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-sans font-light">
              Rooted in centuries of Arabian culinary tradition, prepared in traditional sealed pit ovens.
            </p>
          </div>

          {/* 3 Luxury Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="slate-plate-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between text-center group">
              <div className="space-y-4">
                <div className="gold-seal-badge mx-auto">
                  <span>Ⅰ</span>
                </div>
                <h3 className="font-cinzel text-lg font-bold text-[#fceda2] tracking-wider uppercase group-hover:text-white transition-colors">
                  Underground Coal Pit
                </h3>
                <p className="text-xs text-[#d4d4d8] leading-relaxed font-sans font-light">
                  Long-grain aged basmati rice slow-smoked in deep airtight pits under iron grids of marinated meats, capturing every drop of savory essence.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-[#272730] relative w-full h-44 rounded-xl overflow-hidden">
                <Image
                  src="/images/showcase/mandi_coal_dum.jpg"
                  alt="Underground Pit Mandi"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="slate-plate-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between text-center group">
              <div className="space-y-4">
                <div className="gold-seal-badge mx-auto">
                  <span>Ⅱ</span>
                </div>
                <h3 className="font-cinzel text-lg font-bold text-[#fceda2] tracking-wider uppercase group-hover:text-white transition-colors">
                  Acacia Charcoal Faham
                </h3>
                <p className="text-xs text-[#d4d4d8] leading-relaxed font-sans font-light">
                  Direct live flame roasting of fresh chicken steeped in sumac, garlic, and cumin over blazing coals for crispy char and succulent juicy interior.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-[#272730] relative w-full h-44 rounded-xl overflow-hidden">
                <Image
                  src="/images/showcase/tandoor_skewers.jpg"
                  alt="Charcoal Faham Roast"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="slate-plate-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between text-center group">
              <div className="space-y-4">
                <div className="gold-seal-badge mx-auto">
                  <span>Ⅲ</span>
                </div>
                <h3 className="font-cinzel text-lg font-bold text-[#fceda2] tracking-wider uppercase group-hover:text-white transition-colors">
                  Sultan Communal Platters
                </h3>
                <p className="text-xs text-[#d4d4d8] leading-relaxed font-sans font-light">
                  Grand round feasting trays for 2 to 6 patrons, accompanied by freshly whipped garlic toum, spicy tomato dakkoos, and hot melted cheese kunafa.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-[#272730] relative w-full h-44 rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=500"
                  alt="Sultan Communal Feast"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SECTION: ALTERNATING ZIG-ZAG MASTER DISHES (Inspired by Image 3 & 5)
          ========================================================================= */}
      <section className="py-20 border-b border-[#272730]/60 arabian-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="font-cinzel text-xs tracking-[0.3em] text-[#d4af37] uppercase">
              — SIGNATURE PLATES —
            </p>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#fceda2]">
              Handcrafted on Ancient Acacia Coals
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-sans font-light">
              Every dish is individually prepared by master ustads using authentic brass deghs.
            </p>
          </div>

          {/* Alternating Dishes Feed */}
          <div className="space-y-20">
            {signaturePlatters.map((dish, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={dish.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Text Details Column */}
                  <div
                    className={`lg:col-span-6 space-y-5 text-center lg:text-left ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                      <span className="zomato-nonveg-mark" />
                      <span className="text-[11px] font-cinzel text-[#d4af37] tracking-widest uppercase">
                        {dish.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fceda2]">
                        {dish.name}
                      </h3>
                      <p className="text-sm font-arabic text-[#d4af37]/80 mt-1">{dish.arabic}</p>
                    </div>

                    <p className="text-xs sm:text-sm text-[#d4d4d8] leading-relaxed font-sans font-light max-w-lg mx-auto lg:mx-0">
                      {dish.desc}
                    </p>

                    {/* Portion Pricing Pill Chips (Matching Royal Sizing) */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-cinzel text-[#a1a1aa] uppercase tracking-wider block">
                        Select Sizing & Portion Options:
                      </span>
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                        {dish.sizes.map((sz) => (
                          <div
                            key={sz.name}
                            className="px-3 py-1.5 rounded-lg bg-[#141419] border border-[#272730] text-xs font-mono text-[#fceda2] hover:border-[#d4af37] transition-colors"
                          >
                            <span className="font-sans text-[11px] text-[#a1a1aa] mr-1.5">{sz.name}</span>
                            <span className="font-bold">₹{sz.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <button
                        onClick={() =>
                          setSelectedFood({
                            id: dish.id,
                            name: dish.name,
                            basePrice: dish.price,
                            price: dish.price,
                            description: dish.desc,
                            image: dish.image,
                            category: { name: 'Mandi Specials' },
                            sizesJson: JSON.stringify(dish.sizes),
                          })
                        }
                        className="btn-royal-gold px-6 py-3 text-xs inline-flex items-center gap-2"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>CUSTOMIZE & ADD TO FEAST</span>
                      </button>
                    </div>
                  </div>

                  {/* Circular Plate Image Column */}
                  <div
                    className={`lg:col-span-6 flex justify-center ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
                      <div className="relative w-full h-full rounded-full overflow-hidden circular-plate-glow bg-[#0d0d11]">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-cover rounded-full hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SECTION: ROYAL SLATE MENU BOARD (Inspired by Image 4 & 1)
          ========================================================================= */}
      <section className="py-20 border-b border-[#272730]/60 bg-[#0b0b0e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
            <p className="font-cinzel text-xs tracking-[0.3em] text-[#d4af37] uppercase">
              — SLATE MENU TARIFF —
            </p>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#fceda2]">
              Dine-In & Home Delivery Selections
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-sans font-light">
              Served with unlimited fragrant mandi rice, roasted almond cashews, hot soup & toum dip.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Slate Board: Mandi Specialties */}
            <div className="slate-plate-card rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#272730] pb-4">
                <div className="flex items-center gap-3">
                  <div className="gold-seal-badge">
                    <span>M</span>
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-[#fceda2] tracking-wider uppercase">
                      Royal Mandi Specialties
                    </h3>
                    <p className="text-[11px] text-[#a1a1aa]">Pit-smoked over acacia embers</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#d4af37]">SOLO / SQUAD</span>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Special Faham Chicken Mandi', solo: 280, squad: 1100 },
                  { name: 'Tandoori Smoked Chicken Mandi', solo: 270, squad: 1050 },
                  { name: 'Juicy Mutton Ribs Mandi', solo: 360, squad: 1350 },
                  { name: 'Crispy Fried Chicken Mandi', solo: 260, squad: 1000 },
                  { name: 'Fish Mandi (Apollo Sea Fish)', solo: 340, squad: 1250 },
                  { name: 'Royal Prawns Butter Mandi', solo: 350, squad: 1300 },
                  { name: 'Paneer Makhani Veg Mandi (Pure Veg)', solo: 230, squad: 880 },
                ].map((dish) => (
                  <div key={dish.name} className="flex items-baseline justify-between text-xs sm:text-sm gap-2">
                    <span className="font-medium text-[#f4f4f5]">{dish.name}</span>
                    <span className="menu-dots min-w-[8px]" />
                    <div className="font-mono font-bold text-[#fceda2] whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
                      <span>₹{dish.solo}</span>
                      <span className="text-[#a1a1aa] font-normal text-xs">/ ₹{dish.squad}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#272730] text-center">
                <NextLink
                  href="/menu?category=arabian-mandi"
                  className="text-xs font-cinzel text-[#d4af37] hover:underline"
                >
                  VIEW ALL 15 MANDI VARIETIES →
                </NextLink>
              </div>
            </div>

            {/* Right Slate Board: Starters, Grills & Desserts */}
            <div className="slate-plate-card rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#272730] pb-4">
                <div className="flex items-center gap-3">
                  <div className="gold-seal-badge">
                    <span>S</span>
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-[#fceda2] tracking-wider uppercase">
                      Grills, Kebabs & Kunafa
                    </h3>
                    <p className="text-[11px] text-[#a1a1aa]">Charcoal charred & molten cheese</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#d4af37]">PRICE (INR)</span>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Shish Taouk Charcoal Kebab (8 Pcs)', price: 280 },
                  { name: 'Dragon Crispy Chicken', price: 260 },
                  { name: 'Arabian Glazed Honey Wings (6 Pcs)', price: 240 },
                  { name: 'Mutton Ghee Roast Fry (Boneless)', price: 340 },
                  { name: 'Chilli Paneer & Crispy Corn (Veg)', price: 220 },
                  { name: 'Royal Melted Cheese Kunafa', price: 240 },
                  { name: 'Nutella Cream Kunafa Royale', price: 260 },
                ].map((dish) => (
                  <div key={dish.name} className="flex items-baseline justify-between text-xs sm:text-sm gap-2">
                    <span className="font-medium text-[#f4f4f5]">{dish.name}</span>
                    <span className="menu-dots min-w-[8px]" />
                    <span className="font-mono font-bold text-[#fceda2] whitespace-nowrap flex-shrink-0">₹{dish.price}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#272730] text-center">
                <NextLink
                  href="/menu"
                  className="text-xs font-cinzel text-[#d4af37] hover:underline"
                >
                  EXPLORE FULL ONLINE ORDERING MENU →
                </NextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SECTION: PINTEREST SIZZLER REEL & CULINARY ARTISTRY (Image 5)
          ========================================================================= */}
      <section className="py-20 border-b border-[#272730]/60 arabian-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="font-cinzel text-xs tracking-[0.3em] text-[#d4af37] uppercase">
              — CULINARY MASTERY —
            </p>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#fceda2]">
              Live Fire, Smoked Basmati & Molten Cheese
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] font-sans font-light">
              Witness our master chefs preparing authentic Mandi, tandoori skewers, and stretching cheese kunafa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Video Reel Card */}
            <div className="lg:col-span-5 flex justify-center">
              <SizzlerReelCard onOrderClick={() => setSelectedFood(signaturePlatters[0])} />
            </div>

            {/* Right: Culinary Showcase Grid */}
            <div className="lg:col-span-7">
              <CulinaryShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SECTION: DIRECT ORDER & TABLE RESERVATION CALLOUT
          ========================================================================= */}
      <section className="py-16 bg-[#0c0c0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="slate-plate-card rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
            <div className="gold-seal-badge mx-auto">
              <Crown className="w-5 h-5 text-black" />
            </div>

            <div className="space-y-2">
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#fceda2]">
                Reserve Your Royal Table or Order to Doorstep
              </h2>
              <p className="text-xs sm:text-sm text-[#d4d4d8] font-sans font-light max-w-xl mx-auto">
                Planning a family feast or celebrating an occasion? Experience our traditional majlis seating in Sangivalasa, or enjoy fast home delivery with real-time GPS tracking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <NextLink
                href="/menu"
                className="btn-royal-gold px-8 py-3.5 text-xs sm:text-sm w-full sm:w-auto"
              >
                ORDER ONLINE FOR DELIVERY
              </NextLink>

              <a
                href="tel:+918919234567"
                className="btn-royal-outline px-8 py-3.5 text-xs sm:text-sm w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>BOOK TABLE: +91 89192 34567</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Food Customization Modal */}
      <FoodModal item={selectedFood} onClose={() => setSelectedFood(null)} />

      {/* Location Selector Modal */}
      <LocationModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
    </div>
  );
}

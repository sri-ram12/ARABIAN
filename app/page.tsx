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
  Heart,
  TrendingUp,
  Percent,
} from 'lucide-react';
import FoodModal from '@/components/FoodModal';
import LocationModal from '@/components/LocationModal';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const { selectedAddress, addToCart } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [menuRes, reviewRes] = await Promise.all([
          fetch('/api/menu?bestseller=true'),
          fetch('/api/reviews'),
        ]);

        const menuData = await menuRes.json();
        const reviewData = await reviewRes.json();

        if (menuData.success) {
          setCategories(menuData.categories || []);
          setBestsellers(menuData.items || []);
        }
        if (reviewData.success) {
          setReviews(reviewData.reviews || []);
        }
      } catch (e) {
        console.error('Home load error:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 arabian-pattern">
        {/* Ambient Gold Glow Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gold-500/10 via-amber-600/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold shadow-gold-sm">
                <Flame className="w-4 h-4 text-gold-400 animate-pulse" />
                <span>AUTHENTIC YEMENI CULINARY TRADITION</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
                AUTHENTIC <span className="gold-gradient-text">ARABIAN MANDI</span>, DELIVERED TO YOUR DOOR
              </h1>

              {/* Supporting Subtext */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Freshly prepared Arabian flavours delivered across{' '}
                <strong className="text-gold-300 font-semibold">Thagarapuvalasa</strong>, Sangivalasa & Chittivalasa.
                Smoked basmati rice, tender coal-fired meats, handcrafted toum & rich kunafa.
              </p>

              {/* Delivery Location Selector Card */}
              <div className="bg-mandi-card/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-mandi-border shadow-xl max-w-xl mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => setLocationModalOpen(true)}
                    className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-mandi-surface hover:bg-mandi-elevated border border-mandi-border text-left transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        Delivery Destination
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white truncate block">
                        {selectedAddress ? `${selectedAddress.area}, ${selectedAddress.city}` : 'Select your area in Thagarapuvalasa'}
                      </span>
                    </div>
                  </button>

                  <NextLink
                    href="/menu"
                    className="py-3 px-6 rounded-xl bg-gold-gradient text-black font-heading font-black text-sm tracking-wide shadow-gold-sm hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                  >
                    <span>ORDER NOW</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </NextLink>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between px-1">
                  <span>🚀 Average delivery: 30–40 mins</span>
                  <span>✨ Min order ₹200</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span>100% Authentic Coal Smoked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold-400"></div>
                  <span>Fresh Halal Ingredients</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span>Live GPS Order Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Signature Faham Mandi Platter */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Frame */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-gold-500/30 shadow-2xl bg-mandi-card group">
                  <div className="relative h-80 sm:h-96 w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=900&auto=format&fit=crop"
                      alt="Signature Faham Chicken Mandi Platter"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mandi-card via-black/20 to-transparent" />
                  </div>

                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-mandi-surface/95 backdrop-blur-md border border-mandi-border shadow-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-gold-400 text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>#1 BESTSELLER IN THAGARAPUVALASA</span>
                      </div>
                      <h3 className="font-heading font-bold text-white text-base mt-0.5">
                        Faham Chicken Mandi
                      </h3>
                      <p className="text-[11px] text-slate-300">Smoked basmati + charcoal chicken + toum</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through">₹360</span>
                      <div className="text-lg font-black text-gold-400">₹329</div>
                    </div>
                  </div>
                </div>

                {/* Floating Rating Badge */}
                <div className="absolute -top-4 -right-4 bg-mandi-card/95 backdrop-blur-md border border-gold-500/40 px-3.5 py-2 rounded-2xl shadow-gold-sm flex items-center gap-2">
                  <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                  <div>
                    <span className="text-xs font-bold text-white">4.9 / 5.0</span>
                    <span className="text-[10px] text-slate-400 block">500+ Local Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BROWSER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Explore Our Authentic Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              From signature smoked Mandi to royal desserts & family feasts
            </p>
          </div>
          <NextLink
            href="/menu"
            className="text-xs sm:text-sm font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </NextLink>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => (
            <NextLink
              key={cat.id}
              href={`/menu?category=${cat.slug}`}
              className="group bg-mandi-card border border-mandi-border hover:border-gold-500/50 rounded-2xl p-3.5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-gold-sm flex flex-col items-center"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 border-2 border-mandi-border group-hover:border-gold-400 transition-colors">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-heading font-semibold text-xs sm:text-sm text-white group-hover:text-gold-400 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 mt-0.5">Explore dishes</span>
            </NextLink>
          ))}
        </div>
      </section>

      {/* 3. POPULAR & BESTSELLING MANDI DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Thagarapuvalasa Favorites</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1">
              Top Selling Arabian Mandi Specials
            </h2>
          </div>
          <NextLink
            href="/menu"
            className="px-4 py-2 rounded-xl bg-mandi-surface hover:bg-mandi-elevated border border-mandi-border text-xs font-semibold text-slate-200 transition-colors"
          >
            Explore Full Menu
          </NextLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestsellers.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="bg-mandi-card border border-mandi-border hover:border-gold-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col group"
            >
              {/* Image & Badges */}
              <div
                className="relative h-48 sm:h-52 w-full bg-mandi-surface cursor-pointer overflow-hidden"
                onClick={() => setSelectedFood(item)}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mandi-card via-transparent to-transparent opacity-60" />

                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.isVeg ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                  {item.isBestseller && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black">
                      Bestseller
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white">
                  <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded font-medium">
                    🔥 {item.spiceLevel}
                  </span>
                  <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded font-medium">
                    ⏱️ ~{item.preparationTimeMin} mins
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    className="font-heading font-bold text-base text-white hover:text-gold-400 transition-colors cursor-pointer"
                    onClick={() => setSelectedFood(item)}
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-4 mt-3 border-t border-mandi-border/80 flex items-center justify-between">
                  <div>
                    {item.discountedPrice ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-heading font-black text-lg text-gold-400">
                          ₹{item.discountedPrice}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          ₹{item.price}
                        </span>
                      </div>
                    ) : (
                      <span className="font-heading font-black text-lg text-gold-400">
                        ₹{item.price}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 block -mt-0.5">
                      {item.servingSize ? item.servingSize.replace(/_/g, ' ') : 'Serves 2'}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedFood(item)}
                    className="px-4 py-2 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs tracking-wider shadow-gold-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL OFFERS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-950 via-mandi-card to-amber-950 border border-gold-500/40 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-500/30">
                <Percent className="w-3.5 h-3.5" /> SPECIAL DISCOUNTS
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Craving Arabian Mandi Tonight?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Use code <span className="font-mono text-gold-400 font-bold bg-black/40 px-2 py-0.5 rounded">MANDI100</span> for flat ₹100 off on platters above ₹699, or <span className="font-mono text-gold-400 font-bold bg-black/40 px-2 py-0.5 rounded">FREEDEL</span> for free home delivery!
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <NextLink
                href="/menu"
                className="py-3.5 px-8 rounded-2xl bg-gold-gradient text-black font-heading font-black text-sm tracking-wide shadow-gold-sm hover:brightness-110 transition-all text-center w-full sm:w-auto"
              >
                APPLY & ORDER NOW
              </NextLink>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY ARABIAN MANDI EXPERIENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            The Arabian Mandi Heritage
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            We honor centuries-old Yemeni tandoor & smoking traditions right here in Thagarapuvalasa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-mandi-card border border-mandi-border space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20 flex items-center justify-center mx-auto text-2xl">
              🔥
            </div>
            <h3 className="font-heading font-bold text-base text-white">
              Coal-Smoked Basmati
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Infused with charcoal smoke, ghee, green cardamom, cloves, and toasted dry fruits for unforgettable aroma.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-mandi-card border border-mandi-border space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20 flex items-center justify-center mx-auto text-2xl">
              🍗
            </div>
            <h3 className="font-heading font-bold text-base text-white">
              Succulent Slow-Roasted Meats
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Marinated in traditional Yemeni hawaij spices. Meat braised to fall-off-the-bone tenderness.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-mandi-card border border-mandi-border space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20 flex items-center justify-center mx-auto text-2xl">
              🧄
            </div>
            <h3 className="font-heading font-bold text-base text-white">
              Handcrafted Toum & Shatta
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Creamy, whipped authentic garlic toum dip alongside spicy crushed tomato dakkoos salsa.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-mandi-card border border-mandi-border space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20 flex items-center justify-center mx-auto text-2xl">
              🛵
            </div>
            <h3 className="font-heading font-bold text-base text-white">
              Piping Hot Fast Delivery
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dispatched in thermal insulated packaging with real-time GPS tracking all the way to your door.
            </p>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CUSTOMER REVIEWS */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1 text-gold-400 text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-gold-400" />
              <span>Customer Satisfaction</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1">
              Loved Across Thagarapuvalasa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-mandi-card border border-mandi-border flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-gold-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-mandi-border/80">
                  <div className="w-9 h-9 rounded-full bg-gold-500 text-black font-bold text-xs flex items-center justify-center">
                    {rev.user?.name?.[0] || 'C'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-white">{rev.user?.name || 'Customer'}</h4>
                    <span className="text-[10px] text-slate-400">Verified Diner in Thagarapuvalasa</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customization Modal */}
      <FoodModal item={selectedFood} onClose={() => setSelectedFood(null)} />
      <LocationModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
    </div>
  );
}

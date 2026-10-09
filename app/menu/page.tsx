'use client';

import React, { useEffect, useState, useMemo, useRef, Suspense } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Flame,
  Star,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Film,
  Scroll,
  Info,
  Award,
  Crown,
} from 'lucide-react';
import FoodModal from '@/components/FoodModal';
import SizzlerReelModal from '@/components/SizzlerReelModal';
import { useCart } from '@/context/CartContext';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const { totalItemsCount, subtotal } = useCart();

  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs & Views
  const [activeTab, setActiveTab] = useState<'order' | 'board'>('order');
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('');
  const [reelOpen, setReelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [nonVegOnly, setNonVegOnly] = useState<boolean>(false);
  const [bestsellerOnly, setBestsellerOnly] = useState<boolean>(false);
  const [spicyOnly, setSpicyOnly] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);

  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories || []);
          setItems(data.items || []);
          if (data.categories?.length > 0) {
            setActiveCategorySlug(data.categories[0].slug);
          }
        }
      } catch (e) {
        console.error('Menu load error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (vegOnly && !item.isVeg) return false;
      if (nonVegOnly && item.isVeg) return false;
      if (bestsellerOnly && !item.isBestseller) return false;
      if (spicyOnly && item.spiceLevel !== 'SPICY') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesCat = item.category?.name.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return true;
    });
  }, [items, vegOnly, nonVegOnly, bestsellerOnly, spicyOnly, searchQuery]);

  // Group filtered items by category
  const groupedCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const catItems = filteredItems.filter((it) => it.categoryId === cat.id || it.category?.slug === cat.slug);
        return {
          ...cat,
          items: catItems,
        };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, filteredItems]);

  const scrollToCategory = (slug: string) => {
    setActiveCategorySlug(slug);
    const element = categoryRefs.current[slug];
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#09090b] min-h-screen pb-24 text-[#f4f4f5] arabian-pattern">
      {/* 1. BREADCRUMBS */}
      <div className="bg-[#0d0d11] border-b border-[#272730]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-[#a1a1aa] flex items-center gap-1.5 overflow-x-auto font-cinzel">
          <NextLink href="/" className="hover:text-[#fceda2]">Home</NextLink>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span>India</span>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span>Thagarapuvalasa</span>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span className="text-[#fceda2] font-semibold">S & H Arabian Mandi Menu</span>
        </div>
      </div>

      {/* 2. ROYAL RESTAURANT PROFILE HEADER */}
      <div className="bg-[#0f0f13] border-b border-[#272730]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="gold-seal-badge">
                  <span>S&H</span>
                </div>
                <div>
                  <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#fceda2] tracking-tight">
                    S & H Arabian Mandi
                  </h1>
                  <p className="text-xs text-[#d4af37] font-cinzel uppercase tracking-widest mt-0.5">
                    Authentic Yemeni Mandi & Pit Coal Grills
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#d4d4d8] mt-3 font-sans font-light">
                Opposite Sangivalasa Bus Stop, National Highway 16, Thagarapuvalasa, AP 531162
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#a1a1aa] mt-2">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Open Now (11:00 AM – 11:30 PM)
                </span>
                <span>•</span>
                <span>Cost for two: ₹450 approx</span>
                <span>•</span>
                <span className="text-[#fceda2] font-mono">15 KM Delivery Coverage</span>
              </div>
            </div>

            {/* Ratings & Accolades */}
            <div className="flex items-center gap-3 self-start">
              <div className="bg-[#18181f] border border-[#d4af37]/30 rounded-xl p-3 text-center min-w-[90px] shadow-gold-sm">
                <div className="inline-flex items-center gap-1 text-[#d4af37] font-bold text-sm font-cinzel">
                  <span>4.8</span>
                  <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                </div>
                <div className="text-[10px] text-[#a1a1aa] uppercase mt-0.5 font-cinzel">Dining Rating</div>
              </div>

              <div className="bg-[#18181f] border border-emerald-500/30 rounded-xl p-3 text-center min-w-[90px]">
                <div className="inline-flex items-center gap-1 text-emerald-400 font-bold text-sm font-cinzel">
                  <span>4.7</span>
                  <Star className="w-3.5 h-3.5 fill-emerald-400" />
                </div>
                <div className="text-[10px] text-[#a1a1aa] uppercase mt-0.5 font-cinzel">Delivery Rating</div>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#272730] overflow-x-auto">
            <button
              onClick={() => setActiveTab('order')}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel tracking-wider uppercase transition-all whitespace-nowrap ${
                activeTab === 'order'
                  ? 'bg-[#d4af37] text-black font-bold shadow-gold-sm'
                  : 'bg-[#141419] text-[#d4d4d8] hover:text-[#fceda2] border border-[#272730]'
              }`}
            >
              Order Online (Full Menu)
            </button>

            <button
              onClick={() => setActiveTab('board')}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'board'
                  ? 'bg-[#d4af37] text-black font-bold shadow-gold-sm'
                  : 'bg-[#141419] text-[#d4d4d8] hover:text-[#fceda2] border border-[#272730]'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>📜 Royal Slate Menu Board</span>
            </button>

            <button
              onClick={() => setReelOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-cinzel tracking-wider uppercase bg-[#141419] text-[#ff8a00] hover:bg-[#ff8a00]/10 border border-[#ff8a00]/30 transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5" />
              <span>🔥 Sizzler Video Reel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. FILTER & SEARCH TOOLBAR */}
      <div className="sticky top-20 z-30 bg-[#09090b]/95 backdrop-blur-md border-b border-[#272730] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  vegOnly
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-[#141419] border-[#272730] text-[#a1a1aa] hover:border-neutral-600'
                }`}
              >
                <div className="zomato-veg-mark" />
                <span>Pure Veg</span>
              </button>

              <button
                onClick={() => setNonVegOnly(!nonVegOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  nonVegOnly
                    ? 'bg-red-950/80 border-red-500 text-red-300'
                    : 'bg-[#141419] border-[#272730] text-[#a1a1aa] hover:border-neutral-600'
                }`}
              >
                <div className="zomato-nonveg-mark" />
                <span>Non-Veg</span>
              </button>

              <button
                onClick={() => setBestsellerOnly(!bestsellerOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel border flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  bestsellerOnly
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#fceda2]'
                    : 'bg-[#141419] border-[#272730] text-[#a1a1aa] hover:border-neutral-600'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Bestsellers</span>
              </button>

              <button
                onClick={() => setSpicyOnly(!spicyOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  spicyOnly
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                    : 'bg-[#141419] border-[#272730] text-[#a1a1aa] hover:border-neutral-600'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Spicy</span>
              </button>
            </div>

            {/* In-Menu Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in this menu..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#141419] border border-[#272730] focus:border-[#d4af37] focus:outline-none text-xs text-white placeholder-neutral-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT (ORDER ONLINE 2-COLUMN VIEW OR SLATE BOARD) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'order' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: STICKY CATEGORIES SIDEBAR */}
            <div className="lg:col-span-3 sticky top-36 z-20">
              <div className="slate-plate-card rounded-2xl p-3 space-y-1">
                <div className="px-3 py-2 text-[10px] font-cinzel uppercase tracking-wider text-[#d4af37] border-b border-[#272730]">
                  Menu Categories ({groupedCategories.length})
                </div>

                <div className="max-h-[calc(100vh-220px)] overflow-y-auto space-y-1 pt-1 pr-1">
                  {groupedCategories.map((cat) => {
                    const isActive = activeCategorySlug === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => scrollToCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-cinzel transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-[#d4af37]/15 text-[#fceda2] font-bold border-l-4 border-[#d4af37]'
                            : 'text-[#d4d4d8] hover:bg-[#18181f] hover:text-white'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] font-mono text-[#a1a1aa] ml-2">
                          ({cat.items.length})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DISHES FEED */}
            <div className="lg:col-span-9 space-y-12">
              {groupedCategories.map((category) => (
                <div
                  key={category.id}
                  id={category.slug}
                  ref={(el) => {
                    categoryRefs.current[category.slug] = el;
                  }}
                  className="space-y-4 scroll-mt-36"
                >
                  {/* Category Header */}
                  <div className="border-b border-[#272730] pb-2 flex items-baseline justify-between">
                    <div>
                      <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#fceda2]">
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-xs text-[#a1a1aa] font-sans font-light mt-0.5">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-mono text-[#d4af37]">
                      {category.items.length} items
                    </span>
                  </div>

                  {/* Dishes in this Category */}
                  <div className="space-y-4">
                    {category.items.map((dish: any) => {
                      let parsedSizes: any[] = [];
                      if (dish.sizesJson) {
                        try {
                          parsedSizes = JSON.parse(dish.sizesJson);
                        } catch (e) {}
                      }

                      return (
                        <div
                          key={dish.id}
                          className="slate-plate-card rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4 transition-all"
                        >
                          {/* Left: Dish Information */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              {dish.isVeg ? (
                                <div className="zomato-veg-mark" title="Pure Veg" />
                              ) : (
                                <div className="zomato-nonveg-mark" title="Non-Veg" />
                              )}
                              {dish.isBestseller && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-cinzel text-[#fceda2] bg-[#d4af37]/20 border border-[#d4af37]/40 px-2 py-0.5 rounded-full font-bold">
                                  <Crown className="w-3 h-3 text-[#d4af37]" />
                                  <span>Bestseller</span>
                                </span>
                              )}
                            </div>

                            <div>
                              <h3 className="font-cinzel font-bold text-base sm:text-lg text-[#fceda2] leading-snug">
                                {dish.name}
                              </h3>
                              <div className="font-mono font-bold text-sm sm:text-base text-white mt-0.5">
                                ₹{dish.price}
                              </div>
                            </div>

                            {/* Portion sizing pill chips if available */}
                            {parsedSizes.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {parsedSizes.map((sz: any) => (
                                  <span
                                    key={sz.name}
                                    className="px-2 py-0.5 rounded-md bg-[#141419] border border-[#272730] text-[10px] font-mono text-[#fceda2]"
                                  >
                                    {sz.name}: ₹{sz.price}
                                  </span>
                                ))}
                              </div>
                            )}

                            {dish.description && (
                              <p className="text-xs text-[#d4d4d8] font-sans font-light leading-relaxed max-w-xl line-clamp-2">
                                {dish.description}
                              </p>
                            )}
                          </div>

                          {/* Right: Square Food Thumbnail with Floating Action Button */}
                          <div className="relative flex-shrink-0 flex flex-col items-center">
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-[#272730] bg-[#141419]">
                              <Image
                                src={dish.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300'}
                                alt={dish.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>

                            {/* Floating Action Button */}
                            <div className="relative -mt-4 z-10">
                              <button
                                onClick={() => setSelectedFood(dish)}
                                className="btn-royal-gold px-5 py-1.5 text-xs shadow-gold-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>ADD</span>
                              </button>
                            </div>

                            <span className="text-[10px] font-sans text-[#a1a1aa] mt-1">
                              customisable
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ROYAL SLATE BOARD TAB (Inspired by Image 4 & 1) */
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <p className="font-cinzel text-xs tracking-[0.3em] text-[#d4af37] uppercase">
                — RESTAURANT SLATE TARIFF —
              </p>
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#fceda2]">
                Complete Authentic Slate Menu
              </h2>
              <p className="text-xs text-[#a1a1aa] font-sans font-light">
                Prices inclusive of GST and all traditional accompaniments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {groupedCategories.map((cat) => (
                <div key={cat.id} className="slate-plate-card rounded-2xl p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#272730] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="gold-seal-badge">
                        <span>{cat.name.charAt(0)}</span>
                      </div>
                      <h3 className="font-cinzel text-base font-bold text-[#fceda2] tracking-wider uppercase">
                        {cat.name}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-[#d4af37]">PRICE (INR)</span>
                  </div>

                  <div className="space-y-3">
                    {cat.items.map((it: any) => (
                      <div
                        key={it.id}
                        onClick={() => setSelectedFood(it)}
                        className="flex items-baseline justify-between text-xs sm:text-sm hover:text-[#fceda2] cursor-pointer group transition-colors"
                      >
                        <span className="font-medium text-[#f4f4f5] group-hover:text-[#fceda2] whitespace-nowrap">
                          {it.name}
                        </span>
                        <span className="menu-dots" />
                        <span className="font-mono font-bold text-[#fceda2] whitespace-nowrap">
                          ₹{it.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. FLOATING BOTTOM CART BAR */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-lg">
          <NextLink
            href="/cart"
            className="flex items-center justify-between p-4 rounded-2xl bg-[#121216] border border-[#d4af37] text-white shadow-2xl backdrop-blur-xl group hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-black font-cinzel font-black text-sm flex items-center justify-center">
                {totalItemsCount}
              </div>
              <div>
                <div className="text-[10px] font-cinzel text-[#a1a1aa] uppercase tracking-wider">Feast Cart Active</div>
                <div className="text-base font-mono font-bold text-[#fceda2]">₹{subtotal}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-cinzel font-bold text-xs sm:text-sm text-[#fceda2]">
              <span>VIEW FEAST CART</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </div>
          </NextLink>
        </div>
      )}

      {/* Food Customization Modal */}
      <FoodModal item={selectedFood} onClose={() => setSelectedFood(null)} />

      {/* Sizzler Video Reel Modal */}
      <SizzlerReelModal
        isOpen={reelOpen}
        onClose={() => setReelOpen(false)}
        onSelectDish={() => setSelectedFood(items[0])}
      />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-[#09090b]">
          <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#a1a1aa] mt-2 font-cinzel">Loading S & H Arabian Mandi Menu...</p>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}

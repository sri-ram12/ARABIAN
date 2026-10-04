'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Flame,
  Sparkles,
  Plus,
  SlidersHorizontal,
  X,
  UtensilsCrossed,
  Check,
} from 'lucide-react';
import FoodModal from '@/components/FoodModal';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [bestsellerOnly, setBestsellerOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('default'); // 'default', 'price_asc', 'price_desc'
  const [selectedFood, setSelectedFood] = useState<any | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories || []);
          setItems(data.items || []);
        }
      } catch (e) {
        console.error('Menu load error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // Update selectedCategory if URL query param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Client-side filtering & sorting for instantaneous feedback
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all' && item.category?.slug !== selectedCategory) {
          return false;
        }

        // Veg filter
        if (vegOnly && !item.isVeg) {
          return false;
        }

        // Bestseller filter
        if (bestsellerOnly && !item.isBestseller) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesDesc = item.description?.toLowerCase().includes(q);
          const matchesIngredients = item.ingredients?.toLowerCase().includes(q);
          const matchesCat = item.category?.name.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesIngredients && !matchesCat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountedPrice || a.price;
        const priceB = b.discountedPrice || b.price;
        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        return 0;
      });
  }, [items, selectedCategory, vegOnly, bestsellerOnly, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-mandi-border pb-6">
        <div>
          <span className="text-gold-400 font-bold text-xs uppercase tracking-wider block">
            Authentic Arabian Kitchen
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-white mt-1">
            Our Complete Menu
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse through 30+ signature Arabian Mandi platters, grills, and desserts
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chicken, faham, mutton, kunafa..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border focus:border-gold-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-gold-500 text-black shadow-gold-sm'
              : 'bg-mandi-card border border-mandi-border text-slate-300 hover:bg-mandi-surface'
          }`}
        >
          All Items ({items.length})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.slug
                ? 'bg-gold-500 text-black shadow-gold-sm'
                : 'bg-mandi-card border border-mandi-border text-slate-300 hover:bg-mandi-surface'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Secondary Quick Toggles & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-mandi-surface/60 p-3 rounded-2xl border border-mandi-border text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              vegOnly
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                : 'bg-mandi-card text-slate-300 border-mandi-border hover:bg-mandi-elevated'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${vegOnly ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span>Pure Veg</span>
          </button>

          {/* Bestsellers Toggle */}
          <button
            onClick={() => setBestsellerOnly(!bestsellerOnly)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
              bestsellerOnly
                ? 'bg-amber-950 text-amber-300 border-amber-500'
                : 'bg-mandi-card text-slate-300 border-mandi-border hover:bg-mandi-elevated'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bestsellers</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-mandi-card border border-mandi-border text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-gold-500"
          >
            <option value="default">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-mandi-card border border-mandi-border rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-mandi-card border border-mandi-border rounded-3xl space-y-4">
          <UtensilsCrossed className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-white">No dishes found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords or toggle off Veg/Bestseller filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setVegOnly(false);
              setBestsellerOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-gold-500 text-black font-semibold text-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-mandi-card border border-mandi-border hover:border-gold-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col group"
            >
              {/* Image Banner */}
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

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.isVeg
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-950 text-red-400 border border-red-500/30'
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

              {/* Card Body */}
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

                {/* Footer / Add Action */}
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
                    <span>CUSTOMIZE</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Food Customization Modal */}
      <FoodModal item={selectedFood} onClose={() => setSelectedFood(null)} />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Loading Arabian Mandi Menu...</p>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}

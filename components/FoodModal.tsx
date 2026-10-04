'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart, CartAddon } from '@/context/CartContext';
import { X, Plus, Minus, Flame, Sparkles, Check, ShoppingBag } from 'lucide-react';

interface Props {
  item: any | null;
  onClose: () => void;
}

export default function FoodModal({ item, onClose }: Props) {
  const { addToCart } = useCart();

  // Parse available sizes if available
  let availableSizes: { name: string; price: number }[] = [];
  if (item?.sizesJson) {
    try {
      availableSizes = JSON.parse(item.sizesJson);
    } catch (e) {}
  }

  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes.length > 0 ? availableSizes[0].name : 'Standard'
  );

  const [selectedAddons, setSelectedAddons] = useState<CartAddon[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialNote, setSpecialNote] = useState<string>('');

  if (!item) return null;

  // Determine current unit base price
  let basePrice = item.discountedPrice || item.price;
  if (availableSizes.length > 0) {
    const matched = availableSizes.find((s) => s.name === selectedSize);
    if (matched) basePrice = matched.price;
  }

  // Toggle addon
  const toggleAddon = (addon: { name: string; price: number }) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (basePrice + addonsTotal) * quantity;

  const handleAddToCart = () => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: basePrice,
      size: availableSizes.length > 0 ? selectedSize : undefined,
      image: item.image,
      quantity,
      selectedAddons,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-mandi-card border border-mandi-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Food Banner Image */}
        <div className="relative h-64 sm:h-72 w-full bg-mandi-surface overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mandi-card via-transparent to-black/30" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {item.isBestseller && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-black flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> Bestseller
              </span>
            )}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                item.isVeg ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40' : 'bg-red-900/80 text-red-300 border border-red-500/40'
              }`}
            >
              {item.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="font-heading text-2xl font-bold text-white drop-shadow-md">
              {item.name}
            </h2>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1">
              {item.description}
            </p>
          </div>
        </div>

        {/* Customization Details */}
        <div className="p-6 space-y-6">
          {/* Portion Size Selection */}
          {availableSizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading font-semibold text-sm text-white">
                  Choose Portion Size
                </span>
                <span className="text-[11px] text-gold-400 font-bold uppercase tracking-wider">Required</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size.name;
                  return (
                    <button
                      key={size.name}
                      type="button"
                      onClick={() => setSelectedSize(size.name)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-gold-500/15 border-gold-500 text-white shadow-gold-sm'
                          : 'bg-mandi-surface border-mandi-border hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-xs">{size.name}</div>
                      <div className="text-gold-400 font-bold text-sm mt-1">
                        ₹{size.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons Selection */}
          {item.addons && item.addons.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading font-semibold text-sm text-white">
                  Add Arabian Sides & Accompaniments
                </span>
                <span className="text-[11px] text-slate-400">Optional</span>
              </div>
              <div className="space-y-2">
                {item.addons.map((addon: any) => {
                  const isChecked = selectedAddons.some((a) => a.name === addon.name);
                  return (
                    <div
                      key={addon.id || addon.name}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-gold-500/10 border-gold-500/60 text-white'
                          : 'bg-mandi-surface border-mandi-border hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isChecked
                              ? 'bg-gold-500 border-gold-500 text-black'
                              : 'border-slate-500 bg-transparent'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-gold-400">+₹{addon.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice Level & Ingredients Preview */}
          <div className="p-3.5 rounded-xl bg-mandi-surface/70 border border-mandi-border text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-300">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Spice Level: <strong className="text-white">{item.spiceLevel}</strong></span>
              <span className="text-slate-500">•</span>
              <span>Prep Time: <strong className="text-white">~{item.preparationTimeMin} mins</strong></span>
            </div>
            {item.ingredients && (
              <p className="text-[11px] text-slate-400">
                Ingredients: {item.ingredients}
              </p>
            )}
          </div>

          {/* Quantity Controls & Add to Cart Action */}
          <div className="pt-4 border-t border-mandi-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-mandi-surface border border-mandi-border rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-mandi-card"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-mandi-card"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gold-gradient text-black font-heading font-bold text-sm tracking-wide shadow-gold-sm hover:brightness-110 active:scale-98 transition-all flex items-center justify-between"
            >
              <span>ADD TO CART</span>
              <span className="text-base font-black">₹{totalPrice}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart, CartAddon } from '@/context/CartContext';
import { X, Plus, Minus, Flame, Sparkles, Check, Users, Crown, Star } from 'lucide-react';

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

  const getPortionServingDesc = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('solo') || lower.includes('1p')) return 'Serves 1 Person';
    if (lower.includes('duo') || lower.includes('2p')) return 'Serves 2 Diners';
    if (lower.includes('trio') || lower.includes('3p')) return 'Serves 3 Foodies';
    if (lower.includes('squad') || lower.includes('4p')) return 'Serves 4 - 5 Grand Feast';
    return '1 Portion';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121216] rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl relative border border-[#d4af37]/40 divide-y divide-[#272730] text-[#f4f4f5]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-[#d4d4d8] hover:text-white border border-[#272730] shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Food Banner Image */}
        <div className="relative h-56 sm:h-64 w-full bg-[#18181f] overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent" />

          {/* Badges on Image */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            {item.isVeg ? (
              <span className="zomato-veg-mark shadow-sm" />
            ) : (
              <span className="zomato-nonveg-mark shadow-sm" />
            )}
            {item.isBestseller && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-cinzel font-bold bg-[#d4af37] text-black shadow-md flex items-center gap-1">
                <Crown className="w-3 h-3 text-black" />
                <span>Bestseller</span>
              </span>
            )}
          </div>
        </div>

        {/* Dish Title & Description Header */}
        <div className="p-6 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#fceda2] leading-tight">
                {item.name}
              </h2>
              {item.category?.name && (
                <span className="text-xs text-[#d4af37] font-cinzel uppercase tracking-wider block mt-1">
                  {item.category.name}
                </span>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#fceda2]">
                ₹{basePrice}
              </span>
            </div>
          </div>

          {item.description && (
            <p className="text-xs sm:text-sm text-[#d4d4d8] font-sans font-light leading-relaxed pt-1">
              {item.description}
            </p>
          )}
        </div>

        {/* Mandi Portion Sizes Section */}
        {availableSizes.length > 0 && (
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-cinzel font-bold text-[#fceda2] uppercase tracking-wider">
                Select Mandi Portion Size
              </span>
              <span className="text-[10px] font-mono text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/30">
                Required
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {availableSizes.map((size) => {
                const isSelected = selectedSize === size.name;
                return (
                  <div
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-gold-sm'
                        : 'bg-[#18181f] border-[#272730] hover:border-[#383845]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel font-bold text-xs text-[#fceda2]">
                        {size.name}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#d4af37] bg-[#d4af37]' : 'border-neutral-600'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#a1a1aa] mt-1">
                      {getPortionServingDesc(size.name)}
                    </span>
                    <span className="font-mono font-bold text-xs text-white mt-2">
                      ₹{size.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Accompaniments & Extra Addons */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel font-bold text-[#fceda2] uppercase tracking-wider">
              Yemeni Accompaniments & Add-ons
            </span>
            <span className="text-[10px] text-[#a1a1aa]">Optional</span>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Extra Fragrant Mandi Rice (Solo Bowl)', price: 60 },
              { name: 'Traditional Toum Garlic Whip (50ml)', price: 40 },
              { name: 'Spicy Tomato Dakkoos Chutney', price: 30 },
              { name: 'Golden Roasted Cashews & Fried Onions', price: 50 },
              { name: 'Chilled Thums Up Glass Bottle (300ml)', price: 45 },
            ].map((addon) => {
              const isChecked = selectedAddons.some((a) => a.name === addon.name);
              return (
                <div
                  key={addon.name}
                  onClick={() => toggleAddon(addon)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isChecked
                      ? 'bg-[#d4af37]/15 border-[#d4af37]'
                      : 'bg-[#18181f] border-[#272730] hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-[#d4af37] border-[#d4af37]' : 'border-neutral-600'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-black stroke-[3]" />}
                    </div>
                    <span className="text-xs font-medium text-[#d4d4d8]">{addon.name}</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#fceda2]">
                    +₹{addon.price}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA & Stepper */}
        <div className="p-6 bg-[#0f0f13] flex items-center justify-between gap-4 sticky bottom-0 z-20 border-t border-[#272730]">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-[#18181f] border border-[#272730] rounded-xl overflow-hidden shadow-inner">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2.5 text-[#d4af37] hover:bg-[#202028] transition-colors"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="px-3 font-mono font-bold text-sm text-[#fceda2] min-w-[28px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2.5 text-[#d4af37] hover:bg-[#202028] transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 btn-royal-gold py-3 px-6 text-xs sm:text-sm flex items-center justify-between"
          >
            <span>ADD TO FEAST</span>
            <span className="font-mono font-black">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

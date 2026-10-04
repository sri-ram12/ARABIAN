'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartAddon {
  id?: string;
  name: string;
  price: number;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  size?: string;
  image?: string;
  quantity: number;
  selectedAddons?: CartAddon[];
}

export interface AppliedCoupon {
  code: string;
  title: string;
  description: string;
  discountType: string;
  discountValue: number;
  calculatedDiscount: number;
}

export interface Address {
  id: string;
  addressLine: string;
  landmark?: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  addressType: 'HOME' | 'WORK' | 'OTHER';
  deliveryInstructions?: string;
  isDefault?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  tax: number;
  packagingFee: number;
  deliveryFee: number;
  grandTotal: number;
  totalItemsCount: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address | null) => void;
  isServiceable: boolean;
  serviceabilityMessage: string;
  checkServiceabilityForAddress: (addr: Address) => Promise<boolean>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  subtotal: 0,
  discount: 0,
  tax: 0,
  packagingFee: 25,
  deliveryFee: 35,
  grandTotal: 0,
  totalItemsCount: 0,
  appliedCoupon: null,
  applyCoupon: async () => ({ success: false, message: '' }),
  removeCoupon: () => {},
  selectedAddress: null,
  setSelectedAddress: () => {},
  isServiceable: true,
  serviceabilityMessage: '',
  checkServiceabilityForAddress: async () => true,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(35);
  const [isServiceable, setIsServiceable] = useState<boolean>(true);
  const [serviceabilityMessage, setServiceabilityMessage] = useState<string>('');
  const [packagingFee] = useState<number>(25);
  const [taxRate] = useState<number>(0.05); // 5% GST

  // Load cart from local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('arabian_mandi_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem('arabian_mandi_coupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
      const savedAddress = localStorage.getItem('arabian_mandi_address');
      if (savedAddress) {
        setSelectedAddress(JSON.parse(savedAddress));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('arabian_mandi_cart', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('arabian_mandi_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('arabian_mandi_coupon');
      }
    } catch (e) {}
  }, [appliedCoupon]);

  useEffect(() => {
    try {
      if (selectedAddress) {
        localStorage.setItem('arabian_mandi_address', JSON.stringify(selectedAddress));
        checkServiceabilityForAddress(selectedAddress);
      } else {
        localStorage.removeItem('arabian_mandi_address');
      }
    } catch (e) {}
  }, [selectedAddress]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qty = newItem.quantity || 1;
    setItems((prev) => {
      // Check if identical item (same ID, size, addons) exists
      const existingIndex = prev.findIndex((item) => {
        if (item.menuItemId !== newItem.menuItemId) return false;
        if (item.size !== newItem.size) return false;
        const a1 = (item.selectedAddons || []).map((a) => a.name).sort().join(',');
        const a2 = (newItem.selectedAddons || []).map((a) => a.name).sort().join(',');
        return a1 === a2;
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [...prev, { ...newItem, quantity: qty }];
      }
    });
  };

  const removeFromCart = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  // Subtotal calculation
  const subtotal = items.reduce((sum, item) => {
    const addonsTotal = (item.selectedAddons || []).reduce((aSum, a) => aSum + a.price, 0);
    return sum + (item.price + addonsTotal) * item.quantity;
  }, 0);

  // Recalculate discount if coupon applied
  const discount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;

  // Delivery check based on address
  const checkServiceabilityForAddress = async (addr: Address): Promise<boolean> => {
    try {
      const res = await fetch('/api/check-serviceability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: addr.latitude,
          longitude: addr.longitude,
          subtotal,
        }),
      });
      const data = await res.json();
      if (data.success && data.serviceability) {
        setIsServiceable(data.serviceability.isServiceable);
        setDeliveryFee(data.serviceability.deliveryFee);
        if (!data.serviceability.isServiceable) {
          setServiceabilityMessage(data.serviceability.reason || 'Out of delivery area');
          return false;
        } else {
          setServiceabilityMessage(`Delivering to ${data.serviceability.zoneName} (${data.serviceability.distanceKm} km)`);
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Apply Coupon
  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Invalid coupon' };
    } catch (e: any) {
      return { success: false, message: 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * taxRate * 100) / 100;
  const grandTotal = subtotal > 0
    ? Math.round((taxableAmount + tax + deliveryFee + packagingFee) * 100) / 100
    : 0;

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        tax,
        packagingFee,
        deliveryFee,
        grandTotal,
        totalItemsCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        selectedAddress,
        setSelectedAddress,
        isServiceable,
        serviceabilityMessage,
        checkServiceabilityForAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

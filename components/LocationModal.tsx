'use client';

import React, { useState } from 'react';
import { useCart, Address } from '@/context/CartContext';
import { MapPin, Navigation, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_AREAS = [
  {
    name: 'Sangivalasa (NRI Hospital & College Road)',
    area: 'Sangivalasa',
    city: 'Thagarapuvalasa',
    pincode: '531162',
    lat: 17.9250,
    lng: 83.4385,
    zone: 'Zone A (Within 3.5 km)',
    fee: '₹30 delivery',
  },
  {
    name: 'Thagarapuvalasa Main Market & RTC Bus Stand',
    area: 'Thagarapuvalasa Town',
    city: 'Thagarapuvalasa',
    pincode: '531162',
    lat: 17.9290,
    lng: 83.4345,
    zone: 'Zone A (Within 3.5 km)',
    fee: '₹30 delivery',
  },
  {
    name: 'Chittivalasa Jute Mill Area & Quarters',
    area: 'Chittivalasa',
    city: 'Thagarapuvalasa',
    pincode: '531162',
    lat: 17.9355,
    lng: 83.4312,
    zone: 'Zone B (3.5 - 8 km)',
    fee: '₹50 delivery',
  },
  {
    name: 'Anandapuram NH16 Junction',
    area: 'Anandapuram',
    city: 'Thagarapuvalasa',
    pincode: '530052',
    lat: 17.9050,
    lng: 83.4150,
    zone: 'Zone B (3.5 - 8 km)',
    fee: '₹50 delivery',
  },
  {
    name: 'Bheemunipatnam (Bheemili Town & Beach Road)',
    area: 'Bheemili',
    city: 'Bheemunipatnam',
    pincode: '531163',
    lat: 17.8920,
    lng: 83.4540,
    zone: 'Zone C (8 - 15 km)',
    fee: '₹80 delivery',
  },
];

export default function LocationModal({ isOpen, onClose }: Props) {
  const { setSelectedAddress, checkServiceabilityForAddress, selectedAddress } = useCart();
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectArea = async (areaItem: typeof POPULAR_AREAS[0]) => {
    const newAddr: Address = {
      id: `addr_preset_${Date.now()}`,
      addressLine: `${areaItem.area}, Near Main Landmark`,
      area: areaItem.area,
      city: areaItem.city,
      state: 'Andhra Pradesh',
      pincode: areaItem.pincode,
      latitude: areaItem.lat,
      longitude: areaItem.lng,
      addressType: 'HOME',
      deliveryInstructions: 'Deliver to door',
    };

    setSelectedAddress(newAddr);
    const ok = await checkServiceabilityForAddress(newAddr);
    if (ok) {
      setStatusMessage(`Selected: ${areaItem.name}`);
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 500);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoadingGeo(true);
    setStatusMessage('Detecting GPS location in Thagarapuvalasa...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newAddr: Address = {
          id: `addr_gps_${Date.now()}`,
          addressLine: 'GPS Detected Location',
          area: 'Thagarapuvalasa Region',
          city: 'Thagarapuvalasa',
          state: 'Andhra Pradesh',
          pincode: '531162',
          latitude,
          longitude,
          addressType: 'HOME',
        };

        setSelectedAddress(newAddr);
        const ok = await checkServiceabilityForAddress(newAddr);
        setLoadingGeo(false);
        if (ok) {
          setStatusMessage('Location verified and serviceable!');
          setTimeout(() => {
            setStatusMessage(null);
            onClose();
          }, 800);
        } else {
          setStatusMessage('Location is outside our 15 km delivery radius.');
        }
      },
      (err) => {
        setLoadingGeo(false);
        setStatusMessage('GPS permission denied or unavailable. Please choose from the list below.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-mandi-card border border-mandi-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-mandi-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold-400" />
            <h3 className="font-heading text-lg font-bold text-white">Choose Delivery Location</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Button */}
        <div className="p-5 space-y-4">
          <button
            onClick={handleGetCurrentLocation}
            disabled={loadingGeo}
            className="w-full py-3 px-4 rounded-xl bg-gold-500/10 border border-gold-500/30 hover:bg-gold-500/20 text-gold-400 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Navigation className={`w-4 h-4 ${loadingGeo ? 'animate-spin' : ''}`} />
            {loadingGeo ? 'Locating...' : 'Use Current Device Location (GPS)'}
          </button>

          {statusMessage && (
            <div className="p-3 rounded-lg bg-mandi-surface border border-mandi-border text-xs text-center text-slate-300">
              {statusMessage}
            </div>
          )}

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Popular Service Areas in Thagarapuvalasa
            </span>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {POPULAR_AREAS.map((loc) => {
                const isSelected = selectedAddress?.area === loc.area;
                return (
                  <button
                    key={loc.name}
                    onClick={() => handleSelectArea(loc)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-gold-500/15 border-gold-500/50 text-white'
                        : 'bg-mandi-surface hover:bg-mandi-elevated border-mandi-border text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        <span>{loc.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-gold-400" />}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {loc.zone} • {loc.fee}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/40 text-gold-400 border border-gold-500/20">
                      Deliver Here
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-mandi-surface/50 border-t border-mandi-border text-center text-xs text-slate-400">
          Arabian Mandi delivers within 15 km of our NH16 Sangivalasa Kitchen.
        </div>
      </div>
    </div>
  );
}

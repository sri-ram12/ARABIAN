'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  MapPin,
  Search,
  User,
  Menu as MenuIcon,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  UtensilsCrossed,
  Bike,
  Crown,
} from 'lucide-react';
import LocationModal from './LocationModal';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItemsCount, subtotal, selectedAddress } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: '🔥 Showcase', href: '/showcase' },
    { name: 'Royal Offers', href: '/offers' },
    { name: 'GPS Tracker', href: '/track' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      window.location.href = `/menu?q=${encodeURIComponent(navSearch.trim())}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#09090b]/95 backdrop-blur-xl border-b border-[#272730] transition-all">
        {/* Top Gold Foil Announcement Ribbon */}
        <div className="bg-gradient-to-r from-[#141419] via-[#241e12] to-[#141419] border-b border-[#d4af37]/20 py-1.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-[#fceda2]">
            <div className="hidden sm:flex items-center gap-2">
              <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-cinzel tracking-wider uppercase">Authentic Royal Yemeni Mandi & Pit Coal Grills</span>
            </div>
            <div className="mx-auto sm:mx-0 flex items-center gap-4 text-[#e8c466]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
                <span>Dining & Delivery: 11:00 AM – 11:30 PM</span>
              </span>
              <span className="hidden md:inline text-neutral-500">|</span>
              <span className="hidden md:inline font-mono">Sangivalasa, Thagarapuvalasa</span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Left: Brand Logo & Insignia */}
            <NextLink href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="gold-seal-badge group-hover:scale-105 transition-transform">
                <span>S&H</span>
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-[#fceda2] leading-none group-hover:text-white transition-colors">
                  S & H <span className="gold-gradient-text">ARABIAN MANDI</span>
                </span>
                <span className="text-[10px] font-cinzel text-[#a1a1aa] tracking-widest uppercase mt-1">
                  Yemeni Royal Gastronomy
                </span>
              </div>
            </NextLink>

            {/* Middle: Delivery Location & Search Bar */}
            <div className="hidden lg:flex items-center gap-3 flex-1 max-w-lg mx-4">
              {/* Location Pill */}
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141419] border border-[#272730] hover:border-[#d4af37]/40 text-xs text-[#d4d4d8] hover:text-white transition-all max-w-[200px]"
              >
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                <span className="truncate text-left font-medium">
                  {selectedAddress ? `${selectedAddress.area}` : 'Thagarapuvalasa'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#a1a1aa] flex-shrink-0" />
              </button>

              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Search Faham, Mutton Mandi, Tikka..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141419] border border-[#272730] focus:border-[#d4af37] focus:outline-none text-xs text-white placeholder-neutral-500 transition-colors"
                />
              </form>
            </div>

            {/* Center-Right: Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <NextLink
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-cinzel tracking-wider uppercase transition-all ${
                      isActive
                        ? 'text-[#fceda2] bg-[#d4af37]/10 border border-[#d4af37]/30'
                        : 'text-[#d4d4d8] hover:text-[#fceda2] hover:bg-[#141419]'
                    }`}
                  >
                    {link.name}
                  </NextLink>
                );
              })}
            </nav>

            {/* Right: Cart & User Account */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <NextLink
                href="/cart"
                className="flex items-center gap-2.5 py-2 px-4 rounded-xl bg-[#141419] hover:bg-[#1c1c24] border border-[#d4af37]/30 hover:border-[#d4af37] text-white transition-all group shadow-gold-sm"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-[#d4af37] group-hover:scale-110 transition-transform" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#d4af37] to-[#ff8a00] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#09090b]">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[9px] font-cinzel text-[#a1a1aa] uppercase leading-none">Feast Cart</span>
                  <span className="text-xs font-mono font-bold text-[#fceda2] leading-tight">
                    {subtotal > 0 ? `₹${subtotal}` : 'Empty'}
                  </span>
                </div>
              </NextLink>

              {/* User Account / Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-[#141419] hover:bg-[#1c1c24] border border-[#272730] text-xs text-[#d4d4d8] transition-colors"
                  >
                    <span className="font-medium max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-black font-bold text-xs flex items-center justify-center font-cinzel">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#121216] border border-[#d4af37]/30 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-[#272730]">
                      <div className="px-3 py-2 text-xs">
                        <p className="font-cinzel font-bold text-[#fceda2]">{user.name}</p>
                        <p className="text-[11px] text-[#a1a1aa] truncate">{user.phone || user.email}</p>
                      </div>

                      <div className="py-1">
                        <NextLink
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-[#d4d4d8] hover:text-[#fceda2] hover:bg-[#18181f] rounded-lg"
                        >
                          <User className="w-3.5 h-3.5 text-[#d4af37]" /> My Orders & Profile
                        </NextLink>
                        <NextLink
                          href="/track"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-[#d4d4d8] hover:text-[#fceda2] hover:bg-[#18181f] rounded-lg"
                        >
                          <Bike className="w-3.5 h-3.5 text-[#d4af37]" /> Live GPS Tracking
                        </NextLink>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <NextLink
                    href="/login"
                    className="px-3.5 py-1.5 rounded-xl text-[#d4d4d8] hover:text-[#fceda2] font-cinzel text-xs tracking-wider transition-colors"
                  >
                    Log In
                  </NextLink>
                  <NextLink
                    href="/register"
                    className="btn-royal-gold px-4 py-1.5 text-xs shadow-gold-sm"
                  >
                    Sign Up
                  </NextLink>
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-[#d4d4d8] hover:text-[#fceda2] hover:bg-[#141419]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#141419] border border-[#272730] rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-[#a1a1aa] mr-2 flex-shrink-0" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search Mandi, Tikka, Grills..."
                className="w-full text-xs text-white placeholder-neutral-500 focus:outline-none bg-transparent"
              />
            </form>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#121216] border-b border-[#272730] px-4 pt-2 pb-6 space-y-3 shadow-2xl">
            <button
              onClick={() => {
                setLocationModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 p-3 rounded-xl bg-[#18181f] border border-[#272730] text-xs text-[#d4d4d8]"
            >
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              <div className="text-left flex-1">
                <span className="text-[10px] text-[#a1a1aa] block uppercase font-cinzel">Deliver to Thagarapuvalasa</span>
                <span className="font-bold text-[#fceda2]">
                  {selectedAddress ? `${selectedAddress.area}, ${selectedAddress.city}` : 'Select Delivery Location'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#a1a1aa]" />
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <NextLink
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-[#18181f] text-center font-cinzel text-xs text-[#d4d4d8] hover:text-[#fceda2] hover:bg-[#202028] border border-transparent hover:border-[#d4af37]/30 transition-all"
                >
                  {link.name}
                </NextLink>
              ))}
            </div>
          </div>
        )}
      </header>

      <LocationModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
    </>
  );
}

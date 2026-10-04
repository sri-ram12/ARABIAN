'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  MapPin,
  User as UserIcon,
  Search,
  Menu as MenuIcon,
  X,
  ChevronDown,
  Shield,
  Bike,
  UtensilsCrossed,
  LogOut,
  Flame,
} from 'lucide-react';
import LocationModal from './LocationModal';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItemsCount, selectedAddress } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Offers', href: '/offers' },
    { name: 'Track Order', href: '/track' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-mandi-bg/95 backdrop-blur-md border-b border-mandi-border/80">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-amber-950 via-gold-900 to-amber-950 text-gold-200 text-xs py-1.5 px-4 text-center font-medium border-b border-gold-500/20 flex items-center justify-center gap-2">
          <Flame className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
          <span>Special Offer: Use code <strong className="text-white tracking-wider underline">WELCOME50</strong> for ₹50 OFF on your first Mandi order!</span>
          <span className="hidden sm:inline text-gold-400/60">• Delivering across Thagarapuvalasa & Sangivalasa</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <NextLink href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 p-0.5 shadow-gold-sm transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-mandi-card rounded-[10px] flex items-center justify-center text-gold-400 font-heading font-black text-2xl tracking-tighter">
                  AM
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold tracking-tight text-white group-hover:text-gold-400 transition-colors">
                  ARABIAN MANDI
                </span>
                <span className="text-[10px] tracking-widest text-gold-400 font-semibold uppercase -mt-0.5">
                  Thagarapuvalasa • Authentic
                </span>
              </div>
            </NextLink>

            {/* Location Selector (Desktop) */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-mandi-surface hover:bg-mandi-elevated border border-mandi-border text-xs text-slate-300 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
              <div className="text-left max-w-[190px] truncate">
                <span className="text-slate-400 text-[10px] block leading-none">Deliver to</span>
                <span className="font-semibold text-white">
                  {selectedAddress ? `${selectedAddress.area}, ${selectedAddress.city}` : 'Thagarapuvalasa, 531162'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <NextLink
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-gold-400 bg-gold-500/10 border border-gold-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-mandi-surface'
                    }`}
                  >
                    {link.name}
                  </NextLink>
                );
              })}
            </nav>

            {/* Right Icons: Search, Cart, Account */}
            <div className="flex items-center gap-2 sm:gap-4">
              <NextLink
                href="/menu"
                className="p-2 rounded-full text-slate-300 hover:text-gold-400 hover:bg-mandi-surface transition-colors"
                title="Search Food"
              >
                <Search className="w-5 h-5" />
              </NextLink>

              {/* Cart Button */}
              <NextLink
                href="/cart"
                className="relative p-2.5 rounded-xl bg-mandi-surface hover:bg-gold-500/10 border border-mandi-border hover:border-gold-500/30 text-white transition-all group"
              >
                <ShoppingBag className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-mandi-bg animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </NextLink>

              {/* User Account / Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-mandi-surface hover:bg-mandi-elevated border border-mandi-border text-sm text-white transition-colors"
                  >
                    <span className="font-medium text-xs max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <div className="w-7 h-7 rounded-full bg-gold-500 text-black font-bold text-xs flex items-center justify-center">
                      {user.name[0]}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-mandi-card border border-mandi-border shadow-2xl py-2 z-50 divide-y divide-mandi-border"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <NextLink
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-mandi-surface hover:text-gold-400"
                        >
                          <UserIcon className="w-4 h-4" /> My Profile & Orders
                        </NextLink>

                        {user.role === 'ADMIN' && (
                          <NextLink
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-amber-400 font-semibold hover:bg-amber-500/10"
                          >
                            <Shield className="w-4 h-4" /> Admin Dashboard
                          </NextLink>
                        )}

                        {(user.role === 'KITCHEN_STAFF' || user.role === 'ADMIN') && (
                          <NextLink
                            href="/admin/kitchen"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-orange-400 hover:bg-orange-500/10"
                          >
                            <UtensilsCrossed className="w-4 h-4" /> Kitchen Display (KDS)
                          </NextLink>
                        )}

                        {(user.role === 'DELIVERY_PARTNER' || user.role === 'ADMIN') && (
                          <NextLink
                            href="/delivery"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <Bike className="w-4 h-4" /> Delivery Dashboard
                          </NextLink>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NextLink
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-gold-gradient text-black font-semibold text-xs tracking-wide shadow-gold-sm hover:brightness-110 active:scale-95 transition-all"
                >
                  LOGIN
                </NextLink>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-mandi-surface"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-mandi-card border-b border-mandi-border px-4 pt-2 pb-6 space-y-3">
            <button
              onClick={() => {
                setLocationModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 p-3 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-slate-300"
            >
              <MapPin className="w-4 h-4 text-gold-400" />
              <div className="text-left flex-1">
                <span className="text-[10px] text-slate-400 block">Deliver to Thagarapuvalasa</span>
                <span className="font-semibold text-white">
                  {selectedAddress ? `${selectedAddress.area}, ${selectedAddress.city}` : 'Select Delivery Location'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <NextLink
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-lg bg-mandi-surface text-center text-sm font-medium text-slate-200 hover:text-gold-400"
                >
                  {link.name}
                </NextLink>
              ))}
            </div>

            {user ? (
              <div className="pt-2 border-t border-mandi-border space-y-2">
                <div className="text-xs text-slate-400 px-1">
                  Signed in as <strong className="text-white">{user.name}</strong> ({user.role})
                </div>
                {user.role === 'ADMIN' && (
                  <NextLink
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-lg bg-amber-500/10 text-amber-400 font-semibold text-xs text-center"
                  >
                    Open Restaurant Admin Dashboard
                  </NextLink>
                )}
                {user.role === 'DELIVERY_PARTNER' && (
                  <NextLink
                    href="/delivery"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold text-xs text-center"
                  >
                    Open Delivery Partner Dashboard
                  </NextLink>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full p-2 rounded-lg bg-red-500/10 text-red-400 font-medium text-xs text-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <NextLink
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-center text-sm shadow-gold-sm"
                >
                  Login / Sign Up
                </NextLink>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Location Modal */}
      <LocationModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
    </>
  );
}

'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, Clock, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItemsCount } = useCart();
  const { user } = useAuth();

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Menu', href: '/menu', icon: UtensilsCrossed },
    { name: 'Orders', href: user ? '/profile' : '/login', icon: Clock },
    { name: 'Cart', href: '/cart', icon: ShoppingBag, badge: totalItemsCount },
    { name: 'Account', href: user ? '/profile' : '/login', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-mandi-bg/95 backdrop-blur-lg border-t border-mandi-border/80 px-2 py-2 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <NextLink
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1 relative transition-colors ${
                isActive ? 'text-gold-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {link.badge && link.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-mandi-bg">
                    {link.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1">{link.name}</span>
            </NextLink>
          );
        })}
      </div>
    </nav>
  );
}

'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, UtensilsCrossed, Clock, ShoppingBag, User, Crown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItemsCount } = useCart();
  const { user } = useAuth();

  const links = [
    { name: 'Home', href: '/', icon: Crown },
    { name: 'Menu', href: '/menu', icon: UtensilsCrossed },
    { name: 'Orders', href: user ? '/profile' : '/login', icon: Clock },
    { name: 'Feast Cart', href: '/cart', icon: ShoppingBag, badge: totalItemsCount },
    { name: 'Profile', href: user ? '/profile' : '/login', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-xl border-t border-[#272730] px-2 py-2 safe-area-pb shadow-2xl">
      <div className="grid grid-cols-5 items-center justify-around">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <NextLink
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1 relative transition-colors ${
                isActive ? 'text-[#fceda2] font-bold' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-[#d4af37]' : 'text-[#a1a1aa]'} transition-transform`} />
                {link.badge && link.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-[#d4af37] to-[#ff8a00] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#09090b]">
                    {link.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] mt-1 font-cinzel ${isActive ? 'text-[#fceda2] font-bold' : 'text-[#a1a1aa]'}`}>
                {link.name}
              </span>
            </NextLink>
          );
        })}
      </div>
    </nav>
  );
}

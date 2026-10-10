import React from 'react';
import NextLink from 'next/link';
import { MapPin, Phone, Mail, Clock, MessageCircle, Globe, ChevronDown, Instagram, Facebook, Crown, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b0b0e] border-t border-[#272730] text-[#a1a1aa] text-sm mt-16 arabian-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        {/* Top Header with Brand and Region Switchers */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-[#272730] gap-4">
          <div className="flex items-center gap-3">
            <div className="gold-seal-badge">
              <span>S&H</span>
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#fceda2] tracking-wider">
                S & H <span className="gold-gradient-text">ARABIAN MANDI</span>
              </span>
              <p className="text-xs text-[#d4af37] font-cinzel uppercase tracking-widest mt-0.5">
                Authentic Yemeni Mandi & Pit Coal Grills • Thagarapuvalasa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#272730] bg-[#141419] text-xs font-cinzel text-[#d4d4d8]">
              <span>🇮🇳 India</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#a1a1aa]" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#272730] bg-[#141419] text-xs font-cinzel text-[#d4d4d8]">
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>English</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#a1a1aa]" />
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8 py-10">
          {/* Col 1: About */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-[#fceda2] text-xs uppercase tracking-wider">
              Our Heritage
            </h4>
            <ul className="space-y-2.5 text-xs text-[#d4d4d8]">
              <li>
                <NextLink href="/about" className="hover:text-[#fceda2] transition-colors">
                  Ancestral Yemeni Roots
                </NextLink>
              </li>
              <li>
                <NextLink href="/menu" className="hover:text-[#fceda2] transition-colors">
                  Underground Pit Dum Process
                </NextLink>
              </li>
              <li>
                <NextLink href="/contact" className="hover:text-[#fceda2] transition-colors">
                  Contact & Table Bookings
                </NextLink>
              </li>
              <li>
                <NextLink href="/offers" className="hover:text-[#fceda2] transition-colors">
                  Royal Discounts & Vouchers
                </NextLink>
              </li>
              <li>
                <NextLink href="/track" className="hover:text-[#fceda2] transition-colors">
                  Live GPS Order Tracker
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Col 2: Mandiverse */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-[#fceda2] text-xs uppercase tracking-wider">
              Signature Dishes
            </h4>
            <ul className="space-y-2.5 text-xs text-[#d4d4d8]">
              <li>
                <NextLink href="/menu?category=arabian-mandi" className="hover:text-[#fceda2] transition-colors">
                  Faham Smoked Chicken Mandi
                </NextLink>
              </li>
              <li>
                <NextLink href="/menu?category=arabian-mandi" className="hover:text-[#fceda2] transition-colors">
                  Juicy Mutton Ribs Mandi
                </NextLink>
              </li>
              <li>
                <NextLink href="/menu?category=chicken-starters" className="hover:text-[#fceda2] transition-colors">
                  Shish Taouk & Charcoal Grills
                </NextLink>
              </li>
              <li>
                <NextLink href="/menu?category=combos-feasts" className="hover:text-[#fceda2] transition-colors">
                  Sultan Communal Feasts
                </NextLink>
              </li>
              <li>
                <NextLink href="/menu?category=desserts" className="hover:text-[#fceda2] transition-colors">
                  Royal Melted Cheese Kunafa
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Col 3: Delivery Areas */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-[#fceda2] text-xs uppercase tracking-wider">
              Serving Locations (15 KM)
            </h4>
            <ul className="space-y-2 text-xs text-[#d4d4d8]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <span>Thagarapuvalasa Town & RTC</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <span>Sangivalasa & NRI Hospital</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <span>Chittivalasa Jute Mill Colony</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <span>Anandapuram Highway Junction</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                <span>Bheemili Beach Road (15 KM)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality & Hospitality */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-[#fceda2] text-xs uppercase tracking-wider">
              Quality & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-[#d4d4d8]">
              <li className="flex items-center gap-1.5 text-[#d4d4d8]">
                <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>100% Halal Certified Meats</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#d4d4d8]">
                <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Ancestral Yemeni Dum Process</span>
              </li>
              <li>
                <NextLink href="/track" className="hover:text-[#fceda2] transition-colors">
                  Contactless Delivery & Live GPS
                </NextLink>
              </li>
              <li>
                <NextLink href="/offers" className="hover:text-[#fceda2] transition-colors">
                  Exclusive Feast Offers & Codes
                </NextLink>
              </li>
              <li>
                <NextLink href="/privacy" className="text-neutral-400 hover:text-white transition-colors">
                  Privacy & FSSAI Standards
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Col 5: Social & Contact */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-[#fceda2] text-xs uppercase tracking-wider">
              Reservations & Support
            </h4>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/918919234567?text=Hello%20Arabian%20Mandi%20Thagarapuvalasa"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="Order on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <div className="w-8 h-8 rounded-full bg-[#18181f] border border-[#272730] text-[#d4af37] flex items-center justify-center hover:border-[#d4af37] transition-colors cursor-pointer">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#18181f] border border-[#272730] text-[#d4af37] flex items-center justify-center hover:border-[#d4af37] transition-colors cursor-pointer">
                <Facebook className="w-4 h-4" />
              </div>
            </div>

            <div className="pt-2 text-xs space-y-1.5 text-[#d4d4d8]">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <span>Opp. Sangivalasa Bus Stop, NH16, Thagarapuvalasa</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                <span className="font-mono font-bold text-[#fceda2]">+91 89192 34567</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                <span>11:00 AM – 11:30 PM (Daily)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-8 pt-8 border-t border-[#272730] text-xs text-[#a1a1aa] space-y-3 font-sans">
          <p className="leading-relaxed font-light">
            S & H Arabian Mandi™ is dedicated to authentic Yemeni culinary excellence. All meats are 100% Halal certified and pit-roasted over acacia charcoal. FSSAI Lic. No: 20124020000124.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[#a1a1aa]">
            <p className="font-cinzel text-[11px]">2024–{new Date().getFullYear()} © S&H Arabian Mandi™ Ltd. All rights reserved.</p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#fceda2] font-cinzel">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <span>Thagarapuvalasa’s Highest Rated Arabian Restaurant (4.8 ★)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

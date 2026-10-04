import React from 'react';
import NextLink from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-mandi-card border-t border-mandi-border text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-700 p-0.5 shadow-gold-sm">
                <div className="w-full h-full bg-mandi-card rounded-[10px] flex items-center justify-center text-gold-400 font-heading font-black text-xl">
                  AM
                </div>
              </div>
              <span className="font-heading text-xl font-bold text-white tracking-tight">
                ARABIAN MANDI
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              The premier destination for authentic Yemeni & Arabian Mandi in Thagarapuvalasa.
              Smoked long-grain basmati, charcoal roasted faham chicken, tender juicy mutton,
              signature toum, and artisanal royal kunafa delivered straight to your door.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/918919234567?text=Hello%20Arabian%20Mandi%20Thagarapuvalasa"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Support
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase text-xs text-gold-400">
              Explore Menu
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <NextLink href="/menu?category=arabian-mandi" className="hover:text-gold-400 transition-colors">
                  Signature Arabian Mandi
                </NextLink>
              </li>
              <li>
                <NextLink href="/menu?category=chicken-starters" className="hover:text-gold-400 transition-colors">
                  Faham & Shish Taouk Kebabs
                </NextLink>
              </li>
              <li>
                <NextLink href="/menu?category=mutton-delicacies" className="hover:text-gold-400 transition-colors">
                  Juicy Mutton Ribs & Ghee Roast
                </NextLink>
              </li>
              <li>
                <NextLink href="/menu?category=combos-feasts" className="hover:text-gold-400 transition-colors">
                  Sultan Family Feasting Platters
                </NextLink>
              </li>
              <li>
                <NextLink href="/menu?category=desserts" className="hover:text-gold-400 transition-colors">
                  Hot Melted Cheese Kunafa
                </NextLink>
              </li>
              <li>
                <NextLink href="/offers" className="hover:text-gold-400 transition-colors">
                  Active Coupons & Discount Offers
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase text-xs text-gold-400">
              Delivery Coverage (15 KM)
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                <span>Thagarapuvalasa Town & RTC Complex</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                <span>Sangivalasa & NRI Hospital Campus</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                <span>Chittivalasa & Jute Mill Colony</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                <span>Anandapuram NH16 Junction</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                <span>Bheemunipatnam (Bheemili Beach Road)</span>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase text-xs text-gold-400">
              Restaurant Location
            </h4>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <span>NH16 National Highway, Opposite Sangivalasa Bus Stop, Thagarapuvalasa, Andhra Pradesh 531162</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>+91 89192 34567</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>orders@arabianmandi.in</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>11:00 AM – 11:30 PM (Daily)</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-mandi-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Arabian Mandi Restaurant, Thagarapuvalasa. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <NextLink href="/about" className="hover:text-gold-400">Our Story</NextLink>
            <NextLink href="/contact" className="hover:text-gold-400">Contact & Support</NextLink>
            <NextLink href="/track" className="hover:text-gold-400">Live GPS Tracking</NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

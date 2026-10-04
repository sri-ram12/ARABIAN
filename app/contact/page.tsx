'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-gold-400 font-bold text-xs uppercase tracking-wider">
          Visit Us or Get in Touch
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-white">
          Contact Arabian Mandi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Located conveniently on NH16 at Thagarapuvalasa, Andhra Pradesh. We welcome dine-in guests and deliver within a 15 km radius.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-mandi-card border border-mandi-border rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-heading font-bold text-base text-white border-b border-mandi-border pb-3">
              Restaurant Details
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Our Location</strong>
                  <span>NH16 National Highway, Opposite Sangivalasa Bus Stop, Thagarapuvalasa, Andhra Pradesh 531162</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <div>
                  <strong className="text-white block text-sm">Direct Phone Order Line</strong>
                  <span>+91 89192 34567</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <div>
                  <strong className="text-white block text-sm">Email Address</strong>
                  <span>orders@arabianmandi.in</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <div>
                  <strong className="text-white block text-sm">Operating Hours</strong>
                  <span>11:00 AM – 11:30 PM (All 7 Days Open)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-mandi-border flex flex-col gap-2.5">
              <a
                href="https://maps.google.com/?q=17.9288,83.4350"
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs tracking-wider text-center shadow-gold-sm hover:brightness-110 flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 stroke-[3]" />
                <span>GET DIRECTIONS (GOOGLE MAPS)</span>
              </a>

              <a
                href="https://wa.me/918919234567?text=Hello%20Arabian%20Mandi%20Thagarapuvalasa"
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold text-center hover:bg-emerald-600/30 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WHATSAPP SUPPORT</span>
              </a>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-mandi-card border border-mandi-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Send Us a Message</h3>
            <p className="text-xs text-slate-400 mt-1">
              For catering inquiries, bulk Mandi platters for functions, or feedback
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you! Your message has been sent to our Thagarapuvalasa team.');
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Kumar"
                  className="w-full px-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  className="w-full px-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Subject *</label>
              <input
                type="text"
                required
                placeholder="Bulk Mandi order for party / function"
                className="w-full px-3 py-2.5 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Message *</label>
              <textarea
                required
                rows={4}
                placeholder="Tell us what you need..."
                className="w-full p-3 rounded-xl bg-mandi-surface border border-mandi-border text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs tracking-wider shadow-gold-sm hover:brightness-110 flex items-center gap-2"
            >
              <Send className="w-4 h-4 stroke-[3]" />
              <span>SEND MESSAGE</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

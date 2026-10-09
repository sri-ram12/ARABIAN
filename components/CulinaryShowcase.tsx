'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Flame,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  CheckCircle2,
  Users,
} from 'lucide-react';
import FieryEmbers from './FieryEmbers';
import FoodModal from './FoodModal';

interface CulinaryShowcaseProps {
  onSelectItem?: (item: any) => void;
  className?: string;
}

export default function CulinaryShowcase({ onSelectItem, className = '' }: CulinaryShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'reel' | 'dum' | 'tandoor' | 'wok' | 'kunafa'>('reel');
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setVideoPlaying(false);
    }
  };

  const toggleVideoSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setVideoMuted(videoRef.current.muted);
  };

  const stories = [
    {
      id: 'reel',
      title: 'Tandoori Sizzle Reel',
      subtitle: 'Spice That Lingers • Flavours That Last',
      tag: '🔥 SOCIAL MEDIA HIT',
      dishName: 'Tandoori Mandi & Chicken Tikka',
      price: '₹220',
      dishSlug: 'tandoori-mandi',
      steps: [
        'Clay tandoor oven charred chicken basted in butter and sumac',
        'Kinetic floating sizzler platter with rising hot spiced steam',
        'Layered over authentic fragrant smoked basmati mandi rice',
        'Served piping hot with whipped garlic toum and red dakkoos salsa',
      ],
    },
    {
      id: 'dum',
      title: 'Yemeni Coal-Dum Smoking',
      subtitle: 'The Soul of Authentic Mandi',
      tag: '👑 800-YEAR HERITAGE',
      dishName: 'Juicy Mandi & Mutton Mandi',
      price: '₹260',
      dishSlug: 'juicy-mandi',
      image: '/images/showcase/mandi_coal_dum.jpg',
      steps: [
        'Aged long-grain basmati parboiled with whole Yemeni spices & ghee',
        'A glowing red-hot burning charcoal lump placed in silver bowl inside deg',
        'Pure desi ghee poured onto coal to release dense aromatic smoke',
        'Pot sealed airtight for 30 minutes to trap the smoke into every grain',
      ],
    },
    {
      id: 'tandoor',
      title: 'Clay Pit Skewer Roasting',
      subtitle: 'Charcoal Kissed Kebabs',
      tag: '⚡ 800°F CLAY OVEN',
      dishName: 'Chicken Tikka & Tangdi Kebab',
      price: '₹180',
      dishSlug: 'chicken-tikka-4pcs',
      image: '/images/showcase/tandoor_skewers.jpg',
      steps: [
        'Fresh chicken marinated 8 hours in thick yogurt, Kashmiri chili & hawaij',
        'Threaded on heavy stainless steel skewers and lowered into burning pit',
        'Slow roasted directly over white-hot hardwood lump charcoal embers',
        'Basted with ghee and lemon juice for blistered, juicy charred perfection',
      ],
    },
    {
      id: 'wok',
      title: 'Flaming Wok Starters Toss',
      subtitle: 'High Flame Explosive Heat',
      tag: '🌶️ SIZZLING HEAT',
      dishName: 'Chicken 65 & Chilli Wings',
      price: '₹170',
      dishSlug: 'chicken-65-starter',
      image: '/images/showcase/flaming_wok_toss.jpg',
      steps: [
        'Crispy battered chicken fried to golden crunch in small batches',
        'Seasoned black cast-iron wok fired on high burner with leaping flame',
        'Curry leaves, green chilies, cracked garlic & secret masala flashed',
        'Crisp chicken tossed vigorously mid-air to coat every single piece',
      ],
    },
    {
      id: 'kunafa',
      title: 'Royal Kunafa Cheese Pull',
      subtitle: 'Hot, Stretchy & Heavenly',
      tag: '✨ SWEET FINALE',
      dishName: 'Royal Cheese Kunafa',
      price: '₹249',
      dishSlug: 'royal-cheese-kunafa',
      image: '/images/showcase/royal_kunafa_stretch.jpg',
      steps: [
        'Fine kataifi shredded vermicelli buttered and pressed into copper pan',
        'Stuffed generously with sweet stretchy fresh Arabian cheese layer',
        'Baked on live gas flames until crisp, crunchy, and deep amber golden',
        'Drenched in boiling hot rose & cardamom sugar syrup and pistachios',
      ],
    },
  ];

  const currentStory = stories.find((s) => s.id === activeTab) || stories[0];

  const handleOrder = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success && data.items) {
        const found = data.items.find((i: any) => i.slug === currentStory.dishSlug) || data.items[0];
        if (onSelectItem) {
          onSelectItem(found);
        } else {
          setSelectedFood(found);
        }
      }
    } catch (e) {
      window.location.href = '/menu';
    }
  };

  return (
    <section className={`relative rounded-3xl overflow-hidden border border-orange-500/30 bg-gradient-to-b from-[#140e08] via-mandi-card to-[#0d0905] p-6 sm:p-10 shadow-2xl ${className}`}>
      {/* Floating rising fiery embers across showcase */}
      <FieryEmbers count={20} className="opacity-75" />

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-red-600/15 via-orange-500/20 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 relative z-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-950 to-amber-950 border border-orange-500/40 text-orange-300 text-xs font-bold shadow-md">
          <Flame className="w-4 h-4 text-orange-500 animate-flame" />
          <span>S & H LIVE CULINARY MAKING PROCESS & STORIES</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          The Craft Behind The <span className="fire-gradient-text">FIERY FLAVOURS</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
          Witness our authentic Yemeni coal-dum smoking, 800°F clay pit kebab roasting, and flaming wok tosses.
          Every dish is crafted with fire, smoke, and royal heritage.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none relative z-20">
        {stories.map((story) => {
          const isActive = activeTab === story.id;
          return (
            <button
              key={story.id}
              onClick={() => setActiveTab(story.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-[0_0_20px_rgba(255,106,0,0.5)] scale-105'
                  : 'bg-mandi-surface/90 border border-mandi-border text-slate-300 hover:text-white hover:border-orange-500/40'
              }`}
            >
              {story.id === 'reel' && <Play className="w-3.5 h-3.5 fill-current" />}
              {story.id === 'dum' && <span>💨</span>}
              {story.id === 'tandoor' && <span>🍢</span>}
              {story.id === 'wok' && <span>🔥</span>}
              {story.id === 'kunafa' && <span>🧀</span>}
              <span>{story.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">
        {/* Left: Visual Media (Vertical 9:16 Video Reel or Process Motion Art) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative aspect-[9/15] w-full max-w-xs sm:max-w-sm rounded-3xl overflow-hidden border-2 border-orange-500/50 bg-black shadow-[0_0_35px_rgba(255,106,0,0.35)] group fiery-border-glow">
            {activeTab === 'reel' ? (
              // Live Video Reel from Pinterest
              <div className="relative w-full h-full cursor-pointer" onClick={toggleVideoPlay}>
                <video
                  ref={videoRef}
                  src="/videos/fire_food_reel.mp4"
                  poster="/videos/fire_food_poster.jpg"
                  loop
                  muted={videoMuted}
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Sound Toggle */}
                <div className="absolute top-3.5 right-3.5 z-30">
                  <button
                    type="button"
                    onClick={toggleVideoSound}
                    aria-label={videoMuted ? 'Unmute video audio' : 'Mute video audio'}
                    className="p-2 rounded-full bg-black/70 hover:bg-orange-600 text-white border border-white/20 backdrop-blur-md transition-colors shadow-lg active:scale-90"
                  >
                    {videoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
                  </button>
                </div>

                {/* Pause/Play Overlay */}
                {!videoPlaying && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Motion Process Poster with Floating Steam & Flame Effects
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={currentStory.image || '/videos/fire_food_poster.jpg'}
                  alt={currentStory.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Animated Rising Steam Wisps */}
                <div className="steam-particle" style={{ bottom: '35%', left: '40%', width: '70px', height: '70px', animationDelay: '0s' }} />
                <div className="steam-particle" style={{ bottom: '40%', left: '50%', width: '90px', height: '90px', animationDelay: '1.2s' }} />
                <div className="steam-particle" style={{ bottom: '30%', left: '30%', width: '60px', height: '60px', animationDelay: '2.1s' }} />

                {/* Floating rising embers */}
                <FieryEmbers count={12} className="opacity-90" />
              </div>
            )}

            {/* Bottom Overlay Label */}
            <div className="absolute bottom-4 left-4 right-4 z-20 p-3.5 rounded-2xl bg-black/80 backdrop-blur-md border border-orange-500/30">
              <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {currentStory.tag}
              </span>
              <h4 className="font-heading font-black text-white text-sm sm:text-base leading-tight mt-0.5">
                {currentStory.dishName}
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">{currentStory.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Right: Step-by-Step Making Process & Culinary Story */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400">
              {currentStory.tag}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
              {currentStory.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {currentStory.subtitle}
            </p>
          </div>

          {/* 4-Step Making Process Timeline */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Step-by-Step Kitchen Process:
            </span>
            <div className="space-y-2.5">
              {currentStory.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-mandi-surface/90 border border-mandi-border hover:border-orange-500/50 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 font-black text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Portion Availability & Order CTA */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-mandi-card to-amber-950/40 border border-orange-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-slate-400">Available Daily Fresh:</div>
              <div className="font-heading font-black text-lg text-white">
                {currentStory.dishName}
              </div>
              <div className="text-xs font-bold text-gold-400 mt-0.5">
                Solo from {currentStory.price} • Duo • Trio • Squad
              </div>
            </div>

            <button
              type="button"
              onClick={handleOrder}
              className="py-3 px-6 rounded-xl fire-btn text-white font-heading font-black text-xs tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 fire-glow"
            >
              <Flame className="w-4 h-4 text-white animate-flame" />
              <span>CUSTOMIZE & ORDER</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* Food Customization Modal */}
      <FoodModal item={selectedFood} onClose={() => setSelectedFood(null)} />
    </section>
  );
}

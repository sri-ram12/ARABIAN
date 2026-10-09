'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play, Pause, Flame, Sparkles, ArrowRight, Maximize2 } from 'lucide-react';
import FieryEmbers from './FieryEmbers';

interface SizzlerReelCardProps {
  onOrderClick?: () => void;
  className?: string;
}

export default function SizzlerReelCard({ onOrderClick, className = '' }: SizzlerReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Attempt auto play
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div
      className={`relative mx-auto max-w-sm sm:max-w-md w-full rounded-3xl overflow-hidden border-2 border-orange-500/50 bg-[#0d0905] shadow-[0_0_40px_rgba(255,106,0,0.35)] group select-none fiery-border-glow ${className}`}
    >
      {/* Floating rising glowing embers over the reel */}
      <FieryEmbers count={14} className="opacity-80" />

      {/* Video Container (aspect 9/16 vertical social reel) */}
      <div className="relative aspect-[9/14] sm:aspect-[9/15] w-full overflow-hidden bg-gradient-to-b from-orange-600/20 via-black to-black cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src="/videos/fire_food_reel.mp4"
          poster="/videos/fire_food_poster.jpg"
          loop
          muted={isMuted}
          playsInline
          autoPlay
          onLoadedData={() => setIsLoaded(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Top Badges & Controls Overlay */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-orange-500/40 text-orange-300 text-xs font-bold pointer-events-auto shadow-md">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-flame" />
            <span>S & H TANDOOR SIZZLE</span>
          </div>

          {/* Sound Mute/Unmute Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            className="p-2 rounded-full bg-black/70 hover:bg-orange-600 text-white border border-white/20 backdrop-blur-md pointer-events-auto transition-colors shadow-lg active:scale-90"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
          </button>
        </div>

        {/* Center Pause/Play Indicator (fades when playing) */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity">
            <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg transform scale-100 transition-transform">
              <Play className="w-6 h-6 ml-1 fill-white" />
            </div>
          </div>
        )}

        {/* Ambient bottom gradient for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />

        {/* Bottom Interactive Order & Feature Card */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 space-y-2 pointer-events-auto">
          <div className="p-3.5 rounded-2xl bg-mandi-card/90 backdrop-blur-md border border-orange-500/30 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Charcoal Smoked Platter
                </span>
                <h4 className="font-heading font-black text-white text-sm sm:text-base leading-tight mt-0.5">
                  Chicken Tikka & Tandoori Mandi
                </h4>
                <p className="text-[11px] text-slate-300">Spice that Lingers • Flavours that Last</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Starting at</span>
                <span className="font-heading font-black text-lg text-gold-400">₹180</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-mandi-border/80 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOrderClick) {
                    onOrderClick();
                  } else {
                    window.location.href = '/menu';
                  }
                }}
                className="flex-1 py-2 px-3 rounded-xl fire-btn text-white text-xs font-black tracking-wide flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
              >
                <Flame className="w-3.5 h-3.5 animate-flame" />
                <span>ORDER SIZZLER NOW</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live in S&H Kitchen
            </span>
            <span>Tap video to {isPlaying ? 'pause' : 'play'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

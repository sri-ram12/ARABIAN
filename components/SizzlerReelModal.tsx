'use client';

import React from 'react';
import { X } from 'lucide-react';
import SizzlerReelCard from './SizzlerReelCard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectDish?: (dish: any) => void;
}

export default function SizzlerReelModal({ isOpen, onClose, onSelectDish }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-sm sm:max-w-md w-full">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 z-30 p-2 rounded-full bg-black/80 text-white hover:bg-orange-600 transition-colors border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        <SizzlerReelCard
          onOrderClick={() => {
            onClose();
            if (onSelectDish) onSelectDish(null);
          }}
        />
      </div>
    </div>
  );
}

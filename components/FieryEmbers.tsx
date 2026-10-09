'use client';

import React, { useMemo } from 'react';

interface FieryEmbersProps {
  count?: number;
  className?: string;
}

export default function FieryEmbers({ count = 24, className = '' }: FieryEmbersProps) {
  // Generate random static particles to avoid hydration mismatches
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = ((i * 137.5) % 100).toFixed(1); // golden ratio distribution
      const duration = (3.5 + ((i * 7) % 4) * 0.8).toFixed(2);
      const delay = (((i * 11) % 15) * 0.35).toFixed(2);
      const size = (3 + ((i * 5) % 5)).toString();
      const drift = (((i * 9) % 40) - 20).toString();
      const hue = i % 3 === 0 ? '#ff3b00' : i % 3 === 1 ? '#ff8c00' : '#ffd000';

      return {
        id: i,
        left: `${left}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        size: `${size}px`,
        drift: `${drift}px`,
        hue,
      };
    });
  }, [count]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none z-10 ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="ember-particle"
          style={
            {
              left: p.left,
              bottom: '-10px',
              width: p.size,
              height: p.size,
              '--duration': p.duration,
              '--delay': p.delay,
              '--drift': p.drift,
              background: `radial-gradient(circle, #fff 10%, ${p.hue} 60%, transparent 100%)`,
              boxShadow: `0 0 10px ${p.hue}, 0 0 20px ${p.hue}`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

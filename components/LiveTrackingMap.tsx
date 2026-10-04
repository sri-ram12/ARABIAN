'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Bike, MapPin, Store, Navigation } from 'lucide-react';

interface Props {
  restaurantLat: number;
  restaurantLng: number;
  restaurantName?: string;
  customerLat: number;
  customerLng: number;
  customerAddress?: string;
  riderLat?: number | null;
  riderLng?: number | null;
  riderName?: string;
  status: string;
}

export default function LiveTrackingMap({
  restaurantLat,
  restaurantLng,
  restaurantName = 'Arabian Mandi',
  customerLat,
  customerLng,
  customerAddress = 'Customer Location',
  riderLat,
  riderLng,
  riderName = 'Delivery Partner',
  status,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const riderMarkerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Dynamically load leaflet on the client side
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      // Clear previous map if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center halfway between restaurant and customer
      const centerLat = (restaurantLat + customerLat) / 2;
      const centerLng = (restaurantLng + customerLng) / 2;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 14,
        zoomControl: true,
      });

      // Dark theme map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Custom icon generators
      const createIcon = (bgClass: string, text: string) =>
        L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="background: ${bgClass}; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 3px solid #14161a; box-shadow: 0 4px 14px rgba(0,0,0,0.5);">
              ${text}
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

      // 1. Restaurant Marker
      const restIcon = createIcon('#D4AF37', '🏰');
      L.marker([restaurantLat, restaurantLng], { icon: restIcon })
        .addTo(map)
        .bindPopup(`<strong>${restaurantName}</strong><br/>NH16 Thagarapuvalasa`);

      // 2. Customer Marker
      const custIcon = createIcon('#10B981', '🏠');
      L.marker([customerLat, customerLng], { icon: custIcon })
        .addTo(map)
        .bindPopup(`<strong>Delivery Destination</strong><br/>${customerAddress}`);

      // 3. Route Polyline
      const routePoints: [number, number][] = [
        [restaurantLat, restaurantLng],
        [centerLat + 0.001, centerLng - 0.001],
        [customerLat, customerLng],
      ];

      L.polyline(routePoints, {
        color: '#D4AF37',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.85,
      }).addTo(map);

      // 4. Rider Marker if Out for Delivery
      if (status === 'OUT_FOR_DELIVERY' && riderLat && riderLng) {
        const riderIcon = L.divIcon({
          className: 'custom-rider-marker',
          html: `
            <div class="rider-pulse" style="background: #E65100; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid #D4AF37;">
              🛵
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const rMarker = L.marker([riderLat, riderLng], { icon: riderIcon })
          .addTo(map)
          .bindPopup(`<strong>${riderName}</strong><br/>Out for delivery!`);

        riderMarkerRef.current = rMarker;
      }

      // Fit map bounds to show all markers
      const bounds = L.latLngBounds([
        [restaurantLat, restaurantLng],
        [customerLat, customerLng],
        ...(riderLat && riderLng ? [[riderLat, riderLng] as [number, number]] : []),
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });

      mapInstanceRef.current = map;
      if (isMounted) setIsLoaded(true);
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [restaurantLat, restaurantLng, customerLat, customerLng, status]);

  // Update Rider position smoothly when new coordinates arrive
  useEffect(() => {
    if (
      riderMarkerRef.current &&
      status === 'OUT_FOR_DELIVERY' &&
      riderLat &&
      riderLng
    ) {
      riderMarkerRef.current.setLatLng([riderLat, riderLng]);
    }
  }, [riderLat, riderLng, status]);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-mandi-border shadow-2xl bg-mandi-card">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 bg-mandi-card/90 backdrop-blur-md border border-mandi-border px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-semibold text-white">Thagarapuvalasa Delivery Route</span>
      </div>

      {status === 'OUT_FOR_DELIVERY' && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-mandi-card/95 backdrop-blur-md border border-gold-500/40 p-3 rounded-xl shadow-gold-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center">
              <Bike className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{riderName} is on the way</div>
              <div className="text-[11px] text-slate-400">Broadcasting live GPS location via NH16</div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30">
            Live Moving
          </span>
        </div>
      )}
    </div>
  );
}

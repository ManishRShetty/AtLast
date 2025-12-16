'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { TargetLocation } from '../types';
import { TILE_LAYERS, TILE_ATTRIBUTION } from '../constants';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CommandMapProps {
  onMapClick: (lat: number, lng: number) => void;
  interactive: boolean;
  targetLocation?: TargetLocation;
  isDark: boolean;
}

// Component to handle map click events
function MapClickHandler({ onClick, interactive }: { onClick: (lat: number, lng: number) => void; interactive: boolean }) {
  useMapEvents({
    click: (e) => {
      if (interactive) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Custom marker component for target location
function CustomMarker({ position }: { position: [number, number] }) {
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative flex flex-col items-center">
        <div class="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-ping absolute"></div>
        <div class="relative z-10 bg-red-500 text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div class="mt-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold shadow-xl border border-black/5 text-black transform translate-y-1">
          TARGET CONFIRMED
        </div>
      </div>
    `,
    iconSize: [40, 80],
    iconAnchor: [20, 80],
  });

  return <Marker position={position} icon={customIcon} />;
}

export const CommandMap: React.FC<CommandMapProps> = ({ onMapClick, interactive, targetLocation, isDark }) => {
  return (
    <div className="w-full h-full bg-zinc-900 transition-colors duration-500">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ width: '100%', height: '100%', cursor: interactive ? 'crosshair' : 'default' }}
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          url={isDark ? TILE_LAYERS.DARK : TILE_LAYERS.LIGHT}
          attribution={TILE_ATTRIBUTION}
        />

        <MapClickHandler onClick={onMapClick} interactive={interactive} />

        {targetLocation && (
          <CustomMarker position={[targetLocation.lat, targetLocation.lng]} />
        )}
      </MapContainer>
    </div>
  );
};
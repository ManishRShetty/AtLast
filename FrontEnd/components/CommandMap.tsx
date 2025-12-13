'use client';

import React from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import { TargetLocation } from '../types';
import { DEFAULT_MAPBOX_TOKEN, MAP_STYLES } from '../constants';
import { MapPin } from 'lucide-react';

interface CommandMapProps {
  onMapClick: (lat: number, lng: number) => void;
  interactive: boolean;
  targetLocation?: TargetLocation;
  isDark: boolean;
}

export const CommandMap: React.FC<CommandMapProps> = ({ onMapClick, interactive, targetLocation, isDark }) => {
  return (
    <div className="w-full h-full bg-zinc-900 transition-colors duration-500">
      <Map
        mapboxAccessToken={DEFAULT_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 0,
          latitude: 20,
          zoom: 1.8
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={isDark ? MAP_STYLES.DARK : MAP_STYLES.LIGHT}
        projection={{ name: 'globe' } as any}
        fog={isDark ? {
          color: 'rgb(20, 20, 30)',
          'high-color': 'rgb(0, 0, 0)',
          'horizon-blend': 0.2,
          'space-color': 'rgb(0, 0, 0)',
          'star-intensity': 0.5
        } as any : {
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 230, 255)',
          'horizon-blend': 0.2,
          'space-color': 'rgb(240, 240, 240)',
          'star-intensity': 0
        } as any}
        onClick={(e) => {
          if (interactive) {
            onMapClick(e.lngLat.lat, e.lngLat.lng);
          }
        }}
        cursor={interactive ? 'crosshair' : 'default'}
      >
        {/* Only show nav controls if we have a token, though Mapbox usually handles this safely */}
        <NavigationControl position="bottom-right" showCompass={false} />

        {targetLocation && (
          <Marker longitude={targetLocation.lng} latitude={targetLocation.lat} anchor="bottom">
            <div className="relative flex flex-col items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-ping absolute"></div>
              <div className="relative z-10 bg-red-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
                <MapPin size={20} className="fill-current" />
              </div>
              <div className="mt-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold shadow-xl border border-black/5 text-black transform translate-y-1">
                TARGET CONFIRMED
              </div>
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
};
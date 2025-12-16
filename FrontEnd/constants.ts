import { TargetLocation } from './types';

// Leaflet tile layer URLs for different themes
export const TILE_LAYERS = {
  DARK: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  LIGHT: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
};

export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
export const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
export const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoibWF0Y2hpbmciLCJhIjoiY2tmb212M2JyMDFwZjJ2b2xwZ2x2Z2ZyZSJ9.6G6G6G6G6G6G6G6G6G6G6G';
export const TARGETS: TargetLocation[] = [
  { id: '1', name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { id: '2', name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  { id: '3', name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { id: '4', name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
  { id: '5', name: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729 },
  { id: '6', name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { id: '7', name: 'Moscow, Russia', lat: 55.7558, lng: 37.6173 },
  { id: '8', name: 'Reykjavik, Iceland', lat: 64.1265, lng: -21.8174 },
  { id: '9', name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241 },
  { id: '10', name: 'Mumbai, India', lat: 19.0760, lng: 72.8777 }
];
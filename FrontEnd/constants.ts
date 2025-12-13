import { TargetLocation } from './types';

// NOTE: Replace this with your valid Mapbox Public Token in .env.local
export const DEFAULT_MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbHlz..._YOUR_TOKEN_HERE';

export const MAP_STYLES = {
  DARK: "mapbox://styles/mapbox/dark-v11",
  LIGHT: "mapbox://styles/mapbox/light-v11",
  SATELLITE: "mapbox://styles/mapbox/satellite-streets-v12"
};

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
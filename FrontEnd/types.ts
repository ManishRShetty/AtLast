export interface TargetLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export type GameState = 'IDLE' | 'SEARCHING' | 'RESOLVED';

export interface LogMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'alert' | 'success' | 'error';
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}
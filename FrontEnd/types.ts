export interface TargetLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export type GameState = 'IDLE' | 'BRIEFING' | 'SEARCHING' | 'RESOLVED';

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

// Backend API Types
export interface SessionResponse {
  session_id: string;
  status: string;
  message: string;
}

export interface RiddleData {
  riddle: string;
  answer: string;
  difficulty: string;
  topic: string;
}

export interface QuestionResponse {
  status: 'ready' | 'processing';
  data?: RiddleData;
  queue_status?: string;
  message?: string;
  retry_after?: number;
}
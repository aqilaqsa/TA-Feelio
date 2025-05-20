// src/types.ts

export type UserSegment = '7-9' | '10-12';

export interface User {
  id: number;
  name: string;
  email: string;
  segment: '7-9' | '10-12';
  role: 'kid' | 'pendamping';
  createdAt: string;
  totalScore: number;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  segment?: UserSegment;
  role?: 'kid' | 'pendamping'; // ✅ Add this line
}

export interface Narrative {
  id: string; // character varying(10)
  title: string;
  content: string;
  image_path: string;
  emotion_labels: Emotion[]; // array of emotion strings
  segment: number;
}

export type Emotion =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'embarrassed'
  | 'fear'
  | 'envy'
  | string; // in case backend sends lowercase or typoed data

export interface ResponseRecord {
  id: number;
  user_id: number;
  narrative_id: string;
  user_answer: string;
  predicted_emotion: Emotion[];
  is_correct: boolean;
  score: number;
  feedback?: string;
  created_at: string;
}

export interface Badge {
  id: number;
  name: string;
  description?: string;
  points: number;
}

export interface UserBadge {
  id: number;
  user_id: number;
  badge_id: number;
  date_earned: string;
  badge?: Badge; // populated in some API responses
}

// For signup/login
export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  segment?: UserSegment;
}

export type UserSegment = '7-9' | '10-12';

export interface User {
  id: string;
  name: string;
  email: string;
  segment: UserSegment;
  totalScore: number;
  createdAt: string;
}

export interface Narrative {
  id: string;
  text: string;
  isYoungSegment: boolean;
  expectedEmotions: Emotion[];
  createdAt: string;
}

export type Emotion = 'happy' | 'sad' | 'angry' | 'jealous' | 'embarrassed' | 'scared';

export interface Session {
  id: string;
  userId: string;
  narrativeId: string;
  userAnswer: string;
  predictedEmotion: Emotion[];
  feedback: string;
  score: number;
  timestamp: string;
}

export interface Achievement {
  id: string;
  userId: string;
  badge: Badge;
  points: number;
  dateEarned: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  segment?: UserSegment;
}
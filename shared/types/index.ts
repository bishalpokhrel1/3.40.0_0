// Shared types across all platforms

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface UserPreferences {
  interests: string[];
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language?: string;
  timezone?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags?: string[];
  aiSuggestions?: string[];
}

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  aiSummary?: string;
  relevanceScore?: number;
  tags?: string[];
  userId: string;
  userRating?: 'up' | 'down';
  bookmarked?: boolean;
  readAt?: string;
}

export interface AIResponse {
  text: string;
  confidence: number;
  tokens: number;
}

export interface WeatherData {
  condition: string;
  temperature: number;
  description: string;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
}

// Platform-specific types
export type Platform = 'web' | 'ios' | 'android' | 'extension';

export interface PlatformConfig {
  platform: Platform;
  features: {
    weather: boolean;
    ai: boolean;
    notifications: boolean;
    backgroundSync: boolean;
  };
}
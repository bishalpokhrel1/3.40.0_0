// App-wide constants

export const APP_NAME = 'Manage';
export const APP_VERSION = '1.0.0';

// API Endpoints
export const API_ENDPOINTS = {
  FIREBASE_AUTH: 'https://identitytoolkit.googleapis.com/v1',
  FIREBASE_FIRESTORE: 'https://firestore.googleapis.com/v1',
  GEMINI_API: 'https://generativelanguage.googleapis.com/v1beta',
  WEATHER_API: 'https://api.openweathermap.org/data/2.5'
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'userPreferences',
  TASKS: 'tasks',
  FEED_CACHE: 'feedCache',
  AUTH_TOKEN: 'authToken',
  THEME: 'theme'
};

// Default Values
export const DEFAULT_INTERESTS = [
  'technology',
  'science',
  'business',
  'health',
  'entertainment'
];

export const PRIORITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b', 
  high: '#ef4444'
};

export const THEME_COLORS = {
  light: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937'
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#9ca3af',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb'
  }
};

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 200,
  medium: 300,
  slow: 500
};

// AI Configuration
export const AI_CONFIG = {
  MAX_TOKENS: 1024,
  TEMPERATURE: 0.7,
  MODEL_NAME: 'gemini-nano'
};
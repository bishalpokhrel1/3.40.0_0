import { create } from 'zustand';
import type { 
  AIModelStatus,
  LanguageModelSession
} from './nanoAIService';

interface GeminiNanoState {
  currentSession: LanguageModelSession | null;
  isAvailable: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  error: string | null;
  checkAvailability: () => Promise<AIModelStatus>;
  initializeModel: () => Promise<void>;
  generateResponse: (prompt: string) => Promise<string>;
  cleanup: () => void;
}

export const useGeminiNano = create<GeminiNanoState>((set, get) => ({
  currentSession: null,
  isAvailable: false,
  isDownloading: false,
  downloadProgress: 0,
  error: null,

  checkAvailability: async () => {
    // Hackathon-ready: disable real availability checks
    return 'unavailable';
  },

  initializeModel: async () => {
    // No-op in hackathon placeholder mode
    return;
  },

  generateResponse: async (prompt: string) => {
    // Return placeholder
    return `AI placeholder: ${prompt.slice(0, 160)}...`;
  },

  cleanup: () => {
    set({ currentSession: null });
  }
}));

import { create } from 'zustand';
import type { NanoAIResponse } from '../services/geminiService';
import { generateResponse, summarizeContent } from '../services/geminiService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface SidePanelState {
  currentSummary: string | null;
  chatMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  
  summarizePage: () => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  setSummary: (summary: string) => void;
  setError: (error: string | null) => void;
}

interface PageContentResponse {
  content: string;
}

export const useSidePanelStore = create<SidePanelState>((set, get) => ({
  currentSummary: null,
  chatMessages: [],
  isLoading: false,
  error: null,

  setError: (error: string | null) => set({ error }),
  setSummary: (summary: string) => set({ currentSummary: summary }),
  clearChat: () => set({ chatMessages: [] }),

  summarizePage: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Request page content from content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) {
        throw new Error('No active tab found');
      }
      
      const response = await chrome.tabs.sendMessage<any, PageContentResponse>(tab.id, { 
        action: 'getPageContent' 
      });
      
      if (response?.content) {
        const result: NanoAIResponse = await summarizeContent(response.content);
        set({ currentSummary: result.text });
      } else {
        set({ currentSummary: 'No content available to summarize on this page.' });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Failed to summarize page:', errorMessage);
      set({ 
        currentSummary: 'Failed to analyze page content.',
        error: errorMessage
      });
    } finally {
      set({ isLoading: false });
    }
  },

  sendChatMessage: async (message: string) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now()
    };
    
    set((state) => ({
      chatMessages: [...state.chatMessages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      const result: NanoAIResponse = await generateResponse(message, get().currentSummary || undefined);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.text,
        timestamp: Date.now()
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, assistantMessage],
        isLoading: false,
        error: null
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Chat error:', errorMessage);
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  }
}));
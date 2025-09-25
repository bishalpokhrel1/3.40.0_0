// Type definitions for Chrome AI API
export interface LanguageModelOptions {
  temperature?: number;
  topK?: number;
  monitor?: (event: { type: string; message: string }) => void;
}

export interface LanguageModelSession {
  prompt: (text: string) => Promise<string>;
}

export interface LanguageModel {
  availability: () => Promise<'ready' | 'downloadable' | 'unavailable'>;
  create: (options?: LanguageModelOptions) => Promise<LanguageModelSession>;
}

export interface ChromeAI {
  languageModel: LanguageModel;
}

// Extend Window interface globally
declare global {
  interface Window {
    readonly ai: ChromeAI;
  }
}

// Type for AI model status
export type AIModelStatus = 'ready' | 'downloadable' | 'unavailable' | 'checking' | 'context-error';

// Service state

export function checkContext(): boolean {
  try {
    // First check if we're in an extension context
    if (!chrome.runtime) {
      console.error('Not running in a Chrome extension context');
      return false;
    }

    // Check if we're in sidepanel.html
    const url = window.location.href;
    if (url.includes('sidepanel.html')) {
      return true;
    }

    // Check if we're in a normal tab context
    if (url.includes('newtab.html')) {
      return true;
    }

    console.error(
      'AI features are only available in the side panel or new tab page.\n' +
      'To use AI features:\n' +
      '1. Right-click the extension icon\n' +
      '2. Select "Show in Side Panel"\n' +
      '   OR\n' +
      '3. Open a new tab to use the dashboard'
    );
    return false;
  } catch (error) {
    console.error('Error checking context:', error);
    return false;
  }
}

export async function checkAvailability(): Promise<AIModelStatus> {
  // Hackathon-ready: always return unavailable to force placeholder paths
  return 'unavailable';
}

export interface AIError extends Error {
  type: 'unavailable' | 'context' | 'initialization' | 'runtime';
  userMessage: string;
}

export async function initializeModel(): Promise<void> {
  // No-op for hackathon placeholder
  return;
}

export async function generateResponse(prompt: string): Promise<string> {
  // Return a placeholder message synchronously
  return `AI placeholder: ${prompt.slice(0, 160)}...`;
}

export async function testConnection(): Promise<boolean> {
  // Always succeed in hackathon mode
  return true;
}

export function cleanup(): void {
  // Cleanup any resources if needed
}

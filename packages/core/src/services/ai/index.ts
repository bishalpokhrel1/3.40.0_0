import { AIService, AIServiceConfig } from './types';
import { ChromeAIService } from './chrome';
import { WebAIService } from './web';

export function createAIService(config: AIServiceConfig): AIService {
  // Try to use Chrome Gemini Nano first if available
  if (typeof window !== 'undefined' && window?.chrome?.ai) {
    try {
      return new ChromeAIService(config);
    } catch (error) {
      console.warn('Failed to initialize Chrome AI service, falling back to web:', error);
    }
  }

  // Fall back to web implementation
  return new WebAIService(config);
}

export type { AIService, AIServiceConfig, AIResponse } from './types';
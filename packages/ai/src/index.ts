import { AIService, AIServiceConfig, AIModelProvider } from './interfaces';
import { OpenAIService } from './openAIService';
import { GoogleAIService } from './googleAIService';

export function createAIService(config: AIServiceConfig): AIService {
  switch (config.provider) {
    case 'openai':
      return new OpenAIService(config);
    case 'google':
      return new GoogleAIService(config);
    case 'local':
      // TODO: Implement local TensorFlow.js based service
      throw new Error('Local AI service not yet implemented');
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
}

export * from './interfaces';
export { OpenAIService } from './openAIService';
export { GoogleAIService } from './googleAIService';
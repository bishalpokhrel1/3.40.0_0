export interface AIResponse {
  text: string;
}

export interface AIService {
  generateResponse(prompt: string): Promise<AIResponse>;
  summarizeContent(content: string): Promise<AIResponse>;
}

export interface AIServiceConfig {
  apiKey?: string;
  endpoint?: string;
}

export abstract class BaseAIService implements AIService {
  protected config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  abstract generateResponse(prompt: string): Promise<AIResponse>;
  abstract summarizeContent(content: string): Promise<AIResponse>;
}
import { AIResponse, AIService, AIServiceConfig, BaseAIService } from './types';

interface GeminiAPIResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class WebAIService extends BaseAIService implements AIService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(config: AIServiceConfig) {
    super(config);
    if (!config.apiKey) {
      throw new Error('API key is required for WebAIService');
    }
    if (!config.endpoint) {
      throw new Error('API endpoint is required for WebAIService');
    }
    this.apiKey = config.apiKey;
    this.apiUrl = config.endpoint;
  }

  private async callAPI(prompt: string): Promise<string> {
    const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: GeminiAPIResponse = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
  }

  async generateResponse(prompt: string): Promise<AIResponse> {
    try {
      const text = await this.callAPI(prompt);
      return { text };
    } catch (error) {
      console.error('AI response generation failed:', error);
      throw error;
    }
  }

  async summarizeContent(content: string): Promise<AIResponse> {
    const summaryPrompt = `Provide a concise summary of the following text:\n\n---\n\n${content}`;
    return this.generateResponse(summaryPrompt);
  }
}
import { AIResponse, AIService, AIServiceConfig, BaseAIService } from './types';

export class ChromeAIService extends BaseAIService implements AIService {
  private session: any = null;

  constructor(config: AIServiceConfig) {
    super(config);
  }

  private async initializeModel() {
    if (this.session) {
      return;
    }

    // Check if Chrome Gemini Nano is available
    if (!window?.chrome?.ai?.createTextSession) {
      throw new Error('Gemini Nano is not available');
    }

    try {
      this.session = await window.chrome.ai.createTextSession();
      console.log('Gemini Nano session initialized ✅');
    } catch (error) {
      console.error('Failed to initialize Gemini Nano session:', error);
      throw error;
    }
  }

  async generateResponse(prompt: string): Promise<AIResponse> {
    await this.initializeModel();

    if (!this.session) {
      throw new Error('AI session is not initialized');
    }

    try {
      const text = await this.session.prompt(prompt);
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
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiConfig {
  /** Gemini API key stored in platform-specific .env files */
  apiKey: string;
  /** Optional model identifier. Defaults to `gemini-pro`. */
  model?: string;
}

export interface GeminiPromptOptions {
  /** Optional context string appended ahead of the prompt. */
  context?: string;
}

export interface GeminiResponse {
  text: string;
  tokens: number;
}

export interface GeminiClient {
  generate(prompt: string, options?: GeminiPromptOptions): Promise<GeminiResponse>;
  summarize(content: string): Promise<GeminiResponse>;
}

/**
 * Creates a Gemini client wrapper that can be shared between the
 * Chrome extension and the mobile workspace. Each platform is responsible for
 * injecting its own API key via environment variables.
 */
export function createGeminiClient(config: GeminiConfig): GeminiClient {
  if (!config.apiKey) {
    throw new Error('Missing Gemini API key. Ensure the .env file is configured.');
  }

  const modelId = config.model ?? 'gemini-pro';
  const client = new GoogleGenerativeAI(config.apiKey);

  const withModel = () => client.getGenerativeModel({ model: modelId });

  return {
    async generate(prompt, options = {}) {
      const model = withModel();
      const promptWithContext = options.context
        ? `Context: ${options.context}\n\nQuestion: ${prompt}`
        : prompt;

      const result = await model.generateContent(promptWithContext);
      const response = await result.response;

      return {
        text: response.text(),
        tokens: response.text().length
      };
    },
    async summarize(content) {
      const model = withModel();
      const result = await model.generateContent(
        `Please provide a concise summary of the following content:\n\n${content}`
      );
      const response = await result.response;

      return {
        text: response.text(),
        tokens: response.text().length
      };
    }
  };
}

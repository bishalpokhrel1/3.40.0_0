import { getAuth } from 'firebase/auth';

export enum AIModelStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIServiceConfig {
  endpoint: string;
  apiKey: string;
}

export interface AIResponse {
  content: string;
  error?: string;
}

export interface LanguageModelSession {
  messages: Message[];
  status: AIModelStatus;
  error: string | null;
}

export async function sendMessage(message: string, config: AIServiceConfig): Promise<AIResponse> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${config.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }],
        model: 'gemini-pro'
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content
    };
  } catch (error) {
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
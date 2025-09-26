import { apiService } from './apiService';

export interface AIResponse {
  text: string;
  tokens: number;
}

export async function generateResponse(prompt: string, context?: string): Promise<AIResponse> {
  try {
    return await apiService.generateResponse(prompt, context);
  } catch (error) {
    console.error('Error generating response with backend AI:', error);
    throw error;
  }
}

export async function summarizeContent(content: string): Promise<AIResponse> {
  try {
    return await apiService.summarizeContent(content);
  } catch (error) {
    console.error('Error summarizing content with backend AI:', error);
    throw error;
  }
}

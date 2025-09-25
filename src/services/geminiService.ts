import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface AIResponse {
  text: string;
  tokens: number;
}

export async function generateResponse(prompt: string, context?: string): Promise<AIResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const promptWithContext = context 
      ? `Context: ${context}\n\nQuestion: ${prompt}`
      : prompt;
    
    const result = await model.generateContent(promptWithContext);
    const response = await result.response;
    
    return {
      text: response.text(),
      tokens: response.text().length // Approximate token count
    };
  } catch (error) {
    console.error('Error generating response with Gemini:', error);
    throw error;
  }
}

export async function summarizeContent(content: string): Promise<AIResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Please provide a concise summary of the following content:\n\n${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      text: response.text(),
      tokens: response.text().length // Approximate token count
    };
  } catch (error) {
    console.error('Error summarizing content with Gemini:', error);
    throw error;
  }
}

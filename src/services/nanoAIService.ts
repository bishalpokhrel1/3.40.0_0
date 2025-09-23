export interface NanoAIResponse {
  text: string;
  tokens: number;
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const MODEL_NAME = import.meta.env.VITE_MODEL_NAME;

// Rate limiting configuration
const MAX_REQUESTS_PER_MINUTE = 60;
const requestTimes: number[] = [];
}

declare global {
  interface Window {
    chrome: {
      ai?: ChromeAI;
    };
  }
}

let modelInitialized = false;

async function initializeModel() {
  if (modelInitialized) return;
  
  try {
    // Check if Chrome AI API is available
    if (!window.chrome?.ai?.generativeContent) {
      throw new Error('Chrome AI API not available');
    }
    modelInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Chrome AI:', error);
    throw error;
  }
}

async function initializeModel() {
  if (modelInitialized) return;

  try {
    textClassifier = await createClassifier();
    modelInitialized = true;
  } catch (error) {
    console.error('Failed to initialize model:', error);
    throw error;
  }
}

function extractResponseFromResult(result: TextClassifierResult): string {
  if (!result.classifications?.length) {
    return 'Could not generate response';
  }

  const firstResult = result.classifications[0];
  const topCategory: Category = firstResult?.categories?.[0];
  return topCategory?.displayName || topCategory?.categoryName || 'Could not generate response';
}

export async function generateResponse(prompt: string, context?: string): Promise<NanoAIResponse> {
  await initializeModel();
  
  if (!textClassifier) {
    throw new Error('Text classifier not initialized');
  }

  try {
    let input = prompt;
    if (context) {
      input = `Context: ${context}\n\nQuestion: ${prompt}`;
    }
    
    const result = await textClassifier.classify(input);
    return {
      text: extractResponseFromResult(result),
      tokens: input.split(/\s+/).length
    };
  } catch (error) {
    console.error('Generation failed:', error);
    throw error;
  }
}

export async function summarizeContent(content: string): Promise<NanoAIResponse> {
  await initializeModel();
  
  if (!textClassifier) {
    throw new Error('Text classifier not initialized');
  }

  try {
    const prompt = `Please provide a concise summary of this content in 3-5 key points:\n\n${content}`;
    const result = await textClassifier.classify(prompt);
    
    return {
      text: extractResponseFromResult(result),
      tokens: prompt.split(/\s+/).length
    };
  } catch (error) {
    console.error('Summarization failed:', error);
    throw error;
  }
}
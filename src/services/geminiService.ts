export interface NanoAIResponse {
  text: string;
  tokens: number;
}

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
  safetySettings?: {
    category: string;
    threshold: string;
  }[];
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

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const MODEL_NAME = import.meta.env.VITE_MODEL_NAME || 'gemini-pro';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta';

// Rate limiting configuration
const MAX_REQUESTS_PER_MINUTE = 60;
const requestTimes: number[] = [];

function checkRateLimit(): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Remove requests older than 1 minute
  while (requestTimes.length > 0 && requestTimes[0] < oneMinuteAgo) {
    requestTimes.shift();
  }
  
  // Check if we're within rate limits
  if (requestTimes.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  requestTimes.push(now);
  return true;
}

async function callGeminiAPI(prompt: string): Promise<string> {
  console.log('Starting Gemini API call with prompt:', prompt);
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again in a moment.');
  }

  try {
    console.log('Making API request to:', `${API_URL}/models/${MODEL_NAME}:generateContent`);
    console.log('API Key available:', !!API_KEY);
    
    // First, try a preflight OPTIONS request
    try {
      const preflightResponse = await fetch(`${API_URL}/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      console.log('Preflight response:', preflightResponse.status, preflightResponse.statusText);
    } catch (preflightError) {
      console.warn('Preflight request failed:', preflightError);
      // Continue with the main request even if preflight fails
    }

    const response = await fetch(
      `${API_URL}/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        } as GeminiRequest)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      throw new Error(`API call failed: ${response.statusText} (${response.status})`);
      
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Check if it's a CORS error
    if (error instanceof TypeError && error.message.includes('CORS')) {
      console.error('CORS ERROR detected. Details:', {
        origin: window.location.origin,
        apiUrl: API_URL,
        error: error.message
      });
      throw new Error('CORS error: The API request was blocked by the browser. Please check the console for more details.');
    }
    
    // Network error
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('Network Error. Details:', {
        origin: window.location.origin,
        apiUrl: API_URL,
        error: error.message
      });
      throw new Error('Network error: Could not connect to the API. Please check your internet connection.');
    }
    
    throw error;
  }
}

let retryCount = 0;
const MAX_RETRIES = 3;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retryCount < MAX_RETRIES && error instanceof Error && !error.message.includes('Rate limit')) {
      retryCount++;
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn);
    }
    throw error;
  } finally {
    retryCount = 0;
  }
}

export async function generateResponse(prompt: string, context?: string): Promise<NanoAIResponse> {
  const enhancedPrompt = context 
    ? `Context: ${context}\n\nQuestion: ${prompt}\n\nPlease provide a helpful response.`
    : prompt;

  try {
    const response = await withRetry(() => callGeminiAPI(enhancedPrompt));
    return {
      text: response,
      tokens: enhancedPrompt.split(/\s+/).length
    };
  } catch (error) {
    console.error('Generation failed:', error);
    throw error;
  }
}

export async function summarizeContent(content: string): Promise<NanoAIResponse> {
  const prompt = `Please provide a concise summary of this content in 3-5 key points:\n\n${content}`;
  
  try {
    const response = await withRetry(() => callGeminiAPI(prompt));
    return {
      text: response,
      tokens: prompt.split(/\s+/).length
    };
  } catch (error) {
    console.error('Summarization failed:', error);
    throw error;
  }
}
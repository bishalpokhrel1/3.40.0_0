/**
 * Defines the structure for the response from our AI service.
 */
export interface NanoAIResponse {
  text: string;
}

declare global {
  namespace chrome.ai {
    function createTextSession(): Promise<AiTextSession>;
  }
}

interface AiTextSession {
  prompt: (text: string) => Promise<string>;
}

interface GeminiAPIResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

// A variable to hold our generative AI session instance.
// We'll initialize this once and reuse it.
let session: AiTextSession | null = null;

// Configuration for the Gemini API fallback
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Get API key from storage
async function getApiKey(): Promise<string> {
  const result = await chrome.storage.sync.get('GEMINI_API_KEY');
  if (!result.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please add it in extension settings.');
  }
  return result.GEMINI_API_KEY;
}

/**
 * Initializes the generative AI model session.
 * It checks if the chrome.ai API is available and creates a text session.
 * This only runs once.
 */
/**
 * Tries to use Gemini Nano if available, otherwise falls back to Gemini API
 */
async function initializeModel() {
  // If the session is already created, do nothing.
  if (session) {
    return;
  }

  // Check if Chrome Gemini Nano is available
  if (window.chrome?.ai?.createTextSession) {
    try {
      session = await window.chrome.ai.createTextSession();
      console.log('Gemini Nano session initialized successfully ✅');
    } catch (error) {
      console.warn('Failed to initialize Gemini Nano, falling back to remote API:', error);
      session = null;
    }
  } else {
    console.warn('Gemini Nano not available - falling back to remote API');
    console.info('To enable Gemini Nano:');
    console.info('1. Use Chrome Canary');
    console.info('2. Enable #prompt-api-for-gemini-nano in chrome://flags');
    console.info('3. Enable #optimization-guide-on-device-model in chrome://flags');
    console.info('4. Update model in chrome://components');
  }
}

/**
 * Calls the remote Gemini API
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = await getApiKey();
  
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
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
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data: GeminiAPIResponse = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
}

/**
 * Generates a response using either Gemini Nano (if available) or remote Gemini API
 *
 * @param prompt The question or instruction for the AI.
 * @returns A promise that resolves to a NanoAIResponse object.
 */
export async function generateResponse(prompt: string): Promise<NanoAIResponse> {
  await initializeModel();
  
  try {
    let responseText: string;

    if (session) {
      // Use Gemini Nano
      console.log('Using Gemini Nano for response');
      responseText = await session.prompt(prompt);
    } else {
      // Fall back to remote API
      console.log('Using remote Gemini API for response');
      responseText = await callGeminiAPI(prompt);
    }
    
    return {
      text: responseText,
    };
  } catch (error) {
    console.error('AI response generation failed:', error);
    throw new Error('Failed to get a response from the AI model.');
  }
}

/**
 * Generates a summary for a given block of content.
 *
 * @param content The text content to be summarized.
 * @returns A promise that resolves to a NanoAIResponse object containing the summary.
 */
export async function summarizeContent(content: string): Promise<NanoAIResponse> {
  // We can reuse the generateResponse function by creating a specific prompt for summarization.
  const summaryPrompt = `Provide a concise summary of the following text:\n\n---\n\n${content}`;
  
  // Call the main generation function with our specialized prompt.
  return generateResponse(summaryPrompt);
}
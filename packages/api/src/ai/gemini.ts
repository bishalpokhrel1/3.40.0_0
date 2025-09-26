import { createGeminiClient, type GeminiResponse } from '@shared/ai/gemini';
import { buildGeminiConfigFromEnv } from '@shared/utils/env';

const geminiClient = createGeminiClient(buildGeminiConfigFromEnv());

const JSON_FALLBACK_SUGGESTIONS = [
  'Break the task into smaller subtasks',
  'Assign a due date and priority',
  'Identify dependencies or blockers'
];

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    return null;
  }
}

export async function summarizeWithGemini(content: string): Promise<GeminiResponse> {
  return geminiClient.summarize(content);
}

export async function generateWithGemini(input: string, context?: string): Promise<GeminiResponse> {
  return geminiClient.generate(
    `You are a productivity assistant. Respond conversationally but concisely.\n\nUser prompt: ${input}`,
    { context }
  );
}

export async function taskSuggestionsWithGemini(input: string): Promise<string[]> {
  const prompt = [
    'You are helping the user plan actionable steps.',
    'Return a concise JSON array of 3-5 suggestion strings for completing the task below.',
    'Only return JSON, no prose.',
    `Task: ${input}`
  ].join('\n');

  const response = await geminiClient.generate(prompt);
  const parsed = safeJsonParse<string[]>(response.text.trim());

  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed.slice(0, 5);
  }

  return response.text
    .split('\n')
    .map(entry => entry.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 5)
    .concat(JSON_FALLBACK_SUGGESTIONS)
    .slice(0, 5);
}

export interface AIAnalysisResult {
  summary: string;
  suggestions: string[];
}

export async function analyzeContentWithGemini(content: string): Promise<AIAnalysisResult> {
  const prompt = [
    'Analyze the provided content and respond strictly as JSON with the shape:',
    '{ "summary": string, "suggestions": string[] }',
    'Summary should be 2-3 sentences. Suggestions should be actionable next steps.',
    'Content to analyze:',
    content
  ].join('\n\n');

  const response = await geminiClient.generate(prompt);
  const parsed = safeJsonParse<AIAnalysisResult>(response.text.trim());

  if (parsed?.summary && Array.isArray(parsed.suggestions)) {
    return parsed;
  }

  return {
    summary: response.text.slice(0, 400),
    suggestions: JSON_FALLBACK_SUGGESTIONS
  };
}

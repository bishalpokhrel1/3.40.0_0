export interface AIResponse {
  text: string;
  tokens: number;
}

export async function generateResponse(prompt: string, context?: string): Promise<AIResponse> {
  const message = context
    ? `AI placeholder response.\nContext provided: ${context.slice(0, 140)}...\nQuestion: ${prompt.slice(0, 140)}...`
    : `AI placeholder response. Question: ${prompt.slice(0, 160)}...`;
  return { text: message + `\n\n(Real AI will be wired post-hackathon)`, tokens: 0 };
}

export async function summarizeContent(content: string): Promise<AIResponse> {
  const preview = content ? content.slice(0, 200) : '';
  const text = `Summary placeholder: This page appears to contain textual content.\n\nKey points (mock):\n- Extracted ${content?.length || 0} characters\n- Preview: \"${preview}\"\n- Real summarization will use Chrome AI APIs later.`;
  return { text, tokens: 0 };
}
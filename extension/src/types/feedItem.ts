export interface FeedItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  aiSummary?: string;
  relevanceScore?: number;
  tags?: string[];
}

export interface AIResponse {
  score: number;
  summary: string;
  tags: string[];
}

export interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
}

export interface AIWindow extends Window {
  ai?: {
    languageModel: {
      create: (config: { systemPrompt: string }) => Promise<{
        prompt: (text: string) => Promise<string>;
      }>;
    };
    summarizer: {
      create: () => Promise<{
        summarize: (text: string) => Promise<string>;
      }>;
    };
  };
}
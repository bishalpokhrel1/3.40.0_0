export interface AIService {
  summarizeContent(content: string): Promise<string>;
  generateTasks(context: string): Promise<string[]>;
  analyzeWorkspaceItem(item: WorkspaceItem): Promise<AIAnalysis>;
  getSuggestions(context: string): Promise<AISuggestion[]>;
}

export interface WorkspaceItem {
  type: string;
  title: string;
  url?: string;
  content?: string;
  tags?: string[];
}

export interface AIAnalysis {
  summary?: string;
  tags?: string[];
  category?: string;
  importance?: number;
  suggestedActions?: string[];
}

export interface AISuggestion {
  type: string;
  content: string;
  confidence: number;
  metadata?: Record<string, any>;
}

export type AIModelProvider = 'openai' | 'google' | 'local';

export interface AIServiceConfig {
  provider: AIModelProvider;
  apiKey?: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
}
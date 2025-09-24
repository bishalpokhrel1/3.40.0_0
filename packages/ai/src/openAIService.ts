import { AIService, AIServiceConfig, WorkspaceItem, AIAnalysis, AISuggestion } from './interfaces';
import OpenAI from 'openai';

export class OpenAIService implements AIService {
  private client: OpenAI;
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey
    });
  }

  async summarizeContent(content: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Summarize the following content concisely:"
        },
        {
          role: "user",
          content
        }
      ],
      model: this.config.modelName || "gpt-3.5-turbo",
    });

    return completion.choices[0]?.message?.content || '';
  }

  async generateTasks(context: string): Promise<string[]> {
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Generate a list of actionable tasks based on the following context:"
        },
        {
          role: "user",
          content: context
        }
      ],
      model: this.config.modelName || "gpt-3.5-turbo",
    });

    const tasks = completion.choices[0]?.message?.content?.split('\n').filter(Boolean) || [];
    return tasks;
  }

  async analyzeWorkspaceItem(item: WorkspaceItem): Promise<AIAnalysis> {
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Analyze this workspace item and provide a summary, suggested tags, and actions:"
        },
        {
          role: "user",
          content: JSON.stringify(item)
        }
      ],
      model: this.config.modelName || "gpt-3.5-turbo",
    });

    try {
      return JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch {
      return {};
    }
  }

  async getSuggestions(context: string): Promise<AISuggestion[]> {
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Provide contextual suggestions based on the following:"
        },
        {
          role: "user",
          content: context
        }
      ],
      model: this.config.modelName || "gpt-3.5-turbo",
    });

    try {
      return JSON.parse(completion.choices[0]?.message?.content || '[]');
    } catch {
      return [];
    }
  }
}
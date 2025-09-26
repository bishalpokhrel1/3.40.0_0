import env from '../config/environment';

const GRAPHQL_ENDPOINT = env.api.baseUrl;

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface AISummaryResult {
  aiSummarize: {
    text: string;
    tokens: number;
  };
}

interface AIGenerateResult {
  aiGenerate: {
    text: string;
    tokens: number;
  };
}

interface AITaskSuggestionsResult {
  aiTaskSuggestions: string[];
}

interface AIAnalyzeResult {
  aiAnalyze: {
    summary: string;
    suggestions: string[];
  };
}

class ApiService {
  private authToken: string | null = null;

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  private buildHeaders(extra?: HeadersInit): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      ...extra
    };
  }

  private async graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      throw new Error(`GraphQL error: ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as GraphQLResponse<T>;

    if (payload.errors && payload.errors.length > 0) {
      throw new Error(payload.errors.map(error => error.message).join('; '));
    }

    if (!payload.data) {
      throw new Error('GraphQL response missing data');
    }

    return payload.data;
  }

  async summarizeContent(content: string): Promise<{ text: string; tokens: number }> {
    const query = `
      query Summarize($content: String!) {
        aiSummarize(content: $content) {
          text
          tokens
        }
      }
    `;

    const { aiSummarize } = await this.graphqlRequest<AISummaryResult>(query, { content });
    return aiSummarize;
  }

  async generateTaskSuggestions(input: string): Promise<string[]> {
    const query = `
      query TaskSuggestions($input: String!) {
        aiTaskSuggestions(input: $input)
      }
    `;

    const { aiTaskSuggestions } = await this.graphqlRequest<AITaskSuggestionsResult>(query, { input });
    return aiTaskSuggestions;
  }

  async analyzeContent(content: string): Promise<{ summary: string; suggestions: string[] }> {
    const query = `
      query Analyze($content: String!) {
        aiAnalyze(content: $content) {
          summary
          suggestions
        }
      }
    `;

    const { aiAnalyze } = await this.graphqlRequest<AIAnalyzeResult>(query, { content });
    return aiAnalyze;
  }

  async generateResponse(input: string, context?: string): Promise<{ text: string; tokens: number }> {
    const query = `
      query Generate($input: String!, $context: String) {
        aiGenerate(input: $input, context: $context) {
          text
          tokens
        }
      }
    `;

    const variables: Record<string, unknown> = { input };
    if (typeof context === 'string') {
      variables.context = context;
    }

    const { aiGenerate } = await this.graphqlRequest<AIGenerateResult>(query, variables);
    return aiGenerate;
  }
}

export const apiService = new ApiService();
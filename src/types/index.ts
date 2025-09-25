export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  subtasks?: SubTask[];
  notes?: string;
  tags?: string[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  url?: string;
  domain?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  name?: string;
  theme: 'light' | 'dark' | 'system';
  dashboardLayout: {
    showTasks: boolean;
    showNotes: boolean;
    showAISuggestions: boolean;
  };
}

export interface AIPlaceholder {
  type: 'summarize' | 'suggest' | 'analyze';
  content: string;
  result?: string;
  loading: boolean;
}

export interface PageContext {
  url: string;
  title: string;
  domain: string;
  timestamp: string;
}
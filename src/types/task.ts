interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  reminders?: string[];
  subtasks?: SubTask[];
  notes?: string[];
  aiSuggestions?: string[];
  parentId?: string;
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export type { Task, SubTask };
// Shared types between extension and mobile app
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

export interface SyncData {
  tasks: Task[];
  notes: Note[];
  preferences: UserPreferences;
  lastSync: string;
  deviceId: string;
}

export interface TransferData {
  tasks?: Task[];
  notes?: Note[];
  type: 'sync' | 'import';
  source: 'extension' | 'website';
  timestamp: string;
}
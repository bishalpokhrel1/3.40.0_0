import { Task, Note, UserPreferences } from '../types';

/**
 * Storage service for managing extension data
 * Handles local storage and prepares for backend sync
 */
class StorageService {
  private readonly STORAGE_KEYS = {
    TASKS: 'tasks',
    NOTES: 'notes',
    PREFERENCES: 'userPreferences',
    SYNC_STATUS: 'syncStatus'
  };

  // Task Management
  async getTasks(): Promise<Task[]> {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEYS.TASKS);
      return result[this.STORAGE_KEYS.TASKS] || [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await chrome.storage.local.set({ [this.STORAGE_KEYS.TASKS]: tasks });
      // TODO: Trigger backend sync when available
      this.markForSync('tasks');
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: task.subtasks || []
    };

    const tasks = await this.getTasks();
    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.saveTasks(tasks);
  }

  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    await this.saveTasks(filteredTasks);
  }

  // Notes Management
  async getNotes(): Promise<Note[]> {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEYS.NOTES);
      return result[this.STORAGE_KEYS.NOTES] || [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      await chrome.storage.local.set({ [this.STORAGE_KEYS.NOTES]: notes });
      this.markForSync('notes');
    } catch (error) {
      console.error('Error saving notes:', error);
      throw error;
    }
  }

  async addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const newNote: Note = {
      ...note,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const notes = await this.getNotes();
    notes.push(newNote);
    await this.saveNotes(notes);
    return newNote;
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<void> {
    const notes = await this.getNotes();
    const noteIndex = notes.findIndex(n => n.id === noteId);
    
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    notes[noteIndex] = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.saveNotes(notes);
  }

  async deleteNote(noteId: string): Promise<void> {
    const notes = await this.getNotes();
    const filteredNotes = notes.filter(n => n.id !== noteId);
    await this.saveNotes(filteredNotes);
  }

  async getNotesByUrl(url: string): Promise<Note[]> {
    const notes = await this.getNotes();
    return notes.filter(note => note.url === url);
  }

  // User Preferences
  async getPreferences(): Promise<UserPreferences> {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEYS.PREFERENCES);
      return result[this.STORAGE_KEYS.PREFERENCES] || {
        theme: 'system',
        dashboardLayout: {
          showTasks: true,
          showNotes: true,
          showAISuggestions: true
        }
      };
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {
        theme: 'system',
        dashboardLayout: {
          showTasks: true,
          showNotes: true,
          showAISuggestions: true
        }
      };
    }
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      await chrome.storage.local.set({ [this.STORAGE_KEYS.PREFERENCES]: preferences });
      this.markForSync('preferences');
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  // Utility methods
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async markForSync(dataType: string): Promise<void> {
    try {
      const syncStatus = await chrome.storage.local.get(this.STORAGE_KEYS.SYNC_STATUS);
      const currentStatus = syncStatus[this.STORAGE_KEYS.SYNC_STATUS] || {};
      
      currentStatus[dataType] = {
        lastModified: new Date().toISOString(),
        needsSync: true
      };

      await chrome.storage.local.set({ [this.STORAGE_KEYS.SYNC_STATUS]: currentStatus });
    } catch (error) {
      console.error('Error marking for sync:', error);
    }
  }

  // Backend sync preparation (placeholder)
  async syncWithBackend(): Promise<void> {
    console.log('Backend sync placeholder - implement when backend is ready');
    // TODO: Implement actual backend sync
    // This will handle:
    // - Uploading local changes to backend
    // - Downloading remote changes
    // - Conflict resolution
    // - Offline queue management
  }
}

export const storageService = new StorageService();
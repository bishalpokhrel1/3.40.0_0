import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task, Note, UserPreferences } from '../types';

/**
 * Mobile storage service
 * Handles local data persistence with AsyncStorage
 */
class MobileStorageService {
  private readonly STORAGE_KEYS = {
    TASKS: '@manage_tasks',
    NOTES: '@manage_notes',
    PREFERENCES: '@manage_preferences',
    SYNC_STATUS: '@manage_sync_status'
  };

  async initialize(): Promise<void> {
    try {
      // Ensure default preferences exist
      const preferences = await this.getPreferences();
      if (!preferences.name) {
        await this.savePreferences({
          ...preferences,
          name: 'User'
        });
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
    }
  }

  // Task Management
  async getTasks(): Promise<Task[]> {
    try {
      const tasks = await AsyncStorage.getItem(this.STORAGE_KEYS.TASKS);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEYS.TASKS, JSON.stringify(tasks));
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
      const notes = await AsyncStorage.getItem(this.STORAGE_KEYS.NOTES);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEYS.NOTES, JSON.stringify(notes));
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

  // User Preferences
  async getPreferences(): Promise<UserPreferences> {
    try {
      const preferences = await AsyncStorage.getItem(this.STORAGE_KEYS.PREFERENCES);
      return preferences ? JSON.parse(preferences) : {
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
      await AsyncStorage.setItem(this.STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  // Utility methods
  private generateId(): string {
    return `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async markForSync(dataType: string): Promise<void> {
    try {
      const syncStatus = await AsyncStorage.getItem(this.STORAGE_KEYS.SYNC_STATUS);
      const currentStatus = syncStatus ? JSON.parse(syncStatus) : {};
      
      currentStatus[dataType] = {
        lastModified: new Date().toISOString(),
        needsSync: true
      };

      await AsyncStorage.setItem(this.STORAGE_KEYS.SYNC_STATUS, JSON.stringify(currentStatus));
    } catch (error) {
      console.error('Error marking for sync:', error);
    }
  }
}

export const storageService = new MobileStorageService();
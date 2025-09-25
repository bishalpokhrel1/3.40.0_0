import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task, Note, SyncData, TransferData } from '../types';

/**
 * Sync service for mobile app
 * Handles data synchronization with extension and backend
 */
class SyncService {
  private readonly STORAGE_KEYS = {
    TASKS: '@manage_tasks',
    NOTES: '@manage_notes',
    PREFERENCES: '@manage_preferences',
    LAST_SYNC: '@manage_last_sync',
    DEVICE_ID: '@manage_device_id'
  };

  async initialize(): Promise<void> {
    try {
      // Generate device ID if not exists
      let deviceId = await AsyncStorage.getItem(this.STORAGE_KEYS.DEVICE_ID);
      if (!deviceId) {
        deviceId = `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem(this.STORAGE_KEYS.DEVICE_ID, deviceId);
      }
    } catch (error) {
      console.error('Failed to initialize sync service:', error);
    }
  }

  async syncFromExternal(transferData: TransferData): Promise<void> {
    try {
      if (transferData.tasks) {
        await this.mergeTasks(transferData.tasks);
      }
      
      if (transferData.notes) {
        await this.mergeNotes(transferData.notes);
      }
      
      await AsyncStorage.setItem(this.STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Failed to sync from external:', error);
      throw error;
    }
  }

  async importData(transferData: TransferData): Promise<void> {
    try {
      // Import without merging - add as new items
      if (transferData.tasks) {
        const existingTasks = await this.getTasks();
        const newTasks = transferData.tasks.map(task => ({
          ...task,
          id: `imported_${Date.now()}_${task.id}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        await AsyncStorage.setItem(
          this.STORAGE_KEYS.TASKS, 
          JSON.stringify([...existingTasks, ...newTasks])
        );
      }
      
      if (transferData.notes) {
        const existingNotes = await this.getNotes();
        const newNotes = transferData.notes.map(note => ({
          ...note,
          id: `imported_${Date.now()}_${note.id}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        await AsyncStorage.setItem(
          this.STORAGE_KEYS.NOTES, 
          JSON.stringify([...existingNotes, ...newNotes])
        );
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  private async mergeTasks(incomingTasks: Task[]): Promise<void> {
    const existingTasks = await this.getTasks();
    const mergedTasks = this.mergeArrays(existingTasks, incomingTasks, 'updatedAt');
    await AsyncStorage.setItem(this.STORAGE_KEYS.TASKS, JSON.stringify(mergedTasks));
  }

  private async mergeNotes(incomingNotes: Note[]): Promise<void> {
    const existingNotes = await this.getNotes();
    const mergedNotes = this.mergeArrays(existingNotes, incomingNotes, 'updatedAt');
    await AsyncStorage.setItem(this.STORAGE_KEYS.NOTES, JSON.stringify(mergedNotes));
  }

  private mergeArrays<T extends { id: string; updatedAt: string }>(
    existing: T[], 
    incoming: T[], 
    timestampField: keyof T
  ): T[] {
    const merged = [...existing];
    
    for (const incomingItem of incoming) {
      const existingIndex = merged.findIndex(item => item.id === incomingItem.id);
      
      if (existingIndex === -1) {
        // New item
        merged.push(incomingItem);
      } else {
        // Existing item - use latest timestamp
        const existingTimestamp = new Date(merged[existingIndex][timestampField] as string);
        const incomingTimestamp = new Date(incomingItem[timestampField] as string);
        
        if (incomingTimestamp > existingTimestamp) {
          merged[existingIndex] = incomingItem;
        }
      }
    }
    
    return merged;
  }

  async getTasks(): Promise<Task[]> {
    try {
      const tasks = await AsyncStorage.getItem(this.STORAGE_KEYS.TASKS);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Failed to get tasks:', error);
      return [];
    }
  }

  async getNotes(): Promise<Note[]> {
    try {
      const notes = await AsyncStorage.getItem(this.STORAGE_KEYS.NOTES);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Failed to get notes:', error);
      return [];
    }
  }

  async exportData(): Promise<SyncData> {
    const [tasks, notes, deviceId] = await Promise.all([
      this.getTasks(),
      this.getNotes(),
      AsyncStorage.getItem(this.STORAGE_KEYS.DEVICE_ID)
    ]);

    return {
      tasks,
      notes,
      preferences: {
        theme: 'system',
        dashboardLayout: {
          showTasks: true,
          showNotes: true,
          showAISuggestions: true
        }
      },
      lastSync: new Date().toISOString(),
      deviceId: deviceId || 'unknown'
    };
  }
}

export const syncService = new SyncService();
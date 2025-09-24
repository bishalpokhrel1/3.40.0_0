import { useState, useEffect } from 'react';
import { taskService, Task } from '../services/taskService';
import { aiService } from '../services/aiService';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  getTaskSuggestions: (taskTitle: string) => Promise<string[]>;
}

export const useTasks = (userId: string | null): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time task updates
    const unsubscribe = taskService.subscribeToUserTasks(userId, (updatedTasks) => {
      setTasks(updatedTasks);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [userId]);

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<void> => {
    if (!userId) throw new Error('User not authenticated');
    
    try {
      setError(null);
      
      // Get AI suggestions for the task
      let aiSuggestions: string[] = [];
      try {
        aiSuggestions = await aiService.generateTaskSuggestions(taskData.title);
      } catch (aiError) {
        console.warn('Failed to get AI suggestions:', aiError);
      }
      
      await taskService.createTask(userId, {
        ...taskData,
        aiSuggestions
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      setError(errorMessage);
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
    try {
      setError(null);
      await taskService.updateTask(taskId, updates);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
      setError(errorMessage);
      throw error;
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      setError(null);
      await taskService.deleteTask(taskId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
      setError(errorMessage);
      throw error;
    }
  };

  const toggleTask = async (taskId: string): Promise<void> => {
    try {
      setError(null);
      await taskService.toggleTaskCompletion(taskId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle task';
      setError(errorMessage);
      throw error;
    }
  };

  const getTaskSuggestions = async (taskTitle: string): Promise<string[]> => {
    try {
      return await aiService.generateTaskSuggestions(taskTitle);
    } catch (error) {
      console.error('Failed to get task suggestions:', error);
      return [
        'Break down the task into smaller steps',
        'Set a specific deadline',
        'Identify required resources',
        'Consider potential obstacles'
      ];
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTaskSuggestions
  };
};
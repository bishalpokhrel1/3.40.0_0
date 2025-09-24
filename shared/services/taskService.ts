import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Task {
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags?: string[];
  aiSuggestions?: string[];
}

class TaskService {
  private readonly COLLECTION_NAME = 'tasks';

  // Create a new task
  async createTask(userId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const task: Omit<Task, 'id'> = {
        ...taskData,
        userId,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), task);
      return docRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Update an existing task
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const taskRef = doc(db, this.COLLECTION_NAME, taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Delete a task
  async deleteTask(taskId: string): Promise<void> {
    try {
      const taskRef = doc(db, this.COLLECTION_NAME, taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Get all tasks for a user
  async getUserTasks(userId: string): Promise<Task[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data()
        } as Task);
      });
      
      return tasks;
    } catch (error) {
      console.error('Error getting user tasks:', error);
      throw error;
    }
  }

  // Listen to real-time task updates
  subscribeToUserTasks(userId: string, callback: (tasks: Task[]) => void): () => void {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data()
        } as Task);
      });
      callback(tasks);
    });
  }

  // Toggle task completion
  async toggleTaskCompletion(taskId: string): Promise<void> {
    try {
      const taskRef = doc(db, this.COLLECTION_NAME, taskId);
      const taskSnap = await getDoc(taskRef);
      
      if (taskSnap.exists()) {
        const currentTask = taskSnap.data() as Task;
        await updateDoc(taskRef, {
          completed: !currentTask.completed,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }

  // Get tasks by priority
  async getTasksByPriority(userId: string, priority: 'low' | 'medium' | 'high'): Promise<Task[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('priority', '==', priority),
        where('completed', '==', false),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data()
        } as Task);
      });
      
      return tasks;
    } catch (error) {
      console.error('Error getting tasks by priority:', error);
      throw error;
    }
  }

  // Get overdue tasks
  async getOverdueTasks(userId: string): Promise<Task[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('completed', '==', false),
        where('dueDate', '<', today),
        orderBy('dueDate', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data()
        } as Task);
      });
      
      return tasks;
    } catch (error) {
      console.error('Error getting overdue tasks:', error);
      throw error;
    }
  }
}

export const taskService = new TaskService();
export default taskService;
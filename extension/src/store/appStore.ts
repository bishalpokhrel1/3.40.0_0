import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { Task, Note, UserPreferences, SubTask } from '../types';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';

interface AppState {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;

  // Authentication actions
  initializeAuth: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  // User preferences
  preferences: UserPreferences;
  
  // Tasks
  tasks: Task[];
  tasksLoading: boolean;
  
  // Notes
  notes: Note[];
  notesLoading: boolean;
  
  // UI state
  showPopup: boolean;
  currentPageContext: {
    url: string;
    title: string;
    domain: string;
  } | null;
  
  // Actions
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Task actions
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  addSubTask: (taskId: string, subtask: Omit<SubTask, 'id' | 'createdAt'>) => Promise<void>;
  toggleSubTask: (taskId: string, subtaskId: string) => Promise<void>;
  
  // Note actions
  loadNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (noteId: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  getNotesByUrl: (url: string) => Note[];
  
  // UI actions
  setShowPopup: (show: boolean) => void;
  setPageContext: (context: { url: string; title: string; domain: string }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      // Auth state
      user: null,
      isAuthenticated: false,
      authLoading: true,

      // Auth actions
      initializeAuth: () => {
        authService.onAuthStateChange((user) => {
          set({ 
            user, 
            isAuthenticated: !!user,
            authLoading: false
          });
        });
      },

      signIn: async (email: string, password: string) => {
        set({ authLoading: true });
        try {
          const user = await authService.signIn(email, password);
          set({ 
            user,
            isAuthenticated: true,
            authLoading: false
          });
        } catch (error) {
          set({ authLoading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string) => {
        set({ authLoading: true });
        try {
          const user = await authService.signUp(email, password);
          set({ 
            user,
            isAuthenticated: true,
            authLoading: false
          });
        } catch (error) {
          set({ authLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ authLoading: true });
        try {
          await authService.signOut();
          set({ 
            user: null,
            isAuthenticated: false,
            authLoading: false
          });
        } catch (error) {
          set({ authLoading: false });
          throw error;
        }
      },

      // User preferences
      preferences: {
        theme: 'system',
        dashboardLayout: {
          showTasks: true,
          showNotes: true,
          showAISuggestions: true
        }
      },
      tasks: [],
      tasksLoading: false,
      notes: [],
      notesLoading: false,
      showPopup: false,
      currentPageContext: null,

      // Preferences
      setPreferences: (newPreferences) => {
        const updatedPreferences = { ...get().preferences, ...newPreferences };
        set({ preferences: updatedPreferences });
        storageService.savePreferences(updatedPreferences);
      },

      // Task management
      loadTasks: async () => {
        set({ tasksLoading: true });
        try {
          const tasks = await storageService.getTasks();
          set({ tasks, tasksLoading: false });
        } catch (error) {
          console.error('Failed to load tasks:', error);
          set({ tasksLoading: false });
        }
      },

      addTask: async (taskData) => {
        try {
          const newTask = await storageService.addTask(taskData);
          set(state => ({ tasks: [...state.tasks, newTask] }));
        } catch (error) {
          console.error('Failed to add task:', error);
          throw error;
        }
      },

      updateTask: async (taskId, updates) => {
        try {
          await storageService.updateTask(taskId, updates);
          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
            )
          }));
        } catch (error) {
          console.error('Failed to update task:', error);
          throw error;
        }
      },

      deleteTask: async (taskId) => {
        try {
          await storageService.deleteTask(taskId);
          set(state => ({ tasks: state.tasks.filter(task => task.id !== taskId) }));
        } catch (error) {
          console.error('Failed to delete task:', error);
          throw error;
        }
      },

      toggleTask: async (taskId) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (task) {
          await get().updateTask(taskId, { completed: !task.completed });
        }
      },

      addSubTask: async (taskId, subtaskData) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) return;

        const newSubTask: SubTask = {
          ...subtaskData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };

        const updatedSubtasks = [...(task.subtasks || []), newSubTask];
        await get().updateTask(taskId, { subtasks: updatedSubtasks });
      },

      toggleSubTask: async (taskId, subtaskId) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task || !task.subtasks) return;

        const updatedSubtasks = task.subtasks.map(subtask =>
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );

        await get().updateTask(taskId, { subtasks: updatedSubtasks });
      },

      // Note management
      loadNotes: async () => {
        set({ notesLoading: true });
        try {
          const notes = await storageService.getNotes();
          set({ notes, notesLoading: false });
        } catch (error) {
          console.error('Failed to load notes:', error);
          set({ notesLoading: false });
        }
      },

      addNote: async (noteData) => {
        try {
          const newNote = await storageService.addNote(noteData);
          set(state => ({ notes: [...state.notes, newNote] }));
        } catch (error) {
          console.error('Failed to add note:', error);
          throw error;
        }
      },

      updateNote: async (noteId, updates) => {
        try {
          await storageService.updateNote(noteId, updates);
          set(state => ({
            notes: state.notes.map(note =>
              note.id === noteId ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
            )
          }));
        } catch (error) {
          console.error('Failed to update note:', error);
          throw error;
        }
      },

      deleteNote: async (noteId) => {
        try {
          await storageService.deleteNote(noteId);
          set(state => ({ notes: state.notes.filter(note => note.id !== noteId) }));
        } catch (error) {
          console.error('Failed to delete note:', error);
          throw error;
        }
      },

      getNotesByUrl: (url) => {
        return get().notes.filter(note => note.url === url);
      },

      // UI actions
      setShowPopup: (show) => set({ showPopup: show }),
      setPageContext: (context) => set({ currentPageContext: context })
    }),
    {
      name: 'manage-app-store',
      partialize: (state) => ({
        preferences: state.preferences,
        tasks: state.tasks,
        notes: state.notes
      })
    }
  )
);
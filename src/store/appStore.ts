import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface UserPreferences {
  name: string
  interests: string[]
  location?: { lat: number; lon: number; city: string }
  weatherEnabled: boolean
  feedEnabled: boolean
  tasksEnabled: boolean
  googleTasksSync: boolean
  theme: 'auto' | 'light' | 'dark'
}

export interface WeatherData {
  temperature: number
  condition: string
  description: string
  icon: string
  humidity: number
  windSpeed: number
  precipitation?: number
  timestamp: number
}

export interface FeedItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  imageUrl?: string
  aiSummary?: string
  relevanceScore?: number
  tags?: string[]
  userRating?: 'up' | 'down'
}

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  aiSuggestions?: string[]
  googleTaskId?: string
}

interface AppState {
  // Onboarding & Settings
  isOnboarded: boolean
  showSettings: boolean
  userPreferences: UserPreferences
  
  // Weather
  weatherData: WeatherData | null
  weatherLoading: boolean
  
  // Feed
  feedItems: FeedItem[]
  feedLoading: boolean
  lastFeedUpdate: number
  
  // Tasks
  tasks: Task[]
  tasksLoading: boolean
  
  // Actions
  setOnboarded: (onboarded: boolean) => void
  setShowSettings: (show: boolean) => void
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void
  setWeatherData: (data: WeatherData | null) => void
  setWeatherLoading: (loading: boolean) => void
  setFeedItems: (items: FeedItem[]) => void
  setFeedLoading: (loading: boolean) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  rateFeedItem: (id: string, rating: 'up' | 'down') => void
  initializeApp: () => Promise<void>
  saveToStorage: () => Promise<void>
}

const defaultPreferences: UserPreferences = {
  name: '',
  interests: [],
  weatherEnabled: true,
  feedEnabled: true,
  tasksEnabled: true,
  googleTasksSync: false,
  theme: 'auto'
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    isOnboarded: false,
    showSettings: false,
    userPreferences: defaultPreferences,
    weatherData: null,
    weatherLoading: false,
    feedItems: [],
    feedLoading: false,
    lastFeedUpdate: 0,
    tasks: [],
    tasksLoading: false,

    // Actions
    setOnboarded: (onboarded) => set({ isOnboarded: onboarded }),
    setShowSettings: (show) => set({ showSettings: show }),
    
    updateUserPreferences: (preferences) => {
      set((state) => ({
        userPreferences: { ...state.userPreferences, ...preferences }
      }))
      get().saveToStorage()
    },
    
    setWeatherData: (data) => set({ weatherData: data }),
    setWeatherLoading: (loading) => set({ weatherLoading: loading }),
    
    setFeedItems: (items) => {
      set({ feedItems: items, lastFeedUpdate: Date.now() })
      get().saveToStorage()
    },
    setFeedLoading: (loading) => set({ feedLoading: loading }),
    
    addTask: (taskData) => {
      const task: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      }
      set((state) => ({ tasks: [...state.tasks, task] }))
      get().saveToStorage()
    },
    
    updateTask: (id, updates) => {
      set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      }))
      get().saveToStorage()
    },
    
    deleteTask: (id) => {
      set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }))
      get().saveToStorage()
    },
    
    toggleTask: (id) => {
      set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      }))
      get().saveToStorage()
    },
    
    rateFeedItem: (id, rating) => {
      set((state) => ({
        feedItems: state.feedItems.map(item =>
          item.id === id ? { ...item, userRating: rating } : item
        )
      }))
      get().saveToStorage()
    },

    initializeApp: async () => {
      try {
        const result = await chrome.storage.local.get([
          'isOnboarded',
          'userPreferences', 
          'feedItems',
          'tasks',
          'lastFeedUpdate'
        ])
        
        set({
          isOnboarded: result.isOnboarded || false,
          userPreferences: { ...defaultPreferences, ...result.userPreferences },
          feedItems: result.feedItems || [],
          tasks: result.tasks || [],
          lastFeedUpdate: result.lastFeedUpdate || 0
        })
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    },

    saveToStorage: async () => {
      try {
        const state = get()
        await chrome.storage.local.set({
          isOnboarded: state.isOnboarded,
          userPreferences: state.userPreferences,
          feedItems: state.feedItems,
          tasks: state.tasks,
          lastFeedUpdate: state.lastFeedUpdate
        })
      } catch (error) {
        console.error('Failed to save to storage:', error)
      }
    }
  }))
)
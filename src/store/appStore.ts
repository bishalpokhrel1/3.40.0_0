import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCurrentLocation, getWeatherData } from '@/services/weatherService'

export interface WeatherData {
  condition: string;
  temperature: number;
  description: string;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
}

export interface UserPreferences {
  name?: string;
  interests: string[];
  location?: {
    lat: number;
    lon: number;
    city?: string;
  };
  theme: 'light' | 'dark' | 'system';
  layout?: {
    [key: string]: {
      x: number;
      y: number;
    };
  };
  weatherEnabled: boolean;
  feedEnabled: boolean;
  tasksEnabled: boolean;
  googleTasksSync: boolean;
}

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  aiSummary?: string;
  relevanceScore?: number;
  tags?: string[];
  userRating?: 'up' | 'down';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  aiSuggestions?: string[];
  googleTaskId?: string;
}

interface AppState {
  // Onboarding & Settings
  isOnboarded: boolean;
  showSettings: boolean;
  userPreferences: UserPreferences;
  
  // Weather
  weatherData: WeatherData | null;
  weatherLoading: boolean;
  
  // Feed
  feedItems: FeedItem[];
  feedLoading: boolean;
  lastFeedUpdate: number;
  
  // Tasks
  tasks: Task[];
  tasksLoading: boolean;
  
  // Actions
  setOnboarded: (onboarded: boolean) => void;
  setShowSettings: (show: boolean) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  updateLocation: (lat: number, lon: number) => Promise<void>;
  updateLayoutPosition: (componentId: string, position: { x: number; y: number }) => void;
  refreshWeather: () => Promise<void>;
  initializeApp: () => Promise<void>;
  
  // Feed Actions
  setFeedItems: (items: FeedItem[]) => void;
  setFeedLoading: (loading: boolean) => void;
  rateFeedItem: (id: string, rating: 'up' | 'down') => void;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  saveToStorage: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      isOnboarded: false,
      showSettings: false,
      userPreferences: {
        theme: 'system',
        layout: {},
        weatherEnabled: true,
        feedEnabled: true,
        tasksEnabled: true,
        interests: [],
        googleTasksSync: false,
        name: '',
      },
      weatherData: null,
      weatherLoading: false,
      feedItems: [],
      feedLoading: false,
      lastFeedUpdate: 0,
      tasks: [],
      tasksLoading: false,

      // Onboarding & Settings Actions
      setOnboarded: (onboarded: boolean) => set({ isOnboarded: onboarded }),
      setShowSettings: (show: boolean) => set({ showSettings: show }),
      updateUserPreferences: (preferences: Partial<UserPreferences>) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ...preferences,
          },
        }));
      },
      
      // Weather Actions
      updateLocation: async (lat: number, lon: number) => {
        try {
          set((state) => ({
            userPreferences: {
              ...state.userPreferences,
              location: { lat, lon },
            },
            weatherLoading: true
          }));
          await get().refreshWeather();
        } catch (error) {
          console.error('Failed to update location:', error);
          set({ weatherLoading: false });
        }
      },
      
      updateLayoutPosition: (componentId: string, position: { x: number; y: number }) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            layout: {
              ...state.userPreferences.layout,
              [componentId]: position,
            },
          },
        }));
      },
      
      refreshWeather: async () => {
        const { userPreferences } = get();
        set({ weatherLoading: true });

        try {
          // If no location stored, try to get current location
          if (!userPreferences.location) {
            const position = await getCurrentLocation();
            await get().updateLocation(
              position.coords.latitude,
              position.coords.longitude
            );
            return;
          }

          const weatherData = await getWeatherData(
            userPreferences.location.lat,
            userPreferences.location.lon
          );
          set({ weatherData, weatherLoading: false });
        } catch (error) {
          console.error('Failed to refresh weather:', error);
          set({ 
            weatherLoading: false,
            weatherData: null
          });
          // Re-throw to allow handling by the UI
          throw error;
        }
      },
      
      // Feed Actions
      setFeedItems: (items: FeedItem[]) => {
        set({ 
          feedItems: items,
          lastFeedUpdate: Date.now()
        });
      },
      setFeedLoading: (loading: boolean) => set({ feedLoading: loading }),
      rateFeedItem: (id: string, rating: 'up' | 'down') => {
        set((state) => ({
          feedItems: state.feedItems.map(item =>
            item.id === id ? { ...item, userRating: rating } : item
          )
        }));
      },
      
      // Task Actions
      addTask: (task: Omit<Task, 'id' | 'createdAt'>) => {
        const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newTask: Task = {
          ...task,
          id,
          createdAt: new Date().toISOString(),
          completed: false,
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
      },
      
      updateTask: (id: string, updates: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, ...updates } : task
          )
        }));
      },
      
      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
      },
      
      toggleTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        }));
      },
      
      saveToStorage: async () => {
        // This is handled by the persist middleware
        return Promise.resolve();
      },
      
      // App Initialization
      initializeApp: async () => {
        try {
          // First try to get location from storage
          const { userPreferences } = get();
          
          if (userPreferences.location) {
            await get().refreshWeather();
          } else {
            // If no stored location, try to get current location
            try {
              const position = await getCurrentLocation();
              await get().updateLocation(
                position.coords.latitude,
                position.coords.longitude
              );
            } catch (error) {
              console.warn('Geolocation failed, using default location:', error);
              // Don't set a default location, just let the user know they need to enable location
              set({ weatherData: null, weatherLoading: false });
            }
          }
          
          // Continue with other initialization
          if (userPreferences.interests && userPreferences.interests.length > 0) {
            // Fetch feeds if we have interests
            chrome.runtime.sendMessage({
              action: 'fetchFeeds',
              interests: userPreferences.interests
            });
          }
          
          set({ isOnboarded: true });
        } catch (error) {
          console.error('Error initializing app:', error);
          set({ 
            isOnboarded: true,
            weatherData: null,
            weatherLoading: false
          });
          throw error;
        }
      },
    }),
    {
      name: 'app-store',
    }
  )
)
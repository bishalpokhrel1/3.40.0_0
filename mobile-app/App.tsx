import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import TasksScreen from './src/screens/TasksScreen';
import NotesScreen from './src/screens/NotesScreen';
import DataTransferScreen from './src/screens/DataTransferScreen';

// Import services
import { syncService } from './src/services/syncService';
import { storageService } from './src/services/storageService';

// Types
import type { Task, Note } from './src/types';

const Stack = createNativeStackNavigator();

// Deep linking configuration
const linking = {
  prefixes: [
    'manageapp://',
    'https://manage-dashboard.com',
    'http://manage-dashboard.com'
  ],
  config: {
    screens: {
      Dashboard: '',
      Tasks: 'tasks',
      Notes: 'notes',
      DataTransfer: {
        path: 'transfer',
        parse: {
          data: (data: string) => {
            try {
              return JSON.parse(decodeURIComponent(data));
            } catch {
              return null;
            }
          }
        }
      }
    }
  }
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialUrl, setInitialUrl] = useState<string | null>(null);

  useEffect(() => {
    // Initialize app and handle deep links
    const initializeApp = async () => {
      try {
        // Initialize local storage
        await storageService.initialize();
        
        // Check for initial deep link
        const url = await Linking.getInitialURL();
        setInitialUrl(url);
        
        // Set up deep link listener
        const subscription = Linking.addEventListener('url', handleDeepLink);
        
        setIsReady(true);
        
        return () => subscription?.remove();
      } catch (error) {
        console.error('Failed to initialize app:', error);
        Alert.alert('Error', 'Failed to initialize the app');
      }
    };

    initializeApp();
  }, []);

  const handleDeepLink = async (event: { url: string }) => {
    console.log('Deep link received:', event.url);
    
    try {
      const { hostname, pathname, queryParams } = Linking.parse(event.url);
      
      if (pathname === '/transfer' && queryParams?.data) {
        // Handle data transfer from extension/website
        await handleDataTransfer(queryParams.data as any);
      }
    } catch (error) {
      console.error('Failed to handle deep link:', error);
      Alert.alert('Error', 'Failed to process the shared data');
    }
  };

  const handleDataTransfer = async (transferData: {
    tasks?: Task[];
    notes?: Note[];
    type: 'sync' | 'import';
    source: 'extension' | 'website';
  }) => {
    try {
      if (transferData.type === 'sync') {
        // Sync data with local storage
        await syncService.syncFromExternal(transferData);
        Alert.alert('Success', 'Data synced successfully!');
      } else if (transferData.type === 'import') {
        // Import new data
        await syncService.importData(transferData);
        Alert.alert('Success', 'Data imported successfully!');
      }
    } catch (error) {
      console.error('Data transfer failed:', error);
      Alert.alert('Error', 'Failed to transfer data');
    }
  };

  if (!isReady) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer linking={linking}>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Manage Dashboard' }}
        />
        <Stack.Screen 
          name="Tasks" 
          component={TasksScreen}
          options={{ title: 'Tasks' }}
        />
        <Stack.Screen 
          name="Notes" 
          component={NotesScreen}
          options={{ title: 'Notes' }}
        />
        <Stack.Screen 
          name="DataTransfer" 
          component={DataTransferScreen}
          options={{ title: 'Data Transfer' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
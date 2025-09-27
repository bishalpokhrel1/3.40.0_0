import { auth, db, firebaseStatus } from './firebaseConfig';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export interface ConnectionTestResult {
  auth: {
    status: 'connected' | 'error';
    user: 'signed-in' | 'signed-out' | null;
    error?: string;
  };
  firestore: {
    status: 'connected' | 'error';
    error?: string;
  };
  timestamp: string;
}

export async function testFirebaseConnection(): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    auth: {
      status: 'error',
      user: null
    },
    firestore: {
      status: 'error'
    },
    timestamp: new Date().toISOString()
  };

  if (!firebaseStatus.ready || !auth || !db) {
    const errorMessage = firebaseStatus.error?.message ?? 'Firebase is not configured.';
    result.auth = {
      status: 'error',
      user: null,
      error: errorMessage
    };
    result.firestore = {
      status: 'error',
      error: errorMessage
    };
    return result;
  }

  const authInstance = auth!;
  const dbInstance = db!;

  try {
    // Test Firebase Auth
    await new Promise<void>((resolve) => {
  const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        unsubscribe();
        result.auth = {
          status: 'connected',
          user: user ? 'signed-in' : 'signed-out'
        };
        resolve();
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        unsubscribe();
        result.auth = {
          status: 'error',
          user: null,
          error: 'Auth connection timeout'
        };
        resolve();
      }, 5000);
    });

    // Test Firestore
    try {
  const testQuery = query(collection(dbInstance, 'tasks'), limit(1));
      await getDocs(testQuery);
      result.firestore = {
        status: 'connected'
      };
    } catch (error) {
      result.firestore = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown Firestore error'
      };
    }
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    if (error instanceof Error) {
      result.auth.error = error.message;
    }
  }

  return result;
}

// Helper function to check if all connections are working
export function isFullyConnected(result: ConnectionTestResult): boolean {
  return result.auth.status === 'connected' && result.firestore.status === 'connected';
}

// Export a function to run periodic connection tests
export function startConnectionMonitoring(
  callback: (result: ConnectionTestResult) => void,
  interval = 30000 // Default: check every 30 seconds
) {
  // Initial check
  testFirebaseConnection().then(callback);

  // Set up periodic checks
  const timerId = setInterval(async () => {
    const result = await testFirebaseConnection();
    callback(result);
  }, interval);

  // Return a cleanup function
  return () => clearInterval(timerId);
}
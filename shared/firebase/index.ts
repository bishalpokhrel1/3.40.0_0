import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

let cachedServices: FirebaseServices | null = null;

/**
 * Initializes the shared Firebase services. The config should be read from a
 * platform-specific `.env` file (see extension/.env.example and mobile/.env.example).
 * This method is idempotent and will reuse the existing Firebase app instance
 * when called multiple times across workspaces.
 */
export function initializeFirebase(config: FirebaseConfig): FirebaseServices {
  if (!cachedServices) {
    if (!config.apiKey) {
      throw new Error('Missing Firebase configuration. Ensure .env values are set.');
    }

    const app = getApps().length > 0 ? getApps()[0] : initializeApp(config);
    cachedServices = {
      app,
      auth: getAuth(app),
      db: getFirestore(app)
    };
  }

  return cachedServices;
}

export const COLLECTIONS = {
  TASKS: 'tasks',
  NOTES: 'notes',
  USERS: 'users'
} as const;

type CollectionKeys = typeof COLLECTIONS[keyof typeof COLLECTIONS];

export function getCollectionName(collection: CollectionKeys): string {
  return collection;
}

export function isFirebaseConfigValid(config: FirebaseConfig): boolean {
  if (!config) {
    return false;
  }

  const requiredKeys: Array<keyof FirebaseConfig> = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  return requiredKeys.every((key) => {
    const value = config[key];
    return typeof value === 'string' && value.trim().length > 0;
  });
}

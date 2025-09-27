/**
 * Firebase Authentication Service
 * Handles user authentication flows and session management
 */

import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { initializeFirebase } from '@shared/firebase';

// Initialize Firebase app
const app = initializeFirebase();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Type definitions for authentication
 */
export interface AuthError {
  code: string;
  message: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}

/**
 * Signs in a user with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw {
      code: error.code || 'auth/unknown',
      message: error.message || 'Failed to sign in'
    };
  }
}

/**
 * Signs in a user with Google
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    throw {
      code: error.code || 'auth/unknown',
      message: error.message || 'Failed to sign in with Google'
    };
  }
}

/**
 * Creates a new user account
 */
export async function createAccount(email: string, password: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw {
      code: error.code || 'auth/unknown',
      message: error.message || 'Failed to create account'
    };
  }
}

/**
 * Signs out the current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw {
      code: error.code || 'auth/unknown',
      message: error.message || 'Failed to sign out'
    };
  }
}

/**
 * Subscribes to authentication state changes
 */
export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Gets the current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Checks if a user is currently signed in
 */
export function isUserSignedIn(): boolean {
  return !!getCurrentUser();
}
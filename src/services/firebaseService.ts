import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithCredential,
  User 
} from 'firebase/auth';
import { firebaseConfig } from '../config/firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export interface AuthResponse {
  user: User | null;
  error?: string;
}

export const firebaseService = {
  // Sign up with email and password
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  // Sign in with Google using Chrome Identity API
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      return new Promise((resolve) => {
        chrome.identity.getAuthToken({ interactive: true }, async (token) => {
          if (chrome.runtime.lastError) {
            resolve({ user: null, error: chrome.runtime.lastError.message });
            return;
          }

          try {
            if (typeof token === 'string') {
              const credential = GoogleAuthProvider.credential(null, token);
              const result = await signInWithCredential(auth, credential);
              resolve({ user: result.user });
            } else {
              resolve({ user: null, error: 'Invalid token received' });
            }
          } catch (error: any) {
            resolve({ user: null, error: error.message });
          }
        });
      });
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    await signOut(auth);
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};
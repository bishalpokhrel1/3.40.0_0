import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export interface AuthService {
  user: User | null;
  signUp: (email: string, password: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  getCurrentUser: () => User | null;
  onAuthStateChange: (callback: (user: User | null) => void) => () => void;
}

class FirebaseAuthService implements AuthService {
  private _user: User | null = null;

  get user() {
    return this._user;
  }

  constructor() {
    // Initialize auth state
    onAuthStateChanged(auth, (user) => {
      this._user = user;
    });
  }

  async signUp(email: string, password: string): Promise<User> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    return user;
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}

// Create and export a single instance of the auth service
export const authService = new FirebaseAuthService();
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  type Auth
} from 'firebase/auth';
import { auth, firebaseStatus } from './firebaseConfig';
import { ensureUserProfile } from './profileService';

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

  constructor(private readonly authInstance: Auth) {
    onAuthStateChanged(this.authInstance, (user) => {
      this._user = user;
      if (user) {
        void ensureUserProfile(user);
      }
    });
  }

  get user() {
    return this._user;
  }

  async signUp(email: string, password: string): Promise<User> {
    const { user } = await createUserWithEmailAndPassword(this.authInstance, email, password);
    await ensureUserProfile(user);
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const { user } = await signInWithEmailAndPassword(this.authInstance, email, password);
    await ensureUserProfile(user);
    return user;
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(this.authInstance, provider);
    await ensureUserProfile(user);
    return user;
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(this.authInstance);
  }

  getCurrentUser(): User | null {
    return this.authInstance.currentUser ?? null;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.authInstance, callback);
  }
}

class DisabledAuthService implements AuthService {
  user: User | null = null;

  private readonly error = firebaseStatus.error ?? new Error('Firebase auth is not configured.');

  async signUp(): Promise<User> {
    return Promise.reject(this.error);
  }

  async signIn(): Promise<User> {
    return Promise.reject(this.error);
  }

  async signInWithGoogle(): Promise<User> {
    return Promise.reject(this.error);
  }

  async signOut(): Promise<void> {
    return Promise.reject(this.error);
  }

  getCurrentUser(): User | null {
    return null;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    callback(null);
    return () => undefined;
  }
}

// Create and export a single instance of the auth service
export const authService: AuthService = auth
  ? new FirebaseAuthService(auth)
  : new DisabledAuthService();
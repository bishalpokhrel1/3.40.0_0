import { doc, getDoc, serverTimestamp, setDoc, updateDoc, type Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './firebaseConfig';

export interface UserProfile {
  id: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: string;
}

const USER_COLLECTION = 'users';

export async function ensureUserProfile(user: User): Promise<void> {
  const database = db as Firestore | null;

  if (!database) {
    console.warn('Skipping user profile creation because Firestore is not initialised.');
    return;
  }

  const userRef = doc(database, USER_COLLECTION, user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      id: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: new Date().toISOString()
    });
  } else {
    await updateDoc(userRef, {
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      updatedAt: serverTimestamp(),
      lastLoginAt: new Date().toISOString()
    });
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  const database = db as Firestore | null;

  if (!database) {
    throw new Error('Firestore is not initialised.');
  }

  const userRef = doc(database, USER_COLLECTION, userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp()
  } as never);
}

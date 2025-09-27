declare module 'firebase/app' {
  export interface FirebaseApp {}
  export function initializeApp(config: Record<string, unknown>): FirebaseApp;
  export function getApps(): FirebaseApp[];
}

declare module 'firebase/auth' {
  export interface User {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  }
  export interface Auth {
    currentUser: User | null;
  }
  export class GoogleAuthProvider {}
  export function getAuth(app: import('firebase/app').FirebaseApp): Auth;
  export function onAuthStateChanged(
    auth: Auth,
    callback: (user: User | null) => void
  ): () => void;
  export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<{ user: User }>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<{ user: User }>;
  export function signOut(auth: Auth): Promise<void>;
  export function signInWithPopup(auth: Auth, provider: GoogleAuthProvider): Promise<{ user: User }>;
}

declare module 'firebase/firestore' {
  export interface Firestore {}
  export interface DocumentReference<T = unknown> {}
  export interface DocumentSnapshot<T = unknown> {
    exists(): boolean;
    data(): T | undefined;
  }

  export function getFirestore(app: import('firebase/app').FirebaseApp): Firestore;
  export function collection(db: Firestore, path: string): unknown;
  export function doc(db: Firestore, collectionPath: string, docId?: string): DocumentReference;
  export function getDoc<T = unknown>(ref: DocumentReference<T>): Promise<DocumentSnapshot<T>>;
  export function setDoc<T = unknown>(ref: DocumentReference<T>, data: T): Promise<void>;
  export function updateDoc<T = Record<string, unknown>>(ref: DocumentReference, data: T): Promise<void>;
  export function serverTimestamp(): unknown;
  export function query(...args: unknown[]): unknown;
  export function limit(count: number): unknown;
  export function getDocs(query: unknown): Promise<{ docs: DocumentSnapshot[] }>;
}

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration with environment variables and fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDPCB-djaDfmWUCz76balbwYhWJD4QAKOo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "api-sample-20c3a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "api-sample-20c3a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "api-sample-20c3a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "772194196847",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:772194196847:web:6bc4074b37c297dd389c9a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BGF0R1MEND"
};

// Check if Firebase config is valid
const isFirebaseConfigValid = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.authDomain && 
         firebaseConfig.projectId;
};

// Initialize Firebase only if config is valid
let app;
let auth;
let db;
let analytics;

export const firebaseStatus = {
  ready: false,
  missingConfig: false,
  error: null as Error | null
};

try {
  if (isFirebaseConfigValid()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Only initialize analytics in browser environment
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
    
    firebaseStatus.ready = true;
    console.log('Firebase initialized successfully');
  } else {
    firebaseStatus.missingConfig = true;
    console.warn('Firebase configuration is missing or invalid');
  }
} catch (error) {
  firebaseStatus.error = error as Error;
  console.error('Firebase initialization failed:', error);
}

// Export Firebase services
export { auth, db, analytics };
export default app;
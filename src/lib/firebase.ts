import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  // These are placeholder values - you'll need to replace with your actual Firebase config
  apiKey: "AIzaSyDummyKeyForDemo",
  authDomain: "productivsync-demo.firebaseapp.com",
  projectId: "productivsync-demo",
  storageBucket: "productivsync-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;


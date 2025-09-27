import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDPCB-djaDfmWUCz76balbwYhWJD4QAKOo",
  authDomain: "api-sample-20c3a.firebaseapp.com",
  projectId: "api-sample-20c3a",
  storageBucket: "api-sample-20c3a.firebasestorage.app",
  messagingSenderId: "772194196847",
  appId: "1:772194196847:web:6bc4074b37c297dd389c9a",
  measurementId: "G-BGF0R1MEND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the Firebase app instance if needed elsewhere
export default app;
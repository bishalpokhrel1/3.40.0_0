import env from '../config/environment';
import { initializeFirebase } from '../../../shared/firebase/index.ts';

const firebaseServices = initializeFirebase(env.firebase);
export const auth = firebaseServices.auth;
export const db = firebaseServices.db;

// Export the Firebase app instance if needed elsewhere
const app = firebaseServices.app;

export default app;
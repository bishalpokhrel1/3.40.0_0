import { initializeFirebase } from '@shared/firebase';
import { buildFirebaseConfigFromEnv } from '@shared/utils/env';

const firebaseServices = initializeFirebase(buildFirebaseConfigFromEnv());

export const app = firebaseServices.app;
export const db = firebaseServices.db;
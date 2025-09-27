import env from '../config/environment';
import { initializeFirebase, isFirebaseConfigValid } from '../../../shared/firebase/index.ts';
import type { FirebaseServices } from '../../../shared/firebase/index.ts';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const missingConfigError = new Error('Missing Firebase configuration. Ensure .env values are set.');

let firebaseServices: FirebaseServices | null = null;
let initializationError: Error | null = null;

if (isFirebaseConfigValid(env.firebase)) {
	try {
		firebaseServices = initializeFirebase(env.firebase);
	} catch (error) {
		initializationError = error instanceof Error ? error : new Error(String(error));
		console.error('Failed to initialize Firebase:', initializationError);
	}
} else {
	initializationError = missingConfigError;
	console.warn(
		'Firebase configuration is not set. Auth and sync features will be disabled until credentials are provided.'
	);
}

export const firebaseStatus = {
	ready: Boolean(firebaseServices),
	error: initializationError,
	missingConfig: initializationError === missingConfigError
};

export const auth: Auth | null = firebaseServices?.auth ?? null;
export const db: Firestore | null = firebaseServices?.db ?? null;

const app: FirebaseApp | null = firebaseServices?.app ?? null;

export default app;
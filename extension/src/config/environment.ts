import { buildFirebaseConfigFromEnv, buildGeminiConfigFromEnv, readApiBaseUrlFromEnv } from '../../../shared/utils/env.ts';
import type { FirebaseConfig } from '../../../shared/firebase';
import type { GeminiConfig } from '../../../shared/ai/gemini';

export interface EnvironmentConfig {
  firebase: FirebaseConfig;
  ai: GeminiConfig;
  api: {
    baseUrl: string;
  };
}

const firebase = buildFirebaseConfigFromEnv();
const ai = buildGeminiConfigFromEnv();
const api = {
  baseUrl: readApiBaseUrlFromEnv('http://localhost:4000/graphql')
};

const env: EnvironmentConfig = {
  firebase,
  ai,
  api
};

export default env;
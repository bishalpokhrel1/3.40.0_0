import type { FirebaseConfig } from '../firebase';
import type { GeminiConfig } from '../ai/gemini';

type EnvRecord = Record<string, string | undefined>;

declare global {
  // eslint-disable-next-line no-var
  var __APP_ENV__: EnvRecord | undefined;
}

const getEnvValue = (key: string, prefix = ''): string | undefined => {
  const fullKey = prefix ? `${prefix}_${key}` : key;
  const viteKey = `VITE_${fullKey}`;
  
  // Check process.env
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[fullKey]) return process.env[fullKey];
    if (process.env[viteKey]) return process.env[viteKey];
  }
  
  // Check import.meta.env (Vite)
  try {
    const metaEnv = import.meta?.env;
    if (metaEnv?.[fullKey]) return metaEnv[fullKey];
    if (metaEnv?.[viteKey]) return metaEnv[viteKey];
  } catch {
    // ignore if import.meta is not available
  }
  
  return undefined;
};

const ENV_KEYS = {
  FIREBASE: {
    API_KEY: 'FIREBASE_API_KEY',
    AUTH_DOMAIN: 'FIREBASE_AUTH_DOMAIN',
    PROJECT_ID: 'FIREBASE_PROJECT_ID',
    STORAGE_BUCKET: 'FIREBASE_STORAGE_BUCKET',
    MESSAGING_SENDER_ID: 'FIREBASE_MESSAGING_SENDER_ID',
    APP_ID: 'FIREBASE_APP_ID'
  },
  GEMINI: {
    API_KEY: 'GEMINI_API_KEY',
    MODEL: 'GEMINI_MODEL'
  },
  API: {
    BASE_URL: 'API_BASE_URL'
  }
};

export const buildFirebaseConfigFromEnv = (): FirebaseConfig => {
  return {
    apiKey: getEnvValue(ENV_KEYS.FIREBASE.API_KEY) || '',
    authDomain: getEnvValue(ENV_KEYS.FIREBASE.AUTH_DOMAIN) || '',
    projectId: getEnvValue(ENV_KEYS.FIREBASE.PROJECT_ID) || '',
    storageBucket: getEnvValue(ENV_KEYS.FIREBASE.STORAGE_BUCKET) || '',
    messagingSenderId: getEnvValue(ENV_KEYS.FIREBASE.MESSAGING_SENDER_ID) || '',
    appId: getEnvValue(ENV_KEYS.FIREBASE.APP_ID) || ''
  };
};

export const buildGeminiConfigFromEnv = (): GeminiConfig => {
  return {
    apiKey: getEnvValue(ENV_KEYS.GEMINI.API_KEY) || '',
    model: getEnvValue(ENV_KEYS.GEMINI.MODEL) || 'gemini-pro'
  };
};

export const readApiBaseUrlFromEnv = (): string => {
  return getEnvValue(ENV_KEYS.API.BASE_URL) || 'http://localhost:4000'
};
  API: {
    BASE_URL: 'API_BASE_URL'
  }
} as const;

export function readEnv(key: string, fallback = ''): string {
  return readEnvVariants([key], fallback);
}

export function readEnvVariants(keys: string[], fallback = ''): string {
  for (const source of ENV_SOURCES) {
    for (const key of keys) {
      const value = source?.[key];
      if (typeof value === 'string' && value.length > 0) {
        return value;
      }
    }
  }
  return fallback;
}

const withFallback = (key: string) => [key, `VITE_${key}`];

export function buildFirebaseConfigFromEnv(): FirebaseConfig {
  return {
    apiKey: readEnvVariants(withFallback(ENV_KEYS.FIREBASE.API_KEY)),
    authDomain: readEnvVariants(withFallback(ENV_KEYS.FIREBASE.AUTH_DOMAIN)),
    projectId: readEnvVariants(withFallback(ENV_KEYS.FIREBASE.PROJECT_ID)),
    storageBucket: readEnvVariants(withFallback(ENV_KEYS.FIREBASE.STORAGE_BUCKET)),
    messagingSenderId: readEnvVariants(withFallback(ENV_KEYS.FIREBASE.MESSAGING_SENDER_ID)),
    appId: readEnvVariants(withFallback(ENV_KEYS.FIREBASE.APP_ID))
  };
}

export function buildGeminiConfigFromEnv(): GeminiConfig {
  return {
    apiKey: readEnvVariants(withFallback(ENV_KEYS.GEMINI.API_KEY)),
    model: readEnvVariants(withFallback(ENV_KEYS.GEMINI.MODEL), 'gemini-pro')
  };
}

export function readApiBaseUrlFromEnv(defaultValue = ''): string {
  return readEnvVariants(withFallback(ENV_KEYS.API.BASE_URL), defaultValue);
}

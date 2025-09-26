"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_KEYS = void 0;
exports.readEnv = readEnv;
exports.readEnvVariants = readEnvVariants;
exports.buildFirebaseConfigFromEnv = buildFirebaseConfigFromEnv;
exports.buildGeminiConfigFromEnv = buildGeminiConfigFromEnv;
exports.readApiBaseUrlFromEnv = readApiBaseUrlFromEnv;
const gatherSources = () => {
    const sources = [];
    if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
        sources.push(process.env);
    }
    // `import.meta` is only available in ESM environments (Vite / extension build)
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const metaEnv = import.meta?.env;
        if (metaEnv) {
            sources.push(metaEnv);
        }
    }
    catch (error) {
        // ignore: `import.meta` not supported in this runtime (e.g., React Native)
    }
    if (typeof globalThis !== 'undefined' && globalThis.__APP_ENV__) {
        sources.push(globalThis.__APP_ENV__);
    }
    return sources;
};
const ENV_SOURCES = gatherSources();
exports.ENV_KEYS = {
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
function readEnv(key, fallback = '') {
    return readEnvVariants([key], fallback);
}
function readEnvVariants(keys, fallback = '') {
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
const withFallback = (key) => [key, `VITE_${key}`];
function buildFirebaseConfigFromEnv() {
    return {
        apiKey: readEnvVariants(withFallback(exports.ENV_KEYS.FIREBASE.API_KEY)),
        authDomain: readEnvVariants(withFallback(exports.ENV_KEYS.FIREBASE.AUTH_DOMAIN)),
        projectId: readEnvVariants(withFallback(exports.ENV_KEYS.FIREBASE.PROJECT_ID)),
        storageBucket: readEnvVariants(withFallback(exports.ENV_KEYS.FIREBASE.STORAGE_BUCKET)),
        messagingSenderId: readEnvVariants(withFallback(exports.ENV_KEYS.FIREBASE.MESSAGING_SENDER_ID)),
        appId: readEnvVariants(withFallback(exports.ENV_KEYS.FIREBASE.APP_ID))
    };
}
function buildGeminiConfigFromEnv() {
    return {
        apiKey: readEnvVariants(withFallback(exports.ENV_KEYS.GEMINI.API_KEY)),
        model: readEnvVariants(withFallback(exports.ENV_KEYS.GEMINI.MODEL), 'gemini-pro')
    };
}
function readApiBaseUrlFromEnv(defaultValue = '') {
    return readEnvVariants(withFallback(exports.ENV_KEYS.API.BASE_URL), defaultValue);
}

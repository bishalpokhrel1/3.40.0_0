interface Environment {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  ai: {
    endpoint: string;
    apiKey: string;
  };
}

const development: Environment = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  },
  ai: {
    endpoint: import.meta.env.VITE_AI_ENDPOINT || 'https://api.openai.com/v1',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || ''
  }
};

const production: Environment = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  },
  ai: {
    endpoint: import.meta.env.VITE_AI_ENDPOINT || 'https://api.openai.com/v1',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || ''
  }
};

const test: Environment = {
  firebase: {
    apiKey: 'test-api-key',
    authDomain: 'test-auth-domain',
    projectId: 'test-project-id',
    storageBucket: 'test-storage-bucket',
    messagingSenderId: 'test-messaging-sender-id',
    appId: 'test-app-id'
  },
  ai: {
    endpoint: 'http://localhost:3000',
    apiKey: 'test-api-key'
  }
};

const env = process.env.NODE_ENV === 'production' ? production :
           process.env.NODE_ENV === 'test' ? test :
           development;

export default env;
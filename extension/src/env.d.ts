/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_MODEL_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
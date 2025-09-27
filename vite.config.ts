import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'src/newtab/main.tsx'),
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/contentScript.ts'),
        sidepanel: resolve(__dirname, 'src/sidepanel/main.tsx')
      },
      output: {
        format: 'es',
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    modulePreload: {
      polyfill: false
    },
    cssCodeSplit: false,
    sourcemap: true,
    target: 'esnext'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: false
  },
  optimizeDeps: {
    exclude: ['firebase', '@firebase/app']
  }
});
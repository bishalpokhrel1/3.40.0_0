import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: false, // Makes debugging easier
    rollupOptions: {
      input: {
        newtab: path.resolve(__dirname, 'newtab.html'),
        sidepanel: path.resolve(__dirname, 'sidepanel.html'),
        background: path.resolve(__dirname, 'src/background/background.ts'),
        contentScript: path.resolve(__dirname, 'src/content/contentScript.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') return 'background.js'
          if (chunkInfo.name === 'contentScript') return 'contentScript.js'
          return 'assets/[name]-[hash].js'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    outDir: 'dist',
    assetsInlineLimit: 0, // Don't inline assets into JS
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
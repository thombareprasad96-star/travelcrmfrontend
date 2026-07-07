import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname,'src'),
      '@app': path.resolve(import.meta.dirname,'src/app'),
      '@features': path.resolve(import.meta.dirname,'src/features'),
      '@shared': path.resolve(import.meta.dirname,'src/shared'),
    }
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
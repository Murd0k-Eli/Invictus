import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or vue, svelte, etc.

import tailwindcss from '@tailwindcss/vite'

import path from 'path';
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

export default defineConfig({
  build: {
    outDir: '../static/dist', // 👈 Pushes built assets directly to your root static folder
    emptyOutDir: true,
    manifest: true,            // 👈 Essential for django-vite parsing
    rollupOptions: {
      input: './src/main.jsx', // 👈 Identifies main React mount entry path
    }
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
  //root: path.resolve(import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)), 'src'), // already default relative to config file location
  server: {
    port: 3000, // Specify the port you want to use
    proxy: {
      // This forwards any frontend requests starting with /api to Django
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    },
    cors: true,
  }
})

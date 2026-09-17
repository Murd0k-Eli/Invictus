import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or vue, svelte, etc.
import reactPlugin from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import path from 'path';
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

export default defineConfig(( { command } ) => ({
  // 1. ADD THIS LINE: Tells Django to look at the Vite Dev server for assets during development
  //base: process.env.NODE_ENV === 'production' ? '/static/dist/' : 'http://localhost:3000/',
  base: command === 'serve' ? '/' : '/static/dist/',

  build: {
    outDir: '../static/dist', // 👈 Pushes built assets directly to your root static folder
    emptyOutDir: true,
    manifest: true,            // 👈 Essential for django-vite parsing
    rollupOptions: {
      input: './src/main.jsx', // 👈 Identifies main React mount entry path
      navbar: '../static/scripts/nav.css', 
    }
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      // Creates a shortcut pointing to the parent folder's static directory
      '@static': path.resolve(__dirname, '../static'),
    },
  },
  //root: path.resolve(import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)), 'src'), // already default relative to config file location
  server: {
    cors: true,
    hot: true,
    fs: {
      // Crucial: Tells Vite it is allowed to serve files from the parent directory
      allow: [
        path.resolve(__dirname),      // frontend folder
        path.resolve(__dirname, '..') // parent folder containing static/
      ]
    },
    port: 3000, // Specify the port you want to use
    origin: 'http://localhost:3000',
    proxy: {
      // This forwards any frontend requests starting with /api to Django
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    },  
  },
}));

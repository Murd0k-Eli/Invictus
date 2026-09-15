import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or vue, svelte, etc.

import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    outDir: 'dist', // Specify the output directory for the build
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
  root: './',  // already default relative to config file location
  server: {
    port: 3000, // Specify the port you want to use
    proxy: {
      // This forwards any frontend requests starting with /api to Django
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

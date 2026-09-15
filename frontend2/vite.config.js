import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or vue, svelte, etc.

// https://vite.dev/config/
export default defineConfig({
  root: './', // already default relative to config file location
  plugins: [react()],
  server: {
    port: 3000, // Specify the port you want to use
  },
  build: {
    outDir: 'dist', // Specify the output directory for the build
  }
})
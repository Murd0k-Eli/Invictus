import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    // 📂 Save compiled assets directly into your root Django static folder
    outDir: path.resolve(__dirname, '../static'), 
    emptyOutDir: false, // Prevent Vite from wiping your other static assets
    rollupOptions: {
      input: {
        // Point this to your source CSS file handling Tailwind
        styles: path.resolve(__dirname, './src/index.css'), 
      },
      output: {
        // Force Vite to use predictable names without random bundle hashes
        entryFileNames: 'css/dist/[name].js',
        assetFileNames: 'css/dist/[name].[ext]',
      },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-v3',
    rollupOptions: {
      input: {
        main: 'index-v3.html'
      }
    }
  },
  server: {
    port: 3003
  }
});

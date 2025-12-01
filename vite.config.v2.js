import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  server: {
    port: 3001,
    open: '/index-v2.html'
  },
  build: {
    outDir: 'dist-v2',
    sourcemap: true
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // In dev, send /api requests to the local Express server,
    // so the frontend needs no hardcoded URL during development.
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});

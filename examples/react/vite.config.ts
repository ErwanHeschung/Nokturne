import react from '@vitejs/plugin-react';
import { nokturne } from 'nokturne/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), nokturne()],
});

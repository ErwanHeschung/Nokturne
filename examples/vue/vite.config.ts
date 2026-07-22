import vue from '@vitejs/plugin-vue';
import { nokturne } from 'nokturne/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue(), nokturne()],
});

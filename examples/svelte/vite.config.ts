import { svelte } from '@sveltejs/vite-plugin-svelte';
import { nokturne } from 'nokturne/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte(), nokturne()],
});

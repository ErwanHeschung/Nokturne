import type { Plugin } from 'vite';
import { themeScript } from './script';
import type { ScriptOptions } from './script';

export type { ScriptOptions } from './script';

/**
 * Vite plugin that injects Nokturne's no-flash script at the top of `<head>`,
 * so the correct theme is applied before first paint without a hand-written
 * `<script>` tag. Options must match those passed to `createTheme`.
 */
export function nokturne(options: ScriptOptions = {}): Plugin {
  return {
    name: 'nokturne',
    transformIndexHtml: () => [
      {
        tag: 'script',
        children: themeScript(options),
        injectTo: 'head-prepend',
      },
    ],
  };
}

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    core: 'src/core.ts',
    script: 'src/script.ts',
    react: 'src/react.ts',
    vue: 'src/vue.ts',
    svelte: 'src/svelte.ts',
    angular: 'src/angular.ts',
  },
  format: ['esm', 'cjs'],
  dts: false,
  clean: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
});

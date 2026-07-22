import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    core: 'src/core.ts',
    script: 'src/script.ts',
    'adapters/react': 'src/adapters/react.ts',
    'adapters/vue': 'src/adapters/vue.ts',
    'adapters/svelte': 'src/adapters/svelte.ts',
    'adapters/angular': 'src/adapters/angular.ts',
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

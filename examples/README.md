# Examples

One minimal app per adapter, each consuming the local `nokturne` build through
its real `exports` map (linked with `file:../..`). Every app shows the current
choice, resolved theme, and system theme, with buttons to switch and toggle.

The three Vite apps get the no-flash script from the `nokturne/vite` plugin
(see each `vite.config.ts`). Angular has no Vite pipeline, so its script is
inlined directly in `src/index.html`.

| App | Adapter | Entry |
| --- | ------- | ----- |
| [react](./react) | `nokturne/react` | `useTheme()` |
| [vue](./vue) | `nokturne/vue` | `useTheme()` |
| [svelte](./svelte) | `nokturne/svelte` | `themeStore()` |
| [angular](./angular) | `nokturne/angular` | `createThemeSignal()` |

## Running one

Build the library first (the examples resolve the local `dist`):

```bash
# from the repo root
npm install
npm run build
```

Then start any example:

```bash
cd examples/react   # or vue, svelte, angular
npm install
npm run dev         # angular: npm start
```

Note: the Angular example pins TypeScript 6 because the Angular compiler does
not yet support the TypeScript 7 native compiler that the library itself uses.
Each example is isolated with its own `package.json`, so this does not affect
the library build.

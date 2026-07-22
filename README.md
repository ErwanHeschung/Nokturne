<h1 align="center">Nokturne</h1>

<p align="center">
  Framework-agnostic light and dark theming that never flashes. A ~1&nbsp;kB vanilla core with thin adapters for React, Vue, Svelte, and Angular.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/nokturne"><img src="https://img.shields.io/npm/v/nokturne.svg" alt="npm version"></a>
  <a href="https://github.com/ErwanHeschung/Nokturne/actions/workflows/ci.yml"><img src="https://github.com/ErwanHeschung/Nokturne/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <a href="https://bundlephobia.com/package/nokturne"><img src="https://img.shields.io/bundlephobia/minzip/nokturne.svg" alt="minzipped size"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/nokturne.svg" alt="license"></a>
</p>

Most no-flash theming libraries (`next-themes` and friends) are locked to a single framework. Nokturne keeps all the logic in a tiny vanilla core and ships paper-thin adapters on top, so the same behavior works in React, Vue, Svelte, Angular, or no framework at all.

- **Three states.** `light`, `dark`, and `system`. The `system` state keeps following the OS live, rather than freezing at page load.
- **No flash of the wrong theme.** An inline `<head>` script applies the theme before first paint.
- **Persisted and synced.** Saved to `localStorage`, and kept in sync across tabs through the `storage` event.
- **SSR and hydration safe.** The inline script owns the DOM before your app mounts, so there are no hydration mismatches.
- **Tiny and tree-shakeable.** Zero dependencies, shipping ESM, CJS, and types. An Angular user never bundles the React code.

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
- [Framework adapters](#framework-adapters)
- [API](#api)
- [How it works](#how-it-works)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## Install

```bash
npm install nokturne
```

## Quick start

### 1. Add the no-flash script

The correct theme has to be on `<html>` before the page paints, which is before any module can load. So it ships as a small inline script for the top of `<head>`, ahead of everything else.

```ts
import { themeScriptTag } from 'nokturne/script';

// Server template / document head:
head.innerHTML += themeScriptTag();
```

Prefer to paste it directly? This is the same output, with defaults shown:

```html
<script>
  !function(){try{var d=document.documentElement,v=localStorage.getItem("theme");v==="light"||v==="dark"||v==="system"||(v="system");var t=v==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):v;d.setAttribute("data-theme",t);d.style.colorScheme=t}catch(e){}}()
</script>
```

### 2. Style against the theme

```css
:root               { --bg: #ffffff; --fg: #111111; }
[data-theme="dark"] { --bg: #111111; --fg: #f5f5f5; }

body { background: var(--bg); color: var(--fg); }
```

Prefer classes, like Tailwind's `dark:`? Pass `attribute: 'class'` and target `.dark` instead.

### 3. Drive it from your app

```ts
import { createTheme } from 'nokturne';

const theme = createTheme();

theme.getState();         // { theme: 'system', resolvedTheme: 'dark', systemTheme: 'dark' }
theme.setTheme('light');  // persist, apply, notify subscribers
theme.toggle();           // flip light and dark
theme.subscribe(() => console.log(theme.getState().resolvedTheme));
```

> **Keep options in sync.** Whatever you pass to `themeScriptTag` (`storageKey`, `attribute`, `defaultTheme`) has to match what you pass to `createTheme`.

## Framework adapters

Every adapter is a thin wrapper over the core, roughly 100 to 500 bytes, with the same logic behind an idiomatic surface. Call them with no argument to use a shared default controller, or pass your own `createTheme(...)` instance to customize.

<details open>
<summary><strong>React</strong> (<code>nokturne/react</code>)</summary>

```tsx
import { useTheme } from 'nokturne/react';

function ThemeToggle() {
  const { resolvedTheme, toggle } = useTheme();
  return <button onClick={toggle}>{resolvedTheme === 'dark' ? '🌙' : '☀️'}</button>;
}
```

Built on `useSyncExternalStore`, so it is SSR-safe with no hydration warnings.
</details>

<details>
<summary><strong>Vue</strong> (<code>nokturne/vue</code>)</summary>

```vue
<script setup>
import { useTheme } from 'nokturne/vue';
const { resolvedTheme, toggle } = useTheme();
</script>

<template>
  <button @click="toggle">{{ resolvedTheme }}</button>
</template>
```
</details>

<details>
<summary><strong>Svelte</strong> (<code>nokturne/svelte</code>)</summary>

```svelte
<script>
  import { themeStore } from 'nokturne/svelte';
  const theme = themeStore();
</script>

<button on:click={theme.toggle}>{$theme.resolvedTheme}</button>
```
</details>

<details>
<summary><strong>Angular</strong> (<code>nokturne/angular</code>)</summary>

The adapter is a decorator-free factory that returns a signal, so it builds without the Angular compiler. Wrap it in your own service for DI:

```ts
import { Injectable } from '@angular/core';
import { createThemeSignal } from 'nokturne/angular';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private t = createThemeSignal();
  state = this.t.state;        // Signal<ThemeState>
  setTheme = this.t.setTheme;
  toggle = this.t.toggle;
}
```

```html
<button (click)="theme.toggle()">{{ theme.state().resolvedTheme }}</button>
```
</details>

## API

### `createTheme(options?)` → `ThemeController`

| Option        | Type                     | Default         | Description |
| ------------- | ------------------------ | --------------- | ----------- |
| `storageKey`  | `string`                 | `'theme'`       | `localStorage` key used for persistence. |
| `attribute`   | `string \| 'class'`      | `'data-theme'`  | Attribute set on `<html>` to `light`/`dark`. Use `'class'` to toggle `light`/`dark` classes instead. |
| `defaultTheme`| `'light' \| 'dark' \| 'system'` | `'system'` | Theme used when nothing is stored. |

**`ThemeController`**

| Member                   | Description |
| ------------------------ | ----------- |
| `getState()`             | Returns `ThemeState`. The reference is stable until state changes. |
| `subscribe(cb)`          | Subscribe to changes. Returns an unsubscribe function. |
| `setTheme(theme)`        | Set `'light' \| 'dark' \| 'system'`, then persist, apply, and notify. |
| `toggle()`               | Flip between light and dark based on the resolved theme. |
| `destroy()`              | Detach the `matchMedia` and `storage` listeners. |

**`ThemeState`**

| Field           | Type                | Description |
| --------------- | ------------------- | ----------- |
| `theme`         | `Theme`             | The user's choice (`light` / `dark` / `system`). |
| `resolvedTheme` | `'light' \| 'dark'` | The concrete theme applied (`system` resolved against the OS). |
| `systemTheme`   | `'light' \| 'dark'` | What the OS currently prefers. |

### `getDefaultTheme(options?)` → `ThemeController`

The shared instance the adapters use when you don't pass one. It is keyed on a global `Symbol`, so it stays a single controller even across separately bundled entry points. `options` apply only on the first call, so call it once during startup if you need custom options everywhere.

### `nokturne/script`

| Function                | Returns | Description |
| ----------------------- | ------- | ----------- |
| `themeScript(options?)` | `string` | The raw minified no-flash logic, with no `<script>` wrapper. |
| `themeScriptTag(options?)` | `string` | A full `<script>…</script>` string. Accepts `{ nonce }` for CSP. |

## How it works

The `system` state stays live: Nokturne listens to `matchMedia('(prefers-color-scheme: dark)')` and re-resolves whenever the OS flips, instead of reading the preference once at load. Explicit `light` and `dark` choices are written to `localStorage`, and a `storage` listener mirrors changes into every other open tab.

Avoiding the flash is the reason the inline script is separate from the runtime bundle. The theme has to be on `<html>` before the first paint, and a module import cannot run that early. The core and the inline script resolve the theme with identical logic, so the value the script paints and the value your app reads always agree, which is what keeps SSR hydration clean.

## Browser support

Any browser with `matchMedia`, `localStorage`, and `classList`, which means every modern evergreen browser. The core degrades safely when those are missing (for example during SSR or in privacy modes), falling back to `defaultTheme`.

## Contributing

```bash
npm install      # install dependencies
npm run typecheck
npm test         # node --test
npm run build    # tsup (JS) + tsc (types)
```

Issues and pull requests are welcome.

## License

[MIT](./LICENSE) © Erwan Heschung

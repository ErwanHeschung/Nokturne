import { getDefaultTheme } from '../core';
import type { Theme, ThemeController, ThemeState } from '../core';

export interface ThemeStore {
  subscribe(run: (value: ThemeState) => void): () => void;
  setTheme(theme: Theme): void;
  toggle(): void;
}

/** A Svelte-compatible readable store (`$theme`). Omit `controller` for the shared default. */
export function themeStore(
  controller: ThemeController = getDefaultTheme(),
): ThemeStore {
  return {
    subscribe(run) {
      run(controller.getState());
      return controller.subscribe(() => run(controller.getState()));
    },
    setTheme: controller.setTheme,
    toggle: controller.toggle,
  };
}

export type { Theme, ThemeController, ThemeState } from '../core';

import { signal } from '@angular/core';
import type { Signal } from '@angular/core';
import { getDefaultTheme } from './core';
import type { Theme, ThemeController, ThemeState } from './core';

export interface ThemeSignal {
  state: Signal<ThemeState>;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  destroy: () => void;
}

/**
 * Signal-backed theme binding. Decorator-free so it builds without the Angular
 * compiler; wrap it in your own `@Injectable` service for DI. Omit `controller`
 * for the shared default.
 */
export function createThemeSignal(
  controller: ThemeController = getDefaultTheme(),
): ThemeSignal {
  const state = signal<ThemeState>(controller.getState());
  const unsubscribe = controller.subscribe(() => {
    state.set(controller.getState());
  });

  return {
    state: state.asReadonly(),
    setTheme: controller.setTheme,
    toggle: controller.toggle,
    destroy: unsubscribe,
  };
}

export type { Theme, ThemeController, ThemeState } from './core';

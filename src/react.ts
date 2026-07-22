import { useSyncExternalStore } from 'react';
import { getDefaultTheme } from './core';
import type { Theme, ThemeController, ThemeState } from './core';

export interface UseThemeResult extends ThemeState {
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

/** Subscribe a component to the theme. Omit `controller` for the shared default. */
export function useTheme(
  controller: ThemeController = getDefaultTheme(),
): UseThemeResult {
  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
  return {
    ...state,
    setTheme: controller.setTheme,
    toggle: controller.toggle,
  };
}

export type { Theme, ThemeController, ThemeState } from './core';

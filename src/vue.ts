import { computed, onScopeDispose, shallowRef } from 'vue';
import type { ComputedRef } from 'vue';
import { getDefaultTheme } from './core';
import type { ResolvedTheme, Theme, ThemeController } from './core';

export interface UseThemeResult {
  theme: ComputedRef<Theme>;
  resolvedTheme: ComputedRef<ResolvedTheme>;
  systemTheme: ComputedRef<ResolvedTheme>;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

/** Reactive theme composable. Omit `controller` for the shared default. */
export function useTheme(
  controller: ThemeController = getDefaultTheme(),
): UseThemeResult {
  const snap = shallowRef(controller.getState());
  const unsubscribe = controller.subscribe(() => {
    snap.value = controller.getState();
  });
  onScopeDispose(unsubscribe);

  return {
    theme: computed(() => snap.value.theme),
    resolvedTheme: computed(() => snap.value.resolvedTheme),
    systemTheme: computed(() => snap.value.systemTheme),
    setTheme: controller.setTheme,
    toggle: controller.toggle,
  };
}

export type { Theme, ThemeController, ThemeState } from './core';

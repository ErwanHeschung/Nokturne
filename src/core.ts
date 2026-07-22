import type {
  Attribute,
  ResolvedTheme,
  Theme,
  ThemeController,
  ThemeOptions,
  ThemeState,
} from './types';

export type {
  Attribute,
  ResolvedTheme,
  Theme,
  ThemeController,
  ThemeOptions,
  ThemeState,
} from './types';

const DEFAULT_STORAGE_KEY = 'theme';
const DEFAULT_ATTRIBUTE: Attribute = 'data-theme';
const DEFAULT_THEME: Theme = 'system';
const MEDIA = '(prefers-color-scheme: dark)';

const isTheme = (v: unknown): v is Theme =>
  v === 'light' || v === 'dark' || v === 'system';

/** Create a theme controller. Meant to be a singleton per document. */
export function createTheme(options: ThemeOptions = {}): ThemeController {
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const attribute = options.attribute ?? DEFAULT_ATTRIBUTE;
  const defaultTheme = options.defaultTheme ?? DEFAULT_THEME;

  const isBrowser =
    typeof window !== 'undefined' && typeof document !== 'undefined';

  const listeners = new Set<() => void>();
  let mql: MediaQueryList | null = null;

  const getSystemTheme = (): ResolvedTheme => {
    if (!isBrowser || typeof window.matchMedia !== 'function') return 'light';
    return window.matchMedia(MEDIA).matches ? 'dark' : 'light';
  };

  const readStored = (): Theme => {
    if (!isBrowser) return defaultTheme;
    try {
      const v = localStorage.getItem(storageKey);
      if (isTheme(v)) return v;
    } catch {
      // localStorage can throw in privacy mode / sandboxed iframes.
    }
    return defaultTheme;
  };

  let theme: Theme = readStored();
  let systemTheme: ResolvedTheme = getSystemTheme();

  const build = (): ThemeState => ({
    theme,
    systemTheme,
    resolvedTheme: theme === 'system' ? systemTheme : theme,
  });

  // Cached so the reference only changes on real changes — required by
  // useSyncExternalStore and the other adapters.
  let snapshot: ThemeState = build();

  const apply = (): void => {
    if (!isBrowser) return;
    const el = document.documentElement;
    const resolved = snapshot.resolvedTheme;
    if (attribute === 'class') {
      el.classList.remove('light', 'dark');
      el.classList.add(resolved);
    } else {
      el.setAttribute(attribute, resolved);
    }
    el.style.colorScheme = resolved;
  };

  const recompute = (): void => {
    const next = build();
    if (
      next.theme === snapshot.theme &&
      next.resolvedTheme === snapshot.resolvedTheme &&
      next.systemTheme === snapshot.systemTheme
    ) {
      return;
    }
    snapshot = next;
    apply();
    for (const listener of listeners) listener();
  };

  const setTheme = (next: Theme): void => {
    if (!isTheme(next)) return;
    theme = next;
    if (isBrowser) {
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        // ignore write failures
      }
    }
    recompute();
  };

  const toggle = (): void => {
    setTheme(snapshot.resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const onSystemChange = (e: MediaQueryListEvent): void => {
    systemTheme = e.matches ? 'dark' : 'light';
    recompute();
  };

  const onStorage = (e: StorageEvent): void => {
    if (e.key !== storageKey) return;
    theme = isTheme(e.newValue) ? e.newValue : defaultTheme;
    recompute();
  };

  if (isBrowser) {
    if (typeof window.matchMedia === 'function') {
      mql = window.matchMedia(MEDIA);
      mql.addEventListener('change', onSystemChange);
    }
    window.addEventListener('storage', onStorage);
    apply();
  }

  return {
    getState: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setTheme,
    toggle,
    destroy: () => {
      mql?.removeEventListener('change', onSystemChange);
      if (isBrowser) window.removeEventListener('storage', onStorage);
      listeners.clear();
    },
  };
}

// Keyed on a global Symbol so the default stays a true singleton even when
// core is bundled separately into each adapter entry.
const DEFAULT_KEY = Symbol.for('nokturne.default');

interface DefaultHost {
  [DEFAULT_KEY]?: ThemeController;
}

/** Shared default controller, created on first call. `options` apply only then. */
export function getDefaultTheme(options?: ThemeOptions): ThemeController {
  const host = globalThis as DefaultHost;
  host[DEFAULT_KEY] ??= createTheme(options);
  return host[DEFAULT_KEY];
}

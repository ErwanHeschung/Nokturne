/**
 * Minimal DOM / localStorage / matchMedia stub for testing the core without a
 * full jsdom dependency. Installs onto globalThis and returns handles to fire
 * `matchMedia` change and cross-tab `storage` events.
 */

export interface DomHandle {
  attrs: Map<string, string>;
  classes: Set<string>;
  style: { colorScheme: string };
  store: Map<string, string>;
  setSystemDark(v: boolean): void;
  fireStorage(key: string | null, newValue: string | null): void;
  headStyleCount(): number;
}

export function setupDom(
  opts: { dark?: boolean; stored?: string | null } = {},
): DomHandle {
  const store = new Map<string, string>();
  if (opts.stored != null) store.set('theme', opts.stored);

  const changeListeners = new Set<(e: { matches: boolean }) => void>();
  const storageListeners = new Set<
    (e: { key: string | null; newValue: string | null }) => void
  >();

  let systemDark = opts.dark ?? false;

  const classes = new Set<string>();
  const attrs = new Map<string, string>();
  const style = { colorScheme: '' };

  const documentElement = {
    classList: {
      add: (...cs: string[]) => cs.forEach((c) => classes.add(c)),
      remove: (...cs: string[]) => cs.forEach((c) => classes.delete(c)),
      contains: (c: string) => classes.has(c),
    },
    setAttribute: (k: string, v: string) => attrs.set(k, v),
    getAttribute: (k: string) => attrs.get(k) ?? null,
    style,
  };

  const matchMedia = (q: string) => ({
    matches: systemDark,
    media: q,
    addEventListener: (_: string, cb: (e: { matches: boolean }) => void) =>
      changeListeners.add(cb),
    removeEventListener: (_: string, cb: (e: { matches: boolean }) => void) =>
      changeListeners.delete(cb),
  });

  const headStyles = new Set<object>();
  const createElement = () => {
    const el = { appendChild() {}, remove: () => headStyles.delete(el) };
    return el;
  };
  const head = {
    appendChild: (node: object) => headStyles.add(node),
    removeChild: (node: object) => headStyles.delete(node),
  };

  const g = globalThis as Record<string, unknown>;
  g.window = {
    matchMedia,
    getComputedStyle: () => ({}),
    addEventListener: (type: string, cb: (e: never) => void) => {
      if (type === 'storage') storageListeners.add(cb as never);
    },
    removeEventListener: (type: string, cb: (e: never) => void) => {
      if (type === 'storage') storageListeners.delete(cb as never);
    },
  };
  g.document = { documentElement, head, createElement, createTextNode: () => ({}) };
  g.localStorage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => store.set(k, v),
    removeItem: (k: string) => store.delete(k),
  };

  return {
    attrs,
    classes,
    style,
    store,
    setSystemDark(v: boolean) {
      systemDark = v;
      for (const cb of changeListeners) cb({ matches: v });
    },
    fireStorage(key, newValue) {
      for (const cb of storageListeners) cb({ key, newValue });
    },
    headStyleCount: () => headStyles.size,
  };
}

export function teardownDom(): void {
  const g = globalThis as Record<string, unknown>;
  delete g.window;
  delete g.document;
  delete g.localStorage;
}

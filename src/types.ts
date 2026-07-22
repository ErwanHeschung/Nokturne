/** The user's choice. `system` keeps following the OS live. */
export type Theme = 'light' | 'dark' | 'system';

/** The concrete theme actually applied to the document. */
export type ResolvedTheme = 'light' | 'dark';

/**
 * Attribute name to set on `<html>`, or `'class'` to toggle classes.
 * `& {}` keeps the `'class'` autocomplete hint while still accepting any string
 * (a bare `'class' | string` would collapse to `string`).
 */
export type Attribute = 'class' | (string & {});

export interface ThemeState {
  readonly theme: Theme;
  readonly resolvedTheme: ResolvedTheme;
  readonly systemTheme: ResolvedTheme;
}

export interface ThemeOptions {
  /** localStorage key. Default `"theme"`. */
  storageKey?: string;
  /** Attribute to set to `light`/`dark`, or `"class"` to toggle classes. Default `"data-theme"`. */
  attribute?: Attribute;
  /** Theme when nothing is stored. Default `"system"`. */
  defaultTheme?: Theme;
}

export interface ThemeController {
  getState(): ThemeState;
  subscribe(listener: () => void): () => void;
  setTheme(theme: Theme): void;
  toggle(): void;
  destroy(): void;
}

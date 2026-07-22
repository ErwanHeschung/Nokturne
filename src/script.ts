/**
 * No-flash inline script. Runs before first paint (before the module loads),
 * so it ships as a string you inline into `<head>`. Its resolution logic is
 * intentionally identical to the core's.
 */

import type { Attribute, Theme } from './core';

export interface ScriptOptions {
  storageKey?: string;
  attribute?: Attribute;
  defaultTheme?: Theme;
}

/** The no-flash logic as a minified JS string (no `<script>` wrapper). */
export function themeScript(options: ScriptOptions = {}): string {
  const k = JSON.stringify(options.storageKey ?? 'theme');
  const a = JSON.stringify(options.attribute ?? 'data-theme');
  const d = JSON.stringify(options.defaultTheme ?? 'system');
  return (
    `!function(){try{var d=document.documentElement,` +
    `v=localStorage.getItem(${k});` +
    `v==="light"||v==="dark"||v==="system"||(v=${d});` +
    `var t=v==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):v;` +
    `${a}==="class"?(d.classList.remove("light","dark"),d.classList.add(t)):d.setAttribute(${a},t);` +
    `d.style.colorScheme=t}catch(e){}}()`
  );
}

export interface ScriptTagOptions extends ScriptOptions {
  /** CSP nonce for the generated `<script>` tag. */
  nonce?: string;
}

/** A full `<script>…</script>` string ready to inject into `<head>`. */
export function themeScriptTag(options: ScriptTagOptions = {}): string {
  const nonce = options.nonce ? ` nonce="${options.nonce}"` : '';
  return `<script${nonce}>${themeScript(options)}</script>`;
}

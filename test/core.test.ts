import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { createTheme } from '../src/core.ts';
import { setupDom, teardownDom } from './helpers/dom.ts';

afterEach(teardownDom);

test('defaults to system and resolves against a light OS', () => {
  setupDom({ dark: false });
  const t = createTheme();
  const s = t.getState();
  assert.equal(s.theme, 'system');
  assert.equal(s.systemTheme, 'light');
  assert.equal(s.resolvedTheme, 'light');
});

test('system follows a dark OS', () => {
  const dom = setupDom({ dark: true });
  const t = createTheme();
  assert.equal(t.getState().resolvedTheme, 'dark');
  assert.equal(dom.attrs.get('data-theme'), 'dark');
  assert.equal(dom.style.colorScheme, 'dark');
});

test('reads a stored explicit theme', () => {
  const dom = setupDom({ dark: false, stored: 'dark' });
  const t = createTheme();
  assert.equal(t.getState().theme, 'dark');
  assert.equal(t.getState().resolvedTheme, 'dark');
  assert.equal(dom.attrs.get('data-theme'), 'dark');
});

test('getState is referentially stable until something changes', () => {
  setupDom();
  const t = createTheme();
  const a = t.getState();
  assert.equal(a, t.getState());
  t.setTheme('dark');
  assert.notEqual(a, t.getState());
});

test('setTheme persists, applies, and notifies', () => {
  const dom = setupDom();
  const t = createTheme();
  let calls = 0;
  t.subscribe(() => calls++);
  t.setTheme('dark');
  assert.equal(t.getState().resolvedTheme, 'dark');
  assert.equal(dom.store.get('theme'), 'dark');
  assert.equal(dom.attrs.get('data-theme'), 'dark');
  assert.equal(calls, 1);
});

test('system theme updates live and notifies when following the OS', () => {
  const dom = setupDom({ dark: false });
  const t = createTheme();
  let calls = 0;
  t.subscribe(() => calls++);
  dom.setSystemDark(true);
  assert.equal(t.getState().resolvedTheme, 'dark');
  assert.equal(dom.attrs.get('data-theme'), 'dark');
  assert.equal(calls, 1);
});

test('explicit theme is not overridden by an OS change', () => {
  const dom = setupDom({ dark: false });
  const t = createTheme();
  t.setTheme('light');
  dom.setSystemDark(true);
  assert.equal(t.getState().resolvedTheme, 'light');
  assert.equal(t.getState().systemTheme, 'dark');
});

test('cross-tab storage events sync the theme', () => {
  const dom = setupDom();
  const t = createTheme();
  let calls = 0;
  t.subscribe(() => calls++);
  dom.fireStorage('theme', 'dark');
  assert.equal(t.getState().theme, 'dark');
  assert.equal(calls, 1);
});

test('storage events for other keys are ignored', () => {
  const dom = setupDom();
  const t = createTheme();
  let calls = 0;
  t.subscribe(() => calls++);
  dom.fireStorage('something-else', 'dark');
  assert.equal(t.getState().theme, 'system');
  assert.equal(calls, 0);
});

test('toggle flips the resolved theme', () => {
  setupDom({ dark: false });
  const t = createTheme();
  t.toggle();
  assert.equal(t.getState().theme, 'dark');
  t.toggle();
  assert.equal(t.getState().theme, 'light');
});

test('class attribute mode toggles classes instead of an attribute', () => {
  const dom = setupDom({ dark: true });
  const t = createTheme({ attribute: 'class' });
  assert.ok(dom.classes.has('dark'));
  assert.ok(!dom.classes.has('light'));
  t.setTheme('light');
  assert.ok(dom.classes.has('light'));
  assert.ok(!dom.classes.has('dark'));
});

test('custom storage key is honored', () => {
  const dom = setupDom();
  const t = createTheme({ storageKey: 'ui-theme' });
  t.setTheme('dark');
  assert.equal(dom.store.get('ui-theme'), 'dark');
  assert.equal(dom.store.has('theme'), false);
});

test('destroy detaches listeners', () => {
  const dom = setupDom({ dark: false });
  const t = createTheme();
  let calls = 0;
  t.subscribe(() => calls++);
  t.destroy();
  dom.setSystemDark(true);
  dom.fireStorage('theme', 'dark');
  assert.equal(calls, 0);
});

test('is SSR-safe with no DOM present', () => {
  teardownDom();
  const t = createTheme({ defaultTheme: 'dark' });
  const s = t.getState();
  assert.equal(s.theme, 'dark');
  assert.equal(s.resolvedTheme, 'dark');
  assert.equal(s.systemTheme, 'light');
  assert.doesNotThrow(() => t.setTheme('light'));
  assert.doesNotThrow(() => t.destroy());
});

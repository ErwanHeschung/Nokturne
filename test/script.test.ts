import assert from 'node:assert/strict';
import { test } from 'node:test';
import { themeScript, themeScriptTag } from '../src/script.ts';

test('themeScript embeds custom options', () => {
  const s = themeScript({ storageKey: 'ui', attribute: 'class', defaultTheme: 'dark' });
  assert.match(s, /"ui"/);
  assert.match(s, /"class"/);
  assert.match(s, /"dark"/);
});

test('themeScript is syntactically valid, self-invoking JS', () => {
  const s = themeScript();
  assert.doesNotThrow(() => new Function(s));
  assert.ok(s.startsWith('!function()'));
});

test('themeScript resolves correctly in a simulated head (system + dark OS)', () => {
  const applied: Record<string, string> = {};
  const el = {
    classList: { remove() {}, add() {} },
    setAttribute: (k: string, v: string) => (applied[k] = v),
    style: { colorScheme: '' },
  };
  const sandbox = {
    document: { documentElement: el },
    localStorage: { getItem: () => null },
    matchMedia: () => ({ matches: true }),
  };
  const fn = new Function(
    'document',
    'localStorage',
    'matchMedia',
    themeScript(),
  );
  fn(sandbox.document, sandbox.localStorage, sandbox.matchMedia);
  assert.equal(applied['data-theme'], 'dark');
  assert.equal(el.style.colorScheme, 'dark');
});

test('themeScriptTag wraps in a script tag and supports a nonce', () => {
  assert.match(themeScriptTag(), /^<script>.*<\/script>$/s);
  assert.match(themeScriptTag({ nonce: 'abc' }), /^<script nonce="abc">/);
});

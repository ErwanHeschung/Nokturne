// Copy every emitted `.d.ts` to a matching `.d.cts` so the CJS `require`
// condition resolves types correctly under node16/nodenext. The type content
// is identical for ESM and CJS; only the extension matters for resolution.
import { copyFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith('.d.ts')) {
      copyFileSync(path, path.slice(0, -'.d.ts'.length) + '.d.cts');
    }
  }
}

walk('dist');

// Finalize the declarations emitted by tsc so they resolve under node16/
// nodenext, which require explicit extensions on relative imports in .d.ts
// files. tsc (with bundler resolution) emits them extensionless, so we add the
// extension here: `.js` for the ESM `.d.ts`, `.cjs` for the CJS `.d.cts`.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RELATIVE_SPECIFIER = /(\bfrom\s*['"])(\.\.?\/[^'"]+)(['"])/g;

function addExtension(source, ext) {
  return source.replace(RELATIVE_SPECIFIER, (match, pre, spec, post) =>
    /\.(js|cjs|mjs|json)$/.test(spec) ? match : pre + spec + ext + post,
  );
}

function declarationFiles(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) declarationFiles(path, found);
    else if (path.endsWith('.d.ts')) found.push(path);
  }
  return found;
}

for (const file of declarationFiles('dist')) {
  const source = readFileSync(file, 'utf8');
  writeFileSync(file, addExtension(source, '.js'));
  writeFileSync(file.slice(0, -'.d.ts'.length) + '.d.cts', addExtension(source, '.cjs'));
}

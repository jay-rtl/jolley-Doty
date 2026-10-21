import fs from 'node:fs/promises';
import path from 'node:path';

// Next 16.4 can retain Windows separators inside exported segment filenames.
// Add the flat aliases expected by its browser router; Linux output needs no changes.
const root = path.resolve('out');
let aliases = 0;
async function visit(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await visit(file);
    if (!entry.isFile() || !entry.name.endsWith('.txt')) continue;
    const parts = path.relative(root, file).split(path.sep);
    const marker = parts.findIndex((part) => part.startsWith('__next.'));
    if (marker < 0 || marker === parts.length - 1) continue;
    const target = path.join(root, ...parts.slice(0, marker), parts.slice(marker).join('.'));
    const source = await fs.readFile(file);
    const existing = await fs.readFile(target).catch(() => null);
    if (existing && !source.equals(existing)) throw new Error('Conflicting static segment alias.');
    await fs.writeFile(target, source);
    aliases++;
  }
}
await visit(root);
console.log(`Static router segment aliases: ${aliases}`);

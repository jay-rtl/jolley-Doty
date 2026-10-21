import sharp from 'sharp';
import fs from 'node:fs/promises';

// Preserve supplied originals. Only create responsive web delivery variants.
await fs.mkdir('public/images/responsive', { recursive: true });
for (const name of ['book-one', 'book-two', 'book-three']) {
  const metadata = await sharp(`public/images/${name}.webp`).metadata();
  for (const width of [320, 480, 640].filter((width) => width <= metadata.width)) {
    await sharp(`public/images/${name}.webp`)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(`public/images/responsive/${name}-${width}.webp`);
  }
}

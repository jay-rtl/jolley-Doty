import sharp from 'sharp';

// A local, code-authored share graphic using the verified book cover.
const graphic = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f0efe8"/>
  <text x="85" y="235" font-family="Georgia" font-size="76" fill="#203344">Jalleh Doty</text>
  <text x="90" y="315" font-family="Georgia" font-size="32" fill="#203344">The Child of Humanity</text>
  <text x="90" y="370" font-family="Arial" font-size="21" fill="#56616a">Last Savior &#183; The Journey &#183; Final Awakening</text>
  <text x="90" y="475" font-family="Arial" font-size="18" fill="#855139">PAPERBACK EDITIONS</text>
</svg>`);
const cover = await sharp('public/images/book-one.webp').resize({ height: 510 }).toBuffer();
await sharp(graphic)
  .composite([{ input: cover, left: 790, top: 60 }])
  .jpeg({ quality: 88 })
  .toFile('public/images/social-cover.jpg');

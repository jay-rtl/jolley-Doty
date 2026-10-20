import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('out');
const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '/jolley-Doty';
const port = Number(process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    if (url.pathname === '/') {
      res.writeHead(302, { Location: `${prefix}/` });
      res.end();
      return;
    }
    if (url.pathname === prefix) {
      res.writeHead(301, { Location: `${prefix}/${url.search}` });
      res.end();
      return;
    }
    if (!url.pathname.startsWith(`${prefix}/`)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    let file;
    try {
      file = path.resolve(root, `.${decodeURIComponent(url.pathname.slice(prefix.length))}`);
      if (file !== root && !file.startsWith(root + path.sep)) throw Error('Invalid path');
      let info = await fs.stat(file);
      if (info.isDirectory()) {
        if (!url.pathname.endsWith('/')) {
          res.writeHead(301, { Location: `${url.pathname}/${url.search}` });
          res.end();
          return;
        }
        file = path.join(file, 'index.html');
      }
      const data = await fs.readFile(file);
      res.writeHead(200, {
        'Content-Type': types[path.extname(file)] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(await fs.readFile(path.join(root, '404.html')).catch(() => Buffer.from('Not found')));
    }
  })
  .listen(port, '127.0.0.1', () =>
    console.log(`Static preview: http://127.0.0.1:${port}${prefix}/`),
  );

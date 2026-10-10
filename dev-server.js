// Local preview only: serves the family site on http://localhost:3000
// (home page at /, Wanderlings at /tools/wanderlings/). Talks to the real Supabase project.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json' };

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT) || /[\\/](\.git|node_modules)([\\/]|$)/.test(file)) { res.writeHead(404); return res.end('Not found'); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    // Folders open their index.html; add the trailing slash first so relative links work.
    if (!urlPath.endsWith('/')) { res.writeHead(301, { Location: urlPath + '/' }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}).listen(process.env.PORT || 3000, function () { console.log('Tyse Fam preview at http://localhost:' + this.address().port); });

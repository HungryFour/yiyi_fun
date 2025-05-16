const { createServer } = require('http');
const { createServer: createViteServer } = require('vite');
const path = require('path');
const fs = require('fs');

async function startServer() {
  // 创建Vite服务器
  const vite = await createViteServer({
    server: { middlewareMode: 'html' },
    appType: 'spa',
  });

  const server = createServer((req, res) => {
    vite.middlewares(req, res, async () => {
      try {
        // 提供index.html
        const indexHtml = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        );
        const transformedHtml = await vite.transformIndexHtml(req.url, indexHtml);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(transformedHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        console.error(e);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(e.message);
      }
    });
  });

  server.listen(3000, () => {
    console.log('服务器已启动: http://localhost:3000');
  });
}

startServer(); 
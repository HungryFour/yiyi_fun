/**
 * 简单的HTTP服务器，用于本地开发和测试游戏
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 定义服务器端口
const PORT = 3000;

// MIME类型映射
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 解析请求URL
    const parsedUrl = url.parse(req.url);
    
    // 规范化路径名，防止跨目录访问
    let pathname = path.normalize(`.${parsedUrl.pathname}`);
    
    // 如果路径以"/"结尾，默认返回index.html
    if (pathname === './') {
        pathname = './index.html';
    }
    
    // 获取文件扩展名
    const ext = path.extname(pathname);
    
    // 确定文件的MIME类型
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // 读取文件
    fs.readFile(pathname, (err, data) => {
        if (err) {
            // 文件未找到
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                console.log(`404 ${req.url}`);
            } else {
                // 服务器错误
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                console.error(`500 ${err.message}`);
            }
        } else {
            // 成功读取文件
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
            console.log(`200 ${req.url}`);
        }
    });
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}/`);
    console.log('按 Ctrl+C 停止服务器');
}); 
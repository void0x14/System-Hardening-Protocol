/**
 * Copyright (c) 2025-2026 void0x14
 */

#!/usr/bin/env node
/**
 * System Hardening Protocol - Dev Server
 * Zero NPM Dependencies - Pure Node.js
 * 
 * Usage: node server.js
 * Visit: http://localhost:8000
 */

const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 8000;
const HOST = 'localhost';

// Content-Type mapping
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Log request
    console.log(`  [${new Date().toISOString()}] ${req.method} ${req.url}`);

    // Default to index.html if root requested
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Sanitize path (prevent directory traversal)
    filePath = path.normalize(filePath);
    if (filePath.startsWith('..') || filePath.startsWith('/.')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    // Build full path
    const fullPath = path.join(__dirname, filePath);

    // Read and serve file
    fs.readFile(fullPath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`404 Not Found: ${filePath}`);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
            }
        } else {
            // Determine content type
            const ext = path.extname(fullPath);
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            // Set headers
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });
            res.end(content);
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`\n🚀 System Hardening Protocol Dev Server`);
    console.log(`   ├─ Host: ${HOST}`);
    console.log(`   ├─ Port: ${PORT}`);
    console.log(`   ├─ URL: http://${HOST}:${PORT}`);
    console.log(`   └─ Zero NPM Dependencies ✅\n`);
    console.log(`Press Ctrl+C to stop\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\nShutting down server...');
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);
    });
});

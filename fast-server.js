const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const zlib = require('zlib');

const PORT = 8000;

// MIME types with caching settings
const mimeTypes = {
    '.html': { type: 'text/html; charset=utf-8', cache: 300 }, // 5 minutes
    '.css': { type: 'text/css; charset=utf-8', cache: 86400 }, // 1 day
    '.js': { type: 'text/javascript; charset=utf-8', cache: 86400 }, // 1 day
    '.png': { type: 'image/png', cache: 604800 }, // 7 days
    '.jpg': { type: 'image/jpeg', cache: 604800 }, // 7 days
    '.jpeg': { type: 'image/jpeg', cache: 604800 }, // 7 days
    '.webp': { type: 'image/webp', cache: 604800 }, // 7 days
    '.gif': { type: 'image/gif', cache: 604800 }, // 7 days
    '.svg': { type: 'image/svg+xml', cache: 604800 }, // 7 days
    '.ico': { type: 'image/x-icon', cache: 2592000 }, // 30 days
    '.json': { type: 'application/json', cache: 3600 }, // 1 hour
    '.woff': { type: 'font/woff', cache: 2592000 }, // 30 days
    '.woff2': { type: 'font/woff2', cache: 2592000 } // 30 days
};

// Cache for file contents
const fileCache = new Map();

// Compress data
function compress(data, encoding, callback) {
    if (encoding === 'gzip') {
        zlib.gzip(data, callback);
    } else if (encoding === 'deflate') {
        zlib.deflate(data, callback);
    } else {
        callback(null, data);
    }
}

// Get compression encoding
function getCompression(req) {
    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (acceptEncoding.includes('gzip')) return 'gzip';
    if (acceptEncoding.includes('deflate')) return 'deflate';
    return null;
}

// Should compress file
function shouldCompress(mimeTypeInfo) {
    const type = mimeTypeInfo.type;
    return type.startsWith('text/') || 
           type.includes('javascript') || 
           type.includes('json') || 
           type.includes('xml');
}

const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    
    // Default to index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(pathname).toLowerCase();
    const mimeTypeInfo = mimeTypes[ext] || { type: 'text/plain', cache: 0 };
    
    // Security check - prevent path traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, {'Content-Type': 'text/plain'});
        res.end('403 - Forbidden');
        return;
    }
    
    // Check cache first
    const cacheKey = filePath;
    const cachedFile = fileCache.get(cacheKey);
    
    if (cachedFile) {
        sendResponse(res, req, cachedFile.data, mimeTypeInfo, cachedFile.stats);
        return;
    }
    
    // Read file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 - Page Not Found</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #D4AF37; }
                </style>
            </head>
            <body>
                <h1>404 - Page Not Found</h1>
                <p>The requested page could not be found.</p>
                <a href="/">← Go back to homepage</a>
            </body>
            </html>
            `);
            return;
        }
        
        // Get file stats
        fs.stat(filePath, (statErr, stats) => {
            if (statErr) {
                console.error('Stat error:', statErr);
                stats = { mtime: new Date() };
            }
            
            // Cache file (except HTML for development)
            if (ext !== '.html') {
                fileCache.set(cacheKey, { data, stats });
            }
            
            sendResponse(res, req, data, mimeTypeInfo, stats);
        });
    });
    
    function sendResponse(res, req, data, mimeTypeInfo, stats) {
        const compression = shouldCompress(mimeTypeInfo) ? getCompression(req) : null;
        
        // Set headers
        const headers = {
            'Content-Type': mimeTypeInfo.type,
            'Cache-Control': `public, max-age=${mimeTypeInfo.cache}`,
            'ETag': `"${stats.mtime.getTime()}-${data.length}"`,
            'Last-Modified': stats.mtime.toUTCString(),
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Vary': 'Accept-Encoding'
        };
        
        // Check if client has cached version
        const clientETag = req.headers['if-none-match'];
        const clientModified = req.headers['if-modified-since'];
        
        if ((clientETag && clientETag === headers['ETag']) || 
            (clientModified && new Date(clientModified) >= stats.mtime)) {
            res.writeHead(304);
            res.end();
            return;
        }
        
        // Compress if needed
        if (compression) {
            headers['Content-Encoding'] = compression;
            
            compress(data, compression, (compErr, compData) => {
                if (compErr) {
                    console.error('Compression error:', compErr);
                    headers['Content-Length'] = data.length;
                    delete headers['Content-Encoding'];
                    res.writeHead(200, headers);
                    res.end(data);
                } else {
                    headers['Content-Length'] = compData.length;
                    res.writeHead(200, headers);
                    res.end(compData);
                }
            });
        } else {
            headers['Content-Length'] = data.length;
            res.writeHead(200, headers);
            res.end(data);
        }
    }
    
    // Log request with performance info
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
});

// Clear cache periodically (every hour)
setInterval(() => {
    fileCache.clear();
    console.log('Cache cleared');
}, 3600000);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Fast Mobile Server running on port ${PORT}`);
    console.log(`📊 Features: Gzip compression, caching, optimized images`);
    console.log(`🌐 Open http://localhost:${PORT} to test performance`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('Server shutting down gracefully...');
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('Server shutting down gracefully...');
    server.close(() => {
        process.exit(0);
    });
});
// server/serverFramework.js - Fast, lightweight, robust HTTP micro-framework for ReturnRadar
const http = require('node:http');
const url = require('node:url');
const path = require('node:path');
const fs = require('node:fs');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.ics': 'text/calendar; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8'
};

class MiniApp {
  constructor() {
    this.routes = [];
    this.middlewares = [];
    this.staticDir = null;
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  serveStatic(dirPath) {
    this.staticDir = dirPath;
  }

  addRoute(method, pattern, handler) {
    // Convert express-like pattern e.g. /api/purchases/:id into RegExp
    const paramNames = [];
    const regexPath = pattern
      .replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^\\/]+)';
      })
      .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPath}$`);
    this.routes.push({
      method: method.toUpperCase(),
      pattern,
      regex,
      paramNames,
      handler
    });
  }

  get(pattern, handler) {
    this.addRoute('GET', pattern, handler);
  }

  post(pattern, handler) {
    this.addRoute('POST', pattern, handler);
  }

  put(pattern, handler) {
    this.addRoute('PUT', pattern, handler);
  }

  delete(pattern, handler) {
    this.addRoute('DELETE', pattern, handler);
  }

  handleStatic(req, res, pathname) {
    if (!this.staticDir) return false;

    let targetPath = pathname;
    if (targetPath === '/' || targetPath === '') {
      targetPath = '/index.html';
    }

    const safePath = path.normalize(targetPath).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(this.staticDir, safePath);

    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const ext = path.extname(fullPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(fullPath).pipe(res);
      return true;
    }
    return false;
  }

  createServer() {
    return http.createServer(async (req, res) => {
      // Setup response helpers
      res.status = function(code) {
        this.statusCode = code;
        return this;
      };

      res.json = function(data) {
        this.setHeader('Content-Type', 'application/json; charset=utf-8');
        this.setHeader('Access-Control-Allow-Origin', '*');
        this.end(JSON.stringify(data));
      };

      res.send = function(text, contentType = 'text/plain; charset=utf-8') {
        this.setHeader('Content-Type', contentType);
        this.setHeader('Access-Control-Allow-Origin', '*');
        this.end(text);
      };

      // CORS Preflight
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;
      req.query = parsedUrl.query || {};

      // Parse request body for POST/PUT
      let bodyData = Buffer.alloc(0);
      req.on('data', chunk => {
        bodyData = Buffer.concat([bodyData, chunk]);
      });

      req.on('end', async () => {
        const contentType = req.headers['content-type'] || '';
        
        if (contentType.includes('application/json') && bodyData.length > 0) {
          try {
            req.body = JSON.parse(bodyData.toString('utf-8'));
          } catch (e) {
            req.body = {};
          }
        } else if (contentType.includes('multipart/form-data')) {
          req.rawBody = bodyData;
          req.body = parseMultipartFormData(bodyData, contentType);
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const qs = require('node:querystring');
          req.body = qs.parse(bodyData.toString('utf-8'));
        } else {
          req.body = {};
        }

        // Run middlewares
        for (const mw of this.middlewares) {
          let shouldContinue = true;
          await mw(req, res, () => {
            shouldContinue = true;
          });
          if (res.writableEnded) return;
        }

        // Try Route match
        for (const route of this.routes) {
          if (route.method === req.method) {
            const match = pathname.match(route.regex);
            if (match) {
              req.params = {};
              route.paramNames.forEach((name, index) => {
                req.params[name] = decodeURIComponent(match[index + 1]);
              });

              try {
                await route.handler(req, res);
              } catch (err) {
                console.error('Error handling route:', err);
                if (!res.writableEnded) {
                  res.status(500).json({ error: 'Internal Server Error', message: err.message });
                }
              }
              return;
            }
          }
        }

        // Try static file
        if (this.handleStatic(req, res, pathname)) {
          return;
        }

        // SPA Fallback for non-API routes
        if (!pathname.startsWith('/api') && this.staticDir) {
          const indexPath = path.join(this.staticDir, 'index.html');
          if (fs.existsSync(indexPath)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(indexPath).pipe(res);
            return;
          }
        }

        // Not Found
        res.status(404).json({ error: 'Not Found', path: pathname });
      });
    });
  }

  listen(port, callback) {
    const server = this.createServer();
    server.listen(port, callback);
    return server;
  }
}

// Multipart parser for receipt uploads
function parseMultipartFormData(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) return {};
  const boundary = boundaryMatch[1] || boundaryMatch[2];
  const result = { files: {}, fields: {} };

  const boundaryBuffer = Buffer.from(`--${boundary}`);
  let start = 0;

  while ((start = buffer.indexOf(boundaryBuffer, start)) !== -1) {
    start += boundaryBuffer.length;
    if (buffer[start] === 45 && buffer[start + 1] === 45) { // '--' end
      break;
    }
    // Skip CRLF
    if (buffer[start] === 13 && buffer[start + 1] === 10) {
      start += 2;
    }

    const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), start);
    if (headerEnd === -1) break;

    const headerText = buffer.slice(start, headerEnd).toString('utf-8');
    const contentStart = headerEnd + 4;
    const nextBoundary = buffer.indexOf(boundaryBuffer, contentStart);
    if (nextBoundary === -1) break;

    const partData = buffer.slice(contentStart, nextBoundary - 2); // Exclude \r\n before boundary

    const nameMatch = headerText.match(/name="([^"]+)"/i);
    const filenameMatch = headerText.match(/filename="([^"]+)"/i);
    const typeMatch = headerText.match(/Content-Type:\s*([^\r\n]+)/i);

    if (nameMatch) {
      const fieldName = nameMatch[1];
      if (filenameMatch) {
        result.files[fieldName] = {
          filename: filenameMatch[1],
          contentType: typeMatch ? typeMatch[1].trim() : 'application/octet-stream',
          data: partData
        };
      } else {
        result.fields[fieldName] = partData.toString('utf-8');
      }
    }

    start = nextBoundary;
  }

  return { ...result.fields, files: result.files };
}

module.exports = MiniApp;

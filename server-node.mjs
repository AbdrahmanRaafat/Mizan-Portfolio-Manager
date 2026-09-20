import http from 'node:http';
import worker from './server/index.js';

const port = Number(process.env.PORT || 3000);

const server = http.createServer(async (req, res) => {
  try {
    const protoHeader = req.headers['x-forwarded-proto'];
    const hostHeader = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const proto = Array.isArray(protoHeader) ? protoHeader[0] : String(protoHeader || 'http').split(',')[0].trim();
    const host = Array.isArray(hostHeader) ? hostHeader[0] : String(hostHeader).split(',')[0].trim();
    const url = new URL(req.url || '/', proto + '://' + host);

    const headers = new Headers();
    for (let i = 0; i < req.rawHeaders.length; i += 2) {
      const key = req.rawHeaders[i];
      const value = req.rawHeaders[i + 1];
      if (key && value != null) headers.append(key, value);
    }

    let body;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = [];
      for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      body = Buffer.concat(chunks);
    }

    const request = new Request(url, {
      method: req.method,
      headers,
      body
    });

    const response = await worker.fetch(request);
    res.statusCode = response.status;
    res.statusMessage = response.statusText || res.statusMessage;
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (req.method === 'HEAD' || !response.body) {
      res.end();
      return;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    res.end(buffer);
  } catch (error) {
    console.error('MIZAN_SERVER_ERROR', error);
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log('Mizan Portfolio Manager listening on 0.0.0.0:' + port);
});

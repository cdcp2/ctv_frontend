import http from 'node:http';

const port = Number(process.env.MOCK_API_PORT || 3000);

let inlineAdRequestCount = 0;

const article = {
  id: 41,
  title: 'Noticia E2E con hora Colombia',
  slug: 'colombia-time',
  content: '<p>Contenido de prueba para E2E.</p>',
  excerpt: 'Resumen E2E',
  main_image_url: 'https://example.com/article-e2e.jpg',
  video_embed_url: null,
  author_id: 1,
  category_id: 1,
  status: 'published',
  is_featured: false,
  is_breaking: false,
  views_count: 12,
  published_at: '2026-04-04T15:00:00.000Z',
  created_at: '2026-04-04T15:00:00.000Z',
  updated_at: '2026-04-04T15:00:00.000Z',
};

const inlineAds = [
  {
    id: 501,
    title: 'Banner inline 1',
    image_url: 'https://example.com/banner-inline-1.png',
    target_url: 'https://cliente-1.test/',
    position: 'article_inline',
    is_active: true,
    weight: 1,
  },
  {
    id: 502,
    title: 'Banner inline 2',
    image_url: 'https://example.com/banner-inline-2.png',
    target_url: 'https://cliente-2.test/',
    position: 'article_inline',
    is_active: true,
    weight: 1,
  },
];

const footerAds = [
  {
    id: 601,
    title: 'Banner footer',
    image_url: 'https://example.com/banner-footer.png',
    target_url: 'https://cliente-footer.test/',
    position: 'article_footer',
    is_active: true,
    weight: 1,
  },
];

function sendJson(res, body, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Accept',
  });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
    });
    res.end();
    return;
  }

  if (url.pathname === '/healthz') {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    });
    res.end('ok');
    return;
  }

  if (url.pathname === '/api/articles/colombia-time') {
    sendJson(res, article);
    return;
  }

  if (url.pathname === '/api/articles/colombia-time/related') {
    sendJson(res, []);
    return;
  }

  if (url.pathname === '/api/articles/colombia-time/tags') {
    sendJson(res, []);
    return;
  }

  if (url.pathname === '/api/ads') {
    const position = url.searchParams.get('position');

    if (position === 'article_inline') {
      const ad = inlineAds[Math.min(inlineAdRequestCount, inlineAds.length - 1)];
      inlineAdRequestCount += 1;
      sendJson(res, [ad]);
      return;
    }

    if (position === 'article_footer') {
      sendJson(res, footerAds);
      return;
    }

    sendJson(res, []);
    return;
  }

  sendJson(res, { error: 'Not found' }, 404);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Mock API listening on http://127.0.0.1:${port}`);
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

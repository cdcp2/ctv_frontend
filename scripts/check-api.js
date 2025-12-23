/* Quick API sanity check for the public frontend */
const base = process.env.PUBLIC_API_BASE || 'http://localhost:3000';

const endpoints = [
  { path: '/api/articles/videos', label: 'videos' },
  { path: '/api/articles?has_video=true', label: 'articles?has_video' },
  { path: '/api/tags', label: 'tags' },
  { path: '/api/site-config', label: 'site-config' },
];

async function main() {
  for (const ep of endpoints) {
    const url = base + ep.path;
    try {
      const res = await fetch(url);
      const text = await res.text();
      const preview = text.slice(0, 200);
      console.log(`${ep.label}: ${res.status} ${res.ok ? 'OK' : 'FAIL'} ${preview}`);
    } catch (err) {
      console.error(`${ep.label}: ERROR ${err.message}`);
    }
  }
}

main();

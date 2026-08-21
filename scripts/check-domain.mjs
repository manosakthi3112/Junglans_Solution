import https from 'node:https';
import http from 'node:http';
import { URL } from 'node:url';

function fetchUrl(targetUrl) {
  return new Promise((resolve) => {
    const parsed = new URL(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.get(
      targetUrl,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            url: targetUrl,
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      }
    );

    req.on('error', (err) => {
      resolve({ url: targetUrl, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ url: targetUrl, error: 'Request timed out (10s)' });
    });
  });
}

function checkSSL(hostname) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname,
        port: 443,
        method: 'GET',
        path: '/',
        agent: false,
        rejectUnauthorized: false
      },
      (res) => {
        const cert = res.socket.getPeerCertificate();
        if (cert && cert.valid_to) {
          resolve({
            subject: cert.subject?.CN,
            issuer: cert.issuer?.O || cert.issuer?.CN,
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            daysRemaining: Math.round((new Date(cert.valid_to) - new Date()) / (1000 * 60 * 60 * 24))
          });
        } else {
          resolve({ error: 'No certificate found' });
        }
      }
    );
    req.on('error', (err) => resolve({ error: err.message }));
    req.end();
  });
}

async function runAudit() {
  console.log('========================================================');
  console.log('   FULL LIVE DOMAIN AUDIT REPORT: www.junglans.in');
  console.log('========================================================\n');

  // 1. SSL Check
  console.log('1. SSL / TLS CERTIFICATE:');
  const ssl = await checkSSL('www.junglans.in');
  if (ssl.error) {
    console.log('  - SSL Error:', ssl.error);
  } else {
    console.log(`  - Common Name: ${ssl.subject}`);
    console.log(`  - Issuer: ${ssl.issuer}`);
    console.log(`  - Valid Until: ${ssl.validTo} (${ssl.daysRemaining} days remaining)`);
    console.log(`  - Status: ${ssl.daysRemaining > 0 ? 'VALID & ACTIVE' : 'EXPIRED'}`);
  }

  // 2. HTTP Status & Redirects
  console.log('\n2. ENDPOINT RESPONSES & REDIRECTS:');
  const endpoints = [
    'https://www.junglans.in/',
    'https://junglans.in/',
    'http://www.junglans.in/',
    'http://junglans.in/',
    'https://www.junglans.in/robots.txt',
    'https://www.junglans.in/sitemap.xml',
    'https://www.junglans.in/index.html',
    'https://www.junglans.in/blogs',
    'https://www.junglans.in/team',
    'https://www.junglans.in/security',
    'https://www.junglans.in/project/project-0',
    'https://www.junglans.in/blog/classification-metrics-guide'
  ];

  for (const ep of endpoints) {
    const res = await fetchUrl(ep);
    if (res.error) {
      console.log(`  - ${ep} -> ERROR: ${res.error}`);
    } else {
      const loc = res.headers.location ? ` -> Redirects to: ${res.headers.location}` : '';
      let tagInfo = '';
      if (res.body && res.statusCode === 200 && ep.includes('junglans.in/')) {
        const cCount = (res.body.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi) || []).length;
        const tCount = (res.body.match(/<title>[\s\S]*?<\/title>/gi) || []).length;
        const dCount = (res.body.match(/<meta\s+[^>]*name=["']description["'][^>]*>/gi) || []).length;
        tagInfo = ` [Canonicals: ${cCount}, Titles: ${tCount}, Descs: ${dCount}]`;
      }
      console.log(`  - [HTTP ${res.statusCode}] ${ep}${loc}${tagInfo}`);
    }
  }

  // 3. Live HTML Inspection for https://www.junglans.in/
  console.log('\n3. LIVE HEAD TAGS (https://www.junglans.in/):');
  const homeRes = await fetchUrl('https://www.junglans.in/');
  if (homeRes.body) {
    const titles = homeRes.body.match(/<title>[\s\S]*?<\/title>/gi) || [];
    const descriptions = homeRes.body.match(/<meta\s+[^>]*name=["']description["'][^>]*>/gi) || [];
    const canonicals = homeRes.body.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi) || [];
    const robots = homeRes.body.match(/<meta\s+[^>]*name=["']robots["'][^>]*>/gi) || [];
    const ogTitles = homeRes.body.match(/<meta\s+[^>]*property=["']og:title["'][^>]*>/gi) || [];
    const ogImages = homeRes.body.match(/<meta\s+[^>]*property=["']og:image["'][^>]*>/gi) || [];
    const jsonLd = homeRes.body.match(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi) || [];

    console.log(`  - Title: ${titles[0] || 'MISSING'}`);
    console.log(`  - Description: ${descriptions[0] || 'MISSING'}`);
    console.log(`  - Canonical: ${canonicals[0] || 'MISSING'}`);
    console.log(`  - Robots: ${robots[0] || 'MISSING'}`);
    console.log(`  - OG Title: ${ogTitles[0] || 'MISSING'}`);
    console.log(`  - OG Image: ${ogImages[0] || 'MISSING'}`);
    console.log(`  - JSON-LD Structured Data: ${jsonLd.length} schema blocks found`);

    console.log('\n4. SECURITY & CACHING HEADERS:');
    console.log('  - Server:', homeRes.headers.server || 'Vercel');
    console.log('  - Content-Type:', homeRes.headers['content-type']);
    console.log('  - X-Robots-Tag:', homeRes.headers['x-robots-tag'] || 'Not set');
    console.log('  - Cache-Control:', homeRes.headers['cache-control'] || 'Not set');
    console.log('  - X-Content-Type-Options:', homeRes.headers['x-content-type-options'] || 'Not set');
  }

  console.log('\n========================================================\n');
}

runAudit();

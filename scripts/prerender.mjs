/**
 * Prerender real HTML for every memorial, with Open Graph tags.
 *
 * WHY THIS IS NECESSARY, and why react-helmet would not have worked:
 *
 * MemoryGlen is a Vite single-page app. The build emits exactly one HTML file,
 * and every route is drawn by JavaScript after load. WhatsApp, Facebook,
 * iMessage and X do NOT run JavaScript when they unfurl a link — they fetch the
 * URL, read the raw HTML, and stop. So any tag injected at runtime is invisible
 * to them, and every memorial link shares as the generic site title with no
 * name, no dates and no photograph.
 *
 * This writes a real static HTML file per memorial at build time, with the tags
 * already in the markup. Vercel serves a matching static file in preference to
 * the SPA rewrite, so crawlers get the tags and people still get the app.
 *
 * Run automatically as part of `npm run build`.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
/**
 * Base URL for canonical, og:url and og:image.
 *
 * This was hard-coded to https://memoryglen.com, which is WRONG on any other
 * deployment: the preview and V4 sites then advertised absolute image URLs
 * pointing at a different Vercel project, so WhatsApp fetched an image that is
 * not there and showed a preview with no picture.
 *
 * Resolution order:
 *   SITE_URL                        explicit override, set this for the real domain
 *   VERCEL_PROJECT_PRODUCTION_URL   the project's stable production host
 *   VERCEL_URL                      this specific deployment (previews)
 *   localhost                       local builds
 */
function resolveSite() {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`;
  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`;
  return 'http://localhost:5173';
}

const SITE = resolveSite();

/**
 * LivingGlen deployments identify themselves by their host (SITE_URL or the
 * Vercel domain). They get their own theme-color so the prerendered first byte
 * matches the LivingGlen brand for crawlers and mobile browser chrome, instead
 * of MemoryGlen's evergreen. The canonical/og URLs already derive from SITE.
 */
const IS_LIVINGGLEN = /livingglen/i.test(SITE);
const THEME_COLOR = IS_LIVINGGLEN ? '#1C2526' : '#16302B';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Memorials from the content pack, plus the two bespoke pages. */
function collectPages() {
  const pack = JSON.parse(readFileSync(join(root, 'src/data/memorials.json'), 'utf8'));

  const pages = [
    {
      path: '',
      title: 'The Glen Platform · Active Life Operating System & Legacy Vault',
      description:
        'Document daily living milestones, voice memories, time capsules, and sacred family legacy archives.',
      image: '/hero-home.jpg',
      type: 'website',
    },
    {
      path: 'memorials',
      title: 'Memorials — MemoryGlen',
      description: 'Browse memorials on MemoryGlen.',
      image: '/hero-home.jpg',
      type: 'website',
    },
    {
      path: 'memorials/virginia-dadirayi-chiimba',
      title: 'Virginia Dadirayi Chiimba (1955–2025) — MemoryGlen',
      description:
        'In loving memory of Virginia Dadirayi Chiimba, 7 June 1955 – 19 May 2025. Gogo Chiimba. Her life, her family, her voice.',
      image: '/virginia-portrait-blue-headscarf.jpg',
      type: 'profile',
    },
    {
      path: 'memorials/john-peters',
      title: 'John Peters (1958–2026) — MemoryGlen',
      description:
        'In memory of John Peters, 1958–2026. The man who fixed everything. A demonstration memorial.',
      image: '/john-portrait.jpg',
      type: 'profile',
    },
  ];

  for (const m of pack) {
    if (!m.slug || m.slug === 'john-peters') continue;
    const years = m.years ?? `${m.birthYear}–${m.deathYear}`;
    const description = m.awaitingContent
      ? `In memory of ${m.name}, ${years}.`
      : `In memory of ${m.name}, ${years}. ${m.tagline ?? ''}`.trim();
    pages.push({
      path: `memorials/${m.slug}`,
      title: `${m.name} (${years}) — MemoryGlen`,
      description,
      // Never the homepage hero — a shared memorial that unfurls with a picture
      // of somebody else's landing page reads as careless. Use the person's own
      // portrait where one exists, otherwise a neutral memorial card.
      image: memorialImage(m),
      type: 'profile',
    });
  }
  return pages;
}

/** Portrait for a memorial, or a dignified neutral fallback. */
function memorialImage(m) {
  const portrait = `/memorial-portraits/${m.slug}.jpg`;
  if (existsSync(join(root, 'public', portrait))) return portrait;
  return '/og-memorial-fallback.jpg';
}

function withTags(html, page) {
  const url = `${SITE}/${page.path}`.replace(/\/$/, '');
  const image = page.image.startsWith('http') ? page.image : `${SITE}${page.image}`;

  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:site_name" content="MemoryGlen" />`,
    `<meta property="og:type" content="${esc(page.type)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    `<meta name="theme-color" content="${THEME_COLOR}" />`,
  ].join('\n    ');

  // Idempotent: strip anything a previous run injected before injecting again,
  // otherwise running prerender twice on the same dist duplicates every tag and
  // crawlers see two conflicting canonicals.
  return html
    .replace(/<title>.*?<\/title>\s*/s, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="theme-color"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, '')
    .replace('</head>', `    ${tags}\n  </head>`);
}

function main() {
  const shell = join(dist, 'index.html');
  if (!existsSync(shell)) {
    console.error('[prerender] dist/index.html not found — run vite build first.');
    process.exit(1);
  }
  const html = readFileSync(shell, 'utf8');
  const pages = collectPages();

  for (const page of pages) {
    const out = page.path ? join(dist, page.path, 'index.html') : shell;
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, withTags(html, page), 'utf8');
  }

  console.log(`[prerender] wrote ${pages.length} pages with Open Graph tags`);
  console.log(`[prerender] base URL: ${SITE}`);
  if (SITE.includes('localhost')) {
    console.warn(
      '[prerender] WARNING: no SITE_URL / VERCEL_URL found, so share links point at ' +
        'localhost. Set SITE_URL in your Vercel environment variables.',
    );
  }
}

main();

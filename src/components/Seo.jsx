import React, { useEffect } from 'react';
import { SITE_NAME, SITE_URL, SITE_OG_IMAGE, SITE_TITLE, SITE_DESCRIPTION } from '../config';

function updateOrCreateMeta(attrName, attrVal, content) {
  if (typeof document === 'undefined') return;
  const selector = `meta[${attrName}="${attrVal}"]`;
  const existing = document.head.querySelectorAll(selector);
  if (existing.length > 1) {
    for (let i = 1; i < existing.length; i++) existing[i].remove();
  }
  const el = existing[0] || document.createElement('meta');
  el.setAttribute(attrName, attrVal);
  el.setAttribute('content', content);
  if (!existing[0]) document.head.appendChild(el);
}

function updateOrCreateCanonical(href) {
  if (typeof document === 'undefined') return;
  const existing = document.head.querySelectorAll('link[rel="canonical"]');
  if (existing.length > 1) {
    for (let i = 1; i < existing.length; i++) existing[i].remove();
  }
  const el = existing[0] || document.createElement('link');
  el.setAttribute('rel', 'canonical');
  el.setAttribute('href', href);
  if (!existing[0]) document.head.appendChild(el);
}

function updateOrCreateJsonLd(data) {
  if (typeof document === 'undefined') return;
  const existing = document.head.querySelectorAll('script[type="application/ld+json"]');
  if (existing.length > 1) {
    for (let i = 1; i < existing.length; i++) existing[i].remove();
  }
  if (!data) {
    if (existing[0]) existing[0].remove();
    return;
  }
  const el = existing[0] || document.createElement('script');
  el.setAttribute('type', 'application/ld+json');
  el.textContent = JSON.stringify(data);
  if (!existing[0]) document.head.appendChild(el);
}

export default function Seo({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  path = '/',
  type = 'website',
  ogImage = SITE_OG_IMAGE,
  keywords,
  jsonLd,
}) {
  const canonical = `${SITE_URL}${path === '/' ? '/' : path.replace(/\/+$/, '')}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  useEffect(() => {
    // 1. Title
    document.title = fullTitle;

    // 2. Canonical (strictly 1 tag)
    updateOrCreateCanonical(canonical);

    // 3. Meta Description (strictly 1 tag)
    updateOrCreateMeta('name', 'description', description);
    if (keywords) updateOrCreateMeta('name', 'keywords', keywords);
    updateOrCreateMeta('name', 'robots', 'index, follow');

    // 4. OpenGraph
    updateOrCreateMeta('property', 'og:type', type);
    updateOrCreateMeta('property', 'og:site_name', SITE_NAME);
    updateOrCreateMeta('property', 'og:title', fullTitle);
    updateOrCreateMeta('property', 'og:description', description);
    updateOrCreateMeta('property', 'og:url', canonical);
    updateOrCreateMeta('property', 'og:image', ogImage);

    // 5. Twitter
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', fullTitle);
    updateOrCreateMeta('name', 'twitter:description', description);
    updateOrCreateMeta('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    updateOrCreateJsonLd(jsonLd);
  }, [fullTitle, description, canonical, type, ogImage, keywords, jsonLd]);

  // For SSR (prerendering): return elements so renderToString outputs them for extraction into static HTML head
  if (typeof window === 'undefined') {
    return (
      <>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      </>
    );
  }

  // On client: return null to prevent React 19 from creating duplicate hoisted DOM nodes
  return null;
}
import React from 'react';
import { SITE_NAME, SITE_URL, SITE_OG_IMAGE, SITE_TITLE, SITE_DESCRIPTION } from '../config';

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
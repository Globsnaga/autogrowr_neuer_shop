import { useEffect } from 'react';

const SITE_NAME = 'Autogrowr GmbH';
const SITE_URL = 'https://home.autogrowr.de';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
const DEFAULT_DESCRIPTION =
  'Die Autogrowr GmbH entwickelt den Green Grower Klimakontroller: Temperatur, Luftfeuchtigkeit, Beleuchtung und Luftzirkulation intelligent gesteuert. Made in Germany.';

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Setzt Titel, Meta-Description, Open-Graph-/Twitter-Tags, den Canonical-Link
 * und optional strukturierte Daten (JSON-LD) für die aktuell angezeigte Seite.
 *
 * Wichtig für eine client-seitig gerenderte SPA: Diese Änderungen passieren
 * per useEffect NACH dem ersten Render, nicht schon im initialen HTML.
 * Googlebot führt JavaScript aus und sieht die aktualisierten Tags zuverlässig,
 * andere Systeme (z. B. Linkvorschauen in Messengern/Social Media, die kein JS
 * ausführen) sehen dagegen nur die statischen Standard-Tags aus index.html.
 * Das ist ein bewusster, für die Seitengröße vertretbarer Kompromiss — eine
 * vollständige serverseitige Rendering-Umstellung wäre der "saubere" Fix,
 * aber ein deutlich größeres Projekt.
 */
export default function useSeo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image,
  type = 'website',
  noindex = false,
  structuredData = null,
} = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Green Grower Klimakontroller 2026`;
    const url = `${SITE_URL}${path}`;
    const ogImage = image || DEFAULT_IMAGE;

    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:locale', 'de_DE');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    setLink('canonical', url);

    setJsonLd('seo-structured-data', structuredData);
  }, [title, description, path, image, type, noindex, JSON.stringify(structuredData)]);
}

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// Le pagine del sito sono statiche: si caricano all'istante.
// Solo l'admin di Keystatic gira sul server.
// Con `npm run cms` il sito gira in Node senza l'adapter Cloudflare: è l'unico modo in cui
// l'admin può salvare sui file del computer (il runtime di Cloudflare non ha il filesystem).
const cmsLocale = process.env.CMS_LOCALE === '1';

export default defineConfig({
  site: 'https://daretta.it',
  output: 'static',
  adapter: cmsLocale ? undefined : cloudflare(),
  integrations: [react(), markdoc(), keystatic()],
});

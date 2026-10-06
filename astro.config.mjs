import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import csp from './src/integrazioni/csp.mjs';

// Le pagine del sito sono statiche: si caricano all'istante.
// Solo l'admin di Keystatic gira sul server.
// Con `npm run cms` il sito gira in Node senza l'adapter Cloudflare: è l'unico modo in cui
// l'admin può salvare sui file del computer (il runtime di Cloudflare non ha il filesystem).
const cmsLocale = process.env.CMS_LOCALE === '1';

// Pagine che non vanno nella sitemap: la conferma della newsletter e la 404 non si cercano su Google.
const fuoriSitemap = ['/newsletter/benvenuto', '/404'];

export default defineConfig({
  site: 'https://daretta.it',
  output: 'static',
  // Indirizzi senza barra finale (/chi-sono), come i link del sito e i rimandi nei testi del CMS:
  // ogni pagina diventa chi-sono.html e Cloudflare la serve su /chi-sono, senza redirect.
  // Chi arriva con la barra (/chi-sono/) viene rediretto da Cloudflare.
  build: { format: 'file' },
  // Le pagine interne si scaricano quando il cursore si posa sul link (o al tocco): si aprono all'istante.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Le pagine statiche si generano in Node, non nel runtime di Cloudflare: le immagini per i social
  // (src/og) usano WebAssembly e leggono i font dal disco, cose che il runtime non permette durante la build.
  adapter: cmsLocale ? undefined : cloudflare({ prerenderEnvironment: 'node' }),
  // Stessi browser di prima per il CSS (prefissi per Safari compresi): generando in Node, Vite altrimenti
  // usa un obiettivo più recente e toglie qualche prefisso.
  vite: { build: { cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14'] } },
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      filter: (pagina) => !fuoriSitemap.some((p) => new URL(pagina).pathname.replace(/\/$/, '') === p),
    }),
    // Content-Security-Policy con gli hash degli script in linea, in fondo a _headers (vedi il file).
    // Non serve con `npm run cms`, dove non c'è Cloudflare a leggere _headers.
    ...(cmsLocale ? [] : [csp()]),
  ],
});

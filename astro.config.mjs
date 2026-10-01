import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// Le pagine del sito sono statiche: si caricano all'istante.
// Solo l'admin di Keystatic gira sul server.
export default defineConfig({
  site: 'https://daretta.it',
  output: 'static',
  adapter: cloudflare(),
  integrations: [react(), markdoc(), keystatic()],
});

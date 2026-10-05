// Markdoc controlla i file .mdoc al caricamento: qui gli diciamo quali blocchi esistono.
// Il corpo non si disegna con il renderer di Astro ma con src/components/Corpo.astro.
import { defineMarkdocConfig } from '@astrojs/markdoc/config';
import { config } from './src/markdoc';

export default defineMarkdocConfig({
  tags: config.tags as any,
});

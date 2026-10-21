// Scrive dist/client/_redirects con /newsletter/ultima → l'ultimo numero pubblicato, a ogni build.
//
// Serve alla mail: il template di Kit è uno solo per tutti i numeri, quindi «Guarda la versione web»
// ha un indirizzo fisso, e Cloudflare lo manda al numero più recente.
// L'ultimo numero si legge dalle pagine generate (newsletter/AAAA-MM.html): così è sempre uno
// pubblicato davvero, con «Pubblicato» acceso in Keystatic. Se non ce n'è nessuno, niente regola
// e /newsletter/ultima dà la 404, come l'archivio.
// 302 e non 301: la destinazione cambia ogni mese, e un 301 resterebbe nella cache dei browser.

import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export default function newsletterUltima() {
  return {
    name: 'daretta-newsletter-ultima',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const cartella = fileURLToPath(dir);
        let numeri = [];
        try {
          numeri = (await readdir(join(cartella, 'newsletter')))
            .map((f) => f.match(/^(\d{4}-\d{2})\.html$/)?.[1])
            .filter(Boolean)
            .sort();
        } catch {
          // nessuna cartella newsletter: nessun numero pubblicato
        }
        const ultimo = numeri.at(-1);
        const regole = ultimo ? `/newsletter/ultima /newsletter/${ultimo} 302\n` : '';
        await writeFile(join(cartella, '_redirects'), regole);
        logger.info(ultimo ? `/newsletter/ultima → /newsletter/${ultimo}` : 'nessun numero pubblicato, niente /newsletter/ultima');
      },
    },
  };
}

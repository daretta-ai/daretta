// Aggiunge la Content-Security-Policy a dist/client/_headers, a ogni build.
//
// Astro mette in linea gli script piccoli (menu, newsletter): per permetterli senza 'unsafe-inline'
// servono i loro hash, che cambiano ogni volta che cambia il codice. Per questo la CSP non si scrive
// a mano in public/_headers: si calcola qui, leggendo le pagine generate.
//
// Gli stili restano con 'unsafe-inline': le pagine usano attributi style per le variabili CSS
// (--d, --len…), che gli hash non coprono. Il rischio vero di una CSP sta negli script, non negli stili.

import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Cloudflare Web Analytics: lo script lo inietta Cloudflare (static.cloudflareinsights.com)
// e i dati partono verso cloudflareinsights.com.
const ANALYTICS_SCRIPT = 'https://static.cloudflareinsights.com';
const ANALYTICS_DATI = 'https://cloudflareinsights.com';

async function pagineHtml(cartella) {
  const voci = await readdir(cartella, { withFileTypes: true, recursive: true });
  return voci.filter((v) => v.isFile() && v.name.endsWith('.html')).map((v) => join(v.parentPath, v.name));
}

// Contenuto degli script in linea: tag <script> senza src.
function scriptInLinea(html) {
  const trovati = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attributi, corpo] = m;
    if (/\bsrc\s*=/.test(attributi)) continue;
    if (/type\s*=\s*["']?application\/(ld\+)?json/i.test(attributi)) continue; // dati, non codice
    trovati.push(corpo);
  }
  return trovati;
}

export default function csp() {
  return {
    name: 'daretta-csp',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const cartella = fileURLToPath(dir);
        const hash = new Set();
        for (const file of await pagineHtml(cartella)) {
          for (const corpo of scriptInLinea(await readFile(file, 'utf8'))) {
            hash.add(`'sha256-${createHash('sha256').update(corpo, 'utf8').digest('base64')}'`);
          }
        }

        const regole = [
          "default-src 'self'",
          `script-src 'self' ${[...hash].sort().join(' ')} ${ANALYTICS_SCRIPT}`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self' data:",
          `connect-src 'self' ${ANALYTICS_DATI}`,
          "form-action 'self'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "object-src 'none'",
          'upgrade-insecure-requests',
        ];
        const riga = `Content-Security-Policy: ${regole.join('; ')}`;
        // Cloudflare accetta righe fino a 2000 caratteri nel file _headers.
        if (riga.length > 2000) throw new Error(`CSP troppo lunga (${riga.length} caratteri): troppi script in linea`);

        // Va dentro il blocco /* di public/_headers: una seconda regola /* sostituirebbe la prima
        // invece di sommarsi, e gli altri header di sicurezza sparirebbero.
        const percorso = join(cartella, '_headers');
        const righe = (await readFile(percorso, 'utf8')).split('\n');
        const blocco = righe.findIndex((r) => r.trim() === '/*');
        if (blocco === -1) throw new Error('In _headers manca il blocco /*: la CSP non ha dove andare');
        righe.splice(blocco + 1, 0, `  ${riga}`);
        await writeFile(percorso, righe.join('\n'));
        logger.info(`CSP aggiunta a _headers con ${hash.size} script in linea.`);
      },
    },
  };
}

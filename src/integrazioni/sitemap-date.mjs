// Le date di ultima modifica per la sitemap (<lastmod>), lette dai contenuti di Keystatic.
//
// Solo dove c'è una data vera, scritta nel CMS: gli articoli (data, o «Aggiornato il» se c'è) e i
// numeri della newsletter (inviata). Le pagine elenco prendono la data del loro elemento più recente.
// Le altre pagine restano senza <lastmod>: una data inventata è peggio di nessuna data, e Google
// smette di fidarsi della sitemap se le date non corrispondono a modifiche vere.
// Si legge l'intestazione dei file .mdoc perché in astro.config.mjs le collezioni non ci sono ancora.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CONTENUTI = new URL('../content/', import.meta.url);

/** I campi semplici dell'intestazione (chiave: valore su una riga). */
function intestazione(file) {
  const testo = readFileSync(file, 'utf8');
  const blocco = testo.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  return Object.fromEntries(
    blocco
      .split('\n')
      .map((riga) => riga.match(/^(\w+):\s*(.+)$/))
      .filter(Boolean)
      .map(([, chiave, valore]) => [chiave, valore.trim().replace(/^['"]|['"]$/g, '')]),
  );
}

function voci(cartella) {
  const percorso = new URL(`${cartella}/`, CONTENUTI);
  try {
    return readdirSync(percorso)
      .filter((f) => f.endsWith('.mdoc'))
      .map((f) => ({ slug: f.replace(/\.mdoc$/, ''), ...intestazione(join(percorso.pathname, f)) }))
      .filter((v) => v.pubblicato === 'true');
  } catch {
    return [];
  }
}

const giorno = /^\d{4}-\d{2}-\d{2}$/;
const piuRecente = (date) => date.filter((d) => giorno.test(d)).sort().at(-1);

/** Percorso (senza barra finale) → data AAAA-MM-GG. */
export function dateDellaSitemap() {
  const date = new Map();

  const articoli = voci('articoli').map((a) => ({ slug: a.slug, data: a.aggiornato || a.data }));
  for (const a of articoli) if (giorno.test(a.data)) date.set(`/chiacchiere/${a.slug}`, a.data);
  const ultimoArticolo = piuRecente(articoli.map((a) => a.data));
  if (ultimoArticolo) date.set('/chiacchiere', ultimoArticolo);

  const numeri = voci('numeri').map((n) => ({ slug: n.slug, data: n.inviata }));
  for (const n of numeri) if (giorno.test(n.data)) date.set(`/newsletter/${n.slug}`, n.data);
  const ultimoNumero = piuRecente(numeri.map((n) => n.data));
  if (ultimoNumero) date.set('/newsletter', ultimoNumero);

  return date;
}

// Lettura dei contenuti scritti in Keystatic.
// Le pagine chiedono i testi da qui, mai direttamente ai file.
import { getCollection, getEntry } from 'astro:content';
import Markdoc, { type RenderableTreeNode } from '@markdoc/markdoc';
import { config } from './markdoc';

// Markdoc è CommonJS: i nomi si prendono dall'export di default, così funziona in Node e su Cloudflare.
const { Tag } = Markdoc;

// ── Tipi ────────────────────────────────────────────────────────────────────

export type Stato = 'online' | 'in-sviluppo' | 'concept';

export interface Progetto {
  slug: string;
  nome: string;
  provvisorio: boolean;
  stato: Stato;
  card: string;
  titolo: string;
  fase?: string;
  credito?: string;
  link?: string;
  rimando: 'chi-sono' | 'curiosita';
  body: string;
}

export interface Home {
  motto: string;
  presentazione: string;
  pulsante: string;
}

export interface Newsletter {
  titolo: string;
  testo: string;
  segnaposto: string;
  pulsante: string;
  inviato: string;
  giaIscritto: string;
  mailNonValida: string;
  errore: string;
  articoloTitolo: string;
  articoloTesto: string;
  benvenutoTitolo: string;
  benvenutoTesto: string;
}

export interface Microtesti {
  footer: { prima: string; seconda: string };
  scrittiVuoto: string;
  firma?: string;
  nonTrovato: { titolo: string; testo: string; prima: string; link: string };
  stati: { online: string; inSviluppo: string; concept: string };
}

// ── Pagine singole ──────────────────────────────────────────────────────────

async function pagina<T>(id: string): Promise<T> {
  const voce = await getEntry('pagine', id);
  if (!voce) throw new Error(`Manca il contenuto src/content/pagine/${id}.yaml`);
  return voce.data as T;
}

export const getHome = () => pagina<Home>('home');
export const getNewsletter = () => pagina<Newsletter>('newsletter');
export const getMicrotesti = () => pagina<Microtesti>('microtesti');

export async function getChiSono() {
  const voce = await getEntry('testiPagine', 'chi-sono');
  if (!voce) throw new Error('Manca il contenuto src/content/pagine/chi-sono.mdoc');
  return { ...voce.data, body: voce.body ?? '' };
}

// ── Progetti e articoli ─────────────────────────────────────────────────────

export async function getProgetti(): Promise<Progetto[]> {
  const voci = await getCollection('progetti');
  return voci
    .sort((a, b) => a.data.ordine - b.data.ordine || a.data.nome.localeCompare(b.data.nome))
    .map((v) => ({ slug: v.id, ...v.data, body: v.body ?? '' }));
}

export async function getArticoli() {
  // In locale si vedono anche le bozze, così si possono controllare prima di pubblicarle.
  const voci = await getCollection('articoli', (a) => a.data.pubblicato || import.meta.env.DEV);
  return voci
    .sort((a, b) => b.data.data.getTime() - a.data.data.getTime())
    .map((v) => ({ slug: v.id, ...v.data, body: v.body ?? '' }));
}

// ── Testi ───────────────────────────────────────────────────────────────────

/** Divide un testo su più paragrafi (una riga vuota tra l'uno e l'altro). */
export const paragrafi = (testo: string) =>
  testo
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** Minuti di lettura, a 200 parole al minuto. */
export const minutiDiLettura = (testo: string) =>
  Math.max(1, Math.round(testo.replace(/\{%[^%]*%\}/g, ' ').split(/\s+/).filter(Boolean).length / 200));

// ── Corpo a blocchi ─────────────────────────────────────────────────────────
// I blocchi sono quelli di keystatic.config.ts; gli attributi da tenere stanno in src/markdoc.ts.

const NUMERATI = new Set(['blocco', 'numero', 'figura', 'foto']);
const BLOCCHI = new Set([...NUMERATI, 'citazione', 'confronto']);

/**
 * Trasforma il corpo scritto in Keystatic nell'albero che Corpo.astro disegna.
 * Numera i blocchi in ordine (da `inizio`) e passa lo stato del progetto a chi lo mostra.
 */
export function corpo(body: string, opzioni: { inizio?: number; stato?: Stato } = {}): RenderableTreeNode[] {
  const ast = Markdoc.parse(body);
  const errori = Markdoc.validate(ast, config).filter((e) => e.error.level === 'error' || e.error.level === 'critical');
  if (errori.length) {
    throw new Error(
      'Il testo ha blocchi non validi:\n' + errori.map((e) => `riga ${e.lines?.[0] ?? '?'}: ${e.error.message}`).join('\n')
    );
  }
  const radice = Markdoc.transform(ast, config);
  // Il testo scritto fuori dai blocchi finisce in un paragrafo senza etichetta, nella colonna di lettura.
  const figli: RenderableTreeNode[] = [];
  for (const nodo of Tag.isTag(radice) ? radice.children : [radice]) {
    if (Tag.isTag(nodo) && BLOCCHI.has(nodo.name)) figli.push(nodo);
    else {
      const ultimo = figli.at(-1);
      if (Tag.isTag(ultimo) && ultimo.name === 'blocco' && ultimo.attributes.libero) ultimo.children.push(nodo);
      else figli.push(new Tag('blocco', { libero: true, spazio: 'piccolo' }, [nodo]));
    }
  }
  let n = opzioni.inizio ?? 1;
  for (const nodo of figli) {
    if (!Tag.isTag(nodo)) continue;
    if (NUMERATI.has(nodo.name) && !nodo.attributes.libero) nodo.attributes.n = n++;
    if (nodo.attributes.stato) nodo.attributes.stato = opzioni.stato;
    else delete nodo.attributes.stato;
  }
  return figli;
}

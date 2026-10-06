// Immagini di anteprima per i social (1200×630), dalla tavola design/tavole/AnteprimaSocial.html.
// Satori disegna il layout in SVG, resvg lo trasforma in PNG. Si generano durante la build:
// nessun servizio esterno, e ogni salvataggio in Keystatic rigenera l'immagine della sua pagina.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import type { Stato } from '../cms';

const L = 1200;
const A = 630;

// Colori dal design system (src/styles/token.css)
const C = {
  cemento: '#111314',
  petrolioAlone: '#17393e',
  petrolioLuce: '#1e4f56',
  punti: '#2c8a93',
  onda: '#6ccbd3',
  inchiostro: '#ecece7',
  inchiostroCorpo: '#d2d4ce',
  inchiostroMuto: '#9aa3a4',
  arancio: '#ff4f1a',
};

// ── Font: dai pacchetti @fontsource, in WOFF (Satori non legge il WOFF2) ─────
const richiedi = createRequire(import.meta.url);
const font = (pacchetto: string, file: string) =>
  readFileSync(richiedi.resolve(`${pacchetto}/files/${file}`));

let fontCaricati: Parameters<typeof satori>[1]['fonts'] | undefined;
function fonts() {
  fontCaricati ??= [
    { name: 'Doto', data: font('@fontsource/doto', 'doto-latin-900-normal.woff'), weight: 900, style: 'normal' },
    { name: 'Geist', data: font('@fontsource/geist-sans', 'geist-sans-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Geist', data: font('@fontsource/geist-sans', 'geist-sans-latin-600-normal.woff'), weight: 600, style: 'normal' },
    { name: 'Geist Mono', data: font('@fontsource/geist-mono', 'geist-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
  ];
  return fontCaricati;
}

// ── Mini JSX senza React: Satori accetta oggetti { type, props } ─────────────
type Nodo = { type: string; props: Record<string, unknown> } | string;
function h(type: string, style: Record<string, unknown>, ...children: Nodo[]): Nodo {
  return { type, props: { style, children: children.length === 1 ? children[0] : children } };
}
const img = (src: string, style: Record<string, unknown>): Nodo => ({ type: 'img', props: { src, style } });
const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

// ── La sfera: luce petrolio e punti su una sfera di Fibonacci, sempre uguale ─
function sfera(grande: boolean): string {
  const cx = grande ? 955 : 1090;
  const cy = grande ? 315 : 120;
  const r = grande ? 205 : 120;
  const n = grande ? 900 : 420;
  const t = 0.5;
  const ct = Math.cos(t);
  const st = Math.sin(t);
  const punti: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const yv = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - yv * yv);
    const th = i * 2.399963 + 0.9;
    const px = Math.cos(th) * rad;
    const pz = Math.sin(th) * rad;
    punti.push([px, yv * ct - pz * st, yv * st + pz * ct]);
  }
  punti.sort((a, b) => a[2] - b[2]);
  const cerchi = punti
    .map(([px, py, pz]) => {
      const d = (pz + 1) / 2;
      const raggio = (grande ? 1.6 : 1.3) + d * (grande ? 2.6 : 1.9);
      const colore = d > 0.78 ? C.onda : C.punti;
      return `<circle cx="${(cx + px * r).toFixed(1)}" cy="${(cy + py * r).toFixed(1)}" r="${raggio.toFixed(2)}" fill="${colore}" fill-opacity="${(0.18 + d * 0.82).toFixed(2)}"/>`;
    })
    .join('');
  const fine = r * (grande ? 3.2 : 4.2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}" viewBox="0 0 ${L} ${A}">
<defs><radialGradient id="l" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${fine}">
<stop offset="${((r * 0.2) / fine).toFixed(3)}" stop-color="${C.petrolioLuce}"/><stop offset="0.35" stop-color="${C.petrolioAlone}"/><stop offset="1" stop-color="${C.cemento}"/>
</radialGradient></defs><rect width="${L}" height="${A}" fill="url(#l)"/>${cerchi}</svg>`;
}

// ── Pezzi comuni ─────────────────────────────────────────────────────────────
const mono = { fontFamily: 'Geist Mono', fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: C.inchiostroMuto };

const logotipo = (dimensione: number) =>
  h(
    'div',
    { display: 'flex', fontFamily: 'Doto', fontWeight: 900, fontSize: dimensione, lineHeight: 0.9, color: C.inchiostro },
    'd',
    h('span', { color: C.arancio }, 'à'),
    'retta',
  );

// I segni degli stati: pallino pieno arancio (ONLINE), anello (IN SVILUPPO), anello tratteggiato (CONCEPT)
function segnoStato(stato: Stato): Nodo {
  const dentro =
    stato === 'online'
      ? `<circle cx="11" cy="11" r="9" fill="${C.arancio}"/>`
      : `<circle cx="11" cy="11" r="8" fill="none" stroke="${C.inchiostroMuto}" stroke-width="2.5"${stato === 'concept' ? ' stroke-dasharray="4 3"' : ''}/>`;
  return img(svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">${dentro}</svg>`), { width: 22, height: 22 });
}
const NOMI_STATO: Record<Stato, string> = { online: 'Online', 'in-sviluppo': 'In sviluppo', concept: 'Concept' };

function fondo(grande: boolean, ...contenuto: Nodo[]): Nodo {
  return h(
    'div',
    { display: 'flex', position: 'relative', width: L, height: A, backgroundColor: C.cemento, fontFamily: 'Geist' },
    img(svgUri(sfera(grande)), { position: 'absolute', left: 0, top: 0, width: L, height: A }),
    ...contenuto,
  );
}

// ── Le tre versioni ──────────────────────────────────────────────────────────
function sito(): Nodo {
  return fondo(
    true,
    h('div', { display: 'flex', position: 'absolute', left: 72, top: 0, bottom: 0, alignItems: 'center' }, logotipo(150)),
    h('div', { display: 'flex', position: 'absolute', left: 72, bottom: 64, ...mono, letterSpacing: 2.2 }, 'DARETTA.IT'),
  );
}

interface Voce {
  etichetta: string;
  accanto: Nodo;
  titolo: string;
  sotto?: string;
  dominio: string;
}

function voce({ etichetta, accanto, titolo, sotto, dominio }: Voce): Nodo {
  const lungo = titolo.length > 30;
  return fondo(
    false,
    h(
      'div',
      { display: 'flex', flexDirection: 'column', position: 'absolute', left: 0, top: 0, width: L, height: A, padding: '64px 72px' },
      h('div', { display: 'flex', alignItems: 'center', gap: 22 }, h('span', mono, etichetta), accanto),
      h(
        'div',
        {
          display: 'flex',
          marginTop: 56,
          maxWidth: 780,
          fontWeight: 600,
          fontSize: lungo ? 68 : 84,
          lineHeight: 1.04,
          letterSpacing: lungo ? -1.4 : -1.7,
          color: C.inchiostro,
        },
        titolo,
      ),
      ...(sotto
        ? [h('div', { display: 'flex', marginTop: 24, maxWidth: 700, fontSize: 32, lineHeight: 1.35, color: C.inchiostroCorpo }, sotto)]
        : []),
      h(
        'div',
        { display: 'flex', marginTop: 'auto', alignItems: 'flex-end', justifyContent: 'space-between' },
        logotipo(56),
        h('span', { ...mono, letterSpacing: 2.2 }, dominio),
      ),
    ),
  );
}

export function progetto(p: { nome: string; card: string; stato: Stato }): Nodo {
  return voce({
    etichetta: '[ 004 ] Progetti',
    accanto: h('div', { display: 'flex', alignItems: 'center', gap: 12, ...mono }, segnoStato(p.stato), NOMI_STATO[p.stato]),
    titolo: p.nome,
    sotto: p.card,
    dominio: 'DARETTA.IT/PROGETTI',
  });
}

export function articolo(a: { titolo: string; data: Date; minuti: number }): Nodo {
  const data = a.data.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  return voce({
    etichetta: '[ 003 ] Scritti',
    accanto: h('span', mono, `${data} · ${a.minuti} min`),
    titolo: a.titolo,
    dominio: 'DARETTA.IT/SCRITTI',
  });
}

export { sito };

// resvg in WebAssembly: gira uguale in Node, nella build di Cloudflare e in ogni sistema, senza binari nativi
let wasmPronto: Promise<void> | undefined;
const resvgPronto = () => (wasmPronto ??= initWasm(readFileSync(richiedi.resolve('@resvg/resvg-wasm/index_bg.wasm'))));

/** Trasforma un layout in PNG 1200×630. */
export async function png(nodo: Nodo): Promise<Uint8Array> {
  await resvgPronto();
  // Satori vuole un elemento, non una stringa: il cast è solo per i tipi
  const svg = await satori(nodo as Parameters<typeof satori>[0], { width: L, height: A, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: L } }).render().asPng();
}

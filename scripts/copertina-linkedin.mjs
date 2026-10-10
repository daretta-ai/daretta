// Copertina del profilo LinkedIn (1584×396, esportata a 2x), dalla composizione della hero:
// logotipo a sinistra, sfera a destra. Il logotipo parte dopo la zona coperta dalla foto profilo.
// Uso: node scripts/copertina-linkedin.mjs <cartella di uscita>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';

const L = 1584;
const A = 396;
const SCALA = 2;
const uscita = process.argv[2] ?? '.';

const C = {
  cemento: '#111314',
  petrolioAlone: '#17393e',
  petrolioLuce: '#1e4f56',
  punti: '#2c8a93',
  onda: '#6ccbd3',
  inchiostro: '#ecece7',
  inchiostroMuto: '#9aa3a4',
  arancio: '#ff4f1a',
};

const richiedi = createRequire(import.meta.url);
const font = (p, f) => readFileSync(richiedi.resolve(`${p}/files/${f}`));
const fonts = [
  { name: 'Doto', data: font('@fontsource/doto', 'doto-latin-900-normal.woff'), weight: 900, style: 'normal' },
  { name: 'Geist Mono', data: font('@fontsource/geist-mono', 'geist-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
];

const h = (type, style, ...children) => ({ type, props: { style, children: children.length === 1 ? children[0] : children } });
const img = (src, style) => ({ type: 'img', props: { src, style } });
const svgUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

// Stessa sfera delle anteprime social (src/og/anteprima.ts), solo ricentrata
function sfera(cx, cy, r, n) {
  const t = 0.5, ct = Math.cos(t), st = Math.sin(t);
  const punti = [];
  for (let i = 0; i < n; i++) {
    const yv = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - yv * yv);
    const th = i * 2.399963 + 0.9;
    const px = Math.cos(th) * rad, pz = Math.sin(th) * rad;
    punti.push([px, yv * ct - pz * st, yv * st + pz * ct]);
  }
  punti.sort((a, b) => a[2] - b[2]);
  const cerchi = punti.map(([px, py, pz]) => {
    const d = (pz + 1) / 2;
    const raggio = 1.4 + d * 2.2;
    const colore = d > 0.78 ? C.onda : C.punti;
    return `<circle cx="${(cx + px * r).toFixed(1)}" cy="${(cy + py * r).toFixed(1)}" r="${raggio.toFixed(2)}" fill="${colore}" fill-opacity="${(0.18 + d * 0.82).toFixed(2)}"/>`;
  }).join('');
  const fine = r * 3.6;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}" viewBox="0 0 ${L} ${A}">
<defs><radialGradient id="l" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${fine}">
<stop offset="${((r * 0.2) / fine).toFixed(3)}" stop-color="${C.petrolioLuce}"/><stop offset="0.35" stop-color="${C.petrolioAlone}"/><stop offset="1" stop-color="${C.cemento}"/>
</radialGradient></defs><rect width="${L}" height="${A}" fill="url(#l)"/>${cerchi}</svg>`;
}

const logotipo = (dim) => h('div', { display: 'flex', fontFamily: 'Doto', fontWeight: 900, fontSize: dim, lineHeight: 0.9, color: C.inchiostro },
  'd', h('span', { color: C.arancio }, 'à'), 'retta');
const mono = { fontFamily: 'Geist Mono', fontSize: 20, letterSpacing: 2.2, textTransform: 'uppercase', color: C.inchiostroMuto };

const copertina = h('div', { display: 'flex', position: 'relative', width: L, height: A, backgroundColor: C.cemento },
  img(svgUri(sfera(1270, 198, 150, 700)), { position: 'absolute', left: 0, top: 0, width: L, height: A }),
  h('div', { display: 'flex', flexDirection: 'column', position: 'absolute', left: 430, top: 0, bottom: 0, justifyContent: 'center', gap: 26 },
    logotipo(128),
    h('div', { display: 'flex', ...mono }, 'DARETTA.IT')),
);

await initWasm(readFileSync(richiedi.resolve('@resvg/resvg-wasm/index_bg.wasm')));
const svg = await satori(copertina, { width: L, height: A, fonts });
mkdirSync(uscita, { recursive: true });
const png = new Resvg(svg, { fitTo: { mode: 'width', value: L * SCALA } }).render().asPng();
writeFileSync(join(uscita, 'copertina-linkedin.png'), png);

// Prova: stessa copertina con il cerchio della foto profilo dove lo mette LinkedIn su desktop
const prova = svg.replace('</svg>', `<circle cx="197" cy="396" r="152" fill="#9aa3a4" fill-opacity="0.55" stroke="#ecece7" stroke-width="4"/></svg>`);
writeFileSync(join(uscita, 'copertina-linkedin-prova.png'), new Resvg(prova, { fitTo: { mode: 'width', value: L } }).render().asPng());
console.log('ok');

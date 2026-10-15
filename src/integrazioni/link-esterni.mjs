// I link verso altri siti si aprono in una scheda nuova, così la scheda di dàretta non si perde.
//
// È una regola sola per tutto il sito: si applica alle pagine generate, a ogni build, quindi vale
// per i componenti, per i testi scritti in Keystatic e per ogni link che arriverà, senza che nessuno
// se ne debba ricordare. Esterno vuol dire http o https verso un dominio diverso da daretta.it;
// mail, ancore e indirizzi interni restano come sono.
//
// A ogni link esterno aggiunge target="_blank" e, nel rel che c'è già (es. «me»), noopener: la
// pagina aperta non può toccare la nostra scheda. Niente noreferrer, per scelta: chi riceve la
// visita (un progetto, un profilo) vede che arriva da daretta.it.

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITO = 'daretta.it';

async function pagineHtml(cartella) {
  const voci = await readdir(cartella, { withFileTypes: true, recursive: true });
  return voci.filter((v) => v.isFile() && v.name.endsWith('.html')).map((v) => join(v.parentPath, v.name));
}

function esterno(href) {
  try {
    const url = new URL(href);
    if (!/^https?:$/.test(url.protocol)) return false;
    return url.hostname !== SITO && !url.hostname.endsWith(`.${SITO}`);
  } catch {
    return false; // indirizzi relativi: sono del sito
  }
}

const attributo = (attributi, nome) =>
  attributi.match(new RegExp(`\\s${nome}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));

function sistemaLink(html) {
  let contati = 0;
  const nuovo = html.replace(/<a\b([^>]*)>/gi, (tag, attributi) => {
    const href = attributo(attributi, 'href');
    if (!href || !esterno(href[1] ?? href[2] ?? href[3])) return tag;
    contati++;

    let resto = attributi;
    const rel = attributo(resto, 'rel');
    const valori = new Set((rel ? (rel[1] ?? rel[2] ?? rel[3]) : '').split(/\s+/).filter(Boolean));
    valori.add('noopener');
    if (rel) resto = resto.replace(rel[0], '');
    const target = attributo(resto, 'target');
    if (target) resto = resto.replace(target[0], '');

    return `<a${resto} target="_blank" rel="${[...valori].join(' ')}">`;
  });
  return { nuovo, contati };
}

export default function linkEsterni() {
  return {
    name: 'daretta-link-esterni',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        let totale = 0;
        for (const file of await pagineHtml(fileURLToPath(dir))) {
          const html = await readFile(file, 'utf8');
          const { nuovo, contati } = sistemaLink(html);
          if (contati) await writeFile(file, nuovo);
          totale += contati;
        }
        logger.info(`${totale} link esterni aperti in una scheda nuova.`);
      },
    },
  };
}

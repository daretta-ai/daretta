// Feed RSS delle Chiacchiere: titolo, attacco e link di ogni articolo pubblicato.
// Il testo intero resta sul sito: nel feed c'è l'attacco, come nella lista delle Chiacchiere.
// I numeri della newsletter non ci sono, per scelta (21 ottobre 2026).
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticoli } from '../cms';

export async function GET(context: APIContext) {
  const articoli = await getArticoli();
  return rss({
    title: 'dàretta',
    description: 'Le chiacchiere di Patrizio Bartolozzi.',
    site: context.site!,
    items: articoli.map((a) => ({
      title: a.titolo,
      description: a.attacco,
      pubDate: a.data,
      link: `/chiacchiere/${a.slug}`,
      categories: a.tag ? [a.tag.toLocaleLowerCase('it')] : undefined,
    })),
    // Il link «self» dice ai lettori di feed qual è l'indirizzo del feed stesso.
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>it-it</language><atom:link href="${new URL('/rss.xml', context.site)}" rel="self" type="application/rss+xml"/>`,
    // Link senza barra finale, come gli indirizzi del sito
    trailingSlash: false,
  });
}

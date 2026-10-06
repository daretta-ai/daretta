// Feed RSS degli Scritti: titolo, attacco e link di ogni articolo pubblicato.
// Il testo intero resta sul sito: nel feed c'è l'attacco, come nella lista degli Scritti.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticoli } from '../cms';

export async function GET(context: APIContext) {
  const articoli = await getArticoli();
  return rss({
    title: 'dàretta',
    description: 'Gli scritti di Patrizio Bartolozzi.',
    site: context.site!,
    items: articoli.map((a) => ({
      title: a.titolo,
      description: a.attacco,
      pubDate: a.data,
      link: `/scritti/${a.slug}`,
      categories: a.tag ? [a.tag] : undefined,
    })),
    customData: '<language>it-it</language>',
    // Link senza barra finale, come gli indirizzi del sito
    trailingSlash: false,
  });
}

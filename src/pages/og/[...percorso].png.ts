// Immagini di anteprima per i social: /og/sito.png, /og/progetti/<slug>.png, /og/chiacchiere/<slug>.png,
// /og/newsletter/<AAAA-MM>.png.
// Si generano durante la build (le pagine sono statiche), dai testi in Keystatic.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getArticoli, getNumeri, getProgetti, minutiDiLettura } from '../../cms';
import { articolo, numero, png, progetto, sito } from '../../og/anteprima';

export const getStaticPaths = (async () => {
  const progetti = await getProgetti();
  const articoli = await getArticoli();
  const numeri = await getNumeri();
  return [
    { params: { percorso: 'sito' }, props: { disegno: () => sito() } },
    ...progetti.map((p) => ({
      params: { percorso: `progetti/${p.slug}` },
      props: { disegno: () => progetto(p) },
    })),
    ...articoli.map((a) => ({
      params: { percorso: `chiacchiere/${a.slug}` },
      props: { disegno: () => articolo({ titolo: a.titolo, data: a.data, minuti: minutiDiLettura(a.body) }) },
    })),
    ...numeri.map((n) => ({
      params: { percorso: `newsletter/${n.slug}` },
      props: { disegno: () => numero(n) },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const immagine = await png((props as { disegno: () => Parameters<typeof png>[0] }).disegno());
  return new Response(new Uint8Array(immagine), { headers: { 'Content-Type': 'image/png' } });
};

// Immagini di anteprima per i social: /og/sito.png, /og/progetti/<slug>.png, /og/scritti/<slug>.png.
// Si generano durante la build (le pagine sono statiche), dai testi in Keystatic.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getArticoli, getProgetti, minutiDiLettura } from '../../cms';
import { articolo, png, progetto, sito } from '../../og/anteprima';

export const getStaticPaths = (async () => {
  const progetti = await getProgetti();
  const articoli = await getArticoli();
  return [
    { params: { percorso: 'sito' }, props: { disegno: () => sito() } },
    ...progetti.map((p) => ({
      params: { percorso: `progetti/${p.slug}` },
      props: { disegno: () => progetto(p) },
    })),
    ...articoli.map((a) => ({
      params: { percorso: `scritti/${a.slug}` },
      props: { disegno: () => articolo({ titolo: a.titolo, data: a.data, minuti: minutiDiLettura(a.body) }) },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const immagine = await png((props as { disegno: () => Parameters<typeof png>[0] }).disegno());
  return new Response(new Uint8Array(immagine), { headers: { 'Content-Type': 'image/png' } });
};

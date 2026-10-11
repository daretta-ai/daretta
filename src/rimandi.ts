// Le righe della chiusura (design system, «La chiusura»). Ogni pagina ne sceglie due:
// la prima porta alla cosa successiva dello stesso tipo, la seconda verso progetti o scritti.
import { getArticoli, getMicrotesti } from './cms';

export interface Rimando {
  etichetta: string;
  testo: string;
  href: string;
}

export const progetti: Rimando = {
  etichetta: 'Progetti',
  testo: 'Quello che porto avanti la sera.',
  href: '/#progetti',
};

export const chiSono: Rimando = {
  etichetta: 'Chi sono',
  testo: 'Uno scalino più su.',
  href: '/chi-sono',
};

export const tuttiGliScritti: Rimando = {
  etichetta: 'Tutti gli scritti',
  testo: "Torna all'elenco.",
  href: '/scritti',
};

/** L'ultimo articolo pubblicato; finché non ce n'è uno, la frase di Scritti vuoto. */
export async function ultimoScritto(): Promise<Rimando> {
  const [articoli, micro] = await Promise.all([getArticoli(), getMicrotesti()]);
  const ultimo = articoli[0];
  return ultimo
    ? { etichetta: 'Ultimo scritto', testo: ultimo.titolo, href: `/scritti/${ultimo.slug}` }
    : { etichetta: 'Scritti', testo: micro.scrittiVuoto, href: '/scritti' };
}

// Le righe della chiusura (design system, «La chiusura»). Ogni pagina ne sceglie due:
// la prima porta alla cosa successiva dello stesso tipo, la seconda verso progetti o scritti.
import { getArticoli, getMicrotesti, getProgetti, type Progetto } from './cms';

export interface Rimando {
  etichetta: string;
  testo: string;
  href: string;
  descrizione?: string; // sotto il testo, in piccolo: la frase della card per i progetti
  tutti?: { etichetta: string; href: string }; // link a destra dell'etichetta
}

const tuttiIProgetti = { etichetta: 'Vedi tutti', href: '/#progetti' };

/** Un progetto preciso, mai la sezione: il nome dice poco, quindi sotto c'è la frase della card. */
export function rigaProgetto(p: Progetto, etichetta = 'Progetti'): Rimando {
  return { etichetta, testo: p.nome, descrizione: p.card, href: `/progetti/${p.slug}`, tutti: tuttiIProgetti };
}

/** Un progetto a caso, scelto nel browser a ogni visita (vedi Chiusura.astro).
 *  Si passano tutti: senza JavaScript resta il primo nell'ordine della home. */
export async function progetto(): Promise<Rimando[]> {
  return (await getProgetti()).map((p) => rigaProgetto(p));
}

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

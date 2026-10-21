// Il battito: una linea del tempo disegnata come un'onda (design system, «Il battito»).
// Qui solo i conti, senza markup: Battito.astro li disegna.
//
// L'onda non si disegna a mano: nasce dalle date scritte in Keystatic (collezione «Linee del tempo»).
// Ogni tappa e ogni aggiornamento lascia un'eco sulle colonne vicine, più forte al centro; dove gli eventi
// si avvicinano le eco si sommano. A riposo resta un solo quadretto sull'asse.
//
// La grana cambia con la durata, non la misura del grafico:
//   - tutto in un anno: l'anno a settimane;
//   - più anni: la lente. Sopra la panoramica (a mesi fino a 4 anni, a trimestri oltre), sotto un anno a settimane.
// «Siamo qui» è il giorno della build: il sito si ricostruisce a ogni salvataggio del CMS.

export type Peso = 1 | 2 | 3;

export interface TappaCms {
  data: Date;
  quando?: string;
  titolo: string;
  testo?: string;
  peso: Peso;
}

export interface StoriaCms {
  titolo: string;
  adesso?: string;
  conclusa: boolean;
  tappe: TappaCms[];
  aggiornamenti: { data: Date }[];
}

export const SETTIMANE = 52;
const MESI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

// Eco degli eventi: larghezza in colonne e quanto pesa un evento sull'altezza
const ECO_SETTIMANE = { sigma: 1.5, scala: 1.6, massimo: 6 };
const ECO_PANORAMICA = {
  mese: { sigma: 0.8, scala: 0.8, massimo: 4 },
  trimestre: { sigma: 0.8, scala: 0.45, massimo: 4 },
};

const giornoDellAnno = (d: Date) => (Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 1)) / 864e5;
/** Settimana dell'anno, da 0 a 51 (gli ultimi giorni di dicembre stanno nella 51). */
export const settimana = (d: Date) => Math.min(SETTIMANE - 1, Math.floor(giornoDellAnno(d) / 7));
const meseDi = (w: number) => MESI[Math.min(11, Math.floor((w / SETTIMANE) * 12))];
const due = (n: number) => String(n).padStart(2, '0');

const eco = (eventi: { p: number; peso: number }[], x: number, e: { sigma: number; scala: number; massimo: number }) => {
  let s = 0;
  for (const ev of eventi) {
    const d = x - ev.p;
    if (Math.abs(d) < e.sigma * 5) s += ev.peso * Math.exp(-(d * d) / (2 * e.sigma * e.sigma));
  }
  return Math.min(e.massimo, Math.round(s * e.scala));
};

/** Una colonna dell'onda: vuota prima dell'inizio, accesa con la sua altezza, spenta dopo «siamo qui». */
export type Colonna = { tipo: 'vuota' } | { tipo: 'accesa'; a: number } | { tipo: 'spenta' } | { tipo: 'ora' } | { tipo: 'futura' };

export interface Voce {
  w: number; // colonna (settimana)
  num?: string;
  meta: string;
  titolo: string;
  testo?: string;
  peso: Peso | 0;
  ora: boolean;
  futura: boolean;
}

export interface Anno {
  anno: number;
  colonne: Colonna[];
  voci: Voce[];
}

export interface Panoramica {
  grana: 'mese' | 'trimestre';
  perAnno: number;
  colonne: Colonna[];
  etichette: { x: number; testo: string }[]; // x da 0 a 1
}

export interface Battito {
  titolo: string;
  primo: number;
  ultimo: number;
  anni: Anno[];
  scelto: number; // indice dell'anno aperto all'inizio
  panoramica?: Panoramica;
  tappe: (TappaCms & { num: string; futura: boolean })[];
}

export function calcola(storia: StoriaCms, oggi = new Date()): Battito {
  const tappe = [...storia.tappe].sort((a, b) => a.data.getTime() - b.data.getTime());
  const date = [...tappe.map((t) => t.data), ...storia.aggiornamenti.map((a) => a.data)];
  if (!date.length) throw new Error(`La linea del tempo «${storia.titolo}» non ha né tappe né aggiornamenti.`);

  const inizio = new Date(Math.min(...date.map((d) => d.getTime())));
  const ultimaData = new Date(Math.max(...date.map((d) => d.getTime())));
  const ora = storia.conclusa ? undefined : oggi;
  const fine = ora && ora > ultimaData ? ora : ultimaData;
  const primo = inizio.getUTCFullYear();
  const ultimo = fine.getUTCFullYear();

  // Posizione assoluta in settimane dall'inizio del primo anno
  const g = (d: Date) => (d.getUTCFullYear() - primo) * SETTIMANE + settimana(d);
  const gInizio = g(inizio);
  const gOra = ora ? g(ora) : undefined;
  // Con «siamo qui», dopo oggi la riga spenta arriva fino alla fine dell'anno
  const gFine = ora ? (ultimo - primo + 1) * SETTIMANE - 1 : g(fine);
  const passato = (d: Date) => !ora || d.getTime() <= ora.getTime();

  const numerate = tappe.map((t, i) => ({ ...t, num: due(i + 1), futura: !passato(t.data) }));

  // Gli eventi che fanno l'onda: solo quelli già successi
  const eventi = [
    ...numerate.filter((t) => !t.futura).map((t) => ({ d: t.data, peso: t.peso as number })),
    ...storia.aggiornamenti.filter((a) => passato(a.data)).map((a) => ({ d: a.data, peso: 1 })),
  ];
  const eventiSettimane = eventi.map((e) => ({ p: g(e.d), peso: e.peso }));

  const futureSettimane = new Set(numerate.filter((t) => t.futura).map((t) => g(t.data)));
  const colonna = (pos: number): Colonna => {
    if (pos < gInizio || pos > gFine) return { tipo: 'vuota' };
    if (gOra !== undefined && pos === gOra) return { tipo: 'ora' };
    if (gOra !== undefined && pos > gOra) return futureSettimane.has(pos) ? { tipo: 'futura' } : { tipo: 'spenta' };
    return { tipo: 'accesa', a: eco(eventiSettimane, pos, ECO_SETTIMANE) };
  };

  const anni: Anno[] = [];
  for (let anno = primo; anno <= ultimo; anno++) {
    const base = (anno - primo) * SETTIMANE;
    const colonne = Array.from({ length: SETTIMANE }, (_, w) => colonna(base + w));
    const voci: Voce[] = numerate
      .filter((t) => t.data.getUTCFullYear() === anno)
      .map((t) => {
        const w = settimana(t.data);
        return {
          w,
          num: t.num,
          meta: `[ ${t.num} ] · ${t.quando || meseDi(w)}`,
          titolo: t.titolo,
          testo: t.testo,
          peso: t.peso,
          ora: false,
          futura: t.futura,
        };
      });
    if (ora && ora.getUTCFullYear() === anno) {
      voci.push({ w: settimana(ora), meta: 'Siamo qui', titolo: storia.adesso || 'Oggi', peso: 0, ora: true, futura: false });
    }
    voci.sort((a, b) => a.w - b.w || Number(b.ora) - Number(a.ora));
    anni.push({ anno, colonne, voci });
  }

  // All'inizio la lente sta sull'anno di «siamo qui», o sull'ultimo se la storia è conclusa
  const scelto = ora ? ora.getUTCFullYear() - primo : anni.length - 1;

  let panoramica: Panoramica | undefined;
  if (anni.length > 1) {
    const grana = anni.length <= 4 ? 'mese' : 'trimestre';
    const perAnno = grana === 'mese' ? 12 : 4;
    const pos = (d: Date) => (d.getUTCFullYear() - primo) * perAnno + (giornoDellAnno(d) / 365.25) * perAnno;
    const col = (d: Date) => Math.floor(pos(d));
    const ev = eventi.map((e) => ({ p: pos(e.d), peso: e.peso }));
    const cInizio = col(inizio);
    const cOra = ora ? col(ora) : undefined;
    const cFine = ora ? anni.length * perAnno - 1 : col(fine);
    const totale = anni.length * perAnno;
    const colonne: Colonna[] = Array.from({ length: totale }, (_, c) => {
      if (c < cInizio || c > cFine) return { tipo: 'vuota' };
      if (cOra !== undefined && c === cOra) return { tipo: 'ora' };
      if (cOra !== undefined && c > cOra) return { tipo: 'spenta' };
      return { tipo: 'accesa', a: eco(ev, c + 0.5, ECO_PANORAMICA[grana]) };
    });
    const etichette = numerate
      .filter((t) => t.peso === 3)
      .map((t) => ({ x: (col(t.data) + 0.5) / totale, testo: `[ ${t.num} ] ${t.titolo}` }));
    panoramica = { grana, perAnno, colonne, etichette };
  }

  return { titolo: storia.titolo, primo, ultimo, anni, scelto, panoramica, tappe: numerate };
}

// ── Etichette ────────────────────────────────────────────────────────────────

/** Larghezza stimata di un'etichetta in px: la riga in mono o il titolo, la più lunga. */
// Un po' abbondante: sotto i 1440px il grafico si stringe, le scritte no.
const larghezza = (v: Voce) => (Math.max(v.meta.length * 7.6, v.titolo.length * 7.8) + 8) * 1.1;

/**
 * Desktop: le etichette stanno sopra l'onda su tre livelli, e dal fondo di ognuna scende un filo fino all'onda.
 * Un'etichetta prende il primo posto (livello, allineata a sinistra o a destra del suo filo) dove non copre
 * un'altra etichetta, non è attraversata dal filo di una più in alto e il suo filo non attraversa una più in basso.
 * Le misure sono stimate su 1248px, la larghezza dei moduli.
 */
export function livelli(voci: Voce[], larghezzaTotale = 1248, passo = 24, quanti = 3) {
  const messe: { x: number; da: number; a: number; livello: number }[] = [];
  return voci.map((v) => {
    const x = v.w * passo + passo / 2;
    const l = larghezza(v);
    const prove: { livello: number; destra: boolean; da: number; a: number; danno: number }[] = [];
    // Accanto al filo (a sinistra o a destra), oppure staccata di 14px, per lasciare il filo a chi sta nella stessa colonna.
    // «Siamo qui» preferisce stare a sinistra del suo anello: arrivi lì da sinistra.
    const posti = [
      { destra: false, scarto: -4 },
      { destra: true, scarto: 4 },
      { destra: false, scarto: 14 },
      { destra: true, scarto: -14 },
    ];
    for (let livello = 0; livello < quanti; livello++) {
      for (const { destra, scarto } of posti) {
        const da = destra ? x + scarto - l : x + scarto;
        const a = destra ? x + scarto : x + scarto + l;
        if (da < 0 || a > larghezzaTotale) continue;
        let danno = Math.abs(scarto) > 4 ? 0.5 : 0;
        if (v.ora && !destra) danno += 0.25;
        for (const p of messe) {
          if (p.livello === livello && da < p.a + 8 && a + 8 > p.da) danno += 3;
          if (p.livello < livello && p.x > da - 2 && p.x < a + 2) danno += 2;
          if (p.livello > livello && x > p.da - 2 && x < p.a + 2) danno += 2;
        }
        prove.push({ livello, destra, da, a, danno });
      }
    }
    const scelta = prove.reduce((m, p) => (p.danno < m.danno ? p : m), prove[0]);
    messe.push({ x, da: scelta.da, a: scelta.a, livello: scelta.livello });
    return { ...v, x, livello: scelta.livello, destra: scelta.destra, da: scelta.da, a: scelta.a };
  });
}

/**
 * Mobile: il tempo scende in verticale e le etichette stanno a destra. Se due tappe sono troppo vicine,
 * la seconda scende e il filo fa un gomito. Le altezze sono stimate su una colonna di circa 150px.
 */
export function spinte(voci: Voce[], riga = 8, caratteriPerRiga = 16) {
  let fondo = -Infinity;
  return voci.map((v) => {
    const centro = v.w * riga + 2;
    const alto = 17 + 4 + Math.ceil(v.titolo.length / caratteriPerRiga) * 21;
    const top = Math.max(centro - 8.5, fondo + 12);
    fondo = top + alto;
    return { ...v, centro, top };
  });
}

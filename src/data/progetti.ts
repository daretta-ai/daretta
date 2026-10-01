// I quattro progetti, con i testi delle card approvati il 30 settembre 2026.
// Al passo 5 passano in Keystatic.
export type Stato = 'online' | 'in-sviluppo' | 'concept';

export interface Progetto {
  slug: string;
  nome: string;
  provvisorio?: boolean;
  stato: Stato;
  card: string;
}

export const progetti: Progetto[] = [
  {
    slug: 'valdinievole-online',
    nome: 'valdinievole.online',
    stato: 'in-sviluppo',
    card: 'Le notizie degli undici comuni della Valdinievole, in un posto solo.',
  },
  {
    slug: 'skill-bloom',
    nome: 'Skill Bloom',
    provvisorio: true,
    stato: 'in-sviluppo',
    card: "Un'app per portare la terapia ABA anche a casa, con meno fatica e più dati.",
  },
  {
    slug: 'balillaland',
    nome: 'BalillaLand',
    stato: 'concept',
    card: 'La community del calcio balilla, con statistiche e classifiche per chi non accetta di perdere.',
  },
  {
    slug: 'concorsi-in-regola',
    nome: 'Concorsi in Regola',
    provvisorio: true,
    stato: 'in-sviluppo',
    card: 'Concorsi e instant win per i reparti marketing, con regole e vincoli già risolti.',
  },
];

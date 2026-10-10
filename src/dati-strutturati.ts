// Dati strutturati (schema.org, JSON-LD) per motori di ricerca e modelli AI.
// Solo fatti già scritti nel sito, niente superlativi. Base.astro li mette nell'head di ogni pagina che li passa.

const SITO = 'https://daretta.it';
const assoluto = (percorso: string) => new URL(percorso, SITO).href;

export const ID_SITO = `${SITO}/#sito`;
export const ID_PATRIZIO = `${SITO}/#patrizio`;

type Nodo = Record<string, unknown>;

export const sito: Nodo = {
  '@type': 'WebSite',
  '@id': ID_SITO,
  url: `${SITO}/`,
  name: 'dàretta',
  inLanguage: 'it',
  author: { '@id': ID_PATRIZIO },
};

// Codever e Mirror non hanno una pagina su Patrizio: stanno in worksFor, non in sameAs
// (sameAs è solo per pagine che parlano di lui, come il profilo LinkedIn).
export const patrizio: Nodo = {
  '@type': 'Person',
  '@id': ID_PATRIZIO,
  name: 'Patrizio Bartolozzi',
  url: `${SITO}/chi-sono`,
  image: `${SITO}/foto/notte-800.webp`,
  jobTitle: ['Amministratore delegato di Codever', 'Service manager dello sviluppo digital in Mirror'],
  worksFor: [
    { '@type': 'Organization', name: 'Codever', url: 'https://www.codever.it' },
    { '@type': 'Organization', name: 'Mirror', url: 'https://www.mirror.it' },
  ],
  sameAs: ['https://www.linkedin.com/in/patriziobartolozzi'],
};

/** La pagina /chi-sono: dice che parla di Patrizio. */
export const paginaProfilo: Nodo = {
  '@type': 'ProfilePage',
  '@id': `${SITO}/chi-sono#pagina`,
  url: `${SITO}/chi-sono`,
  inLanguage: 'it',
  mainEntity: { '@id': ID_PATRIZIO },
  isPartOf: { '@id': ID_SITO },
};

/** Un articolo di /scritti. */
export function articolo(a: {
  slug: string;
  titolo: string;
  attacco: string;
  data: Date;
  aggiornato?: Date;
  tag?: string;
}): Nodo {
  const url = assoluto(`/scritti/${a.slug}`);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#articolo`,
    url,
    mainEntityOfPage: url,
    headline: a.titolo,
    description: a.attacco,
    image: assoluto(`/og/scritti/${a.slug}.png`),
    datePublished: a.data.toISOString().slice(0, 10),
    dateModified: (a.aggiornato ?? a.data).toISOString().slice(0, 10),
    inLanguage: 'it',
    ...(a.tag && { keywords: a.tag }),
    author: { '@id': ID_PATRIZIO },
    publisher: { '@id': ID_PATRIZIO },
    isPartOf: { '@id': ID_SITO },
  };
}

const STATI = { online: 'Online', 'in-sviluppo': 'In sviluppo', concept: 'Concept' } as const;

/** Un progetto di /progetti. «credito» è la riga «Con Nome Cognome e Nome Cognome». */
export function progetto(p: {
  slug: string;
  nome: string;
  card: string;
  stato: keyof typeof STATI;
  fase?: string;
  credito?: string;
  link?: string;
}): Nodo {
  const url = assoluto(`/progetti/${p.slug}`);
  const collaboratori = (p.credito ?? '')
    .replace(/^con\s+/i, '')
    .split(/\s*(?:,|\be\b|\bed\b)\s*/)
    .map((nome) => nome.trim())
    .filter(Boolean)
    .map((name) => ({ '@type': 'Person', name }));
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#progetto`,
    url,
    mainEntityOfPage: url,
    name: p.nome,
    description: p.card,
    image: assoluto(`/og/progetti/${p.slug}.png`),
    creativeWorkStatus: p.fase ? `${STATI[p.stato]} · ${p.fase}` : STATI[p.stato],
    inLanguage: 'it',
    creator: { '@id': ID_PATRIZIO },
    ...(collaboratori.length && { contributor: collaboratori }),
    ...(p.link && { sameAs: p.link }),
    isPartOf: { '@id': ID_SITO },
  };
}

/** Il blocco JSON-LD completo: Patrizio e il sito sempre, più i nodi della pagina. */
export const grafo = (...nodi: Nodo[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': [sito, patrizio, ...nodi] });

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

/** Un articolo di /chiacchiere. */
export function articolo(a: {
  slug: string;
  titolo: string;
  attacco: string;
  data: Date;
  aggiornato?: Date;
  tag?: string;
}): Nodo {
  const url = assoluto(`/chiacchiere/${a.slug}`);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#articolo`,
    url,
    mainEntityOfPage: url,
    headline: a.titolo,
    description: a.attacco,
    image: assoluto(`/og/chiacchiere/${a.slug}.png`),
    datePublished: a.data.toISOString().slice(0, 10),
    dateModified: (a.aggiornato ?? a.data).toISOString().slice(0, 10),
    inLanguage: 'it',
    ...(a.tag && { keywords: a.tag }),
    author: { '@id': ID_PATRIZIO },
    publisher: { '@id': ID_PATRIZIO },
    isPartOf: { '@id': ID_SITO },
  };
}

// La newsletter: una serie di numeri. L'archivio è la pagina della serie, ogni numero ne fa parte.
export const ID_NEWSLETTER = `${SITO}/newsletter#serie`;

const serie: Nodo = {
  '@type': 'CreativeWorkSeries',
  '@id': ID_NEWSLETTER,
  name: 'La newsletter di dàretta',
  url: assoluto('/newsletter'),
  inLanguage: 'it',
  author: { '@id': ID_PATRIZIO },
  isPartOf: { '@id': ID_SITO },
};

/** La pagina /newsletter: l'elenco dei numeri pubblicati. */
export function archivio(numeri: { slug: string; oggetto: string }[], descrizione: string): Nodo[] {
  const url = assoluto('/newsletter');
  return [
    serie,
    {
      '@type': 'CollectionPage',
      '@id': `${url}#pagina`,
      url,
      name: 'Archivio della newsletter',
      description: descrizione,
      inLanguage: 'it',
      mainEntity: { '@id': ID_NEWSLETTER },
      isPartOf: { '@id': ID_SITO },
      hasPart: numeri.map((n) => ({ '@id': `${assoluto(`/newsletter/${n.slug}`)}#numero` })),
    },
  ];
}

/** Un numero della newsletter, /newsletter/AAAA-MM. Per i motori è un articolo che fa parte della serie. */
export function numero(n: { slug: string; oggetto: string; descrizione: string; inviata: Date; numero: number }): Nodo[] {
  const url = assoluto(`/newsletter/${n.slug}`);
  return [
    serie,
    {
      '@type': 'BlogPosting',
      '@id': `${url}#numero`,
      url,
      mainEntityOfPage: url,
      headline: n.oggetto,
      description: n.descrizione,
      image: assoluto(`/og/newsletter/${n.slug}.png`),
      datePublished: n.inviata.toISOString().slice(0, 10),
      position: n.numero,
      inLanguage: 'it',
      author: { '@id': ID_PATRIZIO },
      publisher: { '@id': ID_PATRIZIO },
      isPartOf: [{ '@id': ID_NEWSLETTER }, { '@id': ID_SITO }],
    },
  ];
}

const STATI = { online: 'Online', 'in-sviluppo': 'In sviluppo', concept: 'Concept' } as const;

/** Un progetto di /progetti. I collaboratori diventano contributor, con il profilo in sameAs. */
export function progetto(p: {
  slug: string;
  nome: string;
  card: string;
  stato: keyof typeof STATI;
  fase?: string;
  collaboratori?: { nome: string; link?: string }[];
  link?: string;
}): Nodo {
  const url = assoluto(`/progetti/${p.slug}`);
  const collaboratori = (p.collaboratori ?? []).map((c) => ({
    '@type': 'Person',
    name: c.nome,
    ...(c.link && { sameAs: c.link }),
  }));
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

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// I contenuti si scrivono in Keystatic (keystatic.config.ts), che salva i file in src/content.
// Qui il sito li legge. Gli schemi devono restare allineati a quelli di Keystatic.

const curiosita = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/curiosita' }),
  schema: z.object({
    tipo: z.enum(['CASSI MIEI', 'SPORT', 'SVAGHI', 'LAVORO', 'VIAGGI']),
    destinazione: z.string().max(15),
    testo: z.string(),
  }),
});

const facoltativo = z
  .string()
  .nullish()
  .transform((v) => v || undefined);

const progetti = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/progetti' }),
  schema: z.object({
    nome: z.string(),
    provvisorio: z.boolean().default(false),
    stato: z.enum(['online', 'in-sviluppo', 'concept']),
    ordine: z.number().nullish().transform((v) => v ?? 10),
    card: z.string(),
    titolo: z.string(),
    fase: facoltativo,
    credito: facoltativo,
    link: facoltativo,
    rimando: z.enum(['chi-sono', 'curiosita']).default('chi-sono'),
  }),
});

const articoli = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/articoli' }),
  schema: z.object({
    titolo: z.string(),
    pubblicato: z.boolean().default(false),
    data: z.coerce.date(),
    tag: facoltativo,
    attacco: z.string(),
  }),
});

// Pagine singole: home, newsletter, microtesti (yaml) e chi sono (con il corpo a blocchi).
const pagine = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/pagine' }),
  schema: z.record(z.string(), z.any()),
});

const testiPagine = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/pagine' }),
  schema: z.object({
    titolo: z.string(),
    attacco: z.string(),
    ruoli: z.array(z.string()),
    breve: z.string(),
  }),
});

export const collections = { curiosita, progetti, articoli, pagine, testiPagine };

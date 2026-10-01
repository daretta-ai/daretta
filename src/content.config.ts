import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const curiosita = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/curiosita' }),
  schema: z.object({
    tipo: z.enum(['CASSI MIEI', 'SPORT', 'SVAGHI', 'LAVORO', 'VIAGGI']),
    destinazione: z.string().max(15),
    testo: z.string(),
  }),
});

export const collections = { curiosita };

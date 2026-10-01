import { config, collection, fields } from '@keystatic/core';

// Per ora l'admin salva sui file locali.
// Quando il repository è su GitHub passiamo a storage: { kind: 'github', repo: '...' }.
export default config({
  storage: { kind: 'local' },
  ui: { brand: { name: 'dàretta' } },
  collections: {
    curiosita: collection({
      label: 'Curiosità',
      slugField: 'numero',
      path: 'src/content/curiosita/*',
      format: { data: 'json' },
      columns: ['numero', 'tipo', 'destinazione'],
      schema: {
        numero: fields.slug({
          name: { label: 'Numero', description: 'Tre cifre, progressivo. Non si riusa.', validation: { length: { min: 3, max: 3 } } },
        }),
        tipo: fields.select({
          label: 'Tipo',
          options: [
            { label: 'CASSI MIEI', value: 'CASSI MIEI' },
            { label: 'SPORT', value: 'SPORT' },
            { label: 'SVAGHI', value: 'SVAGHI' },
            { label: 'LAVORO', value: 'LAVORO' },
            { label: 'VIAGGI', value: 'VIAGGI' },
          ],
          defaultValue: 'CASSI MIEI',
        }),
        destinazione: fields.text({
          label: 'Destinazione',
          description: 'La battuta del tabellone. Maiuscolo, massimo 15 caratteri.',
          validation: { length: { min: 1, max: 15 } },
        }),
        testo: fields.text({
          label: 'Testo',
          description: 'Massimo ~200 battute. Oltre, è un post.',
          multiline: true,
          validation: { length: { min: 1, max: 220 } },
        }),
      },
    }),
  },
});

import { config, collection, singleton, fields } from '@keystatic/core';
import { wrapper, block } from '@keystatic/core/content-components';

// Il CMS di dàretta.
// In locale (npm run dev) l'admin salva sui file del computer.
// Online salva su GitHub: ogni salvataggio è un commit su main, e Cloudflare ripubblica il sito.
// Le variabili per GitHub sono descritte in CMS.md.
const storage = import.meta.env?.PROD
  ? ({ kind: 'github', repo: { owner: 'daretta-ai', name: 'daretta' } } as const)
  : ({ kind: 'local' } as const);

// ── Campi ricorrenti ────────────────────────────────────────────────────────

const etichetta = fields.text({
  label: 'Etichetta',
  description: 'Va nel margine, in maiuscoletto mono. Il numero [ 01 ] lo mette il sito, in ordine.',
  validation: { length: { min: 1 } },
});

const stato = fields.checkbox({
  label: 'Mostra lo stato del progetto',
  description: 'Solo nelle pagine progetto: lo stato compare sotto il testo. Di solito nell\'ultimo blocco.',
});

// ── Blocchi del corpo ───────────────────────────────────────────────────────
// Sono i pezzi delle tavole: si scrivono come testo e si mettono in fila.
// Il sito li numera da solo (la citazione e la prova prima/dopo non hanno numero).

const blocchi = {
  blocco: wrapper({
    label: 'Paragrafo',
    description: 'Etichetta nel margine, testo a destra.',
    schema: {
      etichetta,
      spazio: fields.select({
        label: 'Spazio sopra',
        options: [
          { label: 'Grande', value: 'grande' },
          { label: 'Medio', value: 'medio' },
          { label: 'Piccolo', value: 'piccolo' },
        ],
        defaultValue: 'grande',
      }),
      stato,
    },
  }),
  numero: wrapper({
    label: 'Numero in evidenza',
    description: 'Modulo con un numero vero in Doto a sinistra e il testo a destra.',
    schema: {
      etichetta,
      cifra: fields.text({ label: 'Numero', description: 'Corto: 11, 1/10, 30%.', validation: { length: { min: 1, max: 6 } } }),
      didascalia: fields.text({ label: 'Didascalia', description: 'Sotto il numero, con un punto mediano: «Comuni · nessun giornale suo».' }),
      stato,
    },
  }),
  figura: wrapper({
    label: 'Paragrafo con figura',
    description: 'Testo a sinistra, figura a destra.',
    schema: {
      etichetta,
      figura: fields.conditional(
        fields.select({
          label: 'Figura',
          options: [
            { label: 'Barre a punti', value: 'barre' },
            { label: 'Elenco', value: 'elenco' },
          ],
          defaultValue: 'barre',
        }),
        {
          barre: fields.object({
            didascalia: fields.text({ label: 'Didascalia in alto' }),
            nota: fields.text({ label: 'Nota in basso' }),
            righe: fields.array(
              fields.object({
                etichetta: fields.text({ label: 'Etichetta' }),
                destra: fields.text({ label: 'A destra', description: 'Facoltativo.' }),
                larghezza: fields.integer({ label: 'Lunghezza della barra (%)', defaultValue: 100, validation: { min: 1, max: 100 } }),
                tono: fields.select({
                  label: 'Tono',
                  options: [
                    { label: 'Spento', value: '1' },
                    { label: 'Medio', value: '2' },
                    { label: 'Acceso', value: '3' },
                  ],
                  defaultValue: '2',
                }),
                accesa: fields.checkbox({ label: 'Etichetta in evidenza' }),
              }),
              { label: 'Righe', itemLabel: (r) => r.fields.etichetta.value || 'Riga' }
            ),
          }),
          elenco: fields.object({
            didascalia: fields.text({ label: 'Didascalia in alto' }),
            voci: fields.array(fields.text({ label: 'Voce' }), { label: 'Voci', itemLabel: (v) => v.value || 'Voce' }),
            nota: fields.text({ label: 'Nota in basso' }),
          }),
        }
      ),
    },
  }),
  foto: wrapper({
    label: 'Paragrafo con foto',
    description: 'Testo a sinistra, foto quadrata a destra. Le foto passano prima da scripts/tratta-foto.py.',
    schema: {
      etichetta,
      foto: fields.select({
        label: 'Foto',
        options: [
          { label: 'Di notte, davanti al paese', value: 'notte' },
          { label: 'Occhiali da sole, mare e pini', value: 'pini' },
        ],
        defaultValue: 'notte',
      }),
      alt: fields.text({ label: 'Testo alternativo', description: 'Breve e descrittivo, senza battute.' }),
      posizione: fields.text({ label: 'Punto della foto da tenere al centro', description: 'Es. 70% 45%. Serve a tenere il viso nel quadrato.', defaultValue: '50% 50%' }),
    },
  }),
  citazione: block({
    label: 'Citazione',
    description: 'Una frase in Doto a tutta pagina. Minuscola, con il punto.',
    schema: {
      testo: fields.text({ label: 'Frase', validation: { length: { min: 1 } } }),
      didascalia: fields.text({ label: 'Riga sotto' }),
    },
  }),
  confronto: block({
    label: 'Prima e dopo',
    description: 'Due o più numeri a confronto, in card.',
    schema: {
      voci: fields.array(
        fields.object({
          etichetta: fields.text({ label: 'Etichetta', description: 'Es. PRIMA, DOPO L\'INDICE.' }),
          cifra: fields.text({ label: 'Numero', description: 'Es. 840 ms.' }),
        }),
        { label: 'Voci', itemLabel: (v) => v.fields.etichetta.value || 'Voce' }
      ),
    },
  }),
};

const corpo = (label: string, conCodice = false) =>
  fields.markdoc({
    label,
    options: {
      heading: false,
      blockquote: false,
      table: false,
      image: false,
      divider: false,
      strikethrough: false,
      codeBlock: conCodice,
      code: conCodice,
    },
    components: blocchi,
  });

const testoLungo = (label: string, description?: string) =>
  fields.text({ label, description, multiline: true, validation: { length: { min: 1 } } });

const riga = (label: string, description?: string) => fields.text({ label, description, validation: { length: { min: 1 } } });

const titoloDoto = (label = 'Titolo in Doto') =>
  fields.text({ label, description: 'Minuscolo, con il punto finale.', validation: { length: { min: 1 } } });

// ── Configurazione ──────────────────────────────────────────────────────────

export default config({
  storage,
  ui: {
    brand: { name: 'dàretta' },
    navigation: {
      Pagine: ['home', 'chiSono', 'newsletter', 'microtesti', 'privacy'],
      Contenuti: ['progetti', 'articoli', 'curiosita'],
    },
  },
  singletons: {
    home: singleton({
      label: 'Home',
      path: 'src/content/pagine/home',
      format: { data: 'yaml' },
      schema: {
        motto: titoloDoto('Frase della hero'),
        presentazione: testoLungo('Sotto la frase'),
        pulsante: riga('Pulsante della hero', 'Porta alla newsletter. Con la freccia →.'),
      },
    }),
    chiSono: singleton({
      label: 'Chi sono',
      path: 'src/content/pagine/chi-sono',
      format: { contentField: 'corpo' },
      entryLayout: 'content',
      schema: {
        titolo: titoloDoto(),
        attacco: testoLungo('Frase d\'attacco', 'Sotto il titolo. Compare anche nel blocco Chi sono della home.'),
        ruoli: fields.array(fields.text({ label: 'Ruolo' }), {
          label: 'Il percorso',
          description: 'I gradini della scala, dal primo all\'ultimo.',
          itemLabel: (r) => r.value || 'Ruolo',
        }),
        breve: testoLungo('La versione breve', 'Primo blocco della pagina. Compare anche nella home.'),
        corpo: corpo('Il resto della pagina'),
      },
    }),
    newsletter: singleton({
      label: 'Newsletter',
      path: 'src/content/pagine/newsletter',
      format: { data: 'yaml' },
      schema: {
        titolo: titoloDoto(),
        testo: testoLungo('Testo', 'Una riga vuota separa i paragrafi.'),
        segnaposto: riga('Segnaposto del campo'),
        pulsante: riga('Pulsante'),
        privacy: riga('Link all\'informativa', 'Sotto il campo, porta alla pagina Privacy.'),
        inviato: testoLungo('Dopo l\'invio del modulo'),
        giaIscritto: testoLungo('Già iscritto'),
        mailNonValida: testoLungo('Email non valida'),
        errore: testoLungo('Errore generico'),
        etichettaInviato: riga('Etichetta dopo l\'invio', 'In mono, tra parentesi quadre, prima del messaggio.'),
        etichettaGiaIscritto: riga('Etichetta già iscritto'),
        etichettaMailNonValida: riga('Etichetta email non valida'),
        etichettaErrore: riga('Etichetta errore generico'),
        articoloTitolo: titoloDoto('In fondo agli articoli, titolo'),
        articoloTesto: testoLungo('In fondo agli articoli, testo'),
        benvenutoTitolo: titoloDoto('Pagina di conferma, titolo'),
        benvenutoTesto: testoLungo('Pagina di conferma, testo'),
      },
    }),
    microtesti: singleton({
      label: 'Microtesti',
      path: 'src/content/pagine/microtesti',
      format: { data: 'yaml' },
      schema: {
        footer: fields.object(
          {
            prima: riga('Prima riga', 'Dopo «dàretta.» in grassetto.'),
            seconda: riga('Seconda riga'),
          },
          { label: 'Footer' }
        ),
        scrittiVuoto: testoLungo('Scritti, finché è vuoto', 'In home e nella pagina Scritti.'),
        firma: fields.text({
          label: 'Firma degli articoli',
          description: 'Una riga su chi scrive, sotto ogni articolo accanto alla foto. Vuota, la firma non compare.',
          multiline: true,
        }),
        nonTrovato: fields.object(
          {
            titolo: titoloDoto(),
            testo: testoLungo('Testo'),
            prima: riga('Prima del link alla home', 'Es. «Altrimenti…».'),
            link: riga('Link alla home'),
          },
          { label: 'Pagina 404' }
        ),
        stati: fields.object(
          {
            online: riga('ONLINE'),
            inSviluppo: riga('IN SVILUPPO'),
            concept: riga('CONCEPT'),
          },
          { label: 'Stati dei progetti', description: 'La frase che compare al passaggio del mouse.' }
        ),
      },
    }),
    privacy: singleton({
      label: 'Privacy',
      path: 'src/content/pagine/privacy',
      format: { data: 'yaml' },
      schema: {
        titolo: titoloDoto(),
        attacco: testoLungo('Frase d\'attacco'),
        sezioni: fields.array(
          fields.object({
            titolo: riga('Etichetta', 'Nel margine, in maiuscolo.'),
            testo: testoLungo('Testo'),
          }),
          { label: 'Sezioni', itemLabel: (s) => s.fields.titolo.value || 'Sezione' }
        ),
      },
    }),
  },
  collections: {
    progetti: collection({
      label: 'Progetti',
      slugField: 'nome',
      path: 'src/content/progetti/*',
      format: { contentField: 'corpo' },
      entryLayout: 'content',
      columns: ['nome', 'stato'],
      schema: {
        nome: fields.slug({
          name: { label: 'Nome', description: 'Come lo scrive il progetto: «valdinievole.online», «Skill Bloom».' },
          slug: { label: 'Indirizzo', description: 'Diventa /progetti/indirizzo. Non cambiarlo dopo la pubblicazione.' },
        }),
        provvisorio: fields.checkbox({ label: 'Nome provvisorio' }),
        stato: fields.select({
          label: 'Stato',
          options: [
            { label: 'ONLINE', value: 'online' },
            { label: 'IN SVILUPPO', value: 'in-sviluppo' },
            { label: 'CONCEPT', value: 'concept' },
          ],
          defaultValue: 'concept',
        }),
        ordine: fields.integer({ label: 'Ordine in home', description: 'Dal più basso al più alto.', defaultValue: 10 }),
        card: testoLungo('Testo della card', 'Una frase. Compare in home e sotto il nome nella pagina.'),
        titolo: titoloDoto(),
        fase: fields.text({ label: 'Fase', description: 'Accanto allo stato, facoltativa: «Alpha», «Alpha interna».' }),
        credito: fields.text({ label: 'Con chi', description: 'Facoltativo: «Con Gianpaolo Ansalone».' }),
        link: fields.url({ label: 'Sito del progetto', description: 'Quando è online, il nome diventa un link.' }),
        rimando: fields.select({
          label: 'Seconda card in fondo',
          description: 'La prima porta sempre agli altri progetti.',
          options: [
            { label: 'Chi sono', value: 'chi-sono' },
            { label: 'Curiosità', value: 'curiosita' },
          ],
          defaultValue: 'chi-sono',
        }),
        corpo: corpo('Testo della pagina'),
      },
    }),
    articoli: collection({
      label: 'Articoli',
      slugField: 'titolo',
      path: 'src/content/articoli/*',
      format: { contentField: 'corpo' },
      entryLayout: 'content',
      columns: ['titolo', 'data', 'pubblicato'],
      schema: {
        titolo: fields.slug({
          name: { label: 'Titolo', description: 'La tesi dell\'articolo, un\'affermazione.' },
          slug: { label: 'Indirizzo', description: 'Diventa /scritti/indirizzo. Non cambiarlo dopo la pubblicazione.' },
        }),
        pubblicato: fields.checkbox({
          label: 'Pubblicato',
          description: 'Finché è spento l\'articolo non compare nel sito.',
          defaultValue: false,
        }),
        data: fields.date({ label: 'Data', validation: { isRequired: true } }),
        tag: fields.text({ label: 'Tag', description: 'Uno solo, es. PERFORMANCE.' }),
        attacco: testoLungo('Frase d\'attacco', 'Sotto il titolo. Serve anche per i social e i motori di ricerca.'),
        corpo: corpo('Testo', true),
      },
    }),
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

# Il CMS di dàretta

I testi del sito si scrivono in Keystatic. Keystatic salva file normali dentro `src/content`, e il sito li legge al momento della build.

## Dove si scrive

- **Online:** `/keystatic` sul sito (oggi `https://daretta.dimmipure.workers.dev/keystatic`, poi `https://daretta.it/keystatic`). Si entra con l'account GitHub. Ogni salvataggio è un commit su `main`, e Cloudflare ripubblica il sito in un paio di minuti.
- **In locale:** `npm run cms`, poi `http://localhost:4321/keystatic`. Qui l'admin salva sui file del computer, e le modifiche vanno messe su GitHub con un commit come il resto del codice. In locale si vedono anche gli articoli non pubblicati. `npm run cms` fa girare il sito in Node, senza l'adapter Cloudflare: con `npm run dev` le pagine funzionano, ma l'admin no, perché il runtime di Cloudflare non può scrivere file.

## Cosa c'è

| Nel CMS | File | Dove compare |
| --- | --- | --- |
| Home | `pagine/home.yaml` | frase della hero, presentazione, pulsante |
| Chi sono | `pagine/chi-sono.mdoc` | titolo, attacco (anche in home), il percorso, la versione breve (anche in home), il resto della pagina |
| Newsletter | `pagine/newsletter.yaml` | il modulo, i messaggi dell'iscrizione, la pagina di conferma, la chiusa degli articoli |
| Microtesti | `pagine/microtesti.yaml` | footer, Scritti vuoto, 404, frasi degli stati, firma degli articoli |
| Progetti | `progetti/*.mdoc` | card in home e pagina `/progetti/…` |
| Articoli | `articoli/*.mdoc` | lista in home e in `/scritti`, pagina `/scritti/…` (solo se «Pubblicato») |
| Curiosità | `curiosita/*.json` | tabellone e `/curiosita` |

Etichette di sezione, rimandi in fondo alle pagine e voci di menu restano nel codice: sono interfaccia, non testo.

## Il corpo a blocchi

Progetti, Chi sono e articoli hanno un corpo fatto di blocchi, gli stessi delle tavole. Si inseriscono dal pulsante «+» dell'editor.

- **Paragrafo:** etichetta nel margine, testo a destra.
- **Numero in evidenza:** un numero vero in Doto, con didascalia.
- **Paragrafo con figura:** barre a punti o elenco.
- **Paragrafo con foto:** solo foto già trattate con `scripts/tratta-foto.py` (oggi «notte» e «pini»).
- **Citazione:** una frase in Doto a tutta pagina.
- **Prima e dopo:** numeri a confronto, in card (pensato per gli articoli).

I numeri `[ 01 ]`, `[ 02 ]` li mette il sito, in ordine: spostando un blocco si rinumera da solo. Il testo scritto fuori dai blocchi finisce nella colonna di lettura, senza etichetta. Nelle pagine progetto, «Mostra lo stato del progetto» mette lo stato sotto il testo di quel blocco.

Per aggiungere un tipo di blocco servono tre posti: `keystatic.config.ts` (il modulo nell'editor), `src/markdoc.ts` (gli attributi) e `src/components/Corpo.astro` (come si disegna).

## Accesso online: la GitHub App

Keystatic entra in GitHub attraverso la GitHub App **daretta-cms**, creata il 5 ottobre 2026 sull'account daretta-ai (Settings → Developer settings → GitHub Apps) e installata solo sul repository `daretta-ai/daretta`.

- Redirect URI: `https://daretta.dimmipure.workers.dev/api/keystatic/github/oauth/callback` e `https://daretta.it/api/keystatic/github/oauth/callback`. Un dominio nuovo va aggiunto qui.
- Permessi del repository: Contents **Read and write**, Metadata **Read-only**, Pull requests **Read and write**. Webhook spento.

Dove stanno i valori:

| Valore | Dove | Perché |
| --- | --- | --- |
| `KEYSTATIC_GITHUB_CLIENT_ID` | `wrangler.jsonc` | Pubblico: compare nell'indirizzo del login di GitHub |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | `wrangler.jsonc` e `.env.production` | Pubblico: serve anche alla build, finisce nella pagina dell'admin |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Cloudflare, Worker `daretta` → Settings → Variables and Secrets, tipo **Secret** | Segreto |
| `KEYSTATIC_SECRET` | Cloudflare, come sopra, tipo **Secret** (una stringa casuale, es. `openssl rand -hex 32`) | Segreto |

Le variabili in chiaro aggiunte dal pannello di Cloudflare spariscono al deploy successivo, perché il deploy usa quelle di `wrangler.jsonc`. I Secret invece restano. Per questo i valori pubblici stanno nel repository e nel pannello solo i segreti.

Se il client secret va rigenerato su GitHub, va aggiornato anche su Cloudflare.

Possono scrivere solo gli account GitHub con accesso in scrittura al repository.

## Newsletter: Kit

Il modulo del sito manda l'email a `/api/iscrizione` (`src/pages/api/iscrizione.ts`), che la passa a Kit. Nella pagina non c'è nessuno script di Kit.

| Valore | Dove | Perché |
| --- | --- | --- |
| `KIT_FORM_ID` | `wrangler.jsonc` | Pubblico: è nell'indirizzo del modulo Kit |
| `KIT_API_KEY` | Cloudflare, come Secret | Segreto. Serve solo per riconoscere chi è già iscritto: senza, l'iscrizione funziona lo stesso |

Nel modulo Kit vanno impostati la conferma via mail (doppio passaggio) e, come pagina dopo la conferma, `https://daretta.it/newsletter/benvenuto`. I messaggi di esito si scrivono in Keystatic, pagina Newsletter.

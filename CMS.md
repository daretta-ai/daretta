# Il CMS di dàretta

I testi del sito si scrivono in Keystatic. Keystatic salva file normali dentro `src/content`, e il sito li legge al momento della build.

## Dove si scrive

- **Online:** `/keystatic` sul sito (`https://daretta.it/keystatic`). Si entra con l'account GitHub. Ogni salvataggio è un commit su `main`, e Cloudflare ripubblica il sito in un paio di minuti.
- **In locale:** `npm run cms`, poi `http://localhost:4321/keystatic`. Qui l'admin salva sui file del computer, e le modifiche vanno messe su GitHub con un commit come il resto del codice. In locale si vedono anche gli articoli non pubblicati. `npm run cms` fa girare il sito in Node, senza l'adapter Cloudflare: con `npm run dev` le pagine funzionano, ma l'admin no, perché il runtime di Cloudflare non può scrivere file.

## Cosa c'è

| Nel CMS | File | Dove compare |
| --- | --- | --- |
| Home | `pagine/home.yaml` | frase della hero, presentazione, pulsante |
| Chi sono | `pagine/chi-sono.mdoc` | titolo, attacco (anche in home), il percorso, la versione breve (anche in home), il resto della pagina |
| Progetti (pagina) | `pagine/progetti.yaml` | titolo e attacco di `/progetti`, testo del modulo con il numero (da aggiornare quando un progetto cambia fase) |
| Newsletter | `pagine/newsletter.yaml` | il modulo, i messaggi dell'iscrizione, la pagina di conferma, la chiusa degli articoli |
| Microtesti | `pagine/microtesti.yaml` | footer, Chiacchiere vuoto, 404, frasi degli stati, firma degli articoli |
| Progetti | `progetti/*.mdoc` | card in home, righe di `/progetti` e pagina `/progetti/…` |
| Articoli | `articoli/*.mdoc` | lista in home e in `/chiacchiere`, pagina `/chiacchiere/…` (solo se «Pubblicato») |
| Newsletter inviate | `numeri/AAAA-MM.mdoc` | archivio `/newsletter` e pagina `/newsletter/AAAA-MM` (solo se «Pubblicato»), link «Guarda cosa ti sei perso» nel modulo |
| Linee del tempo | `tempi/*.yaml` | il blocco «Linea del tempo» (il battito), dove lo inserisci |
| Curiosità | `curiosita/*.json` | tabellone e `/curiosita` |

Etichette di sezione, rimandi in fondo alle pagine e voci di menu restano nel codice: sono interfaccia, non testo.

## L'archivio della newsletter

Ogni numero inviato si copia in **Newsletter inviate**, con il testo identico alla mail. L'indirizzo è anno e mese di uscita (`2026-11`), il numero è progressivo. Le sezioni della mail («L'opinione non richiesta», «Già che ci siamo…», «Una cosa che ho letto») sono paragrafi con l'etichetta nel margine. La «Descrizione» non compare nella pagina: la leggono motori di ricerca, AI e social.

«Pubblicato» si accende qualche giorno dopo l'invio, così chi è iscritto la legge prima. Finché non c'è almeno un numero pubblicato, `/newsletter` non esiste e il link nel modulo non compare. I numeri vanno nella sitemap ma non nel feed RSS, che resta degli articoli. Titolo e frase dell'archivio e testo del link stanno nella pagina Newsletter.

## Le linee del tempo

Il battito è una linea del tempo disegnata come un'onda di quadretti (design system, «Il battito»). Una storia si scrive in **Linee del tempo** e si mostra con il blocco «Linea del tempo» nel corpo di una pagina (progetti, Chi sono, articoli), scegliendola dall'elenco.

- **Tappe:** data, titolo, una riga facoltativa (la legge solo lo screen reader) e un peso. Il peso alza l'onda: le tappe «Grandi» hanno l'etichetta anche nella panoramica degli anni. «Come dirla» prende il posto del mese sotto il numero («A breve», «Estate 2027»): la data serve comunque, anche indicativa, perché decide dove cade la tappa.
- **Aggiornamenti:** solo una data, e una nota che resta per te. Non hanno etichetta, ma fanno battere l'onda nei periodi di lavoro senza tappe. Sono facoltativi: senza, l'onda batte solo sulle tappe.
- **Siamo qui** è il giorno in cui il sito viene costruito, cioè l'ultimo salvataggio. Dopo, l'onda finisce e resta una riga di quadretti spenti, con le tappe future più grandi. «Cosa succede adesso» è la frase accanto a «Siamo qui». Con «Storia conclusa» acceso, l'onda finisce all'ultima data e «Siamo qui» non c'è.

La grana la sceglie il sito dalla durata: una storia che sta in un anno si vede a settimane; se dura di più, sopra c'è la panoramica (a mesi fino a quattro anni, a trimestri oltre) e le parentesi fanno da lente sull'anno aperto sotto. I conti sono in `src/battito.ts`, il disegno in `src/components/Battito.astro`.

## Il corpo a blocchi

Progetti, Chi sono e articoli hanno un corpo fatto di blocchi, gli stessi delle tavole. Si inseriscono dal pulsante «+» dell'editor.

- **Paragrafo:** etichetta nel margine, testo a destra.
- **Numero in evidenza:** un numero vero in Doto, con didascalia.
- **Paragrafo con figura:** barre a punti o elenco.
- **Paragrafo con foto:** solo foto già trattate con `scripts/tratta-foto.py` (oggi «notte» e «pini»).
- **Citazione:** una frase in Doto, nella colonna del testo. La riga sotto è facoltativa: la fonte, se le parole sono di altri; vuota, se è una frase del testo.
- **Prima e dopo:** numeri a confronto, in card (pensato per gli articoli).
- **Linea del tempo:** il battito di una storia scritta in «Linee del tempo» (vedi sopra).

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

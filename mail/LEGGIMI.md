# Mail della newsletter

`template-kit.html` è il template dàretta per Kit. Lo usano la mail di conferma e le newsletter: si incolla in Kit come template HTML e si imposta come predefinito dell'account.

**Nel template non vanno commenti HTML con variabili di Kit dentro.** Kit sostituisce `{{ … }}` anche dentro i commenti: il 6 ottobre 2026 il corpo della mail è comparso due volte, una volta in testa e senza stile, perché un commento citava `{{ message_content }}`. Per questo le note stanno qui. Gli unici commenti nel template sono i condizionali per Outlook (`<!--[if mso]>`), senza variabili.

Variabili obbligatorie, una volta sola ciascuna: `{{ message_content }}`, `{{ unsubscribe_url }}`, `{{ address }}`.

## Come si scrive in Kit

- **I titoli delle sezioni** («L'opinione non richiesta», «Già che ci siamo…», «Una cosa che ho letto») si scrivono come **titolo H2**, non in grassetto. Il template li trasforma nelle etichette del sito: mono maiuscolo in `onda`. H1 è un titolo grande in Geist, H3 un sottotitolo, H4 un'etichetta grigia.
- **Le citazioni** (blocco citazione di Kit) diventano la frase in evidenza: Geist grande, `inchiostro`, senza filetto a sinistra.
- **Il pulsante**: nell'editor di Kit colore `#FF4F1A`, testo `#111314`, nessun bordo, nessun arrotondamento. Kit scrive i colori direttamente sul pulsante, e dove gli stili del template non arrivano (Gmail con indirizzi non Google) restano quelli.
- **Le immagini** escono ad angoli vivi, a tutta colonna. Le foto di Patrizio vanno trattate prima con `scripts/tratta-foto.py`.

## Le regole del design system, adattate alla posta

- Fondo `cemento`, testo `inchiostro-corpo` a 18px (il gradino mobile di `testo-corpo`: la colonna della mail è 520px), interlinea 1,7. Spazi solo dalla scala `space-*`.
- Logotipo in alto (immagine, `public/mail/logotipo.png`, 120px), sotto il filetto, come l'apertura degli articoli e dei numeri sul sito.
- Link come sul sito: testo `inchiostro` e riga di punti in `petrolio-acceso`, che all'hover diventano `punti`. Dove i punti non si possono fare, una sottolineatura dello stesso colore.
- Elenchi con il segno `[ ■ ]` e i filetti tra le voci; dove il segno non si può fare, quadretto pieno (mai pallini tondi). Numerati `01.`.
- L'arancio solo per il pulsante (testo `cemento` sopra) e per la à del logotipo.
- **Niente smusso, da nessuna parte.** Apple Mail saprebbe farlo con `clip-path`, Gmail e Outlook no: il design system vuole il segno uguale ovunque, quindi angoli vivi per tutti. Mai tondi.
- Niente Doto nel testo: la si vede solo nel logotipo, che è un'immagine.
- Piede come il footer del sito: filetto, frasi in Geist 14px `inchiostro-muto`, link in mono maiuscolo, indirizzo in mono 12px.

## Compatibilità: perché il template è fatto così

- **Gli stili sono divisi in più blocchi `<style>`.** Gmail butta un blocco intero se trova una regola che non capisce (per esempio i selettori `[class*=…]`) o se supera 8 KB. Il primo blocco contiene solo regole che Gmail accetta; caratteri, punti sotto i link, segno degli elenchi e correzioni per Apple e Outlook.com stanno nei blocchi dopo. Se si aggiunge una regola, va nel blocco giusto.
- **Tutto quello che conta è anche scritto in linea** sul contenitore (fondo, carattere, colore, misura): Gmail con indirizzi non Google ignora tutti i `<style>`, e lì la mail resta leggibile con i colori ereditati.
- **Caratteri**: Geist e Geist Mono si caricano da `daretta.it/mail/font` (con `Access-Control-Allow-Origin`) dove il programma lo permette: Apple Mail, iOS, Outlook per Mac, Thunderbird. Gmail e Outlook usano i caratteri di sistema. Le `@font-face` stanno dentro `@media screen` perché Outlook per Windows, se le vede, ripiega su Times New Roman.
- **Outlook per Windows**: condizionali `mso` per caratteri (Arial e Courier New), interlinea e rientri degli elenchi; struttura a tabelle di 600px, filetti come celle alte 1px.
- **Modo scuro.** La mail è scura e dichiara `color-scheme: dark`: Apple Mail e Gmail web la lasciano così, Outlook.com e Gmail Android la toccano poco (e per Outlook.com ci sono le regole `[data-ogsc]`). L'app Gmail per iPhone in modo scuro e Outlook per Windows in modo scuro invece invertono tutto, e la mail diventa chiara con il testo scuro: resta leggibile, solo non è più cemento. Il logotipo ha il fondo cemento dentro l'immagine apposta, così resta leggibile anche lì.
- **Indirizzo nel piede**: Gmail e Apple Mail ne fanno da soli un link blu; il template lo riporta al grigio (`format-detection` e regole per i link aggiunti dai programmi).

## Prima di usarlo per un invio

1. Incollare il template in Kit (Email Templates, il template dàretta, Edit) e salvare.
2. Mandarsi una prova con un titolo H2, un elenco, un link, una citazione e un pulsante, e guardarla in Gmail (web e app), Apple Mail (Mac e iPhone) e, se possibile, Outlook.
3. In Gmail web, «Mostra originale» della prova: serve a vedere come Kit scrive pulsanti e titoli, per stringere i selettori del template.

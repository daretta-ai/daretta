# dàretta

Il sito personale di Patrizio Bartolozzi, detto Papi. *dàretta*, in toscano: ascolta me.

Il sistema è **scuro, essenziale e con un solo momento di meraviglia**: fondo cemento, luce petrolio che viene da una sfera di punti, e un solo colore acceso, l'arancio della à, che si accende anche sulle azioni.

## Voce

Diretta, secca, sincera, ironica e un po' caustica. Poche parole, molto peso.

- **Sì:** frasi brevi, un'opinione per frase, l'autoironia. «Il database non è lento. La tua query sì.»
- **No:** superlativi, entusiasmo di maniera, gergo da LinkedIn, punti esclamativi, emoji.
- **dàretta si scrive sempre così:** minuscolo, con l'accento grave. Per ora non si spiega (l'asterisco è stato tolto; la spiegazione del nome, se servirà, troverà un altro posto), non si traduce e non si italianizza mai in «dammi retta».
- I titoli in Doto sono minuscoli e finiscono con il punto: «una mail al mese.»
- Le etichette sono in mono maiuscolo, le sezioni numerate tra parentesi quadre: `[ 003 ] SCRITTI`. Dentro una pagina, le sottosezioni hanno due cifre: `[ 01 ] LA VERSIONE BREVE`.

## Tre regole di colore

1. **Il fondo è cemento.** `cemento` per la pagina, `cemento-rilievo` per i moduli, `cemento-incavo` per le card dentro i moduli. Il testo è `inchiostro`; i paragrafi lunghi `inchiostro-corpo`; etichette e date `inchiostro-muto`.
2. **Il petrolio è luce, non vernice.** Viene dalla sfera: un alone (`petrolio-alone`) si allarga sul fondo della pagina, e ogni modulo ne prende tanto quanto è vicino alla sfera. La hero e la foto sono le più cariche (`petrolio-luce` al centro), «Chi sono» una dose media, «Progetti» appena un velo. Il gradiente è sempre radiale o lineare *da* petrolio *verso* cemento, mai il contrario, mai tra due colori caldi. Unica eccezione: il modulo newsletter è petrolio pieno (`petrolio-acceso` → `petrolio-scuro`, 135°), perché è l'invito principale.
3. **L'arancio vuol dire «vivo», e «fai qualcosa».** `arancio` si accende per la à del logotipo, il pallino dei progetti ONLINE e le CTA (Iscriviti nell'header, Iscrivimi nella newsletter). Più pochi dettagli di stato: il pallino accanto alla voce di menu attiva e i punti già letti della barra di avanzamento negli articoli. Il testo sopra l'arancio è sempre `cemento`, mai `inchiostro` (non raggiunge il contrasto). Mai per link, hover, bordi, tag o decorazione: se un elemento non è la à, uno stato o un'azione, resta spento.

## Tipografia

- **Doto** (punti) per il logotipo, la frase della hero, il titolo di apertura delle pagine interne (`punti-pagina`), un numero vero in evidenza (`punti-numero`), le citazioni e il titolo della newsletter. Mai sotto i 28px, mai in un paragrafo, mai per i titoli degli articoli: sono lunghi, a matrice di punti si leggono male.
- **Geist** (sans) per tutto quello che si legge: titoli di liste e articoli, paragrafi, card.
- **Geist Mono** (mono) per etichette, stati, date, codice. Sempre maiuscolo tranne il codice.

I tre caratteri sono su Google Fonts (`family=Doto:wght@600;800;900&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500`).

## Composizione

- **Pieno e vuoto.** Non tutto sta in un box. Hero, Chi sono, Progetti e Newsletter sono moduli (`radius-modulo`, padding `space-10`); Scritti e Curiosità sono posate direttamente sul fondo. Scritti è una lista separata da `filetto`; Curiosità ha un solo oggetto fisico, il tabellone, senza box attorno. L'alternanza dà ritmo e gerarchia: se una pagina diventa una griglia di box uguali, qualcosa è andato storto.
- **La hero** apre con il logotipo grande (`punti-hero`) e sotto la frase in Doto (`punti-motto`): «risolvo problemi, a volte sono intere aziende.». A destra la sfera. Nella home l'header non ripete il logotipo finché non si scorre oltre la hero; nelle altre pagine c'è sempre.
- **Pagine interne.** Hanno lo stesso ritmo della home, non una colonna di testo dall'inizio alla fine. Si aprono con un modulo-testata petrolio: etichetta, titolo in `punti-pagina`, frase d'attacco; su desktop a destra la sfera piccola. Il testo lungo sta a destra (colonne 4–10) e le etichette delle sottosezioni nel margine a sinistra (colonne 1–3). Almeno ogni due o tre paragrafi qualcosa rompe la colonna: un modulo con un numero in `punti-numero`, una citazione in Doto a tutta griglia, una foto, una figura a punti (es. la scala dei ruoli in Chi sono). Si chiudono con newsletter e rimandi ad altre pagine in card.
- **Articoli:** colonna di lettura di 760px (colonne 4–10) direttamente sul fondo, senza modulo; metadati (tag, data, tempo di lettura) e numeri di sezione nel margine; le citazioni in Doto escono dalla colonna. Sotto l'header una barra di avanzamento a punti: i punti letti in `arancio`, gli altri in `filetto`.
- **Pagina 404:** modulo-testata con titolo in `punti-pagina`, una riga di testo, poi il tabellone delle curiosità posato sul fondo, e sotto il link per tornare alla home. È l'unico posto, oltre a home e `/curiosita`, dove compare il tabellone.
- **Griglia a 12 colonne** su desktop (1440px, margini `space-14`, gap `space-6`), una colonna su mobile (margini `space-3`, gap `space-3`, moduli `radius-modulo-mobile`). Su mobile il margine delle etichette si ripiega sopra il paragrafo.
- Angoli morbidi e generosi, pallini e pill (`radius-pill`). Niente angoli vivi, niente ombre tranne quella della sfera.

## Gli stati dei progetti

Tre stati, dal più vivo al più lontano. Sempre segno e parola insieme, in Geist Mono maiuscolo.

- **ONLINE:** pallino pieno in `arancio`. È l'unico stato acceso.
- **IN SVILUPPO:** anello vuoto a tratto continuo in `inchiostro-muto`.
- **CONCEPT:** anello tratteggiato in `inchiostro-muto`. È un'idea che si sta ancora disegnando: meno di un anello, non ancora un pallino.

**Descrizione all'hover.** Al passaggio del mouse, e al focus da tastiera, accanto allo stato compare una frase breve in Geist, `inchiostro-muto`, senza box né arancio: ONLINE «Si può usare.», IN SVILUPPO «Ci sto lavorando.», CONCEPT «Per ora è un'idea.». La parola dello stato resta sempre visibile; la frase è un di più, e per gli screen reader è la descrizione dello stato (`aria-describedby`). Su touch non compare.

## La sfera

L'unico momento «wow» del sito, ed è legato al nome: la sfera *ascolta*.

1. **A riposo** ruota piano su se stessa.
2. **In ascolto:** quando il cursore si avvicina, i punti vibrano in onde (`onda`) che partono dal cursore, come un suono.
3. **Al clic** i punti si raccolgono a formare la à, che si accende di `arancio` per un istante, poi tornano sfera.

**Dove sta.** In home è grande, nella hero. Nelle pagine interne, solo su desktop, torna piccola (150–320px) nel modulo-testata o accanto al titolo: è la stessa sfera che ti segue, non un secondo effetto, e la luce della pagina parte da lei. Su mobile compare solo in home; nelle pagine interne la luce parte dal modulo-testata.

Implementazione: canvas 2D, nessuna libreria, pochi KB. Rispetta `prefers-reduced-motion` (resta ferma). Il sito deve caricarsi all'istante: la sfera non può rallentarlo; nelle pagine interne si carica dopo il testo.

## Le curiosità

Un tabellone delle partenze, meccanico e sobrio. La meraviglia resta alla sfera: il tabellone è il dettaglio che fa sorridere.

- **Tabellone** (home, pagina `/curiosita` e pagina 404): una testata a tessere (N°, TIPO, DEST.) che girano lettera per lettera, e un corpo a palette che girano una riga intera alla volta, dall'alto in basso. In ordine casuale a ogni visita.
- **Durata variabile.** Ogni curiosità resta 4 secondi più 1 secondo ogni 30 battute del testo, con un minimo di 5 e un massimo di 12 (la 012 resta 5 secondi, una voce media circa 7,5, le più lunghe circa 10). Il conteggio parte quando le palette hanno finito di girare. La battuta sta quasi sempre in fondo: chi legge con calma deve arrivarci.
- **Elenco** (solo pagina `/curiosita`): sotto il tabellone, il titolo «Se proprio non hai nulla da fare, leggile tutte.» e tutte le curiosità. Ogni riga ha N°, TIPO e DEST. in tessere, con le stesse etichette del tabellone, poi il testo. Niente filtri, niente binari.
- **Ancore:** ogni riga dell'elenco ha un'ancora con il suo numero (`/curiosita#013`), così gli altri testi possono rimandare a una curiosità precisa. Chi arriva da un'ancora trova quella riga evidenziata per un istante in `cemento-incavo`, senza arancio.
- **Materiali:** tessere e palette in `cemento-rilievo`, lettere in `inchiostro` (Geist Mono) e testo in `inchiostro-corpo` (Geist). La cerniera è una riga di `cemento` al 40%: si vede la piega, non taglia le lettere. Niente arancio, nemmeno sui pulsanti Pausa e Prossima: sono comandi, non CTA, e una curiosità non è «viva».
- **Regole di scrittura:** testo di massimo ~200 battute (oltre è un post); destinazione ironica di massimo 15 caratteri; tipo di massimo 10. Al massimo cinque tipi, oggi CASSI MIEI, SPORT, SVAGHI, LAVORO e VIAGGI.
- **Accessibilità:** pulsanti Pausa e Prossima; il tabellone si ferma al passaggio del mouse o del focus; il testo completo è annunciato solo quando lo chiede chi legge; con `prefers-reduced-motion` il cambio è istantaneo.

La pagina `/curiosita` non è nel menu principale: ci si arriva da «VEDI TUTTE →» nel blocco in home, dal footer e dai rimandi nei testi.

## Logotipo

Il logotipo è tipografico: *dàretta* in Doto 900, `inchiostro`, con la à in `arancio`. Il simbolo, da solo, è la à arancio. Niente asterisco. Niente contenitori (quadrati, cerchi) attorno al segno.

## Accessibilità

- Testo ≥4.5:1 sul suo fondo (ogni token di testo dice su quali fondi è verificato); ≥3:1 per testo sopra i 24px, anelli e icone. Sui pulsanti arancio il testo è `cemento`.
- Gli stati non si distinguono solo per colore: ONLINE è un pallino pieno, IN SVILUPPO un anello vuoto, CONCEPT un anello tratteggiato, sempre con la parola accanto. Il tratteggio deve restare leggibile anche piccolo: segmenti non più corti dello spessore dell'anello, e `inchiostro-muto` ≥3:1 sul fondo della card. La voce di menu attiva ha anche `aria-current`.
- Pulsanti e chip alti almeno 44px su mobile.

## Da non fare

- Tradurre o storpiare dàretta.
- Usare l'arancio per link, hover, bordi, tag o decorazione.
- Accendere di arancio uno stato che non sia ONLINE.
- Mettere informazioni necessarie solo nell'hover: la descrizione degli stati è un di più.
- Testo chiaro sopra l'arancio.
- Dare al tabellone i colori delle ferrovie (giallo, blu) o l'arancio.
- Gradienti viola-blu, card con bordo sinistro colorato, emoji.
- Doto per paragrafi, etichette o titoli degli articoli.
- Un box attorno a ogni sezione.
- Una pagina interna fatta solo di una colonna di testo.
- La sfera nelle pagine interne su mobile.

# dàretta

Il sito personale di Patrizio Bartolozzi, detto Papi. *dàretta*, in toscano: «dà retta… a un cretino», come dice con falsa modestia chi crede di saperla lunga.

Il sistema è **scuro, essenziale e con un solo momento di meraviglia**: fondo cemento, luce petrolio che viene da una sfera di punti, e un solo colore acceso, l'arancio della à, che si accende anche sulle azioni.

## Voce

Diretta, secca, sincera, ironica e un po' caustica. Poche parole, molto peso.

- **Sì:** frasi brevi, un'opinione per frase, l'autoironia. «Il database non è lento. La tua query sì.»
- **No:** superlativi, entusiasmo di maniera, gergo da LinkedIn, punti esclamativi, emoji.
- **dàretta si scrive sempre così:** minuscolo, con l'accento grave. Se si spiega, si spiega solo così: «dà retta… a un cretino». Mai con «ascoltami» o simili; non si traduce e non si italianizza mai in «dammi retta».
- I titoli in Doto sono minuscoli e finiscono con il punto: «dà retta a un cretino.»
- Le etichette sono in mono maiuscolo, le sezioni numerate tra parentesi quadre: `[ 003 ] CHIACCHIERE`. Dentro una pagina, le sottosezioni hanno due cifre: `[ 01 ] LA VERSIONE BREVE`.
- **I titoli di sezione sono in `onda`**, con la stessa misura e lo stesso carattere delle altre etichette: è il colore dei punti quando la sfera ascolta. Valgono come titoli le etichette numerate delle sezioni e delle sottosezioni e quella delle testate. Restano dentro il loro modulo, senza filetti sopra. Sul modulo newsletter sono `carta`.

## Tre regole di colore

1. **Il fondo è cemento.** `cemento` per la pagina, `cemento-rilievo` per i moduli, `cemento-incavo` per le card dentro i moduli. Il testo è `inchiostro`; i paragrafi lunghi `inchiostro-corpo`; etichette e date `inchiostro-muto`; i titoli di sezione `onda`.
2. **Il petrolio è luce, non vernice.** Viene dalla sfera: un alone (`petrolio-alone`) si allarga sul fondo della pagina, e ogni modulo ne prende tanto quanto è vicino alla sfera. La hero e la foto sono le più cariche (`petrolio-luce` al centro), «Chi sono» una dose media, «Progetti» appena un velo. Il gradiente è sempre radiale o lineare *da* petrolio *verso* cemento, mai il contrario, mai tra due colori caldi. Unica eccezione: il modulo newsletter è petrolio pieno (`petrolio-acceso` → `petrolio-scuro`, 135°), perché è l'invito principale.
3. **L'arancio vuol dire «vivo», e «fai qualcosa».** `arancio` si accende per la à del logotipo, il pallino dei progetti ONLINE e le CTA (Iscriviti nell'header, Iscrivimi nella newsletter). Più un solo dettaglio di stato: il pallino accanto alla voce di menu attiva. Il testo sopra l'arancio è sempre `cemento`, mai `inchiostro` (non raggiunge il contrasto). Mai per link, hover, bordi, tag o decorazione: se un elemento non è la à, uno stato o un'azione, resta spento.

## Tipografia

- **Doto** (punti) per il logotipo, la frase della hero, il titolo di apertura delle pagine interne (`punti-pagina`), un numero vero in evidenza (`punti-numero`), le citazioni e il titolo della newsletter. Mai sotto i 28px, mai in un paragrafo, mai per i titoli degli articoli: sono lunghi, a matrice di punti si leggono male.
- **Geist** (sans) per tutto quello che si legge: titoli di liste e articoli, paragrafi, card.
- **Geist Mono** (mono) per etichette, stati, date, codice. Sempre maiuscolo tranne il codice.

**Una scala sola.** Geist ha quattro misure, più il titolo degli articoli; Geist Mono ne ha due. Sono i token `--testo-*` in `src/styles/token.css`, e su mobile cambiano da soli. Nessun componente si sceglie una misura sua: se un testo non trova posto nella scala, è il testo a doversi adattare. Il Doto resta fuori scala, perché è il carattere di display.

| Token | Desktop | Mobile | Dove |
| --- | --- | --- | --- |
| `testo-articolo` | 64 | 40 | titolo della pagina di un articolo |
| `testo-titolo` | 32 | 24 | titoli delle Chiacchiere, frase del Chi sono in home, rimandi in chiusura, nome nella testata dei progetti, voci del menu mobile |
| `testo-attacco` | 24 | 20 | frase della hero, attacchi di testate e articoli, testo della newsletter, nomi nelle card progetto |
| `testo-corpo` | 20 | 18 | tutti i paragrafi, elenchi compresi |
| `testo-piccolo` | 16 | 16 | descrizioni delle card, campo email, messaggi dei form, codice |
| `testo-etichetta` (mono) | 14 | 13 | etichette e titoli di sezione, link, pulsanti, footer |
| `testo-meta` (mono) | 12 | 12 | stati, date, didascalie, note |

I tre caratteri sono serviti dal sito stesso, mai da Google Fonts: nessun indirizzo IP passa a Google. Sono i file latin di @fontsource (Doto 600, 800, 900; Geist 400, 500, 600; Geist Mono 400, 500) in `src/assets/font`, dichiarati in `src/styles/font.css`.

## Composizione

- **Pieno e vuoto.** Non tutto sta in un box. Hero, Chi sono, Progetti e Newsletter sono moduli (`smusso-modulo`, padding `space-10`); Chiacchiere e Curiosità sono posate direttamente sul fondo. Chiacchiere è una lista separata da `filetto`; Curiosità ha un solo oggetto fisico, il tabellone, senza box attorno. L'alternanza dà ritmo e gerarchia: se una pagina diventa una griglia di box uguali, qualcosa è andato storto.
- **La hero** apre con il logotipo grande (`punti-hero`) e sotto la frase in Doto (`punti-motto`): «risolvo problemi. di solito non i miei.». Da desktop ogni frase resta intera sulla sua riga. È la frase da usare ovunque (sito, LinkedIn, bio), quindi deve reggere anche da sola. A destra la sfera. Nella home l'header non ripete il logotipo finché non si scorre oltre la hero; nelle altre pagine c'è sempre.
- **Pagine interne.** Hanno lo stesso ritmo della home, non una colonna di testo dall'inizio alla fine. Si aprono con un modulo-testata petrolio: etichetta, titolo in `punti-pagina`, frase d'attacco; su desktop a destra la sfera piccola. Su mobile il titolo si stringe quanto basta perché la sua parola più lunga stia nella colonna, mai sotto i 28px (oggi succede con «quattro chiacchiere.»). La griglia del testo è una sola, in tutte le pagine interne e negli articoli (vedi «La griglia del testo»). Almeno ogni due o tre paragrafi qualcosa rompe il ritmo: un modulo con un numero, una citazione in Doto (vedi «Le citazioni»), una foto, una figura a punti (es. la scala dei ruoli in Chi sono). Si chiudono con la fascia di chiusura (vedi «La chiusura»).
- **Articoli:** colonna di lettura di circa 650px (colonne 4–9, vedi «La griglia del testo») direttamente sul fondo, senza modulo; metadati (tag, data, tempo di lettura) e numeri di sezione nel margine; le citazioni in Doto restano nella colonna (vedi «Le citazioni»). Gli elenchi seguono le regole di «Gli elenchi». Sotto l'header una barra di avanzamento a punti: i punti letti in `punti`, gli altri in `filetto-neutro`. Sono i punti della sfera che si accendono mentre leggi: uno stato, non un'azione, quindi niente arancio (faceva concorrenza a ISCRIVITI e al logotipo) e niente `onda` (troppo chiara, sembrava un secondo accento). Tra letti e spenti serve almeno 3:1 (oggi 3,3:1), così il confine si vede. È una barra, non un elemento della pagina: punti tondi da 2px, uno ogni 8px, quanti ne stanno nella larghezza, uguali su desktop e mobile. Il passo è fisso e il numero no (circa 160 punti su desktop, una quarantina su un telefono), così la trama è la stessa su ogni schermo e resta una riga punteggiata sottile, non una fila di bottoni.
- **Pagina 404:** modulo-testata con titolo in `punti-pagina`, una riga di testo, poi il tabellone delle curiosità posato sul fondo, e sotto il link per tornare alla home. È l'unico posto, oltre a home e `/curiosita`, dove compare il tabellone.
- **L'header quando la pagina scorre** è vetro smerigliato, non un fondo pieno: cemento al 60% con `backdrop-filter: blur(14px)`. Sotto si vede che qualcosa scorre, ma non si legge. Nel CSS si scrive solo la regola standard: il prefisso per Safari lo aggiunge la build.
- **Il menu su mobile** è l'hamburger classico, due righe in `inchiostro` su un fondo pieno `filetto`, smussato come ogni pulsante (10,3px su 48px), senza contorno: un contorno accanto a ISCRIVITI pesava troppo, e `cemento-rilievo` sull'header trasparente non si vedeva. L'anello di focus segue lo smusso.
- **Il menu aperto su mobile copre tutta la pagina.** Fondo `cemento` con l'alone `petrolio-alone` che parte dall'angolo del pulsante; logotipo, ISCRIVITI e la X restano al loro posto. Le voci sono in Geist alla misura dei titoli (`testo-titolo`, 24px), separate da `filetto`, con il numero nel margine in mono (`[ 01 ] Chiacchiere`); il pallino arancio della voce attiva sta dopo la parola. In fondo LinkedIn e Mail in mono `inchiostro-muto`. Entra sfumando (320ms) e le voci salgono di 8px una dopo l'altra (60ms di scarto); esce sfumando in 140ms. La pagina sotto non scorre, Esc chiude, con `prefers-reduced-motion` il cambio è istantaneo.
- **Griglia a 12 colonne** su desktop (1440px, margini `space-14`, gap `space-6`), una colonna su mobile (margini `space-3`, gap `space-3`, moduli `smusso-modulo-mobile`). Su mobile il margine delle etichette si ripiega sopra il paragrafo.
- **Stacco tra le sezioni.** Tra una sezione e l'altra lo spazio è più largo del gap: 96px (`space-24`) su desktop, 56px (`space-14`) su mobile (`--stacco`). Il gap resta per ciò che sta insieme, come le card di Progetti.
- **Una scala sola per gli spazi.** Margini, padding e gap usano solo i token `space-*`, su tre livelli. Dentro un elemento 4, 8, 12, 16 (etichetta e testo, chip, righe); tra elementi 24, 32, 40 (gap e padding di card e moduli: card a 32, moduli a 40 sui lati); tra blocchi 56, 72, 96 (blocchi, figure e citazioni negli articoli a 72, chiusure e stacco a 96). Un valore fuori scala va al gradino più vicino. Eccezioni volute: le righe degli elenchi a 14px, e le misure funzionali (tessere del tabellone, spazio del menu sotto l'header).
- Angoli smussati a 45°, mai arrotondati, tranne la sfera e gli stati (vedi «Angoli»). Niente ombre tranne quella della sfera.

## Angoli: il tondo ascolta, il quadrato dice

Nel sito convivono due materiali, e il contrasto tra i due racconta il nome.

- **Tondo è ciò che ascolta.** La sfera e i segni degli stati (il pallino ONLINE, gli anelli IN SVILUPPO e CONCEPT). Solo loro, con `radius-tondo`.
- **Smussato è ciò che dice.** Moduli, foto, card, blocchi di codice, pulsanti, chip e campi hanno gli angoli tagliati a 45°, parenti delle celle quadrate di Doto. Il passaggio tra i due materiali è il clic sulla sfera, quando i punti tondi diventano le celle della à.
- **Le misure.**

| Cosa | Desktop | Mobile |
| --- | --- | --- |
| Moduli e foto | `smusso-modulo` 32px | `smusso-modulo-mobile` 30px |
| Card e blocchi di codice | `smusso-card` 20px | `smusso-card-mobile` 12px |
| Pulsanti e chip | 3/14 dell'altezza (`smusso-azione`, 12px su 56px) | 3/14 dell'altezza |
| Campi dei form e messaggi | `smusso-campo` 6px | `smusso-campo` 6px |

- **Pulsanti e chip hanno lo smusso più forte, e sempre nella stessa proporzione.** Lo smusso è 3/14 dell'altezza, come 12px su un pulsante da 56px: così un pulsante piccolo ha lo stesso carattere di uno grande, senza sembrare tagliato a metà. Per esempio 9,4px su 44px (ISCRIVITI in testata, comandi del tabellone, chip), 10,3px su 48px (menu), 11,1px su 52px (pulsanti su mobile). Sono ciò che agisce, e devono avere carattere. I campi invece restano a 6px fissi, appena accennati, altrimenti sembrano pulsanti.
- **Il tabellone resta com'è.** Tessere e palette hanno gli angoli arrotondati degli oggetti veri: è un oggetto, non layout. I suoi comandi (Pausa, Prossima) invece sono pulsanti, e sono smussati.
- **Costruzione: `clip-path`, ovunque.** Lo smusso è un segno d'identità e deve vedersi uguale su ogni browser: niente `corner-shape` (oggi solo sui browser basati su Chromium) e niente ripiego su `border-radius`. Il taglio è un poligono a otto punti, con `S` lo smusso: `polygon(0 S, S 0, calc(100% - S) 0, 100% S, 100% calc(100% - S), calc(100% - S) 100%, S 100%, 0 calc(100% - S))`.
- **Bordi e focus seguono lo smusso.** `clip-path` taglia `border` e `outline` sulle diagonali, quindi non si usano. Un contorno (pulsante fantasma, chip spenti) si fa con due strati smussati: fuori il colore del bordo, dentro il fondo, 1px più in dentro. All'hover di un pulsante fantasma il contorno resta dov'è e sotto sfuma dentro il fondo `cemento-alto` (150ms): la forma non cambia mai, così non c'è il lampo del bordo che si allarga. L'anello di focus si fa allo stesso modo, con un contenitore attorno all'elemento: 2px di `onda` (`carta` sul modulo newsletter) staccati di 3px. Perché le diagonali restino parallele, lo strato dello stacco ha smusso `S + 2px` e quello dell'anello `S + 3px` (per ogni pixel di distanza lo smusso cresce di circa 0,6px; vedi l'anteprima del Pulsante).

## Gli stati dei progetti

Tre stati, dal più vivo al più lontano. Sempre segno e parola insieme, in Geist Mono maiuscolo.

- **ONLINE:** pallino pieno in `arancio`. È l'unico stato acceso.
- **IN SVILUPPO:** anello vuoto a tratto continuo in `inchiostro-muto`.
- **CONCEPT:** anello tratteggiato in `inchiostro-muto`. È un'idea che si sta ancora disegnando: meno di un anello, non ancora un pallino.

**Descrizione all'hover.** Al passaggio del mouse, e al focus da tastiera, accanto allo stato compare una frase breve in Geist, `inchiostro-muto`, senza box né arancio: ONLINE «Si può usare.», IN SVILUPPO «Ci sto lavorando.», CONCEPT «Per ora è un'idea.». La parola dello stato resta sempre visibile; la frase è un di più, e per gli screen reader è la descrizione dello stato (`aria-describedby`). Su touch non compare.

## Gli elenchi

Negli articoli e nei testi lunghi, puntati o numerati, con la stessa struttura. Il segno sta nel margine dell'elenco, in Geist Mono, come le etichette delle sezioni.

- **Non numerato:** un quadretto pieno di 5px in `inchiostro-muto` tra parentesi quadre, `[ ■ ]`. Quadrato perché il tondo è solo della sfera e degli stati.
- **Numerato:** due cifre tra parentesi quadre, `[ 01 ]`, come le sottosezioni.
- **Misure:** segno in Geist Mono `testo-etichetta` (14px), spaziatura 1px, `inchiostro-muto`, in una colonna di 72px. Testo come il corpo dell'articolo (`testo-corpo`, 20px, interlinea 1,7, `inchiostro-corpo`). Su mobile testo a 18px, segno a 13px e colonna del segno di 56px. Voci separate da `filetto`, con un filetto anche sopra la prima, e 14px sopra e sotto ogni voce. 32px (`space-8`) tra l'elenco e i paragrafi.
- **Niente arancio:** un elenco non è un'azione.
- **Il movimento:** si anima solo il segno, il testo resta fermo. Quando l'elenco entra nello schermo, una volta sola, le parentesi si aprono di 4px e compaiono; il quadretto (cresce da zero) o il numero (sale di 4px e sfuma dentro) arriva 120ms dopo. Ogni voce parte 60ms dopo la precedente, 320ms con la curva del sito. All'hover sulla voce le parentesi si stringono di 3px sul segno (200ms), il gesto opposto all'entrata, così non sembra un replay; il cursore non cambia. Solo con un mouse, a entrata finita.
- **Accessibilità:** `ul` e `ol` veri; il segno è `aria-hidden`, la numerazione arriva allo screen reader dall'`ol`.
- Voci speciali di un solo articolo restano nell'articolo, non nel sistema. Oggi c'è il ritorno all'inizio di «Due giorni di chat VS trenta secondi di telefonata»: una voce che comincia con ↻ ha il segno `[ ↻ ]` e il resto in mono (nel testo «↻ da capo»).

## I link

Niente sottolineatura: i testi cliccabili hanno una riga di punti, gli stessi della barra di avanzamento degli articoli e del segno degli elenchi. Quadretti da 2px ogni 4px, 0,2em sotto la linea di base, appena sotto le gambe di g, p e q (4px nel testo, 6px nei titoli); ogni riga di un link che va a capo ha la sua. Il passo è fisso e corto: l'ultimo punto cade al massimo 2px prima della fine del testo, senza script per calcolarlo. È una regola sola, per tutto il sito: un link nuovo nel testo la prende da solo, senza che nessuno se ne ricordi.

- **Link nel testo.** Fermi, i punti sono spenti; all'hover e al focus si accendono da sinistra a destra, nella direzione della lettura, come la barra che si riempie (240ms).
- **Titoli cliccabili** (lista delle Chiacchiere, righe della chiusura). Fermi non hanno niente, perché la riga intera si capisce già cliccabile; all'hover del link arrivano i punti accesi.
- **I colori sono token, e li decide il fondo.** `--link-testo`, `--link-spento` e `--link-acceso`. Sul cemento sono `inchiostro`, `petrolio-acceso` e `punti`. Sul petrolio pieno della newsletter tutto passa a `carta`, con i punti spenti al 45%. Un elemento non sceglie i suoi colori: se un fondo nuovo ne ha bisogno, cambia i token su quel fondo.
- **Il contrasto.** Fermi, i punti in `petrolio-acceso` fanno 3,5:1 sul cemento, sopra il 3:1 dei segni grafici, e restano più scuri di `punti`, così all'hover la riga si accende. Il grigio delle etichette (`inchiostro-muto`) si vedrebbe di più, ma è più chiaro di `punti`: all'hover la riga si scurirebbe invece di accendersi.
- **Chi li riceve.** Da solo, ogni link senza classe dentro un paragrafo o il testo di una voce di elenco (articoli, Chi sono, progetti, privacy, rimandi alle curiosità). Con `.link-punti`, un link nel testo che ha anche una classe sua (il nome del progetto nella testata, «torna al via» nella 404, l'informativa nella newsletter). Con `.riga-punti`, lo span in linea dentro un titolo cliccabile: in un flex o in una griglia il link diventa un blocco, e i punti finirebbero sotto tutto il riquadro.
- **Fuori:** la navigazione (header, menu, footer, esclusi anche se i link non hanno classe), le etichette in mono con la freccia, che hanno il loro passo, i pulsanti e le card.
- **Verso altri siti, una scheda nuova.** Ogni link http o https verso un dominio che non è daretta.it si apre in una scheda nuova (`target="_blank"`, `rel="noopener"`), così la scheda del sito non si perde. Nessuno lo scrive a mano: lo aggiunge la build a tutte le pagine (`src/integrazioni/link-esterni.mjs`). Mail e link interni restano nella stessa scheda.
- **Costruzione.** È uno sfondo, non `text-decoration`, così passo e colore sono nostri. Regole e token in `src/styles/token.css`, movimento in `src/styles/movimento.css`.

## La griglia del testo

Tutti i testi lunghi (pagine interne e articoli) usano la stessa griglia, su desktop. Chi legge la impara al primo blocco, e il testo non cambia mai bordo.

| Colonne | Cosa ci va |
| --- | --- |
| 1–3 | etichette delle sottosezioni e metadati, in mono |
| 4–9 | il testo, circa 650px: in Geist a 20px fa circa 65 caratteri per riga, la misura comoda; anche citazioni, elenchi e codice |
| 4–8 e 9–12 | quando accanto al testo c'è un oggetto (il numero, la figura, la foto): il testo si stringe a 4–8 (circa 540px, una sessantina di caratteri) e l'oggetto prende 9–12 (circa 430px) |
| 10–12 | senza oggetti resta vuoto |

- **Il testo non si sposta mai.** A rompere il ritmo sono gli oggetti, non il testo: il bordo sinistro resta sempre alla colonna 4, solo quello destro si accorcia di una colonna accanto a un oggetto. Niente testo che parte dalla colonna 1 o dalla 7.
- **Nei moduli** (es. il modulo con il numero) il box resta a tutta larghezza e dentro segue la stessa griglia: l'etichetta nel margine, il testo in 4–8, il numero in 9–12, centrato nelle colonne 9–12 insieme alla didascalia (solo in orizzontale: in alto come il testo), con la luce che parte da lui.
- **Due fili.** Etichette e testi hanno un rientro di 8px, sulla stessa linea del logotipo e del footer, anche dentro i box: il box non aggiunge padding laterale. I box e gli oggetti con un fondo (moduli, figure, foto) arrivano invece al filo dei contenuti, come la newsletter nella chiusura: chi sta in colonna 1 senza rientro a sinistra, chi sta in colonna 12 senza rientro a destra.
- **Il numero accanto al testo** è in `punti-numero` (168px, 104px su mobile), centrato nelle colonne 9–12 con la sua didascalia.
- **Su mobile** tutto torna in una colonna: etichetta, oggetto (il numero) o testo, nell'ordine di lettura.
- Costruzione: `Blocco`, `ModuloNumero`, `BloccoFigura`, `BloccoFoto`, `Citazione` in `src/components`, testata degli articoli in `src/pages/chiacchiere/[slug].astro`.

## Le citazioni

Una frase messa in evidenza dentro un testo lungo (articoli, Chi sono, progetti). Può essere una frase del testo stesso, un passaggio, o parole di qualcun altro: la regola è la stessa.

- **Dove sta.** Nella colonna del testo (4–9), con lo stesso bordo sinistro dei paragrafi: un solo allineamento per tutta la pagina. L'evidenza la danno il Doto, la misura e lo spazio, non la larghezza. Mai a tutta griglia, mai fuori dalla colonna.
- **Come si scrive.** Doto in `punti-motto` (48px, 34px su mobile), `inchiostro`, allineata a sinistra, righe piene fino al bordo destro della colonna (niente bilanciamento delle righe: lascerebbe un vuoto a destra). Minuscola, con il punto. Niente box, niente filetti.
- **La riga sotto è facoltativa.** C'è quando le parole sono di qualcun altro, ed è la fonte, in Geist Mono `testo-meta`, `inchiostro-muto`, preceduta da «—». Manca quando è una frase del testo.
- **Spazi.** 72px sopra e sotto su desktop, 40px su mobile.
- Costruzione: `src/components/Citazione.astro`, blocco «Citazione» in Keystatic.

## I messaggi dei form

Oggi c'è un solo form, la newsletter, ma la regola vale per tutti. Un messaggio è un oggetto, non una riga di testo: deve vedersi arrivare, anche da chi non sta guardando il punto giusto.

- **La striscia.** Ogni messaggio sta in una striscia smussata (`smusso-campo`, 6px) con fondo `petrolio-scuro` al 60%, larga quanto il form. Dentro, un'etichetta in Geist Mono maiuscolo tra parentesi quadre, poi la frase in Geist. Sul modulo newsletter etichetta e testo sono in `carta`.
- **Le etichette.** `[ VERIFICA LA MAIL ]` dopo l'iscrizione, `[ DI NUOVO? ]` se l'indirizzo è già iscritto, `[ MAIL SBAGLIATA? ]` se l'indirizzo non è valido, `[ AZZ ]` per l'errore generico. Le frasi sono nei microtesti (testi.md).
- **Successo: il messaggio sostituisce il form.** Campo e pulsante spariscono e la striscia prende il loro posto. Il form ha finito il suo lavoro, e lasciarlo lì invita a rimandarlo. Vale anche per «già iscritto»: non c'è altro da fare.
- **Errore: il form resta.** La striscia compare sotto il campo e il cursore torna dentro, con l'anello `carta` del focus. Se è l'indirizzo a essere sbagliato, l'anello resta acceso anche quando il campo perde il focus, finché non si reinvia. Al nuovo invio la striscia sparisce.
- **Niente arancio, niente rosso.** L'arancio è per le azioni, e un messaggio non lo è; un rosso sarebbe un colore in più nel sistema. Successo ed errore si distinguono per etichetta e comportamento, non per colore, come gli stati dei progetti.
- **Il movimento.** La striscia sale di 8px e sfuma dentro (320ms, curva del sito). Nel successo il form sfuma via prima (140ms), poi arriva la striscia, e la striscia è alta almeno quanto la riga del campo, così il modulo non salta. Con `prefers-reduced-motion` il cambio è istantaneo.
- **Accessibilità.** `role="status"` per il successo, `role="alert"` per gli errori; il campo ha `aria-invalid="true"` ed è collegato al messaggio con `aria-describedby`. Dopo il successo il focus va sulla striscia (`tabindex="-1"`), così chi usa la tastiera non resta su un pulsante sparito.

## La sfera

L'unico momento «wow» del sito, ed è legato al nome: la sfera *ascolta*.

1. **A riposo** ruota piano su se stessa.
2. **In ascolto:** quando il cursore si avvicina, i punti vibrano in onde (`onda`) che partono dal cursore, come un suono.
3. **Al clic** i punti si raccolgono a formare la à, che si accende di `arancio` per un istante, poi tornano sfera. La à è quella del logotipo e deve essere sovrapponibile al carattere (la matrice di 5×8 della à di Doto 900, con le stesse proporzioni): mentre si raccolgono, i punti tondi della sfera diventano quadrati pieni a spigolo vivo, come le celle di Doto. Il logotipo non si storpia mai.

**Dove sta.** In home è grande, nella hero. Nelle pagine interne, solo su desktop, torna piccola (150–320px) nel modulo-testata o accanto al titolo: è la stessa sfera che ti segue, non un secondo effetto, e la luce della pagina parte da lei. Su mobile compare solo in home; nelle pagine interne la luce parte dal modulo-testata.

Implementazione: canvas 2D, nessuna libreria, pochi KB. Rispetta `prefers-reduced-motion` (resta ferma). Il sito deve caricarsi all'istante: la sfera non può rallentarlo; nelle pagine interne si carica dopo il testo.

## La chiusura

La fascia prima del footer, uguale in tutte le pagine tranne 404, privacy e benvenuto. Chi arriva in fondo ha finito quello che stava facendo e ha due mosse: proseguire o restare in contatto. La fascia offre esattamente queste due, sempre nello stesso posto.

- **A destra, sempre la newsletter** (colonne 7–12), l'unico modulo pieno della fascia. In fondo agli articoli e ai progetti cambiano il titolo («ti è piaciuto?», «ti interessa?») e la prima frase, che mette davanti la cosa appena letta; il resto del testo è quello della home. L'etichetta c'è sempre: `[ 006 ] NEWSLETTER`, numerata solo in home, dove le sezioni sono numerate; altrove è solo `NEWSLETTER`.
- **A sinistra, il prosegui** (colonne 1–5), sempre posato sul fondo, mai in un box: il vuoto accanto al pieno, come in home. In home c'è il tabellone delle curiosità; nelle altre pagine due righe di rimando.
- **Le righe:** filetto sopra e sotto come la lista delle Chiacchiere, etichetta in mono senza numero con la freccia, sotto il testo in `testo-titolo` (`inchiostro-corpo`; all'hover i punti si accendono sotto, vedi «I link»). Per un progetto, sotto il nome la frase della card in `testo-piccolo`, perché il nome da solo dice poco; a destra dell'etichetta «VEDI TUTTI →», un link a sé verso i progetti in home (44px di bersaglio su mobile).
- **Cosa ci va.** Le righe portano sempre verso progetti e articoli, le due cose che lavorano per gli obiettivi del sito; Chi sono è nel menu, e le curiosità sono un regalo da trovare, non una destinazione. Un progetto è sempre un progetto preciso, mai la sezione.

| Pagina | Prima riga | Seconda riga |
| --- | --- | --- |
| Articolo | il prossimo articolo (se non c'è, «Tutte le chiacchiere») | un progetto |
| Progetto | il prossimo progetto, nell'ordine della home | l'ultimo articolo |
| Chi sono | un progetto | l'ultimo articolo |
| Chiacchiere | un progetto | Chi sono |
| Curiosità | un progetto | l'ultimo articolo |

- **Un progetto a caso.** Dove la riga dice «un progetto», la pagina li contiene tutti e uno script ne accende uno a caso a ogni visita; senza JavaScript resta il primo nell'ordine della home. «L'ultimo articolo» è il titolo del più recente; finché non ce n'è, la frase di Chiacchiere vuoto.
- **Su mobile** l'ordine resta lo stesso: prima il prosegui, poi la newsletter, poi il footer. Sopra la fascia, lo stacco delle sezioni.
- Costruzione: `src/components/Chiusura.astro`, righe in `src/rimandi.ts`.

## L'invito al sito

Quando un progetto ha un suo sito, anche solo una pagina d'attesa, il testo del progetto si chiude con un modulo che invita a visitarlo, prima della fascia di chiusura.

- **Com'è fatto.** Un modulo come quello con il numero: etichetta nel margine (`[ 06 ] IL SITO`), nelle colonne 4–8 una riga in mono (`testo-meta`, facoltativa: «APRE A BREVE»), il dominio in `testo-titolo`, una frase in `testo-corpo` e il pulsante fantasma «VAI AL SITO →»; nelle colonne 9–12 le anteprime, il desktop e davanti il telefono. La luce petrolio parte dalle anteprime.
- **Il pulsante è fantasma, non arancio.** L'arancio resta a Iscrivimi, nella newsletter subito sotto: due CTA arancio vicine si farebbero concorrenza.
- **Le anteprime sono a colori.** Sono il sito dell'altro progetto, non foto di Patrizio: niente luce petrolio. Angoli `smusso-card`, il telefono in una cornice `cemento-rilievo` di 4px. Screenshot veri, fatti con `scripts/anteprime.py` (desktop 1280×800, telefono 390×844) e serviti in webp da `public/anteprime`.
- **Il movimento.** Quando il modulo entra nello schermo, una volta sola, le schede salgono di 12px e sfumano dentro (320ms, il telefono 80ms dopo). A entrata finita, con il mouse, si inclinano verso il cursore (vedi «Il movimento»). Su touch resta solo l'entrata.
- **Su mobile:** etichetta, testo, anteprime, pulsante a tutta larghezza.
- **Accessibilità.** Il link vero è il pulsante; le anteprime portano allo stesso indirizzo ma sono `aria-hidden` e fuori dal tab, così chi usa tastiera o screen reader trova un solo link.
- Costruzione: `src/components/InvitoSito.astro`, blocco «Invito al sito del progetto» in Keystatic; il link è il campo «Sito del progetto».

## Il movimento

Poco, e mai a caso. Il movimento non decora: dice da dove arriva una cosa, cosa è cambiato, cosa hai appena fatto. Deve dare l'idea di una grande cura per ogni dettaglio, essere gradevole e sorprendere piano, senza mai mettersi in mezzo alla lettura. La meraviglia resta alla sfera.

- **Passaggio tra le pagine.** La pagina vecchia sfuma (140ms), la nuova sale di 8px e sfuma dentro (320ms). L'header resta fermo. La sfera vola dalla pagina vecchia alla nuova, al suo posto e alla sua misura, solo se al clic si vede sullo schermo: se l'hai già superata scorrendo, la pagina sfuma e basta. View Transitions tra documenti (`@view-transition`), dove il browser non le ha si cambia pagina come prima.
- **Riscontro sulle azioni.** Le frecce dei rimandi fanno un passo di 4px verso dove portano, all'hover e al focus (200ms). I punti sotto i link si accendono da sinistra a destra (240ms, vedi «I link»). Hover e focus sempre tra 150 e 200ms. I messaggi dei form arrivano come descritto in «I messaggi dei form».
- **Moduli sotto la piega.** Salgono di 12px e sfumano dentro, una volta sola, quando entrano nello schermo. Mai la testata o la hero, mai i paragrafi, mai gli articoli, mai il tabellone (si muove già da solo). Niente animazione se si arriva da un'ancora o tornando indietro. Senza JavaScript tutto è già visibile.
- **Segni degli elenchi.** L'unica eccezione dentro gli articoli: si anima il segno (`[ ■ ]`, `[ 01 ]`), mai il testo della voce. Stesse condizioni dei moduli: una volta sola, niente animazione da un'ancora o tornando indietro, senza JavaScript tutto visibile. All'hover le parentesi si stringono appena: un riscontro piccolo, come le palette del tabellone, che non tocca la lettura. Le misure sono in «Gli elenchi».
- **Rotazione, solo sugli elementi visivi.** Un'immagine o un oggetto visivo può inclinarsi di pochi gradi (al massimo 6°) verso il cursore, soprattutto quando ci sono due piani sovrapposti, come le anteprime desktop e telefono nell'invito al sito: il piano davanti si stacca appena (al massimo 12px). Solo con il mouse, solo a entrata finita, e torna dritto quando il cursore esce (420ms). Deve restare discreta: dà il senso di cura, non fa scena. Mai sui testi.
- **Parallasse, solo sugli oggetti.** Foto e indicatori di stato possono scorrere appena più piano o più veloci della pagina, per dare profondità: pochi pixel (al massimo 24px su tutta la corsa), legati allo scorrimento, mai a scatti. Mai sui testi: un paragrafo o un titolo che scorre a un'altra velocità si legge peggio.
- **Le misure.** Spostamenti tra 4 e 12px (unica eccezione, i 3px delle parentesi degli elenchi all'hover: un riscontro, non un arrivo), rotazioni entro 6° (solo gli elementi visivi, vedi sopra), durate tra 140 e 450ms, uscita veloce e ingresso morbido (`cubic-bezier(0.2, 0.7, 0.2, 1)`). Mai rimbalzi, mai elastici.
- **Costruzione.** Solo `transform` e `opacity` (unica eccezione, lo sfondo dei punti sotto i link, che cambia il disegno ma non il layout), solo CSS e qualche riga di script, nessuna libreria: il sito resta istantaneo (Lighthouse e CLS invariati). Tutto in `src/styles/movimento.css`; il reveal è in `Base.astro`. Con `prefers-reduced-motion` non si muove niente.
- **Per ogni nuovo movimento** la domanda è una: spiega qualcosa, o fa solo scena? Se fa solo scena, non si fa. Prima si prova su una pagina, poi si estende.

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

## Le foto

Foto spontanee, scattate da Patrizio, mai in posa da studio. Tutte hanno lo stesso trattamento, **luce petrolio**: foto di anni e luci diverse sembrano un unico rullino, e anche quelle con colori strani in originale (un tramonto rosa, una maglia arancio) tornano utilizzabili.

- **Il trattamento.** La foto diventa monocroma e si rimappa su tre punti: le ombre in `cemento` (#111314), i mezzitoni in `petrolio-luce` (#1E4F56) al 45%, le luci in `inchiostro` (#ECECE7). Prima, contrasto automatico con l'1% tagliato agli estremi e gamma 0,9 (0,85 per l'avatar, che schiarisce il viso). Sopra, una grana leggera uguale per tutte, che uniforma anche le foto più rumorose. Il petrolio sta nel buio e il viso resta neutro: è la regola «il petrolio è luce, non vernice» applicata alle foto.
- **Uno strumento solo.** Il trattamento si fa con `scripts/tratta-foto.py` nel repository, mai a occhio con un filtro. I valori stanno lì e qui; se cambiano, cambiano in tutti e due i posti e si ritrattano tutte le foto.
- **Niente ritocchi al viso.** Se un'espressione o un dettaglio non convince, si cambia foto, non si corregge.
- **Solo Patrizio.** Foto in cui è da solo: niente altre persone riconoscibili, e niente figlio.
- **Moduli foto.** Formato quadrato, il viso nel terzo alto. Le foto di Patrizio sono quasi tutte orizzontali: il quadrato ne tiene tre quarti, e con loro il posto (il mare, il paese di notte), mentre un verticale ne butterebbe via metà. Non orizzontale vero, perché nelle tre colonne degli oggetti, su desktop, il viso diventerebbe troppo piccolo. Nel sito in webp a 480 e 800px, con `srcset`, `loading="lazy"`, `aspect-ratio: 1`, `object-fit: cover` e `object-position` puntato sul viso. Angoli `smusso-modulo` (`smusso-modulo-mobile` su mobile), nessun bordo, nessuna didascalia. Peso indicativo sotto i 150 KB.
- **Avatar.** Quadrato 1024px, viso al centro e testa intera dentro il cerchio. Si controlla a 40px: se il viso non si riconosce, si stringe il taglio. Niente occhiali da sole nell'avatar, perché da piccoli diventano due macchie.
- **Testo alternativo** breve e descrittivo, senza battute: «Patrizio di notte, davanti a un paese illuminato».
- **Dove sono oggi.** Home, accanto a Chiacchiere: la foto con i pini e gli occhiali da sole. Chi sono, accanto a «Perché ora»: la foto di notte. Avatar (LinkedIn, newsletter): la foto di notte, tagliata stretta.

## Logotipo

Il logotipo è tipografico: *dàretta* in Doto 900, `inchiostro`, con la à in `arancio`. Il simbolo, da solo, è la à arancio. Niente asterisco. Niente contenitori (quadrati, cerchi) attorno al segno.

## Accessibilità

- Testo ≥4.5:1 sul suo fondo (ogni token di testo dice su quali fondi è verificato); ≥3:1 per testo sopra i 24px, anelli e icone. Sui pulsanti arancio il testo è `cemento`.
- `inchiostro-muto` su `petrolio-luce` si ferma a 3,5:1: nei moduli più carichi (hero e testate delle pagine interne) le etichette passano a `inchiostro-secondario` (4,8:1).
- I titoli di sezione in `onda` restano sopra 4,5:1 su tutti i fondi (4,8:1 su `petrolio-luce`), tranne il petrolio pieno della newsletter, dove sono `carta`.
- Gli stati non si distinguono solo per colore: ONLINE è un pallino pieno, IN SVILUPPO un anello vuoto, CONCEPT un anello tratteggiato, sempre con la parola accanto. Il tratteggio deve restare leggibile anche piccolo: segmenti non più corti dello spessore dell'anello, e `inchiostro-muto` ≥3:1 sul fondo della card. La voce di menu attiva ha anche `aria-current`.
- I messaggi dei form si distinguono per etichetta e comportamento, mai solo per colore, e vengono annunciati (`role="status"` o `role="alert"`).
- Pulsanti e chip alti almeno 44px su mobile.
- I punti spenti dei link sono in `petrolio-acceso` (3,5:1), sopra il 3:1 dei segni grafici; accesi in `punti` (4,6:1).
- L'anello di focus segue lo smusso (vedi «Angoli»): mai un `outline` rettangolare tagliato dal `clip-path`, e mai un elemento senza anello.

## Da non fare

- Tradurre o storpiare dàretta.
- Usare l'arancio per link, hover, bordi, tag o decorazione.
- Accendere di arancio uno stato che non sia ONLINE.
- La barra di avanzamento degli articoli in arancio o in `onda`: sono i punti della sfera, quindi `punti`.
- Mettere informazioni necessarie solo nell'hover: la descrizione degli stati è un di più.
- Testo chiaro sopra l'arancio.
- Dare al tabellone i colori delle ferrovie (giallo, blu) o l'arancio.
- Gradienti viola-blu, card con bordo sinistro colorato, emoji.
- Doto per paragrafi, etichette o titoli degli articoli.
- Citazioni a tutta griglia, o fuori dalla colonna del testo.
- Testo lungo fuori dalle colonne 4–9, o spostato per fare posto a un oggetto.
- Misure di testo fuori dalla scala `testo-*`, spazi fuori dalla scala `space-*`.
- Un box attorno a ogni sezione.
- Rimandi di chiusura in box o con contorno, o con il numero di una sezione della home.
- La newsletter a sinistra nella chiusura.
- Una pagina interna fatta solo di una colonna di testo.
- La sfera nelle pagine interne su mobile.
- Angoli arrotondati su moduli, card, pulsanti o campi: tondi sono solo la sfera e gli stati.
- Pallini tondi negli elenchi.
- Sottolineature normali sui link, punti accesi in arancio o in `onda`, o colori dei link scelti dal singolo elemento invece che dai token del fondo.
- Un contorno attorno all'hamburger del menu mobile.
- Smussi fatti con `corner-shape` o `border-radius` di ripiego: il segno deve essere uguale su ogni browser.
- Foto a colori, ritoccate, o con un trattamento diverso da luce petrolio.
- Animare ogni blocco in entrata, i paragrafi, la hero o il testo degli articoli (negli elenchi si muove solo il segno).
- Rimbalzi, elastici, transizioni che durano più di mezzo secondo.
- Rotazioni sui testi, o oltre i 6°; anteprime dei siti in luce petrolio o con un pulsante arancio accanto alla newsletter.
- Parallasse sui testi (titoli, paragrafi, etichette).
- Messaggi dei form come semplice riga di testo, o colorati di rosso o di arancio.
- `onda` per testo che non sia un titolo di sezione: resta per l'ascolto della sfera, i titoli e l'anello di focus.

# Tabellone

Il tabellone delle partenze che mostra una curiosità alla volta, in home e in cima alla pagina `/curiosita`.

- **Testata:** tre campi a tessere in Geist Mono, con l'etichetta in `meta` accanto: N° (3), TIPO (10), DEST. (15). Tessere 21×32px su desktop, 16×26px su mobile, `cemento-rilievo`, raggio 4px.
- **Corpo:** palette a riga intera, alte 52px su desktop e 40px su mobile, testo in Geist 22px/17px `inchiostro-corpo`. Le righe sono tante quante servono alla curiosità più lunga, così il tabellone non cambia altezza.
- **Cerniera:** riga di 1px in `cemento` al 40% su tessere e palette.
- **Animazione:** ogni tessera che cambia gira da 2 a 6 lettere a caso prima di fermarsi, sfalsata da sinistra; poi le palette girano dall'alto in basso, 120ms l'una dall'altra. Gira solo ciò che cambia.
- **Ritmo:** durata variabile, 4 secondi più 1 secondo ogni 30 battute del testo, con un minimo di 5 e un massimo di 12 (la 012 resta 5 secondi, una voce media circa 7,5, le più lunghe circa 10). Il conteggio parte quando le palette hanno finito di girare. Ordine casuale a ogni visita, barra di avanzamento di 2px in `inchiostro-muto` su `filetto`, che si riempie nella durata della curiosità.
- **Comandi:** Pausa/Riprendi e Prossima (pill, 44px), contatore `meta` a destra. Si ferma al passaggio del mouse, al focus e con la scheda nascosta.
- **Accessibilità:** il tabellone è `aria-hidden`; accanto c'è il testo completo in una regione `aria-live`, spenta durante la rotazione automatica e accesa quando chi legge preme Prossima. Con `prefers-reduced-motion` il cambio è istantaneo.
- Implementazione: HTML, CSS e poco JS, nessuna libreria. Il consumatore fornisce l'elenco delle curiosità (numero, tipo, destinazione, testo).

# Pulsante

Smussato a 45°, in Geist Mono maiuscolo, alto 44px in testata, 56px nella hero e nei form (52px su mobile). Lo smusso è sempre 3/14 dell'altezza: 12px su 56px (`smusso-azione`), 9,4px su 44px. Così pulsanti di misure diverse hanno la stessa proporzione.

- **CTA:** fondo `arancio`, testo `cemento` (mai `inchiostro`: non raggiunge il contrasto). Solo per le azioni principali: ISCRIVITI nella navigazione, ISCRIVIMI nella newsletter. Una o due per schermata.
- **Fantasma:** contorno `bordo`, testo `inchiostro`. Per azioni secondarie e comandi (es. Pausa e Prossima del tabellone, che restano spenti). Il contorno sono due strati smussati, perché `clip-path` taglierebbe un `border` sulle diagonali: fuori `bordo`, dentro il fondo a 1px.
- **Forma:** `clip-path` a otto punti, mai `border-radius` né `corner-shape` (vedi «Angoli» nel README).
- **Focus:** anello di 2px in `onda` staccato di 3px (in `carta` sul modulo newsletter), che segue lo smusso. Si fa con un contenitore attorno al pulsante: lo strato dello stacco ha lo smusso del pulsante più 2px, quello dell'anello più 3px.
- Il testo è un verbo breve: ISCRIVITI, ISCRIVIMI, LEGGI. Niente «Scopri di più».

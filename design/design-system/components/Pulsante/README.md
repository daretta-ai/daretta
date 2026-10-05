# Pulsante

Smussato a 45° con `smusso-azione` (12px, uguale su desktop e mobile), in Geist Mono maiuscolo, alto 48px (56px nei form).

- **CTA:** fondo `arancio`, testo `cemento` (mai `inchiostro`: non raggiunge il contrasto). Solo per le azioni principali: ISCRIVITI nella navigazione, ISCRIVIMI nella newsletter. Una o due per schermata.
- **Fantasma:** contorno `bordo`, testo `inchiostro`. Per azioni secondarie e comandi (es. Pausa e Prossima del tabellone, che restano spenti). Il contorno sono due strati smussati, perché `clip-path` taglierebbe un `border` sulle diagonali: fuori `bordo`, dentro il fondo a 1px.
- **Forma:** `clip-path` a otto punti, mai `border-radius` né `corner-shape` (vedi «Angoli» nel README).
- **Focus:** anello di 2px in `onda` staccato di 3px (in `carta` sul modulo newsletter), che segue lo smusso. Si fa con un contenitore attorno al pulsante: lo strato dello stacco ha smusso 14px, quello dell'anello 15px.
- Il testo è un verbo breve: ISCRIVITI, ISCRIVIMI, LEGGI. Niente «Scopri di più».

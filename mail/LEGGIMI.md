# Mail della newsletter

`template-kit.html` è il template dàretta per Kit. Lo usano la mail di conferma e le newsletter: si incolla in Kit come template HTML e si imposta come predefinito dell'account.

**Nel template non vanno commenti HTML con variabili di Kit dentro.** Kit sostituisce `{{ … }}` anche dentro i commenti: il 6 ottobre 2026 il corpo della mail è comparso due volte, una volta in testa e senza stile, perché un commento citava `{{ message_content }}`. Per questo le note stanno qui e nel template non ci sono commenti.

Variabili obbligatorie, una volta sola ciascuna: `{{ message_content }}`, `{{ unsubscribe_url }}`, `{{ address }}`.

Regole del design system adattate alla posta:

- fondo cemento, testo inchiostro, link spenti (sottolineati, mai arancio);
- l'arancio solo per il pulsante (testo cemento sopra) e per la à del logotipo;
- il logotipo è un'immagine (`public/mail/logotipo.png`), perché Doto e Geist nelle mail non si caricano in modo affidabile;
- niente smusso: i programmi di posta non supportano clip-path. Pulsante ad angoli vivi, mai tondi.

Il colore del pulsante si sceglie anche nell'editor di Kit: arancio `#FF4F1A`, testo `#111314`, nessun bordo. Kit scrive i suoi colori direttamente sul pulsante, e alcuni programmi di posta ignorano gli stili del template: impostarli anche lì evita il blu.

L'indirizzo postale nel piede è testo semplice, ma Gmail e Apple Mail lo riconoscono e ne fanno da soli un link, blu. Il template lo riporta al grigio del piede (classe `indirizzo` e regole per i link aggiunti dai programmi di posta).

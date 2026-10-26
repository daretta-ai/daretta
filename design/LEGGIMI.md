# Riferimenti di design

Copia di lavoro dei materiali approvati, presa il 2 ottobre 2026. Il sito si costruisce da qui.

- `design-system/`: il design system «dàretta» (README, tokens.json, componenti).
  Originale: https://claude.ai/artifact/Mwghe5AN1donvDG3hcgEPy
- `tavole/`: le tavole di tutte le pagine, desktop e mobile (`*.dc.html`, una per pagina).
  Originale: https://claude.ai/artifact/4pC5AECj2Yd4C1JCMnRqGp
- Prototipo interattivo del tabellone: https://claude.ai/artifact/9W77hKMVMRAKEffgjefzDv

Regola: misure, colori e testi si prendono dalle tavole. Se una tavola e il README del design
system non sono d'accordo, si chiede a Patrizio. Se gli originali cambiano, si ricopiano qui.

## Decisioni prese dopo le tavole

- 2 ottobre 2026: CURIOSITÀ non va nel menu principale, anche se le tavole ce la mettono. Ci si arriva da «VEDI TUTTE →» in home, dal footer e dai rimandi nei testi.
- 5 ottobre 2026: le foto hanno tutte il trattamento «luce petrolio». Regole nel README del design system (sezione «Le foto»), strumento in `scripts/tratta-foto.py`. Home: foto con i pini; Chi sono: foto di notte.
- 5 ottobre 2026: le foto dei moduli sono quadrate, non 4:5 (scelta di Patrizio): tengono più posto e su mobile pesano meno. Le tavole mostrano ancora il riquadro verticale.
- 5 ottobre 2026: gli angoli sono smussati a 45°, non più arrotondati (scelta di Patrizio). Moduli e foto 32px (30 su mobile), card 20px (12 su mobile), pulsanti e chip 12px, campi 6px; tondi solo la sfera e gli stati. Si costruiscono con `clip-path` (tagli pronti `--ritaglio-*` e classe `.smussato` in `src/styles/token.css`, che disegna anche contorni e anello di focus). Regole nel README del design system, sezione «Angoli». Tavole aggiornate lo stesso giorno.
- 5 ottobre 2026: lo smusso dei pulsanti segue l'altezza, 3/14 come 12px su 56px (scelta di Patrizio: ISCRIVITI in testata era troppo tagliato). Nel codice ogni pulsante dichiara `--h` e `.smussato` calcola lo smusso. ISCRIVITI in testata ora è alto 44px. Tavole aggiornate.
- 12 ottobre 2026: la barra di lettura degli articoli passa a passo fisso (scelta di Patrizio: i 72 punti da 5px erano troppo grandi su desktop). Punti da 2px ogni 8px, quanti ne stanno, uguali su desktop e mobile; li conta lo script in `Header.astro`. Regola nel README del design system, sezione «Composizione». Le tavole mostrano ancora i 72 punti.
- 19 ottobre 2026: le etichette di sezione perdono i numeri e prendono il segno degli elenchi, `[ ■ ] CHIACCHIERE`, con la stessa entrata e la stessa stretta all'hover (scelta di Patrizio). Due linee in tutto il sito: i fondi (moduli, foto, figure) al filo dei contenuti, tutto ciò che si legge rientra di 40px (`--rientro`), dentro e fuori dai box, logotipo e footer compresi. Così le etichette restano allineate e non stanno appiccicate al bordo dei box. Lo sbordo dei box, provato prima, è stato scartato: obbligava a troppe eccezioni. Regole nel README del design system. Le tavole mostrano ancora i numeri.
- 26 ottobre 2026: indice dei progetti su `/progetti` (approvato da Patrizio lo stesso giorno). Il menu PROGETTI e «VEDI TUTTI →» portano lì invece che a `/#progetti`. Tavola costruita direttamente con i componenti del sito, quindi già aggiornata alle regole di oggi: `tavole/Progetti.png` e `tavole/Progetti-Mobile.png`. Regole nel README del design system («Composizione»), testi in Keystatic (pagina Progetti).

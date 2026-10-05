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
- 5 ottobre 2026: gli angoli sono smussati a 45°, non più arrotondati (scelta di Patrizio). Moduli e foto 32px (30 su mobile), card 20px (12 su mobile), pulsanti e chip 12px, campi 6px; tondi solo la sfera e gli stati. Si costruiscono con `clip-path` (tagli pronti `--ritaglio-*` e classe `.smussato` in `src/styles/token.css`, che disegna anche contorni e anello di focus). Regole nel README del design system, sezione «Angoli».

// Gli attributi dei blocchi del corpo, per Markdoc.
// Devono restare allineati ai blocchi di keystatic.config.ts.
// Lo usano src/cms.ts (per disegnare il corpo) e markdoc.config.ts (per controllare i file).
import type { Config } from '@markdoc/markdoc';

const testo = { type: String };

export const config: Config = {
  tags: {
    blocco: { render: 'blocco', attributes: { etichetta: testo, spazio: testo, stato: { type: Boolean } } },
    numero: {
      render: 'numero',
      attributes: { etichetta: testo, cifra: testo, didascalia: testo, stato: { type: Boolean } },
    },
    figura: { render: 'figura', attributes: { etichetta: testo, figura: { type: Object } } },
    foto: { render: 'foto', attributes: { etichetta: testo, foto: testo, alt: testo, posizione: testo } },
    citazione: { render: 'citazione', selfClosing: true, attributes: { testo, didascalia: testo } },
    confronto: { render: 'confronto', selfClosing: true, attributes: { voci: { type: Array } } },
  },
  nodes: {
    fence: { render: 'codice', attributes: { content: testo, language: testo } },
  },
};

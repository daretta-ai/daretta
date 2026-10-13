# Marchio dàretta

Asset generati da `scripts/genera-marchio.py` dal font del sito (Doto 900) e dai colori di `design/design-system/tokens.json`. Non si ritoccano a mano: se cambia qualcosa si cambia lo script e si rigenera.

## Logotipo

`dàretta` in Doto 900, con la à in `arancio`. SVG in tracciati (non serve il font), PNG trasparenti a 400, 800 e 1600px di larghezza.

| File | Uso |
| --- | --- |
| `logotipo-scuro` | su fondi scuri, come nel sito: lettere `inchiostro` |
| `logotipo-chiaro` | su fondi chiari (documenti, stampa): lettere `cemento` |
| `logotipo-su-cemento` | con il fondo `cemento` già dentro, per chi non sa scegliere il fondo |
| `logotipo-su-carta` | con il fondo `carta` già dentro |

Mai tutto arancio, mai tutto bianco, mai dentro un contenitore.

## Simbolo

La sola à arancio, senza contenitore: `simbolo.svg` e PNG trasparenti a 128, 512 e 1024px. `simbolo-su-cemento` è la versione piena, per i profili che vogliono un quadrato.

## Icone

| File | Uso |
| --- | --- |
| `favicon.svg` | la scheda del browser, trasparente |
| `favicon.ico` | 16, 32 e 48px, celle allineate ai pixel |
| `apple-touch-icon.png` | 180px, su `cemento` |
| `icon-192.png`, `icon-512.png` | Android e manifest, su `cemento` |
| `icon-maskable-512.png` | Android con maschera: la à sta dentro la zona sicura |
| `site.webmanifest` | il manifest che le collega |

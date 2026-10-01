# Modulo

Il contenitore dei blocchi principali della pagina: `cemento-rilievo`, `radius-modulo` (32px; 24px su mobile), padding `space-10`.

La luce petrolio che riceve dipende da quanto è vicino alla sfera:

- **Vicino** (hero, foto): gradiente radiale da `petrolio-luce` verso `cemento-rilievo`, centrato dalla parte della sfera.
- **Distanza media** (Chi sono): gradiente radiale da `petrolio-alone`, con il centro fuori dal modulo, dalla parte della sfera.
- **Lontano** (Progetti): quasi solo `cemento-rilievo`, un velo di alone al massimo.

Non tutto va in un modulo: liste di scritti e curiosità stanno direttamente sul fondo.

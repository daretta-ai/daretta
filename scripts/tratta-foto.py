"""Trattamento «luce petrolio» per le foto di dàretta.

Le regole stanno nel design system (design/design-system/README.md, sezione «Le foto»).
Questo script le applica tutte, così ogni foto nuova esce uguale alle altre.

Uso:
  python3 scripts/tratta-foto.py FOTO.jpg NOME --viso 0.68,0.48
  python3 scripts/tratta-foto.py FOTO.jpg avatar --avatar --viso 0.665,0.44 --taglio 0.58

  --viso X,Y   centro del viso, in frazioni della foto (0–1, da sinistra e dall'alto)
  --avatar     quadrato 1024px, gamma 0.85; altrimenti 4:5 per i moduli foto
  --taglio F   quanta altezza della foto tenere (default 1 per il 4:5, 0.55 per l'avatar)
  --uscita D   cartella di uscita (default public/foto)

Esce: NOME-480.webp e NOME-800.webp per il sito. Per l'avatar: NOME.jpg e NOME.webp a 1024px,
da tenere fuori da public/ (--uscita) se non servono nel sito.
Richiede Pillow e numpy (pip install pillow numpy).
"""

import argparse
import os

import numpy as np
from PIL import Image, ImageOps

# Colori dai token del design system: ombre, mezzitoni, luci.
PUNTI = [(0.0, "#111314"), (0.45, "#1E4F56"), (1.0, "#ECECE7")]  # cemento, petrolio-luce, inchiostro
TAGLIO_CONTRASTO = 1  # % tagliato agli estremi dal contrasto automatico
GRANA = 0.025  # deviazione del rumore gaussiano, uguale per tutte le foto


def lut():
    x = np.linspace(0, 1, 256)
    rgb = [[int(h[i : i + 2], 16) for i in (1, 3, 5)] for _, h in PUNTI]
    return np.stack(
        [np.interp(x, [p for p, _ in PUNTI], [c[k] for c in rgb]) for k in range(3)], axis=1
    ).astype(np.uint8)


def taglia(im, vx, vy, rapporto, frazione, larghezza, alto=0.42):
    """Ritaglia intorno al viso: il viso sta a `alto` dall'alto del ritaglio."""
    w, h = im.size
    ch = int(h * frazione)
    cw = int(ch * rapporto)
    if cw > w:
        cw, ch = w, int(w / rapporto)
    x = int(min(max(vx * w - cw / 2, 0), w - cw))
    y = int(min(max(vy * h - ch * alto, 0), h - ch))
    return im.crop((x, y, x + cw, y + ch)).resize((larghezza, int(larghezza / rapporto)), Image.LANCZOS)


def tratta(im, gamma, seme=3):
    g = np.asarray(ImageOps.autocontrast(im.convert("L"), cutoff=TAGLIO_CONTRASTO), float) / 255
    g = np.clip(g, 0, 1) ** gamma
    g = np.clip(g + np.random.default_rng(seme).normal(0, GRANA, g.shape), 0, 1)
    return Image.fromarray(lut()[(g * 255).astype(np.uint8)])


def main():
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("foto")
    a.add_argument("nome")
    a.add_argument("--viso", default="0.5,0.4")
    a.add_argument("--avatar", action="store_true")
    a.add_argument("--taglio", type=float)
    a.add_argument("--uscita", default="public/foto")
    o = a.parse_args()
    vx, vy = (float(v) for v in o.viso.split(","))
    os.makedirs(o.uscita, exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(o.foto)).convert("RGB")
    base = os.path.join(o.uscita, o.nome)

    if o.avatar:
        out = tratta(taglia(im, vx, vy, 1, o.taglio or 0.55, 1024, 0.45), gamma=0.85, seme=7)
        out.save(base + ".jpg", quality=86, optimize=True, progressive=True)
        out.save(base + ".webp", quality=82)
        print("avatar:", base + ".jpg", base + ".webp")
        return

    out = tratta(taglia(im, vx, vy, 0.8, o.taglio or 1, 1200), gamma=0.9)
    for w in (480, 800):
        out.resize((w, int(w * 1.25)), Image.LANCZOS).save(f"{base}-{w}.webp", quality=78)
    print("foto:", f"{base}-480.webp", f"{base}-800.webp")


if __name__ == "__main__":
    main()

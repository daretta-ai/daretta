#!/usr/bin/env python3
"""Genera gli asset del marchio dàretta: logotipo, simbolo e icone.

Tutto viene dal font del sito (Doto 900, src/assets/font) e dai colori del
design system (design/design-system/tokens.json): niente disegnato a mano.

    pip install fonttools brotli resvg-py pillow
    python3 scripts/genera-marchio.py            # scrive in design/marchio/

Il logotipo è il nome in Doto 900, `inchiostro`, con la à in `arancio`.
Il simbolo è la sola à arancio, senza contenitore. Le icone (favicon, app)
sono il simbolo sul fondo `cemento`, perché i sistemi le vogliono piene.
"""

import io
import json
import re
import shutil
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image
import resvg_py

RADICE = Path(__file__).resolve().parent.parent
FONT = RADICE / "src/assets/font/doto-latin-900-normal.woff2"
TOKEN = RADICE / "design/design-system/tokens.json"
USCITA = Path(sys.argv[1]) if len(sys.argv) > 1 else RADICE / "design/marchio"

NOME = "dàretta"
CELLA = 100  # Doto è una matrice: una cella = 100 unità, il quadretto ne occupa 90


def colori():
    testo = TOKEN.read_text()
    return {m[1]: m[2] for m in re.finditer(r'"name": "([^"]+)",\s*"value": "(#[0-9A-Fa-f]{6})"', testo)}


C = colori()
font = TTFont(FONT)
glifi = font.getGlyphSet()
mappa = font.getBestCmap()
AVANZO = glifi[mappa[ord("a")]].width  # monospaziato: 600


def tracciato(car, dx):
    """Il glifo come path SVG, con l'asse y girato e spostato di dx."""
    pen = SVGPathPen(glifi)
    glifi[mappa[ord(car)]].draw(TransformPen(pen, (1, 0, 0, -1, dx, 0)))
    return pen.getCommands()


def limiti(testo):
    x0 = y0 = 10**9
    x1 = y1 = -(10**9)
    for i, car in enumerate(testo):
        bp = BoundsPen(glifi)
        glifi[mappa[ord(car)]].draw(bp)
        if bp.bounds:
            a, b, c, d = bp.bounds
            x0, x1 = min(x0, a + i * AVANZO), max(x1, c + i * AVANZO)
            y0, y1 = min(y0, -d), max(y1, -b)  # y girato
    return x0, y0, x1, y1


def svg(viewbox, corpo, titolo, larghezza=None, altezza=None):
    dim = f' width="{larghezza}" height="{altezza}"' if larghezza else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}"{dim} role="img">\n'
        f"  <title>{titolo}</title>\n{corpo}</svg>\n"
    )


def logotipo(testo_col, fondo=None, margine=0):
    x0, y0, x1, y1 = limiti(NOME)
    x0, y0, x1, y1 = x0 - margine, y0 - margine, x1 + margine, y1 + margine
    w, h = x1 - x0, y1 - y0
    righe = []
    if fondo:
        righe.append(f'  <rect x="{x0}" y="{y0}" width="{w}" height="{h}" fill="{fondo}"/>')
    for i, car in enumerate(NOME):
        col = C["arancio"] if car == "à" else testo_col
        righe.append(f'  <path fill="{col}" d="{tracciato(car, i * AVANZO)}"/>')
    return svg(f"{x0} {y0} {w} {h}", "\n".join(righe) + "\n", "dàretta"), w / h


def simbolo(fondo=None, lato=None, quota=0.62):
    """La à da sola. Con fondo: quadrato di lato `lato` unità, à alta `quota` del lato."""
    x0, y0, x1, y1 = limiti("à")
    w, h = x1 - x0, y1 - y0
    if not fondo:
        corpo = f'  <path fill="{C["arancio"]}" d="{tracciato("à", 0)}"/>\n'
        return svg(f"{x0} {y0} {w} {h}", corpo, "dàretta")
    s = h / quota  # lato del quadrato in unità del font
    ox = x0 + w / 2 - s / 2
    oy = y0 + h / 2 - s / 2
    corpo = (
        f'  <rect x="{ox:.1f}" y="{oy:.1f}" width="{s:.1f}" height="{s:.1f}" fill="{fondo}"/>\n'
        f'  <path fill="{C["arancio"]}" d="{tracciato("à", 0)}"/>\n'
    )
    return svg(f"{ox:.1f} {oy:.1f} {s:.1f} {s:.1f}", corpo, "dàretta")


def celle_a():
    """Le celle della à (colonna, riga) lette dal font, per le icone a pochi pixel."""
    from fontTools.pens.recordingPen import DecomposingRecordingPen
    pen = DecomposingRecordingPen(glifi)
    glifi[mappa[ord("à")]].draw(pen)
    celle, punti = [], []
    for op, args in pen.value:
        punti.extend(args)
        if op == "closePath":
            xs = [p[0] for p in punti]
            ys = [p[1] for p in punti]
            cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
            celle.append((cx, cy))
            punti = []
    xmin = min(c[0] for c in celle)
    ymax = max(c[1] for c in celle)
    return sorted({(round((x - xmin) / CELLA), round((ymax - y) / CELLA)) for x, y in celle})


def png_da_svg(testo_svg, larghezza, percorso):
    dati = resvg_py.svg_to_bytes(svg_string=testo_svg, width=larghezza)
    Path(percorso).write_bytes(bytes(dati))


def icona_pixel(lato):
    """Favicon a pixel interi: la matrice 5×8 su fondo trasparente, come favicon.svg, celle allineate alla griglia."""
    celle = celle_a()
    colonne = max(c for c, _ in celle) + 1
    righe = max(r for _, r in celle) + 1
    # passo della griglia e lato del quadretto: a 16px le celle si toccano, poi si staccano
    passo, quad = {16: (2, 2), 32: (4, 3), 48: (5, 4)}[lato]
    img = Image.new("RGBA", (lato, lato), (0, 0, 0, 0))
    ox = (lato - colonne * passo + (passo - quad)) // 2
    oy = (lato - righe * passo + (passo - quad)) // 2
    from PIL import ImageDraw
    d = ImageDraw.Draw(img)
    for c, r in celle:
        x, y = ox + c * passo, oy + r * passo
        d.rectangle([x, y, x + quad - 1, y + quad - 1], fill=C["arancio"])
    return img


def main():
    if USCITA.exists():
        shutil.rmtree(USCITA)
    for sotto in ("logotipo", "simbolo", "icone"):
        (USCITA / sotto).mkdir(parents=True)

    # Logotipo: per fondi scuri (quello del sito) e per fondi chiari (stampa, documenti).
    varianti = {
        "logotipo-scuro": (C["inchiostro"], None, 0),
        "logotipo-chiaro": (C["cemento"], None, 0),
        "logotipo-su-cemento": (C["inchiostro"], C["cemento"], 200),
        "logotipo-su-carta": (C["cemento"], C["carta"], 200),
    }
    for nome, (testo, fondo, margine) in varianti.items():
        s, _ = logotipo(testo, fondo, margine)
        (USCITA / "logotipo" / f"{nome}.svg").write_text(s)
        for w in (400, 800, 1600):
            png_da_svg(s, w, USCITA / "logotipo" / f"{nome}-{w}.png")

    # Simbolo: la sola à, trasparente e su cemento (avatar, profili).
    s = simbolo()
    (USCITA / "simbolo" / "simbolo.svg").write_text(s)
    for w in (128, 512, 1024):
        png_da_svg(s, w, USCITA / "simbolo" / f"simbolo-{w}.png")
    s = simbolo(C["cemento"], quota=0.62)
    (USCITA / "simbolo" / "simbolo-su-cemento.svg").write_text(s)
    png_da_svg(s, 1024, USCITA / "simbolo" / "simbolo-su-cemento-1024.png")

    # Icone del sito e delle app.
    ic = USCITA / "icone"
    favicon = simbolo().replace("<svg ", '<svg shape-rendering="crispEdges" ', 1)
    (ic / "favicon.svg").write_text(favicon)
    piccole = [icona_pixel(n) for n in (16, 32, 48)]
    # Pillow parte dall'immagine più grande e prende le altre così come sono
    piccole[2].save(ic / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)],
                    append_images=piccole[:2])
    for n, img in zip((16, 32, 48), piccole):
        img.save(ic / f"favicon-{n}.png")
    for nome, lato, quota in (
        ("apple-touch-icon", 180, 0.62),
        ("icon-192", 192, 0.62),
        ("icon-512", 512, 0.62),
        ("icon-maskable-512", 512, 0.46),  # dentro la zona sicura dell'80%
    ):
        png_da_svg(simbolo(C["cemento"], quota=quota), lato, ic / f"{nome}.png")
    # L'apple-touch-icon non vuole trasparenza: si appiattisce su cemento.
    for p in ic.glob("*.png"):
        if p.name.startswith("favicon"):
            continue
        img = Image.open(p).convert("RGBA")
        piena = Image.new("RGBA", img.size, C["cemento"])
        piena.alpha_composite(img)
        piena.convert("RGB").save(p, optimize=True)

    manifest = {
        "name": "dàretta",
        "short_name": "dàretta",
        "start_url": "/",
        "display": "browser",
        "background_color": C["cemento"],
        "theme_color": C["cemento"],
        "icons": [
            {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
    }
    (ic / "site.webmanifest").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print("Scritto in", USCITA)


if __name__ == "__main__":
    main()

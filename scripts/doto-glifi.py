"""Ridisegna la c e il % di Doto sulla stessa griglia di punti, perché si leggano meglio:
la c di Doto differisce dalla o per un solo punto, e il % sembra una X.
Il punto è copiato dalla o, quindi forma e misura restano quelle del carattere.
Uso: python3 scripts/doto-glifi.py <in.woff2|.woff> <out.woff2|.woff>
Si rilancia sui file di @fontsource quando si aggiorna Doto (vedi src/styles/font.css)."""
import sys, copy
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import DecomposingRecordingPen

NUOVI = {
 'c': ['.####',
       '#....',
       '#....',
       '#....',
       '.####'],
 'percent': ['##...',
             '##..#',
             '...#.',
             '..#..',
             '.#...',
             '#..##',
             '...##'],
}
f = TTFont(sys.argv[1]); g = f['glyf']; gs = f.getGlyphSet()
# un punto campione: il primo contorno della o (cella colonna 1, riga 4)
o = g['o']; coords = o.getCoordinates(g)[0]; fine = o.endPtsOfContours[0]
flags = o.flags[:fine+1]; pts = list(coords[:fine+1])
x0 = min(p[0] for p in pts) - 105 + 5; y0 = min(p[1] for p in pts)  # origine della cella
cell0 = (min(p[0] for p in pts)//100, min(p[1] for p in pts)//100)
for nome, righe in NUOVI.items():
    alto = len(righe)
    top = 4 if alto == 5 else 6          # riga più alta: x-height 4, maiuscole/cifre 6
    pen = TTGlyphPen(None)
    from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphCoordinates
    contorni = []; flg = []; ends = []; tutti = []
    for r, riga in enumerate(righe):
        for c, ch in enumerate(riga):
            if ch != '#': continue
            dx = (c - cell0[0]) * 100; dy = (top - r - cell0[1]) * 100
            for p in pts: tutti.append((p[0]+dx, p[1]+dy))
            flg.extend(flags); ends.append(len(tutti)-1)
    gl = Glyph(); gl.numberOfContours = len(ends); gl.endPtsOfContours = ends
    gl.coordinates = GlyphCoordinates(tutti); gl.flags = bytearray(flg); gl.program = copy.deepcopy(o.program)
    gl.recalcBounds(g)
    g[nome] = gl
f['name'].setName('Doto daretta', 1, 3, 1, 0x409)
f.flavor = 'woff' if sys.argv[2].endswith('.woff') else 'woff2'
f.save(sys.argv[2])

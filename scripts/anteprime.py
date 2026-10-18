"""Anteprime per l'invito al sito di un progetto (blocco «Invito al sito del progetto»).

Fotografa una pagina su desktop (1280x800) e su telefono (390x844) e salva in public/anteprime:
  <nome>-desktop-720.webp, <nome>-desktop-1080.webp, <nome>-mobile-240.webp, <nome>-mobile-390.webp

Uso:
  python3 scripts/anteprime.py https://valdinievole.online valdinievole-online

Serve Playwright con Chromium (pip install playwright pillow && playwright install chromium).
Le anteprime restano a colori: sono il sito dell'altro progetto, non foto di Patrizio.
Dopo aver aggiunto un nome nuovo, aggiungilo anche alle opzioni «Anteprime» in keystatic.config.ts.
"""

import asyncio
import io
import sys
from pathlib import Path

from PIL import Image
from playwright.async_api import async_playwright

CARTELLA = Path(__file__).resolve().parent.parent / 'public' / 'anteprime'
FORMATI = [('desktop', 1280, 800, 2, [720, 1080]), ('mobile', 390, 844, 3, [240, 390])]
# Nasconde gli strumenti di sviluppo, se la pagina gira in locale
NASCONDI = 'nuxt-devtools-frame,[id^=nuxt-devtools],#vite-error-overlay{display:none!important}'


async def fotografa(url: str, nome: str) -> None:
    CARTELLA.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for formato, w, h, densita, larghezze in FORMATI:
            pagina = await browser.new_page(viewport={'width': w, 'height': h}, device_scale_factor=densita)
            await pagina.goto(url, wait_until='networkidle')
            await pagina.add_style_tag(content=NASCONDI)
            await pagina.wait_for_timeout(1500)
            immagine = Image.open(io.BytesIO(await pagina.screenshot())).convert('RGB')
            for larghezza in larghezze:
                altezza = round(immagine.height * larghezza / immagine.width)
                destinazione = CARTELLA / f'{nome}-{formato}-{larghezza}.webp'
                immagine.resize((larghezza, altezza), Image.LANCZOS).save(destinazione, quality=82, method=6)
                print(destinazione.relative_to(CARTELLA.parent.parent))
            await pagina.close()
        await browser.close()


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    asyncio.run(fotografa(sys.argv[1], sys.argv[2]))

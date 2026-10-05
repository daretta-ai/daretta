// Iscrizione alla newsletter (passo 6 del piano). Il modulo del sito manda qui l'email,
// e il Worker la passa a Kit: nella pagina non c'è nessuno script di terzi.
//
// Come funziona:
// 1. Se c'è la chiave API (KIT_API_KEY), si chiede a Kit se l'indirizzo è già iscritto e confermato.
//    Se sì, si risponde «già iscritto» e non si manda niente.
// 2. L'iscrizione passa dall'indirizzo pubblico del modulo Kit (KIT_FORM_ID): è la stessa strada
//    dei moduli di Kit, quindi vale la conferma via mail impostata nel modulo.
//    Senza chiave API il punto 1 si salta, e chi è già iscritto vede il messaggio di invio normale.
//
// Risponde con { esito }, e il modulo sceglie il messaggio da mostrare (testi in Keystatic, pagina Newsletter).
import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';

export const prerender = false;

type Esito = 'inviato' | 'gia-iscritto' | 'mail-non-valida' | 'errore';

const risposta = (esito: Esito, status = 200) =>
  new Response(JSON.stringify({ esito }), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

// Un controllo di forma, non di esistenza: quello lo fa la mail di conferma.
const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function giaIscritto(email: string, chiave: string): Promise<boolean> {
  try {
    const url = new URL('https://api.kit.com/v4/subscribers');
    url.searchParams.set('email_address', email);
    const r = await fetch(url, { headers: { 'X-Kit-Api-Key': chiave, accept: 'application/json' } });
    if (!r.ok) return false; // chiave non valida o piano senza API: si va avanti senza il controllo
    const dati = (await r.json()) as { subscribers?: { state?: string }[] };
    return (dati.subscribers ?? []).some((s) => s.state === 'active');
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  let email = '';
  let trappola = '';
  try {
    const dati = (await request.json()) as { email?: unknown; sito?: unknown };
    email = String(dati.email ?? '').trim().toLowerCase();
    trappola = String(dati.sito ?? '');
  } catch {
    return risposta('errore', 400);
  }

  // Il campo «sito» è nascosto: lo riempiono solo i bot. Si risponde come se fosse andata bene.
  if (trappola) return risposta('inviato');
  if (!MAIL.test(email) || email.length > 254) return risposta('mail-non-valida', 422);

  const modulo = getSecret('KIT_FORM_ID');
  if (!modulo) {
    console.error('iscrizione: manca KIT_FORM_ID');
    return risposta('errore', 503);
  }

  const chiave = getSecret('KIT_API_KEY');
  if (chiave && (await giaIscritto(email, chiave))) return risposta('gia-iscritto');

  try {
    const r = await fetch(`https://app.kit.com/forms/${encodeURIComponent(modulo)}/subscriptions`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      body: new URLSearchParams({ email_address: email, referrer: request.headers.get('referer') ?? '' }),
    });
    if (r.ok) return risposta('inviato');
    if (r.status === 422) return risposta('mail-non-valida', 422);
    console.error('iscrizione: Kit ha risposto', r.status, await r.text().catch(() => ''));
    return risposta('errore', 502);
  } catch (e) {
    console.error('iscrizione: Kit non raggiungibile', e);
    return risposta('errore', 502);
  }
};

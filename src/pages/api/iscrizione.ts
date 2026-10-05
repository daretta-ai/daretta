// Iscrizione alla newsletter (passo 6 del piano). Il modulo del sito manda qui l'email,
// e il Worker la passa a Kit: nella pagina non c'è nessuno script di terzi.
//
// Come funziona, con la chiave API (KIT_API_KEY, Secret su Cloudflare):
// 1. si chiede a Kit se l'indirizzo è già iscritto e confermato: se sì, «già iscritto» e basta;
// 2. si crea l'iscritto come «inactive» (non riceve niente finché non conferma);
// 3. lo si aggiunge al modulo (KIT_FORM_ID): il modulo ha la conferma via mail, e Kit la manda.
// Senza chiave si ripiega sull'indirizzo pubblico del modulo, e il «già iscritto» non c'è.
// Ogni risposta di Kit diversa da quella attesa finisce nei log del Worker, con «iscrizione:» davanti.
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

const KIT = 'https://api.kit.com/v4';

async function kit(chiave: string, percorso: string, init: RequestInit = {}) {
  return fetch(KIT + percorso, {
    ...init,
    headers: { 'X-Kit-Api-Key': chiave, accept: 'application/json', 'content-type': 'application/json' },
  });
}

async function registra(cosa: string, r: Response) {
  console.error(`iscrizione: ${cosa} → ${r.status}`, (await r.text().catch(() => '')).slice(0, 500));
}

async function giaIscritto(email: string, chiave: string): Promise<boolean> {
  const r = await kit(chiave, `/subscribers?email_address=${encodeURIComponent(email)}`);
  if (!r.ok) {
    await registra('controllo già iscritto', r);
    return false; // si va avanti: al peggio Kit non manda una seconda conferma
  }
  const dati = (await r.json()) as { subscribers?: { state?: string }[] };
  return (dati.subscribers ?? []).some((s) => s.state === 'active');
}

/** Iscrizione con l'API v4. */
async function conApi(email: string, modulo: string, chiave: string): Promise<Esito> {
  if (await giaIscritto(email, chiave)) return 'gia-iscritto';

  const crea = await kit(chiave, '/subscribers', {
    method: 'POST',
    body: JSON.stringify({ email_address: email, state: 'inactive' }),
  });
  if (crea.status === 422) return 'mail-non-valida';
  if (!crea.ok) {
    await registra('creazione iscritto', crea);
    return 'errore';
  }

  const aggiungi = await kit(chiave, `/forms/${encodeURIComponent(modulo)}/subscribers`, {
    method: 'POST',
    body: JSON.stringify({ email_address: email }),
  });
  if (!aggiungi.ok) {
    await registra('aggiunta al modulo', aggiungi);
    return 'errore';
  }
  return 'inviato';
}

/** Ripiego senza chiave: l'indirizzo pubblico del modulo. Vale solo se Kit risponde davvero «success». */
async function senzaApi(email: string, modulo: string, referrer: string): Promise<Esito> {
  const r = await fetch(`https://app.kit.com/forms/${encodeURIComponent(modulo)}/subscriptions`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
    body: new URLSearchParams({ email_address: email, referrer }),
    redirect: 'manual',
  });
  if (r.status === 422) return 'mail-non-valida';
  const testo = await r.text().catch(() => '');
  try {
    if (r.ok && (JSON.parse(testo) as { status?: string }).status === 'success') return 'inviato';
  } catch {
    // non era JSON: sotto finisce nei log
  }
  console.error(`iscrizione: modulo pubblico → ${r.status}`, testo.slice(0, 500));
  return 'errore';
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
  if (trappola) {
    console.warn('iscrizione: fermata dalla trappola per i bot');
    return risposta('inviato');
  }
  if (!MAIL.test(email) || email.length > 254) return risposta('mail-non-valida', 422);

  const modulo = getSecret('KIT_FORM_ID');
  if (!modulo) {
    console.error('iscrizione: manca KIT_FORM_ID');
    return risposta('errore', 503);
  }

  const chiave = getSecret('KIT_API_KEY');
  try {
    const esito = chiave
      ? await conApi(email, modulo, chiave)
      : await senzaApi(email, modulo, request.headers.get('referer') ?? '');
    const stato = { inviato: 200, 'gia-iscritto': 200, 'mail-non-valida': 422, errore: 502 }[esito];
    return risposta(esito, stato);
  } catch (e) {
    console.error('iscrizione: Kit non raggiungibile', e);
    return risposta('errore', 502);
  }
};

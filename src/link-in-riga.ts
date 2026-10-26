// Nei campi di testo semplice di Keystatic (es. «La versione breve») l'unico markdown ammesso
// è il link: [testo](https://…). Tutto il resto viene escapato, così il campo resta testo.
// Il link non ha classe: prende i punti da solo (token.css) e la build aggiunge la scheda nuova
// se porta fuori da daretta.it.

const escapa = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const LINK = /\[([^\]]+)\]\(((?:https?:\/\/|\/|mailto:)[^)\s]+)\)/g;

export function linkInRiga(testo: string): string {
  let html = '';
  let ultimo = 0;
  for (const m of testo.matchAll(LINK)) {
    html += escapa(testo.slice(ultimo, m.index));
    html += `<a href="${escapa(m[2])}">${escapa(m[1])}</a>`;
    ultimo = m.index! + m[0].length;
  }
  return html + escapa(testo.slice(ultimo));
}

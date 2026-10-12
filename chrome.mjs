/* ============================================================
   LCS — chrome.mjs
   Escribe el encabezado, el menú y el pie dentro de cada página,
   con las mismas plantillas que usa js/mono.js (LCS_CHROME). Así
   la navegación y los datos de contacto están en el HTML aunque no
   corra JavaScript, que es como leen el sitio varios buscadores y
   asistentes de IA. mono.js después solo engancha los eventos, y
   en las páginas compartidas rehace el menú si la visita viene de
   otro camino.

   Cada página marca dónde va cada bloque:
     <!--chrome-->…<!--/chrome-->   y   <!--footer-->…<!--/footer-->
   (o, la primera vez, los huecos <div id="chrome"></div> y
   <div id="site-footer"></div>).

   Uso:   node chrome.mjs           reescribe las páginas
          node chrome.mjs --check   avisa si alguna quedó vieja
   Correrlo cada vez que se toque la navegación en mono.js, y
   después node csp-hashes.mjs (no cambia hashes, pero no cuesta).
   ============================================================ */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const { header, footer } = createRequire(import.meta.url)('./js/mono.js');

const files = [
  ...readdirSync('.').filter(f => f.endsWith('.html')),
  ...readdirSync('branding').filter(f => f.endsWith('.html')).map(f => 'branding/' + f),
].sort();

const check = process.argv.includes('--check');
const stale = [];
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const body = html.match(/<body[^>]*\sdata-page="([^"]*)"[^>]*\sdata-section="([^"]*)"/);
  if (!body) throw new Error(`${file}: falta data-page / data-section en <body>`);
  const [, page, sec] = body;
  // las compartidas se escriben con el menú de la portada; mono.js lo
  // cambia en el navegador si la visita viene de un camino
  const section = sec === 'shared' ? 'portal' : sec;

  const hd = `<!--chrome-->${header(section, page)}\n<!--/chrome-->`;
  const ft = `<!--footer-->${footer(section)}\n<!--/footer-->`;
  const out = html
    .replace(/<!--chrome-->[\s\S]*?<!--\/chrome-->|<div id="chrome"><\/div>/, () => hd)
    .replace(/<!--footer-->[\s\S]*?<!--\/footer-->|<div id="site-footer"><\/div>/, () => ft);
  if (!out.includes('<!--/chrome-->') || !out.includes('<!--/footer-->')) throw new Error(`${file}: no tiene dónde escribir el encabezado o el pie`);
  if (out !== html) { stale.push(file); if (!check) writeFileSync(file, out); }
}

if (check) {
  if (stale.length) { console.error('Encabezado o pie viejos en: ' + stale.join(', ') + '. Corré: node chrome.mjs'); process.exit(1); }
  console.log(`Encabezado y pie al día · ${files.length} páginas.`);
} else {
  console.log(`${stale.length} de ${files.length} páginas actualizadas.`);
}

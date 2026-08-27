/* ============================================================
   LCS — csp-hashes.mjs
   La política de contenido de vercel.json no permite scripts en
   línea sueltos: solo los que están enumerados por su huella. Los
   bloques en línea del sitio son dos por página (el que marca que
   hay JavaScript y el de datos estructurados para buscadores), así
   que cada vez que se toca uno hay que rehacer la lista.

   Este script la rehace solo:   node csp-hashes.mjs
   Sin argumentos reescribe vercel.json. Con --check no toca nada y
   sale con error si la lista quedó vieja, que es lo que conviene
   correr antes de publicar.
   ============================================================ */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const INLINE = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;
const CONFIG = 'vercel.json';

const hashes = new Set();
for (const file of readdirSync('.').filter(f => f.endsWith('.html')).sort()) {
  const html = readFileSync(file, 'utf8');
  for (const [, body] of html.matchAll(INLINE)) {
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
}
const list = [...hashes].join(' ');

const config = readFileSync(CONFIG, 'utf8');
const updated = config.replace(
  /("value": "default-src 'self'; script-src 'self')[^"]*?(; style-src)/,
  `$1 ${list}$2`
);

if (process.argv.includes('--check')) {
  if (updated !== config) {
    console.error('La política de contenido quedó vieja. Corré: node csp-hashes.mjs');
    process.exit(1);
  }
  console.log(`Política al día · ${hashes.size} huellas.`);
} else {
  writeFileSync(CONFIG, updated);
  console.log(`vercel.json actualizado · ${hashes.size} huellas.`);
}

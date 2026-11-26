// node videos.cjs — Muestrario de Edición de video: escribe el mazo (inicio del camino) y la grilla
// clasificada (Proyectos) a partir de una sola lista. Se puede correr las veces que haga falta.
const fs = require('fs');
const R = __dirname + '/';

const CATS = [
  { id: 'lyric', es: 'Video lyrics', en: 'Lyric videos',
    dEs: 'La letra animada al ritmo de la canción. Cada tema con su propio diseño, de la tipografía al color.',
    dEn: 'Lyrics animated to the beat. Every song with its own design, from type to colour.' },
  { id: 'brand', es: 'Motion para marcas', en: 'Brand motion',
    dEs: 'Anuncios animados: la interfaz, el producto y la marca en movimiento, en pocos segundos.',
    dEn: 'Animated ads: the interface, the product and the brand in motion, in a few seconds.' },
  { id: 'reel', es: 'Reels para redes', en: 'Social reels',
    dEs: 'Reels de producto y de marca con gancho, ritmo y textos, listos para publicar.',
    dEn: 'Product and brand reels with a hook, pace and on-screen text, ready to post.' },
];

// t = título, a = artista o marca, k = tipo (es/en), d = descripción (es/en), f = formatos
const V = [
  { id: 'arruinarse', cat: 'lyric', t: 'Arruinarse', a: 'Tan Biónica', kEs: 'Video lyric', kEn: 'Lyric video',
    dEs: 'Tipografía que se rompe, gira y crece con cada palabra, en bordó, negro y crema.',
    dEn: 'Type that breaks, spins and grows with every word, in burgundy, black and cream.',
    f: [{ r: '16:9', src: 'arruinarse', d: '0:54' }] },
  { id: 'fuego', cat: 'lyric', t: 'Fuego', a: 'SIZE ft. 2Kan y Lizard', kEs: 'Video lyric', kEn: 'Lyric video',
    dEs: 'La tapa del single llevada a pixel art: cada artista entra como personaje de videojuego. Con versión horizontal y reel vertical.',
    dEn: 'The single’s cover turned into pixel art: each artist enters as a video-game character. In horizontal and vertical reel versions.',
    deck: 'fuego-reel',
    f: [{ r: '16:9', src: 'fuego', d: '0:54' }, { r: '9:16', src: 'fuego-reel', d: '0:54', lEs: 'Reel', lEn: 'Reel' }] },
  { id: 'tuchat', cat: 'lyric', t: 'TUCHAT', a: 'Quevedo', kEs: 'Video lyric', kEn: 'Lyric video',
    dEs: 'Afiche rojo y crema donde los íconos actúan la letra: la balanza, la cama, la palabra tachada.',
    dEn: 'A red and cream poster where icons act out the lyrics: the scales, the bed, the crossed-out word.',
    f: [{ r: '9:16', src: 'tuchat', d: '0:52' }] },
  { id: 'els', cat: 'lyric', t: 'El S', a: 'SIZE', kEs: 'Video lyric', kEn: 'Lyric video',
    dEs: 'Letra editorial sobre un visualizer de callejón nocturno: palabras chicas y espaciadas que acompañan sin tapar la imagen.',
    dEn: 'Editorial lyrics over a night-alley visualizer: small, spaced-out words that go along without covering the image.',
    f: [{ r: '16:9', src: 'els', d: '2:33' }] },
  { id: 'spotify', cat: 'brand', t: 'Spotify × Tan Biónica', a: 'Spotify', kEs: 'Motion graphics', kEn: 'Motion graphics',
    dEs: 'Promo del artista dentro de la app: el celular, las portadas en 3D y el cierre con la marca.',
    dEn: 'An artist promo inside the app: the phone, the covers in 3D and the closing brand shot.',
    f: [{ r: '9:16', src: 'spotify', d: '0:20' }] },
  { id: 'pedidosya', cat: 'brand', t: 'PedidosYa', a: 'PedidosYa', kEs: 'Motion graphics', kEn: 'Motion graphics',
    dEs: 'La app explicada en movimiento: del antojo al pedido en vivo, con la interfaz animada.',
    dEn: 'The app explained in motion: from the craving to the live order, with the interface animated.',
    f: [{ r: '9:16', src: 'pedidosya', d: '0:21' }] },
  { id: 'iphone', cat: 'brand', t: 'iPhone 17', a: 'Amazon', kEs: 'Motion graphics 3D', kEn: '3D motion graphics',
    dEs: 'Del buscador a la caja en la puerta: interfaz, recorrido de entrega en 3D y cierre de marca.',
    dEn: 'From the search bar to the box at the door: interface, a 3D delivery route and the brand sign-off.',
    f: [{ r: '16:9', src: 'iphone', d: '0:18' }] },
  { id: 'nexo', cat: 'reel', t: 'La IA no te conoce', a: 'NEXO Club', kEs: 'Reel editorial', kEn: 'Editorial reel',
    dEs: 'Reel con filmación propia: gancho en el primer segundo, textos en pantalla y música al corte.',
    dEn: 'A reel with original footage: a hook in the first second, on-screen text and music cut to the edit.',
    f: [{ r: '9:16', src: 'nexo', d: '0:27' }] },
  { id: 'semix-chips', cat: 'reel', t: 'Chips', a: 'Semix', kEs: 'Animación de producto', kEn: 'Product animation',
    dEs: 'Loop de producto: los sabores giran en arco sobre el naranja de la marca.',
    dEn: 'A product loop: the flavours spin in an arc over the brand’s orange.',
    f: [{ r: '9:16', src: 'semix-chips', d: '0:10' }] },
  { id: 'semix-papas', cat: 'reel', t: 'Papas', a: 'Semix', kEs: 'Reel de producto', kEn: 'Product reel',
    dEs: 'Producto en exteriores con transiciones de tarjeta y cortes al ritmo de la música.',
    dEn: 'Product shot outdoors with card transitions and cuts on the beat.',
    f: [{ r: '9:16', src: 'semix-papas', d: '0:15' }] },
  { id: 'semix-navidad', cat: 'reel', t: 'Navidad', a: 'Semix', kEs: 'Reel de temporada', kEn: 'Seasonal reel',
    dEs: 'Saludo de fin de año: los sabores pasan uno por uno y arman el árbol.',
    dEn: 'A holiday greeting: the flavours go by one by one and build the tree.',
    f: [{ r: '9:16', src: 'semix-navidad', d: '0:09' }] },
];

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const A = '/assets/video/';
const fmts = v => JSON.stringify(v.f.map(x => ({ r: x.r, src: A + x.src + '.mp4', d: x.d, l: x.lEs || '', le: x.lEn || '' })));
const fmtLine = v => v.f.map(x => x.r + ' · ' + x.d).join(' — ');
const cat = id => CATS.find(c => c.id === id);
const data = v => `data-id="${v.id}" data-cat="${v.cat}" data-t="${esc(v.t)}" data-a="${esc(v.a)}" data-k-es="${esc(v.kEs)}" data-k-en="${esc(v.kEn)}" data-d-es="${esc(v.dEs)}" data-d-en="${esc(v.dEn)}" data-f="${esc(fmts(v))}"`;
const aria = v => `Ver ${v.t} — ${v.a} con sonido`;

/* ---------- Mazo (inicio de Edición de video) ---------- */
const deckCards = V.map((v, i) => {
  const p = v.deck || v.f[0].src;
  return `          <li class="vdeck__card" ${data(v)} data-prev="${A}${p}-prev.mp4">
            <button class="vdeck__hit" type="button" aria-label="${esc(aria(v))}"><img src="${A}${p}-poster.webp" alt="" width="640" height="800"${i > 2 ? ' loading="lazy"' : ''} decoding="async"></button>
          </li>`;
}).join('\n');

const filters = `<div class="vfilter" role="group" aria-label="Tipo de video" data-label-es="Tipo de video" data-label-en="Video type">
          <button type="button" aria-pressed="true" data-f="all"><span data-es="Todos" data-en="All">Todos</span><sup>${V.length}</sup></button>
${CATS.map(c => `          <button type="button" aria-pressed="false" data-f="${c.id}"><span data-es="${c.es}" data-en="${c.en}">${c.es}</span><sup>${V.filter(v => v.cat === c.id).length}</sup></button>`).join('\n')}
        </div>`;

const first = V[0];
const deck = `<!-- VSHOW:START — generado por videos.cjs -->
  <!-- ============ TRABAJO RECIENTE — mazo de videos (js/videos.js) ============ -->
  <section class="sec vshow" id="trabajo">
    <div class="wrap vshow__in">
      <div class="vshow__copy" data-rv>
        <p class="vshow__kicker" data-es="Muestrario · ${V.length} videos" data-en="Showreel · ${V.length} videos">Muestrario · ${V.length} videos</p>
        <h2 class="display vshow__title" data-es="Trabajo reciente" data-en="Recent work">Trabajo reciente</h2>
        <p class="vshow__lede" data-es="Video lyrics, motion graphics para marcas y reels para redes. Cada pieza con su propio diseño, pensada desde cero." data-en="Lyric videos, brand motion graphics and social reels. Every piece with its own design, built from scratch.">Video lyrics, motion graphics para marcas y reels para redes. Cada pieza con su propio diseño, pensada desde cero.</p>
        ${filters}
        <div class="btns">
          <a class="pill pill--light" href="/edicion-de-video/proyectos" data-es="Ver todos los videos" data-en="See every video">Ver todos los videos</a>
          <a class="txtlink arw" href="/contacto" data-es="Quiero mi video" data-en="I want my video">Quiero mi video</a>
        </div>
      </div>
      <div class="vdeck" data-vdeck>
        <ol class="vdeck__pile" aria-label="Videos" data-label-es="Videos" data-label-en="Videos">
${deckCards}
        </ol>
        <div class="vdeck__bar">
          <div class="vdeck__meta" aria-live="polite">
            <p class="vdeck__name">${esc(first.t)}</p>
            <p class="vdeck__type" data-es="${esc(first.kEs)} · ${esc(first.a)}" data-en="${esc(first.kEn)} · ${esc(first.a)}">${esc(first.kEs)} · ${esc(first.a)}</p>
          </div>
          <p class="vdeck__count"><span class="vdeck__i">01</span> / <span class="vdeck__n">${String(V.length).padStart(2, '0')}</span></p>
          <div class="vdeck__nav">
            <button class="vdeck__btn" type="button" data-dir="-1" aria-label="Video anterior" data-label-es="Video anterior" data-label-en="Previous video"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>
            <button class="vdeck__btn" type="button" data-dir="1" aria-label="Video siguiente" data-label-es="Video siguiente" data-label-en="Next video"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>
          </div>
        </div>
      </div>
    </div>
  </section>
<!-- VSHOW:END -->
`;

/* ---------- Grilla clasificada (Proyectos) ---------- */
const card = v => {
  const p = v.deck || v.f[0].src;
  return `          <li class="vcard" ${data(v)} data-prev="${A}${p}-prev.mp4" data-rv>
            <button class="vcard__hit" type="button" aria-label="${esc(aria(v))}">
              <span class="vcard__media"><img src="${A}${p}-poster.webp" alt="" width="640" height="800" loading="lazy" decoding="async"><span class="vcard__play" aria-hidden="true"></span></span>
              <span class="vcard__name"><span>${esc(v.t)}</span><small>${esc(v.a)}</small></span>
              <span class="vcard__sub"><span data-es="${esc(v.kEs)}" data-en="${esc(v.kEn)}">${esc(v.kEs)}</span><span class="vcard__fmt">${esc(fmtLine(v))}</span></span>
            </button>
          </li>`;
};
const grid = `<!-- VGRID:START — generado por videos.cjs -->
  <!-- ============ MUESTRARIO — por tipo de video (js/videos.js) ============ -->
  <nav class="vjump" aria-label="Tipos de video" data-label-es="Tipos de video" data-label-en="Video types">
    <div class="wrap">
      <ul>
${CATS.map((c, i) => `        <li><a href="#${c.id}"><span class="vjump__n">0${i + 1}</span><span data-es="${c.es}" data-en="${c.en}">${c.es}</span><sup>${V.filter(v => v.cat === c.id).length}</sup></a></li>`).join('\n')}
      </ul>
    </div>
  </nav>
${CATS.map((c, i) => `
  <section class="sec vsec" id="${c.id}">
    <div class="wrap">
      <header class="sh" data-rv>
        <h2 class="display"><span class="vsec__n">0${i + 1}</span><span data-es="${c.es}" data-en="${c.en}">${c.es}</span></h2>
        <p data-es="${c.dEs}" data-en="${c.dEn}">${c.dEs}</p>
      </header>
      <ul class="vgrid${V.filter(v => v.cat === c.id).length === 4 ? ' vgrid--4' : ''}">
${V.filter(v => v.cat === c.id).map(card).join('\n')}
      </ul>
    </div>
  </section>`).join('\n')}
<!-- VGRID:END -->
`;

function put(file, re, block, anchor) {
  let s = fs.readFileSync(R + file, 'utf8');
  if (re.test(s)) s = s.replace(re, block);
  else { if (!s.includes(anchor)) throw new Error(file + ': no encuentro el ancla'); s = s.replace(anchor, block + anchor); }
  if (!s.includes('/js/videos.js')) s = s.replace('<script src="/js/mono.js" defer></script>', '<script src="/js/videos.js" defer></script>\n<script src="/js/mono.js" defer></script>');
  fs.writeFileSync(R + file, s);
}

put('edicion-de-video.html', /<!-- VSHOW:START[\s\S]*?<!-- VSHOW:END -->\n/, deck, '  <!-- ============ BENEFICIOS ============ -->');

// Proyectos: la sección de casos vacíos se reemplaza por la grilla
let p = fs.readFileSync(R + 'edicion-de-video/proyectos.html', 'utf8');
p = p.replace(/  <!-- ============ CASOS ============[\s\S]*?<\/section>\n\n/, '');
fs.writeFileSync(R + 'edicion-de-video/proyectos.html', p);
put('edicion-de-video/proyectos.html', /<!-- VGRID:START[\s\S]*?<!-- VGRID:END -->\n/, grid, '  <!-- ============ QUÉ HAY EN CADA CASO ============ -->');

console.log('muestrario escrito:', V.length, 'videos en', CATS.length, 'tipos');

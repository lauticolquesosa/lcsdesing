// node redes.cjs — Casos de Redes sociales: escribe el cuerpo interactivo de cada caso
// (perfil de Instagram navegable, carruseles, videos, historias, destacadas y placas)
// entre las marcas RCASE:START / RCASE:END de su página. El comportamiento vive en
// js/redes.js y el estilo en css/redes.css. Se puede correr las veces que haga falta.
//
// Esquema de archivos de cada caso (assets/redes/<caso>/):
//   <id>-1.webp, -2.webp…  placas 864×1080          <id>-g.webp      480×640, cuadro de la grilla (3:4)
//   <id>.mp4 + -poster.webp  videos del feed         hNN.webp          historias 608×1080
//   hl-<destacada>.webp      portadas 200×200        avatar.webp       foto de perfil 200×200
// Si se reemplaza un archivo ya publicado, va con sufijo -v2 (la carpeta /assets es inmutable en caché).
const fs = require('fs');
const R = __dirname + '/';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = n => String(n).padStart(2, '0');

// ================================================================ CASOS
// feed: en el orden en que se sube (la grilla lo muestra al revés, como Instagram).
//   k = post | video · s = placas (texto alternativo de cada una) · r = proporción del video
//   d = duración en segundos · c = texto de la publicación
// stories: [id, de qué se trata, video?]  ·  highlights: [id, nombre, historias]
const CASES = [
  {
    slug: 'achilata', file: 'redes-sociales/achilata.html', dir: '/assets/redes/achilata/',
    user: 'achilatasalta', name: 'Achilata Salta',
    // Lauti, 2026-11-26: el caso termina en Video, sobre el rojo de la marca; sin historias ni placas
    hide: ['st', 'one'], vidTone: 'tone-1',
    bio: ['Helado tucumano en Salta 🍧', 'Potes y carrito para eventos', 'Envíos a San Lorenzo, El Tipal, Grand Bourg y más', 'Pedí al 387 483 4041 o 387 468 4498'],
    link: { href: 'https://achilata-salta.vercel.app', label: 'achilata-salta.vercel.app' },
    txt: {
      pf: ['El perfil, completo.', 'La grilla, las destacadas y los reels, tal como se ven en el celular. Tocá cualquier publicación para abrirla, deslizá los carruseles o mirá las historias de cada destacada.'],
      car: ['Cada placa empuja a la siguiente.', 'carruseles, de la presentación de la marca al pedido por la web. Cada uno cuenta una sola cosa, placa por placa, y termina en cómo pedir.'],
      vid: ['Lo que una foto no muestra.', 'Reels cortos, de 8 a 12 segundos: la textura, la cucharada y el helado que se derrite por Salta.'],
      st: ['Historias para el día a día. Destacadas para siempre.', 'historias con encuestas, preguntas y cuenta regresiva, ordenadas en destacadas con portada propia.'],
      one: ['Una placa, una idea.'],
    },
    feed: [
      { id: 'p01', t: 'Hay achilata en Salta', k: 'post',
        s: ['Hay achilata en Salta: la mano sostiene el pote fucsia', 'El nombre: achilata', 'La textura del hielo raspado', 'Los dos potes', 'Pedidos por WhatsApp'],
        c: 'Volvimos y llegamos a Salta 🍧 El helado más tucumano, ahora a la vuelta de tu casa. Potes de 1 kg y medio kilo, pedidos por WhatsApp. ¿Vos ya la probaste?' },
      { id: 'p02', t: 'El menú', k: 'post',
        s: ['El menú, corto, como tiene que ser', 'Un kilo a $12.000', 'Medio kilo a $8.000', 'Cómo pedir'],
        c: 'Dos tamaños y un solo sabor, el de siempre. Guardalo para cuando apriete el calor ☀️' },
      { id: 'p03', t: 'Achilata, sustantivo', k: 'post',
        s: ['Achilata, sustantivo femenino', 'Helado de agua tucumano', 'Hay gelata: de dónde viene el nombre', 'Se come con calor y en buena compañía'],
        c: 'Achilata. Sustantivo femenino. Helado de agua tucumano, fucsia, frío y de cuchara.\n\nDicen que el nombre viene de los heladeros italianos que gritaban hay gelata. Nosotros la trajimos a Salta para que no tengas que viajar a Tucumán.' },
      { id: 'p04', t: 'Mirá esta textura', k: 'video', r: '9/16', d: 12,
        c: 'Mirá esta textura. Hielo raspado, color fucsia y receta tucumana.\n\nAsí llega a tu casa, en pote de 1 kg o de medio kilo. Pedidos por WhatsApp, link en la bio.' },
      { id: 'p05', t: 'Hace 32 grados', k: 'post',
        s: ['32 grados en Salta, cuatro de la tarde, y vos sin achilata'],
        c: 'Hace 32 grados en Salta y vos todavía sin achilata. Lo arreglamos rápido: escribinos y te la llevamos bien fría.\n\n1 kg a $12.000\nMedio kilo a $8.000' },
      { id: 'p06', t: 'Cómo pedir', k: 'post',
        s: ['Cómo pedir, en cuatro pasos', 'Escribinos', 'Elegí tu pote', 'Tu zona', 'Pagá', 'Te la llevamos'],
        c: 'Guardalo para el finde. Cómo pedir tu achilata en cuatro pasos:\n\n1. Escribinos por WhatsApp.\n2. Elegí tu pote, 1 kg o medio kilo.\n3. Pasanos tu zona.\n4. Pagá con transferencia o efectivo.\n\nY te la llevamos fría.' },
      { id: 'p07', t: 'Una cucharada y estás en Tucumán', k: 'video', r: '9/16', d: 8,
        c: 'Una cucharada y estás en Tucumán. Para los tucumanos que la extrañan y para los salteños que todavía no la probaron.' },
      { id: 'p08', t: 'Etiquetá a quien le debés', k: 'post',
        s: ['Etiquetá a quien le debés una achilata: el pote derritiéndose frente al Cabildo'],
        c: 'Etiquetá a quien le debés una achilata. Y que pague esta vez.\n\nPotes de 1 kg y medio kilo con envío. Pedidos por WhatsApp, link en la bio.' },
      { id: 'p09', t: 'No deslices', k: 'post',
        s: ['No deslices', 'En serio', 'Último aviso', 'Te lo buscaste', 'Pedí la tuya'],
        c: 'Te dijimos que no deslices. Bueno, vos te lo buscaste.\n\nAhora pedí la tuya por WhatsApp. 1 kg a $12.000 y medio kilo a $8.000.' },
      { id: 'p10', t: 'La achilata, anotada', k: 'post',
        s: ['La achilata anotada: hielo raspado, receta tucumana, sabor clásico, pote de 1 kg'],
        c: 'La achilata, anotada. Hielo raspado, receta tucumana, sabor clásico y un pote de 1 kg que llega frío a tu casa.\n\nContanos en los comentarios qué le agregarías a la lista.' },
      { id: 'p11', t: 'Te la llevamos', k: 'video', r: '9/16', d: 11,
        c: 'Te la llevamos a Grand Bourg, San Lorenzo, San Lorenzo Chico, El Tipal y La Almudena. Si estás en otra zona, escribinos y lo vemos.' },
      { id: 'p12', t: 'Achilata en tu fiesta', k: 'post',
        s: ['Achilata en tu fiesta', 'En Tucumán no hay fiesta sin achilata', 'El carrito', 'Pedí tu presupuesto'],
        c: 'Achilata en tu fiesta. En Tucumán no hay fiesta sin achilata, y ahora en Salta tampoco.\n\nVamos con el carrito, los vasitos, las cucharitas y quien sirve. Casamientos, 15, cumples, empresas y clubes.' },
      { id: 'p13', t: 'Pedí desde la web', k: 'post',
        s: ['Pedí desde la web', 'Elegí tus potes', 'Poné tu dirección', 'Pagás como quieras'],
        c: 'Ahora pedís desde la web. Elegís tus potes, ponés tu dirección y elegís cómo pagar. El link está en la bio ☀️🩷' },
    ],
    stories: [
      ['h01', 'Volvimos'], ['h04', 'Elegí tu pote: 1 kg y medio kilo'], ['h05', '¿Ya probaste achilata? Encuesta'],
      ['h07', 'Hoy hacemos envíos'], ['h08', 'Achilata hoy, para la siesta y el calor'], ['h09', 'Envíos: llega bien fría'],
      ['h10', 'Pedidos por WhatsApp'], ['h11', 'El menú'], ['h12', 'Cómo pedir'], ['h13', 'Pagás como quieras'],
      ['h14', 'Achilata en tu fiesta'], ['h15', 'Pedí tu presupuesto'], ['h16', 'Achilata, sustantivo femenino'],
      ['h17', 'Hay gelata'], ['h18', '¿1 kg o medio kilo? Encuesta'], ['h19', '¿Ya probaste achilata? Deslizador'],
      ['h20', 'Hace calor en Salta: caja de preguntas'], ['h21', 'Pedidos abiertos'], ['h22', 'Preguntanos lo que quieras'],
      ['h23', 'Finde de achilata: cuenta regresiva'], ['h24', 'Tenemos web'], ['h25', 'Cómo pedir desde la web'],
    ],
    highlights: [
      ['menu', 'Menú', ['h04', 'h11']],
      ['pedidos', 'Pedidos', ['h10', 'h12', 'h13', 'h24', 'h25']],
      ['zonas', 'Zonas', ['h09']],
      ['eventos', 'Eventos', ['h14', 'h15']],
      ['achilata', 'Achilata', ['h16', 'h17']],
    ],
  },
  {
    slug: 'bancala', file: 'redes-sociales/bancala.html', dir: '/assets/redes/bancala/',
    user: 'bancala_conquito', name: 'Bancala', audio: true,
    bio: ['Mucho más que un banco 🪑', 'Soy Quito, el banquito de la facu', 'Cuidar la banca es bancar al que viene', 'UCASAL Sustentable'],
    txt: {
      pf: ['Conocé a Quito.', 'La cuenta de la campaña, con Quito como protagonista: el banco del campus que vio de todo y te pide que lo cuides. Tocá una publicación, mirá el video o abrí las destacadas.'],
      car: ['Un personaje que cuenta la campaña.', 'carruseles: quién es Quito, qué no es un banco, las historias que pasan sobre él y un día entero en su vida, de 8 a 20 h.'],
      vid: ['Quito, en movimiento.', 'Un video para el feed que explica y emociona, y una historia que frena el pase y lleva al QR. Animación propia sobre las poses originales del personaje.'],
      st: ['Historias que se responden.', 'historias con encuesta, quiz, deslizador, caja de preguntas, música y cuenta regresiva, ordenadas en destacadas con portada propia.'],
      one: ['Placas para el feed.'],
      credit: 'Música de los videos: «Le Surfuku», Léo Lago (CC BY).',
    },
    feed: [
      { id: 'b01', t: 'Hola, soy Quito', k: 'post',
        s: ['Hola, soy Quito, el banquito de los patios de la facu'],
        c: 'Hola, soy Quito, el banquito de la facu. Vengo a pedirte una mano… bueno, una pata. 🪑' },
      { id: 'b02', t: 'Conocé a Quito', k: 'post',
        s: ['Conocé a Quito', '¿Quién es? La ficha de Quito', 'Vio de todo', 'Su humor depende de vos', 'Él te banca en todas. ¿Vos lo bancás?'],
        c: 'Conocé a Quito. Vio de todo: primeros días, finales aprobados, rondas de mates y siestas de diez minutos. Su humor depende de vos.' },
      { id: 'b03', t: 'Testigo de tus historias', k: 'video', r: '4/5', d: 20,
        c: 'La misma banca. Distintas historias. Pero rayado y sucio, Quito no puede bancar a nadie.\n\nCuidame hoy, mañana se sienta otro. Cuidar la banca es bancar al que viene.' },
      { id: 'b04', t: 'Te banco en todas, menos en estas', k: 'post',
        s: ['Te banco en todas. Menos en estas.', 'No soy reposera', 'No soy peluquería', 'No soy tu cuaderno', 'Si me movés, devolveme', 'Bancala: las reglas'],
        c: 'Te banco en todas. Menos en estas: no soy reposera, no soy peluquería y no soy tu cuaderno. Y si me movés, devolveme.' },
      { id: 'b05', t: 'Los que nos bancan a nosotros', k: 'post',
        s: ['Los que nos bancan a nosotros: homenaje al equipo de Mantenimiento'],
        c: 'Los que nos bancan a nosotros. Detrás de cada banco hay horas de trabajo y el esfuerzo invisible del equipo de Mantenimiento.' },
      { id: 'b06', t: 'La misma banca, distintas historias', k: 'post',
        s: ['La misma banca. Distintas historias.', 'El primer día', 'La ronda de mates', 'La siesta de diez minutos', 'El almuerzo de todos', '¿Cuál es tu historia en un banco?'],
        c: 'La misma banca. Distintas historias. El primer día, la ronda de mates, la siesta de diez minutos y el almuerzo de todos.\n\n¿Cuál es tu historia en un banco?' },
      { id: 'b07', t: 'Pasá por la Estación Bancala', k: 'post',
        s: ['Pasá por la Estación Bancala, en el refugio rojo del patio'],
        c: 'Pasá por la Estación Bancala, en el refugio rojo del patio. Vestimos el refugio y la mesa para que dejes tu historia en el Muro.' },
      { id: 'b08', t: 'Un día en la vida de Quito', k: 'post',
        s: ['Un día en la vida de Quito', '08:00 · Llega el primer ingresante', '10:30 · Hora del mate', '13:00 · Almuerzo al sol', '15:00 · Hora libre y alguien se aburre', '17:00 · Siesta improvisada', '19:00 · Llega Mantenimiento', '20:00 · Mañana arranca todo de nuevo'],
        c: 'Un día en la vida de Quito, de 8 a 20 h. El primer ingresante, la hora del mate, el almuerzo al sol… y a las 19, Mantenimiento.\n\nBancarla vale. Ahora te toca a vos.' },
      { id: 'b09', t: 'Pegalos en tu compu', k: 'post',
        s: ['Pegalos en tu compu. No en el banco: los stickers de Quito'],
        c: 'Pegalos en tu compu. No en el banco. 😉 Los stickers de Quito, gratis en la Estación Bancala.' },
    ],
    stories: [
      ['hv', '¡Ey! ¿Me bancás un segundito? Video', true], ['h01', '¡Buenas! Soy Quito'], ['h02', 'Confesionario de bancos: encuesta'],
      ['h03', 'Pregunta de final: quiz'], ['h04', '¿Cuánto lo bancás? Deslizador'], ['h05', 'Tu historia acá: caja de preguntas'],
      ['h06', 'Para escuchar sentado: música'], ['h07', 'Nos vemos en el patio: cuenta regresiva'],
    ],
    highlights: [
      ['quito', 'Quito', ['h01', 'hv']],
      ['encuestas', 'Encuestas', ['h02', 'h03', 'h04']],
      ['historias', 'Historias', ['h05']],
      ['estacion', 'Estación', ['h07']],
      ['playlist', 'Playlist', ['h06']],
      ['reglas', 'Reglas', ['hv']],
    ],
    // Fuera de la pantalla: la campaña completa, para dar contexto a las redes
    extra: {
      t: 'Y fuera de la pantalla.',
      p: 'Las redes son una parte de la campaña: también hay afiches, infografía, stickers, la Estación Bancala en el patio y un stand con Quito en tamaño real.',
      img: [
        ['x-stand', 'El stand Bancala montado en el campus, con Quito en tamaño real', 1600, 1131, 'w'],
        ['x-afiche', 'Afiche A3 de la serie Te banco en todas', 864, 1222, ''],
        ['x-mesa', 'La mesa Muro de historias de la Estación Bancala', 1200, 1600, ''],
        ['x-infografia', 'Infografía A3 La misma banca, distintas historias', 864, 1222, ''],
        ['x-placa', 'Placa para los bancos existentes del campus', 1200, 1600, ''],
      ],
    },
  },
];

// ================================================================ ÍCONOS
const I = {
  grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  reels: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 8.5h18M8.5 3l3 5.5M14.5 3l3 5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 12v5l4.5-2.5z" fill="currentColor"/></svg>',
  multi: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h11a3 3 0 0 1 3 3v11h-2V6a1 1 0 0 0-1-1H7z" fill="currentColor"/><rect x="3" y="7" width="14" height="14" rx="2.5" fill="currentColor"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>',
  chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z" fill="currentColor"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
};

// ================================================================ BLOQUES
const label = p => (p.k === 'video' ? 'Video: ' : p.s.length > 1 ? `Carrusel de ${p.s.length} placas: ` : 'Publicación: ') + p.t;

function gridTile(c, p, i) {
  const badge = p.k === 'video' ? I.reels : p.s.length > 1 ? I.multi : '';
  return `<li><button class="ig__tile" type="button" data-post="${p.id}" aria-label="${esc(label(p))}">` +
    `<img src="${c.dir}${p.id}-g.webp" alt="" width="480" height="640" loading="${i < 6 ? 'eager' : 'lazy'}" decoding="async">` +
    (badge ? `<span class="ig__badge">${badge}</span>` : '') + `</button></li>`;
}

function reelTile(c, p) {
  return `<li><button class="ig__tile ig__tile--reel" type="button" data-post="${p.id}" aria-label="${esc('Video: ' + p.t)}">` +
    `<img src="${c.dir}${p.id}-poster.webp" alt="" loading="lazy" decoding="async">` +
    `<span class="ig__badge ig__badge--bl">${I.play}<b>0:${pad(p.d)}</b></span></button></li>`;
}

function hlButton(c, h, cls) {
  const [id, name, items] = h;
  return `<button class="${cls}" type="button" data-hl="${id}" aria-label="${esc('Destacada ' + name + ', ' + items.length + (items.length > 1 ? ' historias' : ' historia'))}">` +
    `<span class="${cls}__ring"><img src="${c.dir}hl-${id}.webp" alt="" width="200" height="200" loading="lazy" decoding="async"></span><span class="${cls}__name">${esc(name)}</span></button>`;
}

function phone(c) {
  const rev = [...c.feed].reverse();
  const vids = rev.filter(p => p.k === 'video');
  return `
        <div class="phone">
          <div class="phone__screen">
            <div class="phone__bar" aria-hidden="true"><span>9:41</span><i class="phone__island"></i><span class="phone__sys"><b></b><b></b><b></b></span></div>
            <div class="ig">
              <div class="ig__top">
                <p class="ig__user">${esc(c.user)} ${I.chev}</p>
                <span class="ig__icons" aria-hidden="true">${I.plus}${I.menu}</span>
              </div>
              <div class="ig__scroll" data-ig-scroll>
                <div class="ig__head">
                  <button class="ig__avatar" type="button" data-hl="todas" aria-label="Ver todas las historias">
                    <img src="${c.dir}avatar.webp" alt="" width="200" height="200" decoding="async">
                  </button>
                  <dl class="ig__stats">
                    <div><dt>publicaciones</dt><dd>${c.feed.length}</dd></div>
                    <div><dt>historias</dt><dd>${c.stories.length}</dd></div>
                    <div><dt>destacadas</dt><dd>${c.highlights.length}</dd></div>
                  </dl>
                </div>
                <div class="ig__bio">
                  <p class="ig__name">${esc(c.name)}</p>
                  ${c.bio.map(l => `<p>${esc(l)}</p>`).join('')}
                  ${c.link ? `<a href="${c.link.href}" target="_blank" rel="noopener">${esc(c.link.label)}</a>` : ''}
                </div>
                <div class="ig__btns">
                  <button class="ig__btn ig__btn--main" type="button" data-follow aria-pressed="false">Seguir</button>
                  <a class="ig__btn" href="https://instagram.com/${c.user}" target="_blank" rel="noopener">Ver perfil</a>
                </div>
                <div class="ig__hls">
                  ${c.highlights.map(h => hlButton(c, h, 'hl')).join('\n                  ')}
                </div>
                <div class="ig__tabs" role="tablist" aria-label="Contenido del perfil">
                  <button type="button" role="tab" aria-selected="true" aria-controls="ig-grid" data-tab="grid" aria-label="Publicaciones">${I.grid}</button>
                  <button type="button" role="tab" aria-selected="false" aria-controls="ig-reels" data-tab="reels" aria-label="Videos">${I.reels}</button>
                </div>
                <ul class="ig__grid" id="ig-grid" role="tabpanel">
                  ${rev.map((p, i) => gridTile(c, p, i)).join('\n                  ')}
                </ul>
                <ul class="ig__grid ig__grid--reels" id="ig-reels" role="tabpanel" hidden>
                  ${vids.map(p => reelTile(c, p)).join('\n                  ')}
                </ul>
              </div>
              <div class="ig__nav" aria-hidden="true">${I.home}${I.search}${I.plus}${I.reels}<img src="${c.dir}avatar.webp" alt="" width="200" height="200" loading="lazy"></div>
            </div>
          </div>
        </div>`;
}

function profile(c, n) {
  return `
    <!-- PERFIL: el Instagram de la marca, navegable -->
    <section class="cp rc-pf tone-1" aria-labelledby="pf-t">
      <header class="cp__hd"><span>Perfil</span><span>${pad(n)}. Instagram</span></header>
      <div class="pf">
        <div class="pf__text" data-rv>
          <h2 class="rc-t rc-t--xl" id="pf-t">${esc(c.txt.pf[0])}</h2>
          <p>${esc(c.txt.pf[1])}</p>
          <ol class="pf__keys">
            <li><span>${c.feed.length}</span> publicaciones</li>
            <li><span>${c.feed.filter(p => p.k === 'post' && p.s.length > 1).length}</span> carruseles</li>
            <li><span>${c.stories.length}</span> historias</li>
            <li><span>${c.highlights.length}</span> destacadas</li>
          </ol>
        </div>
${phone(c)}
      </div>
    </section>`;
}

function carousels(c, n) {
  const list = c.feed.filter(p => p.k === 'post' && p.s.length > 1);
  return `
    <!-- CARRUSELES: uno a la vez, placa al lado de placa -->
    <section class="cp rc-car tone-2" data-rv aria-labelledby="car-t">
      <header class="cp__hd"><span>Carruseles</span><span>${pad(n)}. Deslizar</span></header>
      <div class="car" data-car>
        <div class="car__side">
          <h2 class="rc-t" id="car-t">${esc(c.txt.car[0])}</h2>
          <p class="car__txt">${list.length} ${esc(c.txt.car[1])}</p>
          <div class="car__list" role="tablist" aria-label="Elegí un carrusel">
            ${list.map((p, i) => `<button type="button" role="tab" id="car-tab-${p.id}" aria-controls="car-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-car-tab="${p.id}"><span class="car__n">${pad(i + 1)}</span><span class="car__name">${esc(p.t)}</span><span class="car__k">${p.s.length} placas</span></button>`).join('\n            ')}
          </div>
        </div>
        <div class="car__stage">
          ${list.map((p, i) => `<div class="car__track" id="car-${p.id}" role="tabpanel" aria-labelledby="car-tab-${p.id}" tabindex="0" data-car-track${i ? ' hidden' : ''}>
            ${p.s.map((alt, j) => `<figure class="car__slide"><img src="${c.dir}${p.id}-${j + 1}.webp" alt="${esc(alt)}" width="864" height="1080" loading="lazy" decoding="async"><figcaption>${pad(j + 1)}</figcaption></figure>`).join('\n            ')}
          </div>`).join('\n          ')}
          <div class="car__ctrl">
            <div class="car__prog" aria-hidden="true"><i data-car-bar></i></div>
            <p class="car__count" data-car-count>01 / ${pad(list[0].s.length)}</p>
            <button class="car__arw car__arw--prev" type="button" data-car-step="-1" aria-label="Placa anterior"></button>
            <button class="car__arw" type="button" data-car-step="1" aria-label="Placa siguiente"></button>
          </div>
        </div>
      </div>
    </section>`;
}

function videos(c, n) {
  const list = [...c.feed.filter(p => p.k === 'video').map(p => ({ id: p.id, t: p.t, r: p.r, d: p.d, k: p.r === '9/16' ? 'Reel' : 'Video del feed', post: p.id })),
    ...c.stories.filter(s => s[2]).map(([id, t]) => ({ id, t: t.replace(/ Video$/, ''), r: '9/16', k: 'Historia', story: id }))];
  return `
    <!-- VIDEOS -->
    <section class="cp rc-vid ${c.vidTone || 'tone-3'}" data-rv aria-labelledby="vid-t">
      <header class="cp__hd"><span>Video</span><span>${pad(n)}. Movimiento</span></header>
      <div class="rl">
        <div class="rl__head">
          <h2 class="rc-t" id="vid-t">${esc(c.txt.vid[0])}</h2>
          <p>${esc(c.txt.vid[1])}</p>
        </div>
        <ul class="rl__list rl__list--${list.length}">
          ${list.map(v => `<li><button class="rl__item" type="button" ${v.post ? `data-post="${v.post}"` : `data-story-id="${v.story}"`} aria-label="${esc('Ver ' + v.k.toLowerCase() + ': ' + v.t)}">
            <span class="rl__frame rl__frame--${v.r === '4/5' ? 'p' : 'v'}"><video data-src="${c.dir}${v.id}.mp4" poster="${c.dir}${v.id}-poster.webp" muted loop playsinline preload="none"></video></span>
            <span class="rl__name">${esc(v.t)}</span><span class="rl__d">${v.k}${v.d ? ` · ${v.d} s` : ''}</span>
          </button></li>`).join('\n          ')}
        </ul>
        ${c.txt.credit ? `<p class="rl__credit">${esc(c.txt.credit)}</p>` : ''}
      </div>
    </section>`;
}

function stories(c, n) {
  return `
    <!-- HISTORIAS Y DESTACADAS -->
    <section class="cp rc-st tone-1" data-rv aria-labelledby="st-t">
      <header class="cp__hd"><span>Historias</span><span>${pad(n)}. Destacadas</span></header>
      <div class="st">
        <div class="st__head">
          <h2 class="rc-t" id="st-t">${esc(c.txt.st[0])}</h2>
          <p>${c.stories.length} ${esc(c.txt.st[1])}</p>
        </div>
        <div class="st__hls">
          ${c.highlights.map(h => hlButton(c, h, 'bhl')).join('\n          ')}
        </div>
        <div class="st__rail" data-rail tabindex="0" aria-label="Todas las historias">
          ${c.stories.map(([id, t, v], i) => `<button class="st__item" type="button" data-story-id="${id}" aria-label="${esc('Historia: ' + t)}"><img src="${c.dir}${v ? id + '-poster' : id}.webp" alt="" width="608" height="1080" loading="lazy" decoding="async">${v ? `<span class="st__play">${I.play}</span>` : ''}</button>`).join('\n          ')}
        </div>
      </div>
    </section>`;
}

function singles(c, n) {
  const list = c.feed.filter(p => p.k === 'post' && p.s.length === 1);
  return `
    <!-- PLACAS SUELTAS -->
    <section class="cp rc-one tone-4" data-rv aria-labelledby="one-t">
      <header class="cp__hd"><span>Placas</span><span>${pad(n)}. Una sola imagen</span></header>
      <div class="one">
        <h2 class="rc-t" id="one-t">${esc(c.txt.one[0])}</h2>
        <ul class="one__list one__list--${list.length}">
          ${list.map(p => `<li><button class="one__item" type="button" data-post="${p.id}" data-tilt aria-label="${esc('Ver la publicación ' + p.t)}"><img src="${c.dir}${p.id}-1.webp" alt="${esc(p.s[0])}" width="864" height="1080" loading="lazy" decoding="async"></button></li>`).join('\n          ')}
        </ul>
      </div>
    </section>`;
}

function extra(c, n) {
  const x = c.extra;
  return `
    <!-- FUERA DE LA PANTALLA -->
    <section class="cp rc-x tone-2" data-rv aria-labelledby="x-t">
      <header class="cp__hd"><span>Campaña</span><span>${pad(n)}. Impresos y espacio</span></header>
      <div class="xs">
        <div class="xs__head">
          <h2 class="rc-t" id="x-t">${esc(x.t)}</h2>
          <p>${esc(x.p)}</p>
        </div>
        <div class="xs__grid">
          ${x.img.map(([f, alt, w, h, m]) => `<figure class="xs__it${m ? ' xs__it--' + m : ''}"><img src="${c.dir}${f}.webp" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async"></figure>`).join('\n          ')}
        </div>
      </div>
    </section>`;
}

function build(c) {
  const data = {
    dir: c.dir, user: c.user, audio: !!c.audio,
    posts: Object.fromEntries(c.feed.map(p => [p.id, { t: p.t, k: p.k, r: p.r || '4/5', s: p.s || [], c: p.c }])),
    stories: c.stories.map(([id, t, v]) => [id, t, !!v]),
    highlights: Object.fromEntries([['todas', 'Historias', c.stories.map(s => s[0])], ...c.highlights].map(([id, name, items]) => [id, [name, items]])),
  };
  let n = 0;
  const parts = [profile(c, ++n), carousels(c, ++n)];
  if (c.feed.some(p => p.k === 'video') || c.stories.some(s => s[2])) parts.push(videos(c, ++n));
  const hide = c.hide || [];
  if (!hide.includes('st')) parts.push(stories(c, ++n));
  if (!hide.includes('one') && c.feed.some(p => p.k === 'post' && p.s.length === 1)) parts.push(singles(c, ++n));
  if (c.extra) parts.push(extra(c, ++n));
  return `<!-- RCASE:START — generado por redes.cjs -->
  <div class="wrap cpanels">
${parts.join('\n')}

  </div>
  <template id="rcase-data">${esc(JSON.stringify(data))}</template>
<!-- RCASE:END -->`;
}

for (const c of CASES) {
  const file = R + c.file;
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('RCASE:START')) throw new Error('Faltan las marcas RCASE en ' + c.file);
  fs.writeFileSync(file, html.replace(/<!-- RCASE:START[\s\S]*?<!-- RCASE:END -->/, () => build(c)));
  console.log('ok ·', c.file);
}

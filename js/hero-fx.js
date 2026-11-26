/* ============================================================
   LCS — hero-fx.js
   Heros de la portada y de las páginas de cada camino, en dos
   canvas 2D y sin librerías. La forma es una palabra (Branding,
   Diseño web, Servicios…) o el logo de la portada.

   · Unas pocas partículas negras. Se lee la forma real de las letras
     (la palabra se dibuja en un canvas oculto con la misma fuente) y
     de ahí se desprenden puntos y esquirlas en 3D; un polvo ralo
     acompaña de punta a punta y motas del color del fondo gastan un
     poco las letras.
   · En la portada la forma es el logo, que no se toca: las partículas
     salen de su silueta y el polvo se reparte por todo el hero.

   La escena gira suave hacia el cursor y las partículas se apartan a
   su paso. Se detiene fuera de pantalla o con la pestaña oculta; con
   movimiento reducido queda un cuadro quieto.
   ============================================================ */
(function () {
  'use strict';

  const stage = document.querySelector('[data-bhero]');
  if (!stage) return;
  const back = stage.querySelector('.bhero__fx--back');
  const front = stage.querySelector('.bhero__fx--front');
  // La forma puede ser una palabra (<h1 data-bhero-shape>) o el logo de la portada (<svg data-bhero-shape>)
  const shape = stage.querySelector('[data-bhero-shape]');
  const isLogo = !!shape && shape.tagName.toLowerCase() === 'svg';
  const word = isLogo ? null : shape;
  const text = word && word.firstElementChild;
  const baseEl = stage.querySelector('.bhero__base');
  if (!back || !front || !shape || !back.getContext) return;
  if (!isLogo && (!text || !baseEl)) return;
  // el logo se lee de una copia del mismo SVG en una imagen (sin las animaciones de entrada)
  const pic = isLogo ? new Image() : null;
  if (pic) {
    const copy = shape.cloneNode(true);   // con medidas propias: un SVG sin ancho ni alto puede leerse en 0
    copy.setAttribute('width', 1096); copy.setAttribute('height', 344);
    pic.src = 'data:image/svg+xml,' + encodeURIComponent(new XMLSerializer().serializeToString(copy));
  }

  const bx = back.getContext('2d');
  const fx = front.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Utilidades ---------- */
  let seed = 20261012;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const gauss = () => { let u = 0; for (let i = 0; i < 4; i++) u += rnd(); return (u - 2) / 2; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  // El sitio es claro: las partículas son negras, las que quedan atrás (Z > 0)
  // se aclaran apenas hacia el papel y la erosión pinta con el color del fondo.
  const PAPER = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#faf9f5';
  const depthTone = (tone, Z) => Math.round(tone + (200 - tone) * clamp(Z * .3, 0, .6));

  const small = innerWidth < 700;
  const N_DUST = small ? 70 : 140;       // se desprenden de las letras
  const N_FLOAT = small ? 30 : 60;       // polvo ralo a lo largo de la palabra
  const N_FIELD = small ? 50 : 110;      // portada: polvo en todo el hero, más ralo lejos del logo
  const N_ERODE = small ? 200 : 380;     // motas del color del fondo sobre las letras

  /* ---------- Medidas y forma ---------- */
  let W = 0, H = 0, dpr = 1, fs = 100, scale = 1;
  const G = { cx: 0, cy: 0, half: 1, word: null };
  let glyph = [];          // puntos dentro de la forma, en unidades de letra desde el centro

  // El logo se dibuja en un canvas chico y se guarda cada píxel lleno: es su silueta.
  function sampleImage(r) {
    const ir = shape.getBoundingClientRect();
    if (!ir.width || !pic.complete || !pic.naturalWidth) return [];
    const q = Math.min(1, 80 / ir.height);
    const w = Math.ceil(ir.width * q), h = Math.ceil(ir.height * q);
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const o = off.getContext('2d', { willReadFrequently: true });
    o.drawImage(pic, 0, 0, w, h);
    const data = o.getImageData(0, 0, w, h).data;
    const pts = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (data[(y * w + x) * 4 + 3] > 140) pts.push([(ir.left - r.left + x / q - G.cx) / fs, (ir.top - r.top + y / q - G.cy) / fs]);
      }
    }
    return pts;
  }

  // La palabra se dibuja en un canvas chico, a un píxel por punto de muestra.
  function sampleGlyphs(r, base) {
    const tr = text.getBoundingClientRect();
    const cs = getComputedStyle(word);
    const q = Math.min(1, 60 / fs);                 // ~60 muestras por alto de letra
    const left = tr.left - r.left, top = base - fs * 1.05;
    const w = Math.ceil(tr.width * q) + 2, h = Math.ceil(fs * 1.4 * q) + 2;
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const o = off.getContext('2d', { willReadFrequently: true });
    o.scale(q, q);
    o.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
    if ('letterSpacing' in o) o.letterSpacing = cs.letterSpacing;
    o.textBaseline = 'alphabetic';
    o.fillStyle = '#000';
    o.fillText(text.textContent, 0, fs * 1.05);
    const data = o.getImageData(0, 0, w, h).data;
    const pts = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (data[(y * w + x) * 4 + 3] > 140) pts.push([(left + x / q - G.cx) / fs, (top + y / q - G.cy) / fs]);
      }
    }
    return pts;
  }

  function layout() {
    const r = back.getBoundingClientRect(); // los lienzos, no el escenario: llegan al borde
    if (!r.width) return;
    W = r.width; H = r.height;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    for (const c of [back, front]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    bx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (isLogo) {
      // la unidad es el alto del logo: así todo escala con él
      const ir = shape.getBoundingClientRect();
      fs = ir.height * 1.15 || 100;
      G.word = { l: ir.left - r.left, r: ir.right - r.left, t: ir.top - r.top, b: ir.bottom - r.top };
      G.cx = (G.word.l + G.word.r) / 2;
      G.cy = (G.word.t + G.word.b) / 2;
      G.half = ir.width / 2 / fs;
      glyph = sampleImage(r);
    } else {
      fs = parseFloat(getComputedStyle(word).fontSize) || 100;
      const base = baseEl.getBoundingClientRect().top - r.top;
      const tr = text.getBoundingClientRect();
      G.word = { l: tr.left - r.left, r: tr.right - r.left, t: base - fs * .76, b: base + fs * .26 };
      G.cx = (G.word.l + G.word.r) / 2;
      G.cy = base - fs * .34;
      G.half = (G.word.r - G.word.l) / 2 / fs;
      glyph = sampleGlyphs(r, base);
      if (glyph.length) for (const p of erode) placeErode(p);
    }
    scale = clamp(fs / 260, .42, 1.15);
    if (!running) draw(performance.now());
  }

  const pick = () => glyph.length ? glyph[(rnd() * glyph.length) | 0] : [gauss() * G.half, gauss() * .3];

  /* ---------- Partículas ---------- */
  // Las que se desprenden: nacen en un punto de la forma, se van hacia
  // arriba y afuera mientras se apagan, y renacen en otro punto.
  const dust = [];
  for (let i = 0; i < N_DUST; i++) {
    const k = rnd();
    dust.push({
      ax: 0, ay: 0, az: 0, dx: 0, dy: 0, dz: 0, dist: 0,
      t0: -rnd() * 7, dur: 3.5 + rnd() * 4.5,
      size: k < .16 ? 2.4 + rnd() * 4.4 : .8 + rnd() * 1.8, shard: k < .16,
      tone: 8 + ((rnd() * 40) | 0), alpha: .55 + rnd() * .45,
      ph: rnd() * 6.283, sp: .3 + rnd() * .7, rot: rnd() * 6.283, vr: (rnd() - .5) * 2,
      ox: 0, oy: 0, born: false,
    });
  }
  function respawn(p, t) {
    const g = pick();
    p.ax = g[0]; p.ay = g[1]; p.az = (rnd() - .5) * .2;
    const ang = -Math.PI / 2 + (rnd() - .5) * 2.6;
    p.dx = Math.cos(ang); p.dy = Math.sin(ang); p.dz = (rnd() - .5) * 1.4;
    p.dist = .15 + rnd() * .75;
    p.t0 = t; p.dur = 3.5 + rnd() * 4.5; p.born = true;
  }

  // Polvo ralo: un elipsoide ancho que cubre toda la palabra. En la portada
  // cubre todo el hero: u, v van de -1 a 1 (del logo al borde) y la densidad
  // cae con la distancia al centro.
  const float = [];
  const nFloat = isLogo ? N_FIELD : N_FLOAT;
  for (let i = 0; i < nFloat; i++) {
    let u, v;
    do { u = rnd() * 2 - 1; v = rnd() * 2 - 1; } while (rnd() > Math.exp(-(u * u + v * v) / (2 * .42 * .42)) + .04);
    float.push({
      u, v,
      x: gauss() * .78, y: gauss() * .55 - .05, z: gauss() * .6, // x en mitades del ancho de la forma
      size: .8 + rnd() * 1.6, tone: 8 + ((rnd() * 50) | 0), alpha: .35 + rnd() * .5,
      ph: rnd() * 6.283, sp: .15 + rnd() * .35, amp: .02 + rnd() * .05,
      sx: (rnd() - .5) * 5, sy: (rnd() - .5) * 3, ox: 0, oy: 0,
    });
  }

  // Erosión: motas del color del fondo sobre puntos de las letras, más densas
  // en el centro de la palabra y más livianas hacia las puntas.
  const erode = [];
  for (let i = 0; i < N_ERODE; i++) {
    erode.push({ x: 0, y: 0, size: .8 + rnd() * 2.8, alpha: .5 + rnd() * .5, gray: rnd() < .3,
      ph: rnd() * 6.283, sp: .2 + rnd() * .4, keep: rnd(), ox: 0, oy: 0 });
  }
  function placeErode(p) {
    let g = pick();
    for (let n = 0; n < 4 && rnd() > 1 - Math.abs(g[0]) / (G.half || 1) * .8; n++) g = pick();
    p.x = g[0]; p.y = g[1];
  }

  /* ---------- Puntero ---------- */
  const P = { x: -1e4, y: -1e4, nx: 0, ny: 0, tx: 0, ty: 0, on: false };
  function point(e) {
    const r = back.getBoundingClientRect();
    P.x = e.clientX - r.left; P.y = e.clientY - r.top;
    P.tx = clamp((P.x / W) * 2 - 1, -1, 1);
    P.ty = clamp((P.y / H) * 2 - 1, -1, 1);
    P.on = true;
  }
  const leave = () => { P.on = false; P.tx = 0; P.ty = 0; P.x = P.y = -1e4; };
  stage.addEventListener('pointermove', point, { passive: true });
  stage.addEventListener('pointerdown', point, { passive: true });
  stage.addEventListener('pointerleave', leave);
  stage.addEventListener('pointercancel', leave);
  stage.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') leave(); });

  /* ---------- Dibujo ---------- */
  let t0 = performance.now();
  const INTRO = 2400;

  function shard(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * .85, s * .6); ctx.lineTo(-s * .7, s * .45); ctx.closePath();
    ctx.fill(); ctx.restore();
  }
  function dot(ctx, x, y, s) {
    if (s < 1.7) ctx.fillRect(x - s / 2, y - s / 2, s, s);
    else { ctx.beginPath(); ctx.arc(x, y, s / 2, 0, 6.2832); ctx.fill(); }
  }
  // el puntero aparta la partícula y después la deja volver
  function repel(p, sx, sy, R2, f0) {
    if (P.on) {
      const dx = sx + p.ox - P.x, dy = sy + p.oy - P.y, d2 = dx * dx + dy * dy;
      if (d2 < R2 && d2 > 1) { const f = (1 - d2 / R2) * f0, d = Math.sqrt(d2); p.ox += dx / d * f; p.oy += dy / d * f; }
    }
    p.ox *= .92; p.oy *= .92;
  }

  function draw(now) {
    const t = (now - t0) / 1000;
    const k = reduced ? 1 : easeOut(clamp((now - t0 - 300) / INTRO, 0, 1));

    // la escena gira suave hacia el puntero
    P.nx += (P.tx - P.nx) * .06; P.ny += (P.ty - P.ny) * .06;
    const yaw = P.nx * .28 + (reduced ? 0 : Math.sin(t * .17) * .06);
    const pitch = -P.ny * .18;

    bx.clearRect(0, 0, W, H);
    fx.clearRect(0, 0, W, H);

    const cyw = Math.cos(yaw), syw = Math.sin(yaw), cpt = Math.cos(pitch), spt = Math.sin(pitch);
    const cam = 4;
    const R2 = (fs * .5) ** 2, F0 = fs * .055;
    const proj = (x, y, z) => {
      const X = x * cyw - z * syw; let Z = x * syw + z * cyw;
      const Y = y * cpt - Z * spt; Z = y * spt + Z * cpt;
      const sc = cam / (cam + Z);
      return [G.cx + X * fs * sc, G.cy + Y * fs * sc, Z, sc];
    };
    const sizeK = clamp(.2 + scale * .8, .5, 1.1);

    // ---- polvo ralo
    for (const p of float) {
      const fx0 = isLogo ? (p.u < 0 ? p.u * G.cx : p.u * (W - G.cx)) / fs : p.x * Math.max(1, G.half);
      const fy0 = isLogo ? (p.v < 0 ? p.v * G.cy : p.v * (H - G.cy)) / fs : p.y;
      const x = p.sx + (fx0 + (reduced ? 0 : Math.sin(t * p.sp + p.ph) * p.amp) - p.sx) * k;
      const y = p.sy + (fy0 + (reduced ? 0 : Math.cos(t * p.sp * .8 + p.ph) * p.amp) - p.sy) * k;
      const [sx, sy, Z, sc] = proj(x, y, p.z);
      repel(p, sx, sy, R2, F0);
      const ctx = Z > 0 ? bx : fx;
      ctx.globalAlpha = clamp(p.alpha * k * (1.1 - Z * .4), 0, 1);
      const v = depthTone(p.tone, Z);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      dot(ctx, sx + p.ox, sy + p.oy, p.size * sc * sizeK);
    }

    // ---- partículas que se desprenden de la forma
    for (const p of dust) {
      if (!p.born) respawn(p, t + p.t0);
      else if (t - p.t0 >= p.dur) respawn(p, t);
      const age = clamp((t - p.t0) / p.dur, 0, 1);
      const e = reduced ? .35 : easeOut(age);
      const wob = reduced ? 0 : Math.sin(t * p.sp + p.ph) * .02;
      const x = p.ax + p.dx * e * p.dist + wob;
      const y = p.ay + p.dy * e * p.dist - e * e * .08;
      const z = p.az + p.dz * e * p.dist;
      const [sx, sy, Z, sc] = proj(x, y, z);
      repel(p, sx, sy, R2, F0);
      const life = (reduced ? .8 : smooth(0, .12, age) * (1 - smooth(.55, 1, age))) * (isLogo ? smooth(.1, .3, age) : 1);
      const a = p.alpha * life * k;
      if (a < .02) continue;
      const ctx = Z > 0 ? bx : fx;
      ctx.globalAlpha = clamp(a, 0, 1);
      const v = depthTone(p.tone, Z);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      const s = p.size * sc * sizeK;
      if (p.shard) shard(ctx, sx + p.ox, sy + p.oy, s, p.rot + (reduced ? 0 : t * p.vr));
      else dot(ctx, sx + p.ox, sy + p.oy, s);
    }

    // ---- erosión de las letras (el logo de la portada no se toca)
    const wd = G.word, keep = .35 + scale * .65;
    if (!isLogo) for (const p of erode) {
      if (p.keep > keep) continue;
      let sx = G.cx + (p.x + (reduced ? 0 : Math.sin(t * p.sp + p.ph) * .008)) * fs;
      let sy = G.cy + (p.y + (reduced ? 0 : Math.cos(t * p.sp + p.ph) * .006)) * fs;
      repel(p, sx, sy, R2 * .5, F0 * .6);
      sx += p.ox; sy += p.oy;
      if (sx < wd.l || sx > wd.r || sy < wd.t || sy > wd.b) continue;
      fx.globalAlpha = p.alpha * k;
      fx.fillStyle = p.gray ? '#b4b2ac' : PAPER;
      const s = p.size * sizeK;
      fx.fillRect(sx - s / 2, sy - s / 2, s, s);
    }

    bx.globalAlpha = fx.globalAlpha = 1;
  }

  /* ---------- Ciclo ---------- */
  // arranca cuando termina la entrada del logo (CSS, ~1,1 s desde que empezó
  // a cargar la página): mientras tanto el hilo principal queda libre
  let running = false, visible = true, raf = 0, ready = false;
  function loop(now) { draw(now); raf = requestAnimationFrame(loop); }
  function sync() {
    const go = ready && !reduced && visible && !document.hidden;
    if (go && !running) { running = true; raf = requestAnimationFrame(loop); }
    else if (!go && running) { running = false; cancelAnimationFrame(raf); }
  }

  // las mediciones se agrupan: una por cuadro aunque lleguen varios avisos
  let pending = 0;
  const relayout = () => { if (!pending) pending = requestAnimationFrame(() => { pending = 0; layout(); }); };
  layout();
  if ('ResizeObserver' in window) { let first = true; new ResizeObserver(() => { if (first) { first = false; return; } relayout(); }).observe(stage); }
  else addEventListener('resize', relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(stage);
  }
  document.addEventListener('visibilitychange', sync);
  const introEnd = document.documentElement.classList.contains('intro-on') ? 1100 : 0;
  setTimeout(() => { ready = true; t0 = performance.now(); sync(); }, Math.max(120, introEnd - performance.now()));
  if (pic) pic.addEventListener('load', relayout, { once: true });
  sync();
  if (reduced) draw(performance.now());
})();

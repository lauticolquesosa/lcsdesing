/* ============================================================
   LCS — brand-hero.js
   Hero de /branding, en dos canvas 2D y sin librerías:

   · Partículas en toda la palabra. Se lee la forma real de las letras
     (la palabra se dibuja en un canvas oculto con la misma fuente) y de
     ahí se desprenden partículas y esquirlas en 3D, de la B a la g; un
     polvo flotante acompaña de punta a punta y motas negras erosionan
     las letras.
   · La esfera debajo de la «a»: una luna de manchas pintada píxel por
     píxel, con luz, brillo especular y un anillo de partículas en
     órbita. Con el mouse encima crece, gira más rápido, se inclina
     hacia el cursor y suelta partículas.
   · Las etiquetas se inclinan en 3D hacia el puntero y se pueden
     arrastrar: al soltarlas vuelven a su lugar con un rebote.

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
  const word = stage.querySelector('.bhero__word');
  const text = word && word.firstElementChild;
  const aEl = stage.querySelector('.bhero__a');
  const baseEl = stage.querySelector('.bhero__base');
  if (!back || !front || !text || !aEl || !baseEl || !back.getContext) return;

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

  const small = innerWidth < 700;
  const N_DUST = small ? 520 : 1100;     // se desprenden de las letras
  const N_FLOAT = small ? 220 : 420;     // polvo flotante a lo largo de la palabra
  const N_ERODE = small ? 520 : 1100;    // motas negras sobre las letras
  const N_RING = 150;                    // anillo alrededor de la esfera

  /* ---------- Medidas y forma de las letras ---------- */
  let W = 0, H = 0, dpr = 1, sdpr = 1, fs = 100, scale = 1;
  const G = { cx: 0, cy: 0, half: 1, sx: 0, sy: 0, sr: 0, word: null };
  let glyph = [];          // puntos dentro de las letras, en unidades de letra desde el centro
  let sphereCanvas = null, sctx = null, img = null;

  // La palabra se dibuja en un canvas chico, a una resolución de un píxel por
  // punto de muestra, y se guarda cada píxel lleno: es la forma de las letras.
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
    o.fillStyle = '#fff';
    o.fillText('Branding', 0, fs * 1.05);
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

    fs = parseFloat(getComputedStyle(word).fontSize) || 100;
    scale = clamp(fs / 260, .42, 1.15);
    const base = baseEl.getBoundingClientRect().top - r.top;
    const tr = text.getBoundingClientRect();
    const a = aEl.getBoundingClientRect();
    G.word = { l: tr.left - r.left, r: tr.right - r.left, t: base - fs * .76, b: base + fs * .26 };
    G.cx = (G.word.l + G.word.r) / 2;
    G.cy = base - fs * .34;
    G.half = (G.word.r - G.word.l) / 2 / fs;
    G.sr = fs * .26;
    G.sx = a.left - r.left + a.width * .5;
    G.sy = base + fs * .1;

    glyph = sampleGlyphs(r, base);
    if (glyph.length) for (const p of erode) placeErode(p);

    sdpr = Math.min(dpr, 1.25);
    const size = Math.ceil(G.sr * 1.25 * 2.6 * sdpr); // lugar para crecer al pasar el mouse
    sphereCanvas = sphereCanvas || document.createElement('canvas');
    sphereCanvas.width = sphereCanvas.height = size;
    sctx = sphereCanvas.getContext('2d');
    img = null;
    if (!running) draw(performance.now());
  }

  const pick = () => glyph.length ? glyph[(rnd() * glyph.length) | 0] : [gauss() * G.half, gauss() * .3];

  /* ---------- Partículas ---------- */
  // Polvo que se desprende: nace en un punto de la letra, se va hacia
  // arriba y afuera mientras se apaga, y renace en otro punto.
  const dust = [];
  for (let i = 0; i < N_DUST; i++) {
    const k = rnd();
    dust.push({
      ax: 0, ay: 0, az: 0, dx: 0, dy: 0, dz: 0, dist: 0,
      t0: -rnd() * 7, dur: 3.5 + rnd() * 4.5,
      size: k < .16 ? 2.4 + rnd() * 4.4 : .8 + rnd() * 1.8, shard: k < .16,
      tone: 170 + ((rnd() * 85) | 0), alpha: .5 + rnd() * .5,
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

  // Polvo flotante: un elipsoide ancho que cubre toda la palabra.
  const float = [];
  for (let i = 0; i < N_FLOAT; i++) {
    float.push({
      x: gauss() * 1.05, y: gauss() * .55 - .05, z: gauss() * .6,
      size: .7 + rnd() * 1.6, tone: 140 + ((rnd() * 115) | 0), alpha: .25 + rnd() * .55,
      ph: rnd() * 6.283, sp: .15 + rnd() * .35, amp: .02 + rnd() * .05,
      sx: (rnd() - .5) * 5, sy: (rnd() - .5) * 3, ox: 0, oy: 0,
    });
  }

  // Erosión: motas negras sobre puntos de las letras, repartidas en toda la palabra.
  const erode = [];
  for (let i = 0; i < N_ERODE; i++) {
    erode.push({ x: 0, y: 0, size: .8 + rnd() * 2.8, alpha: .5 + rnd() * .5, gray: rnd() < .3,
      ph: rnd() * 6.283, sp: .2 + rnd() * .4, keep: rnd(), ox: 0, oy: 0 });
  }
  // más densa en el centro de la palabra y más liviana hacia las puntas
  function placeErode(p) {
    let g = pick();
    for (let n = 0; n < 4 && rnd() > 1 - Math.abs(g[0]) / (G.half || 1) * .8; n++) g = pick();
    p.x = g[0]; p.y = g[1];
  }

  // Partículas que suelta la esfera al pasar el mouse.
  const burst = [];

  /* ---------- Puntero ---------- */
  const P = { x: -1e4, y: -1e4, nx: 0, ny: 0, tx: 0, ty: 0, on: false };
  function point(e) {
    const r = back.getBoundingClientRect(); // los lienzos, no el escenario: llegan al borde
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

  /* ---------- Esfera ---------- */
  const L = (() => { const l = [-.5, -.62, -.6]; const n = Math.hypot(...l); return l.map(v => v / n); })();
  const HV = (() => { const h = [L[0], L[1], L[2] - 1]; const n = Math.hypot(...h); return h.map(v => v / n); })();
  function relief(x, y, z) {
    // deformación suave del espacio antes de leer las ondas: bordes orgánicos
    const wx = x + .35 * Math.sin(2.3 * y + 1.3) + .2 * Math.sin(4.1 * z + .4);
    const wy = y + .35 * Math.sin(2.1 * z + .7) + .2 * Math.sin(3.7 * x + 2.2);
    const wz = z + .35 * Math.sin(2.5 * x + 2.9) + .2 * Math.sin(4.3 * y + 1.6);
    return Math.sin(3.1 * wx + 1.7) * Math.sin(2.7 * wy + .3) * Math.sin(3.3 * wz + 2.1)
      + .45 * Math.sin(5.3 * wx + 1.7) * Math.sin(4.9 * wz + 1.1) * Math.sin(5.7 * wy + .4)
      + .2 * Math.sin(9.1 * wx + 2.2) * Math.sin(8.3 * wy + .9) * Math.sin(9.7 * wz + 1.5);
  }

  function paintSphere(R, yaw, pitch, k, glow) {
    const size = sphereCanvas.width, Rp = R * sdpr, cp = size / 2;
    if (!img) img = sctx.createImageData(size, size);
    const d = img.data;
    d.fill(0);
    const cy = Math.cos(-yaw), sy = Math.sin(-yaw), cpi = Math.cos(-pitch), spi = Math.sin(-pitch);
    const x0 = Math.max(0, Math.floor(cp - Rp - 1)), x1 = Math.min(size, Math.ceil(cp + Rp + 1));
    for (let j = x0; j < x1; j++) {
      const v = (j + .5 - cp) / Rp;
      for (let i = x0; i < x1; i++) {
        const u = (i + .5 - cp) / Rp;
        const d2 = u * u + v * v;
        if (d2 >= 1) continue;
        const w = -Math.sqrt(1 - d2);
        const ty = v * cpi - w * spi, tz = v * spi + w * cpi;
        const sx = u * cy - tz * sy, sz = u * sy + tz * cy;
        const n = relief(sx * 1.9, ty * 1.9, sz * 1.9);
        const h = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453, grain = h - Math.floor(h) - .5;
        const blot = clamp((n + .2 + grain * .3) / .1, 0, 1); // manchas de borde granulado
        const lam = clamp(u * L[0] + v * L[1] + w * L[2], 0, 1);
        const spec = Math.pow(clamp(u * HV[0] + v * HV[1] + w * HV[2], 0, 1), 28) * (.25 + blot * .55);
        let val = (.08 + blot * .9) * (lam * .6 + .42) + spec + grain * .08;
        val += Math.pow(1 - Math.sqrt(1 - d2), 4) * (.08 + glow * .35); // borde encendido
        const g = clamp(val, 0, 1) * 250 | 0;
        const o = (j * size + i) * 4;
        d[o] = d[o + 1] = d[o + 2] = g;
        d[o + 3] = clamp((1 - Math.sqrt(d2)) * Rp * 1.5, 0, 1) * 255 * k | 0;
      }
    }
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.putImageData(img, 0, 0);
    // se funde hacia abajo, en el polvo
    sctx.globalCompositeOperation = 'destination-out';
    const fade = sctx.createLinearGradient(0, cp + Rp * .05, 0, cp + Rp * .95);
    fade.addColorStop(0, 'rgba(0,0,0,0)');
    fade.addColorStop(1, `rgba(0,0,0,${.92 - glow * .5})`);
    sctx.fillStyle = fade;
    sctx.fillRect(0, cp, size, cp);
    sctx.globalCompositeOperation = 'source-over';
  }

  // anillo en órbita: puntos sobre un círculo inclinado; los de atrás quedan
  // tapados por la esfera y los de adelante pasan por encima
  function ringPoint(i, t, R, hov, yaw) {
    const th = (i / N_RING) * 6.2832 + t * (.35 + hov * .9);
    const rr = R * (1.5 + hov * .25);
    const x = Math.cos(th) * rr, z = Math.sin(th) * rr;
    const tilt = 1.15 - hov * .25;               // inclinación del plano
    const y2 = -z * Math.sin(tilt), z2 = z * Math.cos(tilt);
    const cyw = Math.cos(yaw * .6 + .5), syw = Math.sin(yaw * .6 + .5);
    return [x * cyw - z2 * syw, y2, x * syw + z2 * cyw];
  }

  /* ---------- Etiquetas en 3D, arrastrables ---------- */
  const tags = [...stage.querySelectorAll('.bhero__tag')].map(el => ({
    el, card: el.querySelector('.bhero__card'),
    x: 0, y: 0, vx: 0, vy: 0, drag: false, gx: 0, gy: 0, lt: 0, hx: 0, hy: 0, rx: 0, ry: 0,
  }));
  function applyTag(s) {
    s.el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)`;
    s.card.style.setProperty('--rx', s.rx.toFixed(2) + 'deg');
    s.card.style.setProperty('--ry', s.ry.toFixed(2) + 'deg');
  }
  for (const s of tags) {
    if (!s.card) continue;
    s.el.addEventListener('pointerdown', e => {
      e.preventDefault();
      s.el.setPointerCapture(e.pointerId);
      s.drag = true; s.el.classList.add('is-drag');
      s.gx = e.clientX - s.x; s.gy = e.clientY - s.y; s.lt = performance.now();
      s.vx = s.vy = 0;
    });
    s.el.addEventListener('pointermove', e => {
      if (s.drag) {
        const now = performance.now(), dt = Math.max(8, now - s.lt) / 1000;
        const nx = e.clientX - s.gx, ny = e.clientY - s.gy;
        s.vx = s.vx * .6 + ((nx - s.x) / dt) * .4;
        s.vy = s.vy * .6 + ((ny - s.y) / dt) * .4;
        s.x = nx; s.y = ny; s.lt = now;
        s.ry = clamp(s.vx * .03, -42, 42); s.rx = clamp(-s.vy * .03, -42, 42);
        applyTag(s);
      } else if (e.pointerType === 'mouse') {
        const r = s.card.getBoundingClientRect();
        s.hx = clamp((e.clientX - r.left) / r.width - .5, -.5, .5);
        s.hy = clamp((e.clientY - r.top) / r.height - .5, -.5, .5);
        s.rx = -s.hy * 38; s.ry = s.hx * 34;
        s.el.classList.add('is-tilt');
        applyTag(s);
      }
    });
    const release = () => {
      if (!s.drag) return;
      s.drag = false; s.el.classList.remove('is-drag');
      if (!running) { s.x = s.y = s.vx = s.vy = s.rx = s.ry = 0; applyTag(s); }
    };
    s.el.addEventListener('pointerup', release);
    s.el.addEventListener('pointercancel', release);
    s.el.addEventListener('pointerleave', () => {
      if (s.drag) return;
      s.hx = s.hy = 0; s.el.classList.remove('is-tilt');
      if (!s.x && !s.y) { s.rx = s.ry = 0; applyTag(s); }
    });
  }
  // resorte: la etiqueta vuelve a su lugar y se balancea según la velocidad
  function stepTags(dt) {
    for (const s of tags) {
      if (s.drag || !s.card) continue;
      if (Math.abs(s.x) < .3 && Math.abs(s.y) < .3 && Math.abs(s.vx) < 2 && Math.abs(s.vy) < 2) {
        if (s.x || s.y) { s.x = s.y = s.vx = s.vy = 0; if (!s.hx && !s.hy) s.rx = s.ry = 0; applyTag(s); }
        continue;
      }
      const k = 140, c = 13;
      s.vx += (-k * s.x - c * s.vx) * dt; s.vy += (-k * s.y - c * s.vy) * dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      s.ry = clamp(s.vx * .025, -38, 38); s.rx = clamp(-s.vy * .025, -38, 38);
      applyTag(s);
    }
  }

  /* ---------- Dibujo ---------- */
  let t0 = performance.now();
  const INTRO = 2400;
  let last = t0, yaw = 0, pitch = 0, hov = 0, spin = 0, sxo = 0, syo = 0;

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
    const dt = Math.min(.05, Math.max(0, now - last) / 1000); last = now;
    const k = reduced ? 1 : easeOut(clamp((now - t0 - 300) / INTRO, 0, 1));

    // la escena gira suave hacia el puntero
    P.nx += (P.tx - P.nx) * .06; P.ny += (P.ty - P.ny) * .06;
    stage.style.setProperty('--px', P.nx.toFixed(3));
    stage.style.setProperty('--py', P.ny.toFixed(3));
    yaw = P.nx * .28 + (reduced ? 0 : Math.sin(t * .17) * .06);
    pitch = -P.ny * .18;

    bx.clearRect(0, 0, W, H);
    fx.clearRect(0, 0, W, H);

    // halo ancho detrás de toda la palabra
    bx.save();
    bx.translate(G.cx, G.cy); bx.scale(G.half * 1.15, .62);
    const haze = bx.createRadialGradient(0, 0, 0, 0, 0, fs);
    haze.addColorStop(0, `rgba(255,255,255,${.08 * k})`);
    haze.addColorStop(1, 'rgba(255,255,255,0)');
    bx.fillStyle = haze; bx.fillRect(-fs, -fs, fs * 2, fs * 2);
    bx.restore();

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

    // ---- polvo flotante
    for (const p of float) {
      const x = p.sx + (p.x + (reduced ? 0 : Math.sin(t * p.sp + p.ph) * p.amp) - p.sx) * k;
      const y = p.sy + (p.y + (reduced ? 0 : Math.cos(t * p.sp * .8 + p.ph) * p.amp) - p.sy) * k;
      const [sx, sy, Z, sc] = proj(x, y, p.z);
      repel(p, sx, sy, R2, F0);
      const ctx = Z > 0 ? bx : fx;
      ctx.globalAlpha = clamp(p.alpha * k * (1.1 - Z * .4), 0, 1);
      const v = Math.round(p.tone * clamp(1.05 - Z * .25, .5, 1.1));
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      dot(ctx, sx + p.ox, sy + p.oy, p.size * sc * sizeK);
    }

    // ---- partículas que se desprenden de las letras
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
      const life = reduced ? .8 : smooth(0, .12, age) * (1 - smooth(.55, 1, age));
      const a = p.alpha * life * k;
      if (a < .02) continue;
      const ctx = Z > 0 ? bx : fx;
      ctx.globalAlpha = clamp(a, 0, 1);
      const v = Math.round(p.tone * clamp(1.05 - Z * .25, .5, 1.1));
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      const s = p.size * sc * sizeK;
      if (p.shard) shard(ctx, sx + p.ox, sy + p.oy, s, p.rot + (reduced ? 0 : t * p.vr));
      else dot(ctx, sx + p.ox, sy + p.oy, s);
    }

    // ---- erosión negra en toda la palabra
    const wd = G.word, keep = .35 + scale * .65;
    for (const p of erode) {
      if (p.keep > keep) continue;
      let sx = G.cx + (p.x + (reduced ? 0 : Math.sin(t * p.sp + p.ph) * .008)) * fs;
      let sy = G.cy + (p.y + (reduced ? 0 : Math.cos(t * p.sp + p.ph) * .006)) * fs;
      repel(p, sx, sy, R2 * .5, F0 * .6);
      sx += p.ox; sy += p.oy;
      if (sx < wd.l || sx > wd.r || sy < wd.t || sy > wd.b) continue;
      fx.globalAlpha = p.alpha * k;
      fx.fillStyle = p.gray ? '#5a5a58' : '#000';
      const s = p.size * sizeK;
      fx.fillRect(sx - s / 2, sy - s / 2, s, s);
    }

    // ---- esfera: crece, gira y se inclina hacia el cursor cuando está encima
    const R0 = G.sr;
    const over = P.on && Math.hypot(P.x - G.sx, P.y - G.sy) < R0 * 1.25;
    hov += ((over ? 1 : 0) - hov) * (reduced ? 1 : .08);
    spin += dt * (.18 + hov * 1.4);
    const tx = over ? clamp((P.x - G.sx) / R0, -1, 1) : 0, ty = over ? clamp((P.y - G.sy) / R0, -1, 1) : 0;
    sxo += (tx * R0 * .12 - sxo) * .08; syo += (ty * R0 * .12 - syo) * .08;
    const R = R0 * (1 + hov * .14 + (reduced ? 0 : Math.sin(t * 1.6) * .006));
    const syaw = (reduced ? .6 : spin) + yaw + tx * .7 * hov, spitch = pitch + .18 - ty * .5 * hov;
    const ox = G.sx + sxo, oy = G.sy + syo;

    // anillo de atrás (lo tapa la esfera)
    const ringA = ((scale > .6 ? .12 : 0) + hov * .7) * k; // con letra chica, solo al tocarla
    const ring = [];
    for (let i = 0; i < N_RING; i++) ring.push(ringPoint(i, reduced ? 0 : t, R, hov, yaw));
    fx.fillStyle = '#e8e7e3';
    for (const [x, y, z] of ring) if (z > 0) { fx.globalAlpha = ringA * .55; fx.fillRect(ox + x - .7, oy + y - .7, 1.4, 1.4); }

    // sombra de contacto, detrás de las letras para no ensuciarlas
    bx.globalAlpha = .55 * k;
    const sh = bx.createRadialGradient(ox, oy + R * .95, 0, ox, oy + R * .95, R * 1.1);
    sh.addColorStop(0, 'rgba(0,0,0,.9)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    bx.fillStyle = sh; bx.fillRect(ox - R * 1.2, oy + R * .4, R * 2.4, R * 1.2);
    // resplandor al pasar el mouse
    if (hov > .02) {
      fx.globalAlpha = hov * .5 * k;
      const gl = fx.createRadialGradient(ox, oy, R * .8, ox, oy, R * 1.6);
      gl.addColorStop(0, 'rgba(255,255,255,.35)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
      fx.fillStyle = gl; fx.fillRect(ox - R * 1.7, oy - R * 1.7, R * 3.4, R * 3.4);
    }
    fx.globalAlpha = 1;
    paintSphere(R, syaw, spitch, k, hov);
    const c = sphereCanvas.width / sdpr / 2;
    fx.drawImage(sphereCanvas, ox - c, oy - c, c * 2, c * 2);

    // anillo de adelante
    fx.fillStyle = '#f4f3ef';
    for (const [x, y, z] of ring) if (z <= 0) { fx.globalAlpha = ringA; const s = 1.2 + hov * .8; fx.fillRect(ox + x - s / 2, oy + y - s / 2, s, s); }

    // partículas que suelta la esfera
    if (!reduced && hov > .4) {
      for (let n = 0; n < 3; n++) {
        const u = rnd() * 2 - 1, a = rnd() * 6.2832, q = Math.sqrt(1 - u * u);
        const nx = q * Math.cos(a), ny = u, nz = q * Math.sin(a);
        if (nz > .2) continue;
        const sp = .8 + rnd() * 1.4;
        burst.push({ x: nx, y: ny, vx: nx * sp, vy: ny * sp - .3, life: 0, dur: .9 + rnd() * .9, s: .8 + rnd() * 2 });
      }
    }
    fx.fillStyle = '#f2f1ed';
    for (let i = burst.length - 1; i >= 0; i--) {
      const b = burst[i];
      b.life += dt; if (b.life > b.dur) { burst.splice(i, 1); continue; }
      b.x += b.vx * dt; b.y += b.vy * dt; b.vy -= .25 * dt;
      fx.globalAlpha = (1 - b.life / b.dur) * .9;
      dot(fx, ox + b.x * R, oy + b.y * R, b.s);
    }

    bx.globalAlpha = fx.globalAlpha = 1;
    stepTags(dt);
  }

  /* ---------- Ciclo ---------- */
  // arranca cuando la página terminó de cargar: mientras tanto la palabra
  // entra con su animación de CSS y el hilo principal queda libre
  let running = false, visible = true, raf = 0, ready = document.readyState === 'complete';
  function loop(now) { draw(now); raf = requestAnimationFrame(loop); }
  function sync() {
    const go = ready && !reduced && visible && !document.hidden;
    if (go && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
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
  if (!ready) addEventListener('load', () => setTimeout(() => { ready = true; t0 = performance.now(); sync(); }, 120), { once: true });
  sync();
  if (reduced) draw(performance.now());
})();

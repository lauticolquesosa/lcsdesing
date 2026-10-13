/* ============================================================
   LCS — brand-hero.js
   Hero de /branding: una esfera de partículas apoyada debajo de la
   «a» y una nube 3D que desarma «and». Todo en dos canvas 2D (sin
   librerías): el de atrás pinta lo que queda detrás de las letras y
   el de adelante la esfera, lo que pasa por delante y la erosión
   negra sobre las letras.

   · La geometría se mide sobre el texto real (la «a», la «d» y la
     línea base), así acompaña a la tipografía en cualquier ancho.
   · Con mouse la escena gira hacia el cursor y las partículas se
     apartan a su paso; en táctil, al arrastrar el dedo.
   · Se detiene fuera de pantalla o con la pestaña oculta. Con
     movimiento reducido se dibuja un solo cuadro quieto.
   ============================================================ */
(function () {
  'use strict';

  const stage = document.querySelector('[data-bhero]');
  if (!stage) return;
  const back = stage.querySelector('.bhero__fx--back');
  const front = stage.querySelector('.bhero__fx--front');
  const word = stage.querySelector('.bhero__word');
  const aEl = stage.querySelector('.bhero__a');
  const dEl = stage.querySelector('.bhero__d');
  const baseEl = stage.querySelector('.bhero__base');
  if (!back || !front || !word || !aEl || !dEl || !baseEl || !back.getContext) return;

  const bx = back.getContext('2d');
  const fx = front.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Azar con semilla: la composición es siempre la misma ---------- */
  let seed = 20261012;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const gauss = () => { let u = 0; for (let i = 0; i < 4; i++) u += rnd(); return (u - 2) / 2; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = t => 1 - Math.pow(1 - t, 4);

  /* ---------- Partículas (en unidades del tamaño de letra) ---------- */
  const small = innerWidth < 700;
  const N_CLOUD = small ? 750 : 1700;
  const N_EROSION = small ? 420 : 950;

  // Nube: un elipsoide denso en el centro que se abre hacia arriba, con
  // esquirlas (triángulos) y polvo. Cada una tiene su deriva propia.
  const cloud = [];
  for (let i = 0; i < N_CLOUD; i++) {
    const k = rnd();
    cloud.push({
      x: gauss() * .78, y: gauss() * .62 - Math.abs(gauss()) * .18, z: gauss() * .7,
      size: k < .18 ? 2.4 + rnd() * 4.8 : .8 + rnd() * 1.9,
      shard: k < .18,
      tone: 165 + Math.floor(rnd() * 90),
      alpha: .45 + rnd() * .55,
      ph: rnd() * Math.PI * 2, sp: .25 + rnd() * .6, amp: .015 + rnd() * .05,
      rot: rnd() * Math.PI * 2, vr: (rnd() - .5) * 1.4,
      sx: (rnd() - .5) * 6, sy: (rnd() - .5) * 4, sz: (rnd() - .5) * 3, // posición de partida (entrada)
      ox: 0, oy: 0, // desvío por el puntero
      keep: rnd(),
    });
  }

  // Erosión: motas negras sobre las letras, concentradas en «and».
  const erosion = [];
  for (let i = 0; i < N_EROSION; i++) {
    erosion.push({
      x: gauss() * .58, y: gauss() * .3 - .02,
      size: 1 + rnd() * 3.2, alpha: .55 + rnd() * .45, gray: rnd() < .25,
      ph: rnd() * Math.PI * 2, sp: .2 + rnd() * .4,
      ox: 0, oy: 0, keep: rnd(),
    });
  }

  /* ---------- Medidas ---------- */
  let W = 0, H = 0, dpr = 1, sdpr = 1, fs = 100, scale = 1;
  const G = { sx: 0, sy: 0, sr: 0, cx: 0, cy: 0, ex: 0, ey: 0, word: null };
  let sphereCanvas = null, sctx = null;

  function layout() {
    const r = stage.getBoundingClientRect();
    if (!r.width) return;
    W = r.width; H = r.height;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    for (const c of [back, front]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    bx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fx.setTransform(dpr, 0, 0, dpr, 0, 0);

    fs = parseFloat(getComputedStyle(word).fontSize) || 100;
    // con letra chica (celular) las partículas se achican y se ralean
    scale = clamp(fs / 260, .42, 1.15);
    const a = aEl.getBoundingClientRect(), d = dEl.getBoundingClientRect();
    const base = baseEl.getBoundingClientRect().top - r.top;
    const w = word.getBoundingClientRect();
    G.word = { l: w.left - r.left, r: w.right - r.left, t: base - fs * .74, b: base + fs * .2 };
    // la esfera, apoyada debajo de la «a» y un poco por debajo de la línea base
    G.sr = fs * .26;
    G.sx = a.left - r.left + a.width * .5;
    G.sy = base + fs * .1;
    // la nube, sobre «and», arrancando desde la esfera hacia arriba
    G.cx = (a.left + d.right) / 2 - r.left + fs * .04;
    G.cy = base - fs * .36;
    // la erosión, sobre el ojo de las letras
    G.ex = G.cx; G.ey = base - fs * .3;

    // la esfera se pinta aparte y se funde abajo, como en la imagen
    // la esfera se calcula píxel por píxel: con 1.25x alcanza para que se vea nítida
    sdpr = Math.min(dpr, 1.25);
    const size = Math.ceil(G.sr * 2.6 * sdpr);
    sphereCanvas = sphereCanvas || document.createElement('canvas');
    sphereCanvas.width = sphereCanvas.height = size;
    sctx = sphereCanvas.getContext('2d');
    sctx.setTransform(sdpr, 0, 0, sdpr, 0, 0);
    if (!running) draw(performance.now());
  }

  /* ---------- Puntero ---------- */
  const P = { x: -1e4, y: -1e4, nx: 0, ny: 0, tx: 0, ty: 0, on: false };
  function point(e) {
    const r = stage.getBoundingClientRect();
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
  const t0 = performance.now();
  const INTRO = 2400;

  /* La esfera se pinta píxel por píxel: para cada punto del disco se
     reconstruye la normal, se la gira con la escena y se lee un relieve
     de manchas (suma de ondas en 3D) que da el aspecto de luna. La luz
     viene de arriba a la izquierda y un poco desde adelante. */
  const L = (() => { const l = [-.5, -.62, -.6]; const n = Math.hypot(...l); return l.map(v => v / n); })();
  function relief(x, y, z) {
    // deformación suave del espacio antes de leer las ondas: bordes orgánicos
    const wx = x + .35 * Math.sin(2.3 * y + 1.3) + .2 * Math.sin(4.1 * z + .4);
    const wy = y + .35 * Math.sin(2.1 * z + .7) + .2 * Math.sin(3.7 * x + 2.2);
    const wz = z + .35 * Math.sin(2.5 * x + 2.9) + .2 * Math.sin(4.3 * y + 1.6);
    return Math.sin(3.1 * wx + 1.7) * Math.sin(2.7 * wy + .3) * Math.sin(3.3 * wz + 2.1)
      + .45 * Math.sin(5.3 * wx + 1.7) * Math.sin(4.9 * wz + 1.1) * Math.sin(5.7 * wy + .4)
      + .2 * Math.sin(9.1 * wx + 2.2) * Math.sin(8.3 * wy + .9) * Math.sin(9.7 * wz + 1.5);
  }
  let img = null;
  function drawSphere(t, yaw, pitch, k) {
    const R = G.sr, c = R * 1.3;
    const size = sphereCanvas.width, Rp = R * sdpr, cp = size / 2;
    if (!img || img.width !== size) img = sctx.createImageData(size, size);
    const d = img.data;
    d.fill(0);
    // giro inverso: de la pantalla a la superficie de la esfera
    const cy = Math.cos(-yaw), sy = Math.sin(-yaw), cpi = Math.cos(-pitch), spi = Math.sin(-pitch);
    const x0 = Math.max(0, Math.floor(cp - Rp - 1)), x1 = Math.min(size, Math.ceil(cp + Rp + 1));
    for (let j = x0; j < x1; j++) {
      const v = (j + .5 - cp) / Rp;
      for (let i = x0; i < x1; i++) {
        const u = (i + .5 - cp) / Rp;
        const d2 = u * u + v * v;
        if (d2 >= 1) continue;
        const w = -Math.sqrt(1 - d2);
        // normal en pantalla -> coordenadas de la superficie
        const ty = v * cpi - w * spi, tz = v * spi + w * cpi;
        const sx = u * cy - tz * sy, sz = u * sy + tz * cy;
        const n = relief(sx * 1.9, ty * 1.9, sz * 1.9);
        const h = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453, grain = h - Math.floor(h) - .5;
        const blot = clamp((n + .2 + grain * .3) / .1, 0, 1); // manchas de borde granulado
        const lam = clamp(u * L[0] + v * L[1] + w * L[2], 0, 1);
        let val = (.08 + blot * .9) * (lam * .6 + .42) + grain * .1;
        val += Math.pow(1 - Math.sqrt(1 - d2), 4) * .08;       // borde apenas encendido
        const g = clamp(val, 0, 1) * 248 | 0;
        const o = (j * size + i) * 4;
        d[o] = d[o + 1] = d[o + 2] = g;
        d[o + 3] = clamp((1 - Math.sqrt(d2)) * Rp * 1.5, 0, 1) * 255 * k | 0;
      }
    }
    sctx.putImageData(img, 0, 0);

    // se funde hacia abajo, en el polvo
    sctx.globalCompositeOperation = 'destination-out';
    const fade = sctx.createLinearGradient(0, c + R * .05, 0, c + R * .95);
    fade.addColorStop(0, 'rgba(0,0,0,0)');
    fade.addColorStop(1, 'rgba(0,0,0,.92)');
    sctx.fillStyle = fade;
    sctx.fillRect(0, c, c * 2, c);
    sctx.globalCompositeOperation = 'source-over';

    fx.drawImage(sphereCanvas, G.sx - c, G.sy - c, c * 2, c * 2);
  }

  function shard(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * .85, s * .6); ctx.lineTo(-s * .7, s * .45); ctx.closePath();
    ctx.fill(); ctx.restore();
  }

  let yaw = 0, pitch = 0;
  function draw(now) {
    const t = (now - t0) / 1000;
    const k = reduced ? 1 : ease(clamp((now - t0 - 300) / INTRO, 0, 1));

    // la escena gira suave hacia el puntero
    P.nx += (P.tx - P.nx) * .06;
    P.ny += (P.ty - P.ny) * .06;
    stage.style.setProperty('--px', P.nx.toFixed(3));
    stage.style.setProperty('--py', P.ny.toFixed(3));
    yaw = P.nx * .55 + (reduced ? 0 : Math.sin(t * .17) * .12);
    pitch = -P.ny * .3;

    bx.clearRect(0, 0, W, H);
    fx.clearRect(0, 0, W, H);

    // ---- esfera (adelante de las letras)
    drawSphere(t, (reduced ? .6 : t * .18) + yaw, pitch + .18, k);

    // ---- halo detrás de la nube
    const haze = bx.createRadialGradient(G.cx, G.cy, 0, G.cx, G.cy, fs * .95);
    haze.addColorStop(0, `rgba(255,255,255,${.09 * k})`);
    haze.addColorStop(1, 'rgba(255,255,255,0)');
    bx.fillStyle = haze;
    bx.fillRect(G.cx - fs, G.cy - fs, fs * 2, fs * 2);

    // ---- nube 3D
    const cyw = Math.cos(yaw * .8), syw = Math.sin(yaw * .8), cpt = Math.cos(pitch), spt = Math.sin(pitch);
    const cam = 3.4, R2 = (fs * .55) ** 2;
    for (const p of cloud) {
      if (p.keep > .35 + scale * .65) continue;
      const dx = reduced ? 0 : Math.sin(t * p.sp + p.ph) * p.amp;
      const dy = reduced ? 0 : Math.cos(t * p.sp * .8 + p.ph) * p.amp - t * 0;
      let x = p.x + dx, y = p.y + dy, z = p.z;
      // entrada: llegan desde afuera y se acomodan
      x = p.sx + (x - p.sx) * k; y = p.sy + (y - p.sy) * k; z = p.sz + (z - p.sz) * k;
      let X = x * cyw - z * syw, Z = x * syw + z * cyw;
      const Y = y * cpt - Z * spt; Z = y * spt + Z * cpt;
      const sc = cam / (cam + Z);
      let sx = G.cx + X * fs * sc, sy = G.cy + Y * fs * sc;

      // el puntero las aparta y después vuelven a su lugar
      if (P.on) {
        const ddx = sx + p.ox - P.x, ddy = sy + p.oy - P.y, d2 = ddx * ddx + ddy * ddy;
        if (d2 < R2 && d2 > 1) {
          const f = (1 - d2 / R2) * fs * .06, d = Math.sqrt(d2);
          p.ox += ddx / d * f; p.oy += ddy / d * f;
        }
      }
      p.ox *= .92; p.oy *= .92;
      sx += p.ox; sy += p.oy;

      const ctx = Z > 0 ? bx : fx;
      const a = p.alpha * k * clamp(1.15 - Z * .45, .25, 1);
      const v = Math.round(p.tone * clamp(1.05 - Z * .25, .5, 1.1));
      ctx.globalAlpha = clamp(a, 0, 1);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      const s = p.size * sc * (.55 + scale * .45);
      if (p.shard) shard(ctx, sx, sy, s, p.rot + (reduced ? 0 : t * p.vr));
      else if (s < 1.7) ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
      else { ctx.beginPath(); ctx.arc(sx, sy, s / 2, 0, 6.2832); ctx.fill(); }
    }

    // ---- erosión negra sobre «and» (solo adentro del renglón)
    const wd = G.word;
    for (const p of erosion) {
      if (p.keep > scale) continue;
      let sx = G.ex + (p.x + (reduced ? 0 : Math.sin(t * p.sp + p.ph) * .012)) * fs;
      let sy = G.ey + (p.y + (reduced ? 0 : Math.cos(t * p.sp + p.ph) * .01)) * fs;
      if (P.on) {
        const ddx = sx + p.ox - P.x, ddy = sy + p.oy - P.y, d2 = ddx * ddx + ddy * ddy;
        if (d2 < R2 * .5 && d2 > 1) {
          const f = (1 - d2 / (R2 * .5)) * fs * .035, d = Math.sqrt(d2);
          p.ox += ddx / d * f; p.oy += ddy / d * f;
        }
      }
      p.ox *= .9; p.oy *= .9;
      sx += p.ox; sy += p.oy;
      if (sx < wd.l || sx > wd.r || sy < wd.t || sy > wd.b) continue;
      fx.globalAlpha = p.alpha * k;
      fx.fillStyle = p.gray ? '#5a5a58' : '#000';
      const s = p.size * (.5 + scale * .5);
      fx.fillRect(sx - s / 2, sy - s / 2, s, s);
    }
    bx.globalAlpha = fx.globalAlpha = 1;
  }

  /* ---------- Ciclo ---------- */
  let running = false, visible = true, raf = 0;
  function loop(now) { draw(now); raf = requestAnimationFrame(loop); }
  function sync() {
    const go = !reduced && visible && !document.hidden;
    if (go && !running) { running = true; raf = requestAnimationFrame(loop); }
    else if (!go && running) { running = false; cancelAnimationFrame(raf); }
  }

  layout();
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(stage);
  else addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(stage);
  }
  document.addEventListener('visibilitychange', sync);
  sync();
  if (reduced) draw(performance.now());
})();

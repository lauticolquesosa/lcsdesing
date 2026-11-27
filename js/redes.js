/* ============================================================
   LCS — redes.js
   Casos de Redes sociales. Lee los datos que escribe redes.cjs en
   <template id="rcase-data"> y le da vida a la página:
   · el perfil del celular (pestañas, Seguir, scroll de la grilla);
   · el visor de publicaciones (carrusel, video, me gusta, flechas);
   · el visor de historias (barras, toque, mantener para pausar);
   · los carruseles (pestañas, arrastre, progreso);
   · los videos que se reproducen al entrar en pantalla;
   · la inclinación de las placas sueltas.
   ============================================================ */
(() => {
  'use strict';
  const tpl = document.getElementById('rcase-data');
  if (!tpl) return;
  const D = JSON.parse(tpl.content.textContent);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pad = n => String(n).padStart(2, '0');
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const avatar = D.dir + 'avatar.webp';

  const SVG = {
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.9 3.7 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 3.4 0 5.5 3.4 4.3 6.7-1.7 4.7-9.2 9.3-9.2 9.3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    comment: '<svg viewBox="0 0 24 24"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.4-4.4a8.5 8.5 0 1 1 15.6-4.6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    save: '<svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    bigHeart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.9 3.7 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 3.4 0 5.5 3.4 4.3 6.7-1.7 4.7-9.2 9.3-9.2 9.3z" fill="currentColor"/></svg>',
    muted: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="m16 9 5 6m0-6-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" fill="currentColor"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>',
  };

  // ---------------------------------------------------------- diálogos
  let locks = 0;
  const lock = on => { locks += on ? 1 : -1; document.documentElement.classList.toggle('rc-lock', locks > 0); };
  function makeDialog(cls, label) {
    const d = el('dialog', cls);
    d.setAttribute('aria-label', label);
    document.body.appendChild(d);
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
    return d;
  }
  // abre un diálogo recordando el foco para devolverlo al cerrar
  function openDialog(d) {
    const back = document.activeElement;
    d.addEventListener('close', () => { lock(false); back && back.focus && back.focus({ preventScroll: true }); }, { once: true });
    lock(true);
    d.showModal();
  }

  // ---------------------------------------------------------- perfil
  $$('.ig__tabs [role="tab"]').forEach(tab => tab.addEventListener('click', () => {
    $$('.ig__tabs [role="tab"]').forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }));
  $$('[data-follow]').forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', on);
    b.textContent = on ? 'Siguiendo' : 'Seguir';
  }));
  // el celular acompaña el scroll apenas (parallax suave)
  const phone = $('.phone');
  if (phone && !reduce && fine) {
    let raf = 0;
    const move = () => {
      raf = 0;
      const r = phone.parentElement.getBoundingClientRect();
      const p = (innerHeight / 2 - (r.top + r.height / 2)) / innerHeight;
      phone.style.setProperty('--ph-y', `${Math.max(-1, Math.min(1, p)) * -28}px`);
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(move); }, { passive: true });
    move();
  }

  // ---------------------------------------------------------- visor de publicaciones
  // Orden de navegación = el de la grilla (lo más nuevo primero)
  const order = Object.keys(D.posts).reverse();
  let rv, rvState = null;

  function openPost(id, slide = 0) {
    if (!rv) {
      rv = makeDialog('rv', 'Publicación');
      rv.addEventListener('close', () => { $$('video', rv).forEach(v => v.pause()); rvState = null; });
      rv.addEventListener('keydown', e => {
        if (!rvState) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); rvState.n > 1 && rvState.i < rvState.n - 1 ? goSlide(rvState.i + 1) : stepPost(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); rvState.n > 1 && rvState.i > 0 ? goSlide(rvState.i - 1) : stepPost(-1); }
      });
    }
    const p = D.posts[id];
    const idx = order.indexOf(id);
    const isVid = p.k === 'video';
    const n = isVid ? 1 : p.s.length;
    const caption = p.c.split(/\n\n+/).map((par, i) => `<p>${i === 0 ? `<b>${esc(D.user)}</b>` : ''}${esc(par).replace(/\n/g, '<br>')}</p>`).join('');
    const kind = isVid ? (p.r === '9/16' ? 'Reel' : 'Video') : n > 1 ? `Carrusel de ${n} placas` : 'Publicación';
    rv.innerHTML = `
      <button class="vx" type="button" aria-label="Cerrar"></button>
      <div class="rv__box">
        <button class="va va--prev" type="button" aria-label="Publicación anterior"${idx > 0 ? '' : ' hidden'}></button>
        <article class="rv__card${isVid ? ' rv__card--v' : ''}">
          <div class="rv__media">
            <div class="rv__track">${isVid
              ? `<video src="${D.dir}${id}.mp4" poster="${D.dir}${id}-poster.webp" playsinline loop muted autoplay></video>`
              : p.s.map((alt, j) => `<img src="${D.dir}${id}-${j + 1}.webp" alt="${esc(alt)}" width="864" height="1080" decoding="async"${j > 1 ? ' loading="lazy"' : ''}>`).join('')}</div>
            ${n > 1 ? `<button class="va va--prev" type="button" aria-label="Placa anterior"></button><button class="va va--next" type="button" aria-label="Placa siguiente"></button><div class="rv__dots" aria-hidden="true">${'<i></i>'.repeat(n)}</div><span class="rv__count" aria-live="polite"></span>` : ''}
            ${isVid && D.audio ? `<button class="rv__snd" type="button" aria-label="Activar sonido" aria-pressed="false">${SVG.muted}</button>` : ''}
            <span class="rv__heart" aria-hidden="true">${SVG.bigHeart}</span>
          </div>
          <div class="rv__side">
            <header class="rv__hd"><img src="${avatar}" alt="" width="32" height="32">${esc(D.user)}</header>
            <div class="rv__cap"><img src="${avatar}" alt="" width="32" height="32"><div>${caption}<span class="rv__meta">${kind} · ${esc(p.t)}</span></div></div>
            <footer class="rv__ft">
              <div class="rv__acts">
                <button class="rv__like" type="button" aria-label="Me gusta" aria-pressed="false">${SVG.heart}</button>
                <button type="button" aria-label="Comentar" tabindex="-1">${SVG.comment}</button>
                <button type="button" aria-label="Compartir" tabindex="-1">${SVG.send}</button>
                <button class="rv__save" type="button" aria-label="Guardar" aria-pressed="false">${SVG.save}</button>
              </div>
              <p class="rv__pos">${pad(idx + 1)} de ${pad(order.length)} en la grilla</p>
            </footer>
          </div>
        </article>
        <button class="va va--next" type="button" aria-label="Publicación siguiente"${idx < order.length - 1 ? '' : ' hidden'}></button>
      </div>`;
    const card = $('.rv__card', rv);
    card.style.setProperty('--ratio', isVid ? p.r.replace('/', ' / ') : '4 / 5');
    $('.rv__media', rv).style.setProperty('--ratio', isVid ? p.r.replace('/', ' / ') : '4 / 5');
    rvState = { id, i: 0, n };

    $('.vx', rv).addEventListener('click', () => rv.close());
    const outer = $$('.rv__box > .va', rv);
    outer[0].addEventListener('click', () => stepPost(-1));
    outer[1].addEventListener('click', () => stepPost(1));
    if (n > 1) {
      $('.rv__media .va--prev', rv).addEventListener('click', () => goSlide(rvState.i - 1));
      $('.rv__media .va--next', rv).addEventListener('click', () => goSlide(rvState.i + 1));
    }
    const like = $('.rv__like', rv), save = $('.rv__save', rv);
    const toggle = b => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true');
    like.addEventListener('click', () => toggle(like));
    save.addEventListener('click', () => toggle(save));
    const media = $('.rv__media', rv);
    media.addEventListener('dblclick', () => {
      like.setAttribute('aria-pressed', 'true');
      const h = $('.rv__heart', rv); h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop');
    });
    const snd = $('.rv__snd', rv);
    if (snd) snd.addEventListener('click', () => {
      const v = $('video', rv); v.muted = !v.muted;
      snd.setAttribute('aria-pressed', !v.muted); snd.setAttribute('aria-label', v.muted ? 'Activar sonido' : 'Silenciar');
      snd.innerHTML = v.muted ? SVG.muted : SVG.sound;
    });
    if (isVid) {
      const v = $('video', rv);
      media.addEventListener('click', e => { if (e.target.closest('button')) return; v.paused ? v.play() : v.pause(); });
      if (reduce) v.removeAttribute('autoplay');
    }
    swipe(media, dir => { if (n > 1) goSlide(rvState.i + dir); else stepPost(dir); });
    goSlide(Math.min(slide, n - 1), true);
    if (!rv.open) openDialog(rv);
    (n > 1 ? $('.rv__media .va--next', rv) : $('.vx', rv)).focus({ preventScroll: true });
  }
  function goSlide(i, instant) {
    if (!rvState) return;
    const { n } = rvState;
    i = Math.max(0, Math.min(n - 1, i));
    rvState.i = i;
    const tr = $('.rv__track', rv);
    if (instant) { tr.style.transition = 'none'; requestAnimationFrame(() => { tr.style.transition = ''; }); }
    tr.style.transform = `translateX(${-i * 100}%)`;
    if (n > 1) {
      $$('.rv__dots i', rv).forEach((d, j) => d.classList.toggle('on', j === i));
      $('.rv__count', rv).textContent = `${i + 1}/${n}`;
      $('.rv__media .va--prev', rv).hidden = i === 0;
      $('.rv__media .va--next', rv).hidden = i === n - 1;
    }
  }
  function stepPost(dir) {
    if (!rvState) return;
    const j = order.indexOf(rvState.id) + dir;
    if (j >= 0 && j < order.length) openPost(order[j], dir < 0 && D.posts[order[j]].s.length > 1 ? D.posts[order[j]].s.length - 1 : 0);
  }

  // arrastre horizontal con el dedo (o el mouse) para pasar
  function swipe(node, cb) {
    let x0 = null, y0 = 0, t0 = 0;
    node.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button) return; x0 = e.clientX; y0 = e.clientY; t0 = Date.now(); });
    node.addEventListener('pointerup', e => {
      if (x0 == null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - t0 < 800) cb(dx < 0 ? 1 : -1);
    });
    node.addEventListener('pointercancel', () => { x0 = null; });
  }

  // ---------------------------------------------------------- visor de historias
  const storyById = Object.fromEntries(D.stories.map(([id, t, v]) => [id, { id, t, v }]));
  const hlOrder = Object.keys(D.highlights).filter(k => k !== 'todas');
  let sv, S = null;
  const IMG_MS = 5200;

  function openStories(hl, start = 0) {
    if (!sv) {
      sv = makeDialog('sv', 'Historias');
      sv.addEventListener('close', () => { if (S) { cancelAnimationFrame(S.raf); S = null; } sv.innerHTML = ''; });
      sv.addEventListener('keydown', e => {
        if (!S) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        if (e.key === ' ') { e.preventDefault(); togglePause(); }
      });
    }
    const [name, items] = D.highlights[hl];
    if (S) cancelAnimationFrame(S.raf);
    S = { hl, name, items, i: start, t0: 0, el: 0, paused: false, raf: 0, muted: true };
    $$(`[data-hl="${hl}"]`).forEach(b => b.classList.add('is-seen'));
    const cover = hl === 'todas' ? avatar : `${D.dir}hl-${hl}.webp`;
    const pos = hlOrder.indexOf(hl);
    sv.innerHTML = `
      <div class="sv__stage">
        <button class="va va--prev" type="button" aria-label="Historia anterior"></button>
        <div class="sv__frame is-in">
          <div class="sv__media"></div>
          <div class="sv__bars" aria-hidden="true">${items.map(() => '<span><i></i></span>').join('')}</div>
          <div class="sv__hd"><img src="${cover}" alt="" width="32" height="32"><span>${esc(D.user)} <small>· ${esc(name)}</small></span></div>
          <div class="sv__tools">
            ${D.audio ? `<button class="sv__snd" type="button" aria-label="Activar sonido" hidden>${SVG.muted}</button>` : ''}
            <button class="sv__pp" type="button" aria-label="Pausar">${SVG.pause}</button>
          </div>
          <button class="vx" type="button" aria-label="Cerrar"></button>
          <button class="sv__tap sv__tap--prev" type="button" aria-label="Anterior" tabindex="-1"></button>
          <button class="sv__tap sv__tap--next" type="button" aria-label="Siguiente" tabindex="-1"></button>
          <p class="sv__label" aria-live="polite"></p>
        </div>
        <button class="va va--next" type="button" aria-label="Historia siguiente"></button>
      </div>`;
    $('.vx', sv).addEventListener('click', () => sv.close());
    $('.sv__stage > .va--prev', sv).addEventListener('click', prev);
    $('.sv__stage > .va--next', sv).addEventListener('click', next);
    $('.sv__pp', sv).addEventListener('click', togglePause);
    const snd = $('.sv__snd', sv);
    if (snd) snd.addEventListener('click', () => {
      S.muted = !S.muted;
      const v = $('.sv__media video', sv); if (v) v.muted = S.muted;
      snd.innerHTML = S.muted ? SVG.muted : SVG.sound;
      snd.setAttribute('aria-label', S.muted ? 'Activar sonido' : 'Silenciar');
    });
    // tocar: costados pasan; mantener apretado pausa (como en Instagram)
    const frame = $('.sv__frame', sv);
    let holdT = 0, held = false, sx = 0, sy = 0;
    frame.addEventListener('pointerdown', e => {
      if (e.target.closest('.sv__tools, .vx')) return;
      sx = e.clientX; sy = e.clientY; held = false;
      holdT = setTimeout(() => { held = true; setPaused(true, true); }, 220);
    });
    const release = e => {
      clearTimeout(holdT);
      if (held) { held = false; setPaused(false, true); e && e.preventDefault(); return; }
      if (!e || e.target.closest('.sv__tools, .vx')) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (dy > 90 && Math.abs(dy) > Math.abs(dx)) { sv.close(); return; }
      if (Math.abs(dx) > 50) { dx < 0 ? nextHl(1) : nextHl(-1); return; }
      if (e.target.classList.contains('sv__tap--prev')) prev(); else if (e.target.classList.contains('sv__tap--next')) next();
    };
    frame.addEventListener('pointerup', release);
    frame.addEventListener('pointercancel', () => { clearTimeout(holdT); if (held) { held = false; setPaused(false, true); } });
    frame.addEventListener('contextmenu', e => e.preventDefault());
    $('.sv__stage > .va--prev', sv).hidden = start === 0 && pos <= 0;
    show(start);
    if (!sv.open) openDialog(sv);
    $('.sv__pp', sv).focus({ preventScroll: true });
  }

  function show(i) {
    const st = storyById[S.items[i]];
    S.i = i; S.el = 0; S.t0 = performance.now();
    const media = $('.sv__media', sv);
    media.innerHTML = st.v
      ? `<video src="${D.dir}${st.id}.mp4" poster="${D.dir}${st.id}-poster.webp" playsinline${S.muted ? ' muted' : ''}></video>`
      : `<img src="${D.dir}${st.id}.webp" alt="${esc(st.t)}" width="608" height="1080">`;
    $('.sv__label', sv).textContent = '';
    const snd = $('.sv__snd', sv); if (snd) snd.hidden = !st.v;
    $$('.sv__bars i', sv).forEach((b, j) => { b.style.transform = `scaleX(${j < i ? 1 : 0})`; });
    // precarga la que sigue
    const nx = storyById[S.items[i + 1]];
    if (nx && !nx.v) { const im = new Image(); im.src = `${D.dir}${nx.id}.webp`; }
    const v = $('video', media);
    if (v) { v.play().catch(() => { v.muted = true; S.muted = true; v.play().catch(() => {}); }); }
    const pos = hlOrder.indexOf(S.hl);
    $('.sv__stage > .va--prev', sv).hidden = i === 0 && pos <= 0;
    cancelAnimationFrame(S.raf);
    tick();
  }
  function tick() {
    if (!S) return;
    const bar = $$('.sv__bars i', sv)[S.i];
    const v = $('.sv__media video', sv);
    let p;
    if (v) p = v.duration ? v.currentTime / v.duration : 0;
    else { if (!S.paused) S.el = performance.now() - S.t0; p = S.el / IMG_MS; }
    bar.style.transform = `scaleX(${Math.min(1, p)})`;
    if (p >= 1 || (v && v.ended)) { next(); return; }
    S.raf = requestAnimationFrame(tick);
  }
  function setPaused(on, hold) {
    if (!S) return;
    S.paused = on;
    if (!on) S.t0 = performance.now() - S.el;
    const v = $('.sv__media video', sv); if (v) on ? v.pause() : v.play().catch(() => {});
    if (!hold) { const pp = $('.sv__pp', sv); pp.innerHTML = on ? SVG.play : SVG.pause; pp.setAttribute('aria-label', on ? 'Reanudar' : 'Pausar'); }
  }
  function togglePause() { setPaused(!S.paused); }
  function next() { if (!S) return; if (S.i < S.items.length - 1) show(S.i + 1); else nextHl(1); }
  function prev() { if (!S) return; if (S.i > 0) show(S.i - 1); else nextHl(-1); }
  // al terminar una destacada pasa a la siguiente, como en Instagram
  function nextHl(dir) {
    const pos = hlOrder.indexOf(S.hl);
    const to = hlOrder[pos + dir];
    if (pos < 0 || !to) { if (dir > 0) sv.close(); else show(0); return; }
    openStories(to, dir < 0 ? D.highlights[to][1].length - 1 : 0);
  }

  // ---------------------------------------------------------- clics en toda la página
  document.addEventListener('click', e => {
    const post = e.target.closest('[data-post]');
    if (post) { e.preventDefault(); openPost(post.dataset.post); return; }
    const hl = e.target.closest('[data-hl]');
    if (hl) { e.preventDefault(); openStories(hl.dataset.hl); return; }
    const st = e.target.closest('[data-story-id]');
    if (st) {
      if (st.closest('.st__rail.was-drag')) return;
      e.preventDefault();
      openStories('todas', D.highlights.todas[1].indexOf(st.dataset.storyId));
    }
  });

  // ---------------------------------------------------------- arrastrar con el mouse
  function dragScroll(node) {
    if (!fine) return;
    let x0 = 0, s0 = 0, down = false, moved = false;
    node.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button) return; down = true; moved = false; x0 = e.clientX; s0 = node.scrollLeft; });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 6) { moved = true; node.classList.add('is-drag'); }
      if (moved) node.scrollLeft = s0 - dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return; down = false;
      if (moved) {
        node.classList.remove('is-drag'); node.classList.add('was-drag');
        setTimeout(() => node.classList.remove('was-drag'), 50);
        // vuelve a encajar en la placa más cercana
        const kids = [...node.children], o = kids[0].offsetLeft;
        const dist = k => Math.abs(k.offsetLeft - o - node.scrollLeft);
        const near = kids.reduce((a, k) => dist(k) < dist(a) ? k : a, kids[0]);
        node.scrollTo({ left: near.offsetLeft - o, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  }

  // ---------------------------------------------------------- carruseles
  const car = $('[data-car]');
  if (car) {
    const tabs = $$('[data-car-tab]', car);
    const tracks = $$('[data-car-track]', car);
    const bar = $('[data-car-bar]', car), count = $('[data-car-count]', car);
    const [bPrev, bNext] = $$('[data-car-step]', car);
    let cur = tracks[0];
    const step = () => { const s = cur.children; return s.length > 1 ? s[1].offsetLeft - s[0].offsetLeft : cur.clientWidth; };
    const update = () => {
      const max = cur.scrollWidth - cur.clientWidth;
      const n = cur.children.length;
      const i = Math.min(n - 1, Math.round(cur.scrollLeft / step()));
      const p = max > 0 ? cur.scrollLeft / max : 1;
      bar.style.transform = `scaleX(${Math.max(1 / n, p)})`;
      count.textContent = `${pad(i + 1)} / ${pad(n)}`;
      bPrev.disabled = cur.scrollLeft <= 2;
      bNext.disabled = cur.scrollLeft >= max - 2;
    };
    tracks.forEach(t => { t.addEventListener('scroll', update, { passive: true }); dragScroll(t); });
    bPrev.addEventListener('click', () => cur.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    bNext.addEventListener('click', () => cur.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
    const select = (tab, focus) => {
      tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
      tracks.forEach(t => { t.hidden = t.id !== tab.getAttribute('aria-controls'); });
      cur = document.getElementById(tab.getAttribute('aria-controls'));
      cur.scrollLeft = 0;
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      update();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
      });
    });
    // abrir una placa del carrusel en el visor
    tracks.forEach(t => t.addEventListener('click', e => {
      const fig = e.target.closest('.car__slide');
      if (!fig || t.classList.contains('was-drag')) return;
      openPost(t.id.replace('car-', ''), [...t.children].indexOf(fig));
    }));
    $$('.car__slide img', car).forEach(i => { i.style.cursor = 'zoom-in'; });
    addEventListener('resize', update);
    update();
  }

  // ---------------------------------------------------------- historias: riel
  const rail = $('[data-rail]');
  if (rail) dragScroll(rail);

  // ---------------------------------------------------------- videos que se mueven solos al verse
  const vids = $$('.rl__frame video');
  if (vids.length && 'IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.src) { v.src = v.dataset.src; v.preload = 'auto'; }
        v.play().catch(() => {});
      } else v.pause();
    }), { threshold: 0.35 });
    vids.forEach(v => io.observe(v));
  }

  // ---------------------------------------------------------- placas: inclinación
  if (fine && !reduce) $$('[data-tilt]').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      b.classList.add('is-tilt');
      b.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(20px)`;
    });
    b.addEventListener('pointerleave', () => { b.classList.remove('is-tilt'); b.style.transform = ''; });
  });
})();

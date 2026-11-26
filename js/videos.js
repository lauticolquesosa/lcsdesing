/* ============================================================
   LCS — videos.js
   Muestrario de Edición de video. Sin dependencias.
   · Mazo (inicio del camino): tarjetas apiladas; la de arriba
     reproduce su vista previa muda y, al terminar, pasa a la
     siguiente. Flechas, teclado, deslizar con el dedo y filtros
     por tipo de video.
   · Grilla (Proyectos): cada tarjeta reproduce su vista previa al
     pasar el mouse, o al quedar en pantalla en celulares.
   · Reproductor: el video completo con sonido, en su formato
     original (16:9 o 9:16), con anterior/siguiente y, si la pieza
     tiene más de un formato, el selector entre ellos.
   Todas las vistas previas son 4:5: el video entra completo y el
   resto del marco lo llena una versión desenfocada del mismo.
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lang = () => (window.__lcsLang === 'en' ? 'en' : 'es');
  const T = {
    es: { watch: 'Ver con sonido', close: 'Cerrar', prev: 'Video anterior', next: 'Video siguiente', player: 'Reproductor de video', fmt: 'Formato' },
    en: { watch: 'Watch with sound', close: 'Close', prev: 'Previous video', next: 'Next video', player: 'Video player', fmt: 'Format' },
  };
  const t = k => T[lang()][k];

  // lo que describe a cada video sale de los data-* que escribe videos.cjs
  const info = el => ({
    id: el.dataset.id, t: el.dataset.t, a: el.dataset.a,
    k: el.dataset['k' + (lang() === 'en' ? 'En' : 'Es')],
    d: el.dataset['d' + (lang() === 'en' ? 'En' : 'Es')],
    f: JSON.parse(el.dataset.f), prev: el.dataset.prev,
  });

  function previewVideo(el, loop) {
    const img = $('img', el);
    const v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = loop; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    if (img) v.poster = img.currentSrc || img.src;
    v.src = el.dataset.prev;
    return v;
  }
  const play = v => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };

  /* ---------------- Reproductor ---------------- */
  let player = null;
  function buildPlayer() {
    const el = document.createElement('div');
    el.className = 'vplayer';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.innerHTML = `
      <div class="vplayer__scrim" data-close></div>
      <div class="vplayer__panel">
        <div class="vplayer__stage"><video controls playsinline preload="metadata"></video></div>
        <div class="vplayer__info">
          <p class="vplayer__type"></p>
          <h2 class="vplayer__name"></h2>
          <p class="vplayer__desc"></p>
          <div class="vplayer__fmts" role="group"></div>
          <div class="vplayer__nav">
            <button class="vplayer__btn" type="button" data-dir="-1"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>
            <span class="vplayer__count"></span>
            <button class="vplayer__btn" type="button" data-dir="1"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>
          </div>
        </div>
      </div>
      <button class="vplayer__close" type="button" data-close><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m3 3 10 10M13 3 3 13" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>`;
    document.body.appendChild(el);
    const video = $('video', el);
    let list = [], idx = 0, fi = 0, back = null;

    function render(keepTime) {
      const it = info(list[idx]);
      const f = it.f[fi] || it.f[0];
      const [w, h] = f.r.split(':').map(Number);
      el.classList.toggle('is-tall', h > w);
      el.style.setProperty('--ar', String(w / h));
      el.setAttribute('aria-label', t('player') + ': ' + it.t);
      $('.vplayer__type', el).textContent = it.k + ' · ' + it.a;
      $('.vplayer__name', el).textContent = it.t;
      $('.vplayer__desc', el).textContent = it.d;
      const fm = $('.vplayer__fmts', el);
      fm.setAttribute('aria-label', t('fmt'));
      fm.hidden = it.f.length < 2;
      fm.innerHTML = it.f.map((x, i) => `<button type="button" aria-pressed="${i === fi}" data-fi="${i}">${x.r}${(lang() === 'en' ? x.le : x.l) ? ' · ' + (lang() === 'en' ? x.le : x.l) : ''}</button>`).join('');
      $('.vplayer__count', el).textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
      $('[data-dir="-1"]', el).setAttribute('aria-label', t('prev'));
      $('[data-dir="1"]', el).setAttribute('aria-label', t('next'));
      $('.vplayer__close', el).setAttribute('aria-label', t('close'));
      $('.vplayer__nav', el).hidden = list.length < 2;
      const at = keepTime ? video.currentTime : 0;
      video.src = f.src;
      video.poster = list[idx].dataset.prev.replace(/-prev(-v\d+)?\.mp4$/, '-poster$1.webp');
      if (at) video.addEventListener('loadedmetadata', () => { video.currentTime = Math.min(at, video.duration - .1); }, { once: true });
      play(video);
    }
    function go(d) { idx = (idx + d + list.length) % list.length; fi = 0; render(false); }
    function close() {
      el.classList.remove('open');
      video.pause();
      document.documentElement.classList.remove('vplayer-on');
      setTimeout(() => { if (!el.classList.contains('open')) video.removeAttribute('src'), video.load(); }, 400);
      if (back) back.focus({ preventScroll: true });
      document.dispatchEvent(new CustomEvent('vplayer:close'));
    }
    el.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) return close();
      const b = e.target.closest('[data-dir]'); if (b) return go(+b.dataset.dir);
      const f = e.target.closest('[data-fi]'); if (f) { fi = +f.dataset.fi; render(true); const nb = $('[data-fi="' + fi + '"]', el); if (nb) nb.focus(); }
    });
    document.addEventListener('keydown', e => {
      if (!el.classList.contains('open')) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.tagName !== 'VIDEO') go(e.key === 'ArrowRight' ? 1 : -1);
      else if (e.key === 'Tab') { // el foco no sale del reproductor
        const f = $$('button:not([hidden]), video', el).filter(x => x.offsetParent);
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    return {
      open(items, i, from) {
        list = items; idx = i; fi = 0; back = from || document.activeElement;
        render(false);
        document.documentElement.classList.add('vplayer-on');
        el.classList.add('open');
        document.dispatchEvent(new CustomEvent('vplayer:open'));
        $('.vplayer__close', el).focus({ preventScroll: true });
      },
    };
  }
  const openPlayer = (items, i, from) => { if (!player) player = buildPlayer(); player.open(items, i, from); };

  /* ---------------- Mazo ---------------- */
  function deck(root) {
    const pile = $('.vdeck__pile', root);
    const cards = $$('.vdeck__card', pile);
    const copy = root.closest('.vshow') || document;
    let order = cards.slice(), pos = 0, busy = false, hover = false, visible = false, paused = false, vid = null, raf = 0;

    const bar = document.createElement('span'); bar.className = 'vdeck__prog'; bar.setAttribute('aria-hidden', 'true');
    pile.appendChild(bar);
    cards.forEach(c => {
      const cta = document.createElement('span'); cta.className = 'vdeck__cta'; cta.setAttribute('aria-hidden', 'true');
      $('.vdeck__hit', c).appendChild(cta);
    });

    function layout() {
      cards.forEach(c => { c.classList.add('is-off'); c.removeAttribute('data-d'); });
      order.forEach((c, i) => {
        const d = (i - pos + order.length) % order.length;
        c.classList.remove('is-off');
        c.style.setProperty('--d', String(Math.min(d, 4)));
        c.dataset.d = d > 3 ? 'x' : String(d);
        const hit = $('.vdeck__hit', c);
        hit.tabIndex = d === 0 ? 0 : -1;
        c.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
        $('.vdeck__cta', c).textContent = t('watch');
      });
      const top = order[pos], it = info(top);
      $('.vdeck__name', root).textContent = it.t;
      $('.vdeck__type', root).textContent = it.k + ' · ' + it.a;
      $('.vdeck__i', root).textContent = String(pos + 1).padStart(2, '0');
      $('.vdeck__n', root).textContent = String(order.length).padStart(2, '0');
      start(top);
    }

    function stop() {
      cancelAnimationFrame(raf);
      bar.style.setProperty('--p', '0');
      if (vid) { vid.pause(); vid.remove(); vid = null; }
    }
    function start(card) {
      stop();
      if (reduce) return;
      vid = previewVideo(card, false);
      $('.vdeck__hit', card).prepend(vid);
      vid.addEventListener('playing', () => card.classList.add('is-live'), { once: true });
      vid.addEventListener('ended', () => { if (!hover && visible && !paused && order.length > 1) step(1); else { vid.currentTime = 0; run(); } });
      const tick = () => { if (vid && vid.duration) bar.style.setProperty('--p', String(vid.currentTime / vid.duration)); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
      run();
    }
    const run = () => { if (vid && visible && !paused) play(vid); else if (vid) vid.pause(); };

    function step(d) {
      if (busy || order.length < 2) return;
      busy = true;
      const top = order[pos];
      cards.forEach(c => c.classList.remove('is-live'));
      if (d > 0) {
        top.classList.add('is-out');
        setTimeout(() => {
          top.classList.add('is-snap'); top.classList.remove('is-out');
          pos = (pos + 1) % order.length; layout();
          requestAnimationFrame(() => requestAnimationFrame(() => top.classList.remove('is-snap')));
          busy = false;
        }, reduce ? 0 : 420);
      } else {
        const prev = order[(pos - 1 + order.length) % order.length];
        prev.classList.add('is-snap', 'is-out');
        requestAnimationFrame(() => {
          prev.classList.remove('is-snap');
          pos = (pos - 1 + order.length) % order.length; layout();
          requestAnimationFrame(() => prev.classList.remove('is-out'));
          setTimeout(() => { busy = false; }, reduce ? 0 : 420);
        });
      }
    }

    $$('.vdeck__btn', root).forEach(b => b.addEventListener('click', () => step(+b.dataset.dir)));
    root.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
    pile.addEventListener('mouseenter', () => { hover = true; });
    pile.addEventListener('mouseleave', () => { hover = false; });

    // deslizar la tarjeta de arriba con el dedo o el mouse; un toque sin arrastre la abre
    let sx = 0, sy = 0, dx = 0, drag = false, moved = false, pid = null;
    pile.addEventListener('pointerdown', e => {
      const c = e.target.closest('.vdeck__card'); if (!c || c !== order[pos] || busy) return;
      sx = e.clientX; sy = e.clientY; dx = 0; drag = true; moved = false; pid = e.pointerId;
    });
    pile.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== pid) return;
      dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - sy)) { moved = true; try { pile.setPointerCapture(pid); } catch (_) {} order[pos].classList.add('is-drag'); }
      if (moved) { order[pos].style.setProperty('--dx', dx + 'px'); order[pos].style.setProperty('--dr', (dx * .04) + 'deg'); }
    });
    const end = () => {
      if (!drag) return; drag = false;
      const top = order[pos];
      top.classList.remove('is-drag'); top.style.setProperty('--dx', '0px'); top.style.setProperty('--dr', '0deg');
      if (moved && Math.abs(dx) > 70) step(dx < 0 ? 1 : -1);
    };
    pile.addEventListener('pointerup', end);
    pile.addEventListener('pointercancel', end);
    pile.addEventListener('click', e => {
      const c = e.target.closest('.vdeck__card');
      if (moved) { e.preventDefault(); moved = false; return; }
      if (!c) return;
      if (c !== order[pos]) return step(1);
      openPlayer(order, pos, $('.vdeck__hit', c));
    });

    // filtros por tipo
    const fbtns = $$('.vfilter button', copy);
    fbtns.forEach(b => b.addEventListener('click', () => {
      if (busy) return;
      fbtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.f;
      order = cards.filter(c => f === 'all' || c.dataset.cat === f);
      pos = 0;
      pile.classList.add('is-shuffle');
      setTimeout(() => pile.classList.remove('is-shuffle'), 500);
      layout();
    }));

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; run(); }, { threshold: 0.35 }).observe(pile);
    } else visible = true;
    document.addEventListener('visibilitychange', () => { visible = !document.hidden && visible; run(); });
    document.addEventListener('vplayer:open', () => { paused = true; run(); });
    document.addEventListener('vplayer:close', () => { paused = false; run(); });
    root.classList.add('is-ready');
    layout();
  }

  /* ---------------- Grilla ---------------- */
  function grid() {
    const all = $$('.vcard');
    if (!all.length) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const on = c => {
      if (reduce) return;
      let v = $('video', c);
      if (!v) { v = previewVideo(c, true); $('.vcard__media', c).prepend(v); v.addEventListener('playing', () => c.classList.add('is-live')); }
      play(v);
    };
    const off = c => { const v = $('video', c); if (v) v.pause(); };
    all.forEach((c, i) => {
      if (fine) { c.addEventListener('mouseenter', () => on(c)); c.addEventListener('mouseleave', () => off(c)); }
      $('.vcard__hit', c).addEventListener('click', e => openPlayer(all, i, e.currentTarget));
    });
    // en celulares no hay mouse: se reproduce la tarjeta que está a la vista
    if (!fine && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => (e.intersectionRatio >= .7 ? on : off)(e.target)), { threshold: [0, .7] });
      all.forEach(c => io.observe(c));
      document.addEventListener('vplayer:open', () => all.forEach(off));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    $$('[data-vdeck]').forEach(deck);
    grid();
  });
})();

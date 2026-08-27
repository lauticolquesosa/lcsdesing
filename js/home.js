/* ============================================================
   LCS — home.js
   Home-only interactions:
   · video del logo en el hero (autoplay a prueba de bloqueos)
   · carrusel de trabajo (flechas, drag, teclado, progreso)
   · magnetic buttons
   · manifesto word-fill on scroll
   · interactive process progress line
   Loaded before site.js; site.js calls window.__lcsOnLang()
   on every language apply (incl. the initial one).
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGsap = () => typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ---------- 0 · Video del logo en el hero ----------
     El navegador puede negarse a reproducir solo: modo de ahorro de
     energía, ahorro de datos, la pestaña abierta en segundo plano o el
     archivo todavía sin bufear. Cuando eso pasa el video se queda en el
     póster y parece una imagen estática. Acá se insiste: apenas hay
     datos, cuando entra en pantalla, cuando la pestaña vuelve al frente
     y —última red— ante el primer gesto del visitante. Si aun así no
     arranca, el póster sigue siendo un cierre digno.                   */
  function heroVideo() {
    const v = $('[data-hero-video]');
    if (!v) return;

    // Safari solo respeta el silencio si además se fija la propiedad.
    v.muted = true;
    v.playsInline = true;
    v.setAttribute('disablepictureinpicture', '');

    if (reduced) { try { v.pause(); } catch (e) {} return; }

    let done = false;
    const playing = () => !v.paused && !v.ended && v.readyState > 2;

    function attempt() {
      if (playing()) return;
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});   // sin ruido en consola
    }

    // Reintentos ligados al ciclo de vida del propio archivo
    ['loadeddata', 'canplay', 'canplaythrough', 'stalled', 'suspend'].forEach(
      ev => v.addEventListener(ev, attempt)
    );
    v.addEventListener('playing', () => { done = true; }, { once: true });

    // Solo se reproduce mientras se ve: fuera de pantalla no gasta batería
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        entries.forEach(e => { e.isIntersecting ? attempt() : v.pause(); });
      }, { threshold: 0.1 }).observe(v);
    }

    // La pestaña vuelve al frente, o la página vuelve del historial
    document.addEventListener('visibilitychange', () => { if (!document.hidden) attempt(); });
    window.addEventListener('pageshow', attempt);

    // Último recurso: el primer gesto del visitante desbloquea el autoplay
    const gestures = ['pointerdown', 'touchstart', 'keydown', 'scroll'];
    const onGesture = () => {
      attempt();
      if (done) gestures.forEach(g => window.removeEventListener(g, onGesture));
    };
    gestures.forEach(g => window.addEventListener(g, onGesture, { passive: true }));

    attempt();
  }

  /* ---------- 1 · Carrusel de trabajo (finito, flechas + drag) ----------
     El scroll es nativo (scroll-snap): sin JS el carrusel se sigue
     pudiendo recorrer. Acá se suman las flechas, el arrastre con mouse,
     el teclado, la barra de progreso y el contador.                     */
  let wcSyncLabels = null;
  function workCarousel() {
    const root = $('[data-carousel]');
    if (!root) return;
    const vp    = $('[data-wc-viewport]', root);
    const track = $('.wc__track', vp);
    const items = $$('.wc__item', track);
    if (!vp || !track || !items.length) return;

    const prev  = $('[data-wc-prev]', root);
    const next  = $('[data-wc-next]', root);
    // La barra de progreso vive fuera de .wc, dentro del .shell de la sección.
    const bar   = $('[data-wc-bar]', root.closest('section') || document);

    /* El recorrido es infinito: detrás de la última tarjeta vuelve a
       empezar la primera. Para eso el set se clona dos veces y, cuando el
       scroll entra en la tercera copia, se resta el ancho de un set. Como
       el contenido de esa posición es idéntico, el salto no se ve. */
    const SETS = 2;
    const originals = items.length;
    for (let c = 0; c < SETS; c++) {
      const frag = document.createDocumentFragment();
      items.forEach(li => {
        const clone = li.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        $$('a', clone).forEach(a => { a.tabIndex = -1; });
        frag.appendChild(clone);
      });
      track.appendChild(frag);
    }

    // Un "paso" = ancho de tarjeta + gap. Con scroll-padding = gutter,
    // la tarjeta i queda exactamente en scrollLeft = i * step.
    const step = () => {
      const a = items[0].getBoundingClientRect();
      const b = items[1] && items[1].getBoundingClientRect();
      return Math.round(b ? b.left - a.left : a.width) || 1;
    };
    const setW = () => originals * step();          // ancho de una vuelta
    const maxScroll = () => Math.max(0, vp.scrollWidth - vp.clientWidth);
    const perPage = () => Math.max(1, Math.floor(vp.clientWidth / step()));
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

    let raf = 0, idle = 0;
    // Destino de la última animación: mientras está en curso, los clics
    // encadenados parten de ahí y no de un scrollLeft a mitad de camino.
    let target = null;

    /* Reubica el scroll dentro de la primera vuelta sin que se note. */
    function shift(delta) {
      const behavior = vp.style.scrollBehavior;
      vp.style.scrollBehavior = 'auto';
      vp.scrollLeft += delta;
      vp.style.scrollBehavior = behavior;
      if (target !== null) target += delta;
      if (dragging) startLeft += delta;
    }
    function normalize() {
      const w = setW();
      if (vp.scrollLeft >= 2 * w) shift(-w);
    }

    function sync() {
      raf = 0;
      const x = vp.scrollLeft, w = setW();
      if (bar) {
        // Progreso dentro de la vuelta actual (los clones no cuentan).
        const seen = ((x % w) + vp.clientWidth) / w;
        bar.style.transform = `scaleX(${clamp(seen, 0.04, 1).toFixed(4)})`;
      }
      clearTimeout(idle);
      idle = setTimeout(() => {                       // el scroll se detuvo
        target = null;
        if (!dragging) normalize();
      }, 140);
    }
    const queueSync = () => { if (!raf) raf = requestAnimationFrame(sync); };

    function scrollTo(left) {
      target = left;
      vp.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' });
    }
    function goTo(index) {
      scrollTo(clamp(index * step(), 0, maxScroll()));
    }

    /* Avanza o retrocede una pantalla. Al llegar a la última tarjeta el
       recorrido sigue de largo con las primeras; hacia atrás, si ya está
       en el arranque, se salta una vuelta adelante y se retrocede desde ahí. */
    function page(dir) {
      const s = step();
      if (dir < 0 && (target === null ? vp.scrollLeft : target) < s) shift(setW());
      const x = target === null ? vp.scrollLeft : target;
      goTo(Math.round(x / s) + dir * perPage());
    }

    if (prev) prev.addEventListener('click', () => page(-1));
    if (next) next.addEventListener('click', () => page(1));

    vp.addEventListener('scroll', queueSync, { passive: true });
    window.addEventListener('resize', queueSync);
    vp.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); page(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); page(-1); }
    });

    /* Arrastre con mouse / lápiz (en touch ya scrollea nativo) */
    let dragging = false, active = false, moved = 0;
    let startX = 0, startLeft = 0, lastX = 0, lastT = 0, vel = 0;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      dragging = true; active = false; moved = 0; vel = 0;
      startX = lastX = e.clientX; lastT = e.timeStamp;
      startLeft = vp.scrollLeft;
    });
    vp.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (!active) {
        if (moved < 4) return;   // hasta acá todavía puede ser un clic normal
        active = true;
        root.classList.add('is-dragging');
        // La captura recién acá: si se toma en el pointerdown, el clic
        // posterior se dispara sobre el viewport y el link nunca navega.
        try { vp.setPointerCapture(e.pointerId); } catch (err) {}
      }
      vp.scrollLeft = startLeft - dx;
      // El arrastre también es infinito: se reubica en cuanto pisa un borde.
      const w = setW();
      if (vp.scrollLeft >= 2 * w) shift(-w);
      else if (vp.scrollLeft < step()) shift(w);
      const dt = e.timeStamp - lastT;
      if (dt > 0) vel = (e.clientX - lastX) / dt;   // px por ms
      lastX = e.clientX; lastT = e.timeStamp;
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      if (!active) return;
      active = false;
      root.classList.remove('is-dragging');
      try { if (e && vp.hasPointerCapture(e.pointerId)) vp.releasePointerCapture(e.pointerId); } catch (err) {}
      const s = step();
      // Pequeña inercia: la velocidad del gesto empuja hasta una tarjeta más.
      const flick = clamp(Math.round(-vel * 0.28), -2, 2);
      goTo(Math.round(vp.scrollLeft / s) + flick);
      queueSync();
    }
    vp.addEventListener('pointerup', endDrag);
    vp.addEventListener('pointercancel', endDrag);
    // Por si se suelta el botón fuera del carrusel (antes de tomar la captura)
    window.addEventListener('pointerup', endDrag);
    vp.addEventListener('dragstart', e => e.preventDefault());
    // Un arrastre no debe abrir el caso que quedó debajo del cursor.
    vp.addEventListener('click', e => {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
      moved = 0;
    }, true);

    // aria-label de las flechas según idioma (site.js dispara __lcsOnLang)
    wcSyncLabels = () => {
      const en = window.__lcsLang === 'en';
      [prev, next].forEach(b => {
        if (!b) return;
        const v = b.getAttribute(en ? 'data-label-en' : 'data-label-es');
        if (v) b.setAttribute('aria-label', v);
      });
    };
    wcSyncLabels();

    if (document.readyState === 'complete') queueSync();
    window.addEventListener('load', queueSync, { once: true });
    queueSync();
  }

  /* ---------- 2 · Magnetic buttons ---------- */
  function magnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const strength = 0.28;
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 3 · Manifesto word-fill (rebuilds per language) ---------- */
  let manifestoST = null;
  function wrapWords(host) {
    const frag = document.createDocumentFragment();
    [...host.childNodes].forEach(node => {
      if (node.nodeType === 3) {                       // text node → split into words
        node.textContent.split(/(\s+)/).forEach(tok => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
          const sp = document.createElement('span');
          sp.className = 'word';
          sp.textContent = tok;
          frag.appendChild(sp);
        });
      } else if (node.nodeType === 1) {                // element (em) → one fill unit
        node.classList.add('word');
        frag.appendChild(node);
      }
    });
    host.innerHTML = '';
    host.appendChild(frag);
  }
  function manifesto() {
    const host = $('[data-manifesto]');
    if (!host) return;
    wrapWords(host);
    if (manifestoST) { manifestoST.kill(); manifestoST = null; }
    if (reduced || !hasGsap()) return;                 // no-JS / reduced → words stay full
    const words = $$('.word', host);
    gsap.set(words, { opacity: 0.18 });
    const tween = gsap.to(words, {
      opacity: 1, ease: 'none', stagger: { each: 0.4 },
      scrollTrigger: { trigger: host, start: 'top 80%', end: 'bottom 62%', scrub: true }
    });
    manifestoST = tween.scrollTrigger;
  }

  /* ---------- 4 · Interactive process line (one-time) ---------- */
  let flowReady = false;
  function flow() {
    if (flowReady) return;
    const bar = $('[data-flow-progress]');
    if (!bar) return;
    flowReady = true;
    if (reduced || !hasGsap()) { bar.style.transform = 'scaleX(1)'; return; }
    gsap.fromTo(bar, { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.flow', start: 'top 72%', end: 'bottom 72%', scrub: true }
    });
  }

  /* ---------- Language hook (fired by site.js i18n, incl. first run) ---------- */
  window.__lcsOnLang = function () {
    manifesto();   // re-wrap after i18n swapped the text
    flow();
    if (wcSyncLabels) wcSyncLabels();
    if (!reduced && hasGsap()) ScrollTrigger.refresh();
  };

  document.addEventListener('DOMContentLoaded', () => {
    heroVideo();
    workCarousel();
    magnetic();
    // manifesto() + flow() are kicked off by __lcsOnLang during site.js i18n().
    // Fallback if i18n never runs (e.g. site.js failed to load):
    setTimeout(() => { if (!window.__lcsLang) { manifesto(); flow(); } }, 0);
  });
})();

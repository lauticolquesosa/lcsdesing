/* ============================================================
   LCS — home.js
   Home-only interactions:
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

    // Un "paso" = ancho de tarjeta + gap. Con scroll-padding = gutter,
    // la tarjeta i queda exactamente en scrollLeft = i * step.
    const step = () => {
      const a = items[0].getBoundingClientRect();
      const b = items[1] && items[1].getBoundingClientRect();
      return Math.round(b ? b.left - a.left : a.width) || 1;
    };
    const maxScroll = () => Math.max(0, vp.scrollWidth - vp.clientWidth);
    const perPage = () => Math.max(1, Math.floor(vp.clientWidth / step()));
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

    let raf = 0, idle = 0;
    // Destino de la última animación: mientras está en curso, los clics
    // encadenados parten de ahí y no de un scrollLeft a mitad de camino.
    let target = null;
    function sync() {
      raf = 0;
      const max = maxScroll(), x = vp.scrollLeft;
      const ratio = Math.min(1, vp.clientWidth / vp.scrollWidth);
      if (bar) {
        const offset = max > 0 ? (x / max) * (1 - ratio) : 0;
        bar.style.transform = `translateX(${(offset * 100).toFixed(3)}%) scaleX(${ratio.toFixed(4)})`;
      }
      clearTimeout(idle);
      idle = setTimeout(() => { target = null; }, 140);   // el scroll se detuvo
    }
    const queueSync = () => { if (!raf) raf = requestAnimationFrame(sync); };

    function scrollTo(left) {
      target = left;
      vp.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' });
    }
    function goTo(index) {
      scrollTo(clamp(index * step(), 0, maxScroll()));
    }

    /* Vuelta al otro extremo: el scroll nativo tarda lo que le pinta cuando
       son 5.000px, así que este tramo se anima a duración fija. */
    let animRaf = 0;
    function stopAnim() {
      if (!animRaf) return;
      cancelAnimationFrame(animRaf); animRaf = 0;
      root.classList.remove('is-animating');
    }
    function rewindTo(left) {
      stopAnim();
      target = left;
      if (reduced) { vp.scrollLeft = left; target = null; return; }
      const from = vp.scrollLeft, delta = left - from, t0 = performance.now(), dur = 760;
      const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      root.classList.add('is-animating');
      const frame = now => {
        const t = Math.min(1, (now - t0) / dur);
        vp.scrollLeft = from + delta * ease(t);
        if (t < 1) { animRaf = requestAnimationFrame(frame); }
        else { animRaf = 0; root.classList.remove('is-animating'); target = null; }
      };
      animRaf = requestAnimationFrame(frame);
    }

    /* Las flechas dan la vuelta: en la última tarjeta, "siguiente" vuelve
       al principio, y en la primera, "anterior" salta al final. */
    function page(dir) {
      const s = step(), max = maxScroll();
      const x = target === null ? vp.scrollLeft : target;
      if (dir > 0 && x >= max - 2) return rewindTo(0);
      if (dir < 0 && x <= 2) return rewindTo(max);
      stopAnim();
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
      stopAnim();                       // agarrar el carrusel corta la vuelta
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
    workCarousel();
    magnetic();
    // manifesto() + flow() are kicked off by __lcsOnLang during site.js i18n().
    // Fallback if i18n never runs (e.g. site.js failed to load):
    setTimeout(() => { if (!window.__lcsLang) { manifesto(); flow(); } }, 0);
  });
})();

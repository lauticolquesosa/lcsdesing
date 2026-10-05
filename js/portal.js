/* ============================================================
   LCS — portal.js
   Solo la portada (/). Tres cosas, ninguna imprescindible: si este
   archivo no carga, las cards siguen siendo dos enlaces comunes.
   · luz e inclinación que siguen al puntero (un rAF por cuadro)
   · precarga del destino apenas el puntero se acerca a una card
   · al tocar, el color de la card se expande a toda la pantalla
     y recién ahí se navega; el destino entra con un fundido nativo
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cards = [...document.querySelectorAll('[data-path]')];
  if (!cards.length) return;

  /* ---------- Precarga del destino ---------- */
  const fetched = new Set();
  function prefetch(href) {
    if (fetched.has(href)) return;
    fetched.add(href);
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = href;
    document.head.appendChild(l);
  }

  /* ---------- Luz + inclinación ---------- */
  function pointer(card) {
    const tilt = card.querySelector('[data-tilt]');
    let raf = 0, x = 0, y = 0;
    function paint() {
      raf = 0;
      const r = card.getBoundingClientRect();
      const px = (x - r.left) / r.width, py = (y - r.top) / r.height;
      card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      if (tilt) {
        tilt.style.setProperty('--ry', ((px - .5) * 10).toFixed(2) + 'deg');
        tilt.style.setProperty('--rx', ((.5 - py) * 8).toFixed(2) + 'deg');
      }
    }
    card.addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    });
    card.addEventListener('pointerleave', () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (tilt) { tilt.style.setProperty('--rx', '0deg'); tilt.style.setProperty('--ry', '0deg'); }
    });
  }

  /* ---------- Entrada al camino ---------- */
  let leaving = false;
  function enter(card, e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (reduced || leaving) return;
    e.preventDefault();
    leaving = true;

    const href = card.href;
    const r = card.getBoundingClientRect();
    const radius = getComputedStyle(card).borderRadius;
    const wipe = document.createElement('div');
    wipe.className = 'path-wipe';
    wipe.style.background = getComputedStyle(card).backgroundColor;
    const from = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round ${radius})`;
    wipe.style.clipPath = from;
    document.body.appendChild(wipe);

    let gone = false;
    const go = () => { if (!gone) { gone = true; location.href = href; } };
    requestAnimationFrame(() => requestAnimationFrame(() => {
      wipe.style.clipPath = 'inset(0px 0px 0px 0px round 0px)';
    }));
    wipe.addEventListener('transitionend', go, { once: true });
    setTimeout(go, 900);   // por si la transición no llega a dispararse
  }

  // Al volver con el botón atrás la página sale del caché tal como quedó:
  // se saca la cortina para que las cards vuelvan a estar a la vista.
  window.addEventListener('pageshow', e => {
    if (!e.persisted) return;
    leaving = false;
    document.querySelectorAll('.path-wipe').forEach(w => w.remove());
  });

  cards.forEach(card => {
    const warm = () => prefetch(card.getAttribute('href'));
    card.addEventListener('pointerenter', warm);
    card.addEventListener('focus', warm);
    card.addEventListener('touchstart', warm, { passive: true });
    card.addEventListener('click', e => enter(card, e));
    if (fine && !reduced) pointer(card);
  });
})();

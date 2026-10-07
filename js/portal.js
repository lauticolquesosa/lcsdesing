/* ============================================================
   LCS — portal.js
   Solo la portada (/). Tres cosas, ninguna imprescindible: si este
   archivo no carga, las cards siguen siendo dos enlaces comunes.
   · luz e inclinación que siguen al puntero (un rAF por cuadro)
   · precarga del destino apenas el puntero se acerca a una card
   · al tocar, el color de la card se expande a toda la pantalla
     y recién ahí se navega; el destino entra con un fundido nativo
   · en el celular, las cards apiladas: --p achica la de abajo mientras
     la otra la tapa, --e endereza las piezas al entrar y .is-live abre
     el abanico del brandbook (ahí no hay hover que lo haga)
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

  /* ---------- Celular: apilado al scrollear ---------- */
  const phone = window.matchMedia('(max-width: 640px)');
  function stack() {
    if (reduced) { cards.forEach(c => c.classList.add('is-live')); return; }
    let raf = 0;
    const clamp = v => Math.min(1, Math.max(0, v));
    function paint() {
      raf = 0;
      if (!phone.matches) return;
      const vh = innerHeight;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        // Entrada: 0 cuando el borde superior asoma abajo, 1 a 45% de la pantalla
        card.style.setProperty('--e', clamp((vh - r.top) / (vh * .55)).toFixed(3));
        const next = cards[i + 1];
        if (next) {
          const n = next.getBoundingClientRect();
          // Cuánto de la card de arriba ya quedó tapado por la siguiente
          card.style.setProperty('--p', clamp((r.bottom - n.top) / r.height).toFixed(3));
        }
      });
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    phone.addEventListener('change', () => {
      if (phone.matches) return queue();
      cards.forEach(c => { c.style.removeProperty('--e'); c.style.removeProperty('--p'); });
    });
    paint();

    // El abanico se abre cuando más de la mitad de la card está a la vista
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => entries.forEach(en =>
        en.target.classList.toggle('is-live', en.isIntersecting)), { threshold: .55 });
      cards.forEach(c => io.observe(c));
    }
  }
  stack();

  cards.forEach(card => {
    const warm = () => prefetch(card.getAttribute('href'));
    card.addEventListener('pointerenter', warm);
    card.addEventListener('focus', warm);
    card.addEventListener('touchstart', warm, { passive: true });
    card.addEventListener('click', e => enter(card, e));
    if (fine && !reduced) pointer(card);
  });
})();

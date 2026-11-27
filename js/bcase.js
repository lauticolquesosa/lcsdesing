/* ============================================================
   LCS — bcase.js
   Casos de branding. Solo suma movimiento: las imágenes se ven
   igual sin JS. Desfasa la segunda columna de fotos con el scroll,
   corre la banda de patrón, reproduce los videos a la vista y copia
   el HEX al tocar un color.
   ============================================================ */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // movimiento ligado al scroll
  const cols = $$('.bc-cols__c:nth-child(2)');
  const bands = $$('.bc-band');
  if (!reduce && (cols.length || bands.length)) {
    let raf = 0;
    const move = () => {
      raf = 0;
      const vh = innerHeight;
      if (innerWidth > 560) cols.forEach(c => {
        const r = c.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (vh - r.top) / (vh + r.height);            // 0 → 1 mientras cruza la pantalla
        c.style.setProperty('--shift', `${Math.round((p - .5) * -90)}px`);
      });
      bands.forEach(b => {
        const r = b.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        b.style.setProperty('--px', `${Math.round((r.top - vh) * .3)}px`);
      });
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(move); }, { passive: true });
    addEventListener('resize', move);
    move();
  }

  // videos: solo corren a la vista (se observa el contenedor, no algo recortado)
  $$('.bc video[data-auto]').forEach(v => {
    if (reduce) { v.removeAttribute('autoplay'); return; }
    new IntersectionObserver(([e]) => { e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }, { threshold: 0.2 }).observe(v.parentElement);
  });

  // paleta: copiar el HEX
  $$('.bc-pal__c').forEach(c => c.addEventListener('click', () => {
    const done = () => { c.classList.add('is-ok'); setTimeout(() => c.classList.remove('is-ok'), 1400); };
    if (navigator.clipboard) navigator.clipboard.writeText(c.dataset.hex).then(done, () => {}); else done();
  }));
})();

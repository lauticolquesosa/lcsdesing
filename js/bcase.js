/* ============================================================
   LCS — bcase.js
   Casos de branding: revela las fotos al entrar en pantalla, corre
   la banda de patrón con el scroll, pinta «Calmate y tomate un mate»
   y copia el HEX al tocar un color de la paleta.
   ============================================================ */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // fotos y frase: se revelan una vez
  const targets = $$('.bc [data-bc], .bc-mate');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    targets.forEach(t => io.observe(t));
  } else targets.forEach(t => t.classList.add('on'));

  // videos de logo: solo corren a la vista
  $$('.bc video[data-auto]').forEach(v => {
    if (reduce) return;
    new IntersectionObserver(([e]) => { e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }, { threshold: 0.3 }).observe(v);
  });

  // banda de patrón: el fondo se corre en sentido contrario al scroll
  const bands = $$('.bc-band');
  if (bands.length && !reduce) {
    let raf = 0;
    const move = () => {
      raf = 0;
      bands.forEach(b => {
        const r = b.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        b.style.setProperty('--px', `${Math.round((r.top - innerHeight) * 0.35)}px`);
      });
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(move); }, { passive: true });
    move();
  }

  // paleta: copiar el HEX
  $$('.bc-pal__c').forEach(c => c.addEventListener('click', () => {
    const hex = c.dataset.hex;
    const done = () => { c.classList.add('is-ok'); setTimeout(() => c.classList.remove('is-ok'), 1400); };
    if (navigator.clipboard) navigator.clipboard.writeText(hex).then(done, () => {}); else done();
  }));
})();

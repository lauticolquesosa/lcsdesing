/* ============================================================
   LCS — mono.js
   Motor de las páginas en blanco y negro (todo el sitio):
   header · menú móvil · footer · idioma ES|EN · tira de imágenes
   con flechas · reveals al entrar en pantalla · enganche con el
   modal de proyectos (projects.js) y con contacto.js.
   Sin dependencias.
   ============================================================ */

/* ---------- Encabezado y pie: una sola fuente de verdad ----------
   Funciones puras que devuelven el marcado según el camino (portal,
   branding, web) y la página activa. Las usa este archivo en el
   navegador y también chrome.mjs, que las escribe en cada HTML para
   que el menú y el pie existan sin JavaScript (buscadores y
   asistentes de IA que no lo ejecutan). Si cambia algo acá, correr
   node chrome.mjs. */
const LCS_CHROME = (function () {
  'use strict';

  const NAVS = {
    portal: [
      { key: 'branding',  href: '/branding',   es: 'Branding',   en: 'Branding' },
      { key: 'web',       href: '/diseno-web', es: 'Diseño web', en: 'Web design' },
    ],
    branding: [
      { key: 'servicios', href: '/branding/servicios', es: 'Servicios', en: 'Services' },
      { key: 'proyectos', href: '/branding/proyectos', es: 'Proyectos', en: 'Work' },
      { key: 'inversion', href: '/branding/inversion', es: 'Inversión', en: 'Investment' },
    ],
    web: [
      { key: 'servicios', href: '/servicios', es: 'Servicios', en: 'Services' },
      { key: 'proyectos', href: '/proyectos', es: 'Proyectos', en: 'Work' },
      { key: 'inversion', href: '/inversion', es: 'Inversión', en: 'Investment' },
    ],
  };
  const HOMES = {
    portal:   { href: '/',           es: 'Inicio',     en: 'Home' },
    branding: { href: '/branding',   es: 'Branding',   en: 'Branding' },
    web:      { href: '/diseno-web', es: 'Diseño web', en: 'Web design' },
  };
  const WA = 'https://wa.me/543874834041';
  const IG = 'https://instagram.com/lcswebstudio';
  const MAIL = 'lcsdesignstudio1@gmail.com';
  const CONTACT = { key: 'contacto', href: '/contacto', es: 'Contacto', en: 'Contact' };

  const t = (es, en) => `data-es="${es}" data-en="${en}"`;

  function header(section, page) {
    const NAV = NAVS[section] || NAVS.portal;
    const cur = (k) => (k === page ? ' aria-current="page"' : '');
    // en la portada el logo ya está grande en el hero: el header va sin logo
    const home = section === 'portal' ? [] : [{ key: 'home', ...HOMES[section] }];
    // dentro de un camino, el primer link lleva a su home (Branding / Diseño web)
    const links = [...home, ...NAV].map(n => `<li><a href="${n.href}"${cur(n.key)} ${t(n.es, n.en)}>${n.es}</a></li>`).join('');
    // selector para pasar al otro camino sin volver a la portada
    const sw = section === 'portal' ? '' : `<nav class="pswitch" aria-label="Área del estudio">${
      [['branding', '/branding', 'Branding', 'Branding'], ['web', '/diseno-web', 'Web', 'Web']].map(([k, h, es, en]) =>
        `<a href="${h}"${k === section ? ' aria-current="true"' : ''} ${t(es, en)}>${es}</a>`).join('')}</nav>`;
    const menuLinks = [...home, ...NAV, CONTACT]
      .map(n => `<li><a href="${n.href}"${cur(n.key)} ${t(n.es, n.en)}>${n.es}</a></li>`).join('');

    return `
      <a class="skip" href="#main" ${t('Saltar al contenido', 'Skip to content')}>Saltar al contenido</a>
      <header class="hd" data-nav="${section}">
        <div class="wrap hd__in">
          <div class="hd__start">
            ${page === 'portal' ? '' : `<a class="hd__logo" href="/" aria-label="LCS — Inicio">
              <img src="/assets/logo-lcs-pantera.webp" alt="LCS" width="1200" height="372">
            </a>`}
          </div>
          <nav class="hd__nav" aria-label="Principal">
            <ul class="hd__links">${links}</ul>
          </nav>
          <div class="hd__end">
            ${sw}
            <button class="burger" type="button" aria-label="Menú" aria-expanded="false" aria-controls="mm"><span></span><span></span></button>
          </div>
        </div>
      </header>
      <nav class="mm" id="mm" aria-label="Menú">
        ${sw}
        <ul class="mm__links">${menuLinks}</ul>
        <div class="mm__foot">
          <a href="${IG}" target="_blank" rel="noopener">Instagram</a>
          <a href="${WA}" target="_blank" rel="noopener">WhatsApp</a>
          <a href="mailto:${MAIL}">Email</a>
        </div>
      </nav>`;
  }

  function footer(section) {
    const nav = [
      HOMES.portal,
      HOMES.branding,
      ...(section === 'branding' ? NAVS.branding : []),
      HOMES.web,
      ...(section === 'web' ? NAVS.web : []),
      CONTACT,
    ].map(n => `<li><a href="${n.href}" ${t(n.es, n.en)}>${n.es}</a></li>`).join('');

    return `
      <footer class="ft" data-nav="${section}">
        <div class="wrap">
          <div class="ft__in">
            <div>
              <h2 ${t('Correo', 'Email')}>Correo</h2>
              <a href="mailto:${MAIL}">${MAIL}</a>
              <h2>WhatsApp</h2>
              <a href="${WA}" target="_blank" rel="noopener">+54 387 483 4041</a>
            </div>
            <nav aria-label="Footer">
              <h2 ${t('Navegación', 'Navigation')}>Navegación</h2>
              <ul>${nav}</ul>
            </nav>
            <div>
              <h2>Social</h2>
              <ul>
                <li><a href="${IG}" target="_blank" rel="noopener">Instagram</a></li>
                <li><a href="${WA}" target="_blank" rel="noopener">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div class="ft__bottom">
            <a class="ft__logo" href="/" aria-label="LCS"><img src="/assets/logo-lcs-pantera.webp" alt="LCS" width="1200" height="372" loading="lazy" decoding="async"></a>
            <div class="ft__legal">
              <span ${t('© 2026 LCS · Estudio de Diseño Web y Branding · Salta, Argentina', '© 2026 LCS · Web Design &amp; Branding Studio · Salta, Argentina')}>© 2026 LCS · Estudio de Diseño Web y Branding · Salta, Argentina</span>
              <a href="/terminos" ${t('Términos y condiciones', 'Terms &amp; conditions')}>Términos y condiciones</a>
            </div>
          </div>
        </div>
      </footer>`;
  }

  return { header, footer };
})();
if (typeof module === 'object' && module.exports) module.exports = LCS_CHROME;

(function () {
  'use strict';
  if (typeof document === 'undefined') return; // cargado desde Node (chrome.mjs)

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  root.dataset.anim = '1'; // el <head> no necesita la red de seguridad: los reveals los maneja este archivo

  const PAGE = document.body.dataset.page || '';

  /* ---------- Los dos caminos ----------
     Cada página declara el suyo en <body data-section>: portal (la
     portada), branding o web. Las compartidas (contacto, términos)
     heredan el último camino recorrido en la visita, para que el menú
     no cambie de golpe al entrar a Contacto. */
  const PATH_KEY = 'lcs-path';
  let SECTION = document.body.dataset.section || 'portal';
  if (SECTION === 'shared') {
    let last = null;
    try { last = sessionStorage.getItem(PATH_KEY); } catch (e) {}
    SECTION = last === 'branding' || last === 'web' ? last : 'portal';
  } else if (SECTION !== 'portal') {
    try { sessionStorage.setItem(PATH_KEY, SECTION); } catch (e) {}
  }

  /* El HTML ya trae el encabezado escrito por chrome.mjs. Solo se rehace
     si el camino de la visita no coincide (páginas compartidas) o si la
     página todavía tiene el hueco #chrome. */
  function header() {
    const hd = $('.hd');
    if (!hd || hd.dataset.nav !== SECTION) {
      const html = LCS_CHROME.header(SECTION, PAGE);
      const mount = $('#chrome');
      if (mount) mount.outerHTML = html;
      else if (hd) {
        // los nodos viejos se toman antes de insertar los nuevos
        const old = [$('.skip'), hd, $('#mm')].filter(Boolean);
        old[0].insertAdjacentHTML('beforebegin', html);
        old.forEach(n => n.remove());
      } else document.body.insertAdjacentHTML('afterbegin', html);
    }

    const burger = $('.burger');
    const setOpen = (open) => {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));
    $$('.mm a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
  }

  function footer() {
    const ft = $('.ft');
    const mount = $('#site-footer');
    if (mount) mount.outerHTML = LCS_CHROME.footer(SECTION);
    else if (ft && ft.dataset.nav !== SECTION) ft.outerHTML = LCS_CHROME.footer(SECTION);
  }

  function i18n() {
    const KEY = 'lcs-lang';
    const md = $('meta[name="description"]');
    const META = {
      es: { title: document.title, desc: md ? md.content : '' },
      en: { title: document.body.dataset.titleEn || document.title, desc: document.body.dataset.descEn || '' },
    };
    let lang = 'es';
    // sin selector de idioma: el sitio se muestra siempre en español (se ignora
    // un 'en' que haya quedado guardado de antes)
    try { localStorage.removeItem(KEY); } catch (e) {}
    function apply(next) {
      lang = next === 'en' ? 'en' : 'es';
      window.__lcsLang = lang; // lo leen projects.js (modal) y contacto.js (botón copiar)
      try { localStorage.setItem(KEY, lang); } catch (e) {}
      root.lang = lang;
      $$('[data-es]').forEach(el => {
        const v = el.getAttribute(lang === 'en' ? 'data-en' : 'data-es');
        if (v != null && el.innerHTML !== v) el.innerHTML = v;
      });
      $$('[data-label-es]').forEach(el => {
        const v = el.getAttribute(lang === 'en' ? 'data-label-en' : 'data-label-es');
        if (v != null) el.setAttribute('aria-label', v);
      });
      $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
      if (META[lang].title) document.title = META[lang].title;
      if (md && META[lang].desc) md.setAttribute('content', META[lang].desc);
      if (window.__lcsOnLang) window.__lcsOnLang(lang);
      if (window.__modalRerender) window.__modalRerender();
    }
    window.setLang = apply;
    $$('.lang button').forEach(b => b.addEventListener('click', () => apply(b.dataset.lang)));
    apply(lang);
  }

  /* Tira de imágenes: scroll nativo; las flechas avanzan de a una
     tarjeta y se apagan en los extremos (no hay vuelta infinita). */
  function strips() {
    $$('[data-strip]').forEach(s => {
      const vp = $('.strip__vp', s);
      const prev = $('.strip__btn--prev', s);
      const next = $('.strip__btn--next', s);
      if (!vp || !prev || !next) return;
      const step = () => {
        const it = $('.strip__it', vp);
        return it ? it.getBoundingClientRect().width + 10 : vp.clientWidth * .8;
      };
      const sync = () => {
        prev.disabled = vp.scrollLeft < 4;
        next.disabled = vp.scrollLeft + vp.clientWidth > vp.scrollWidth - 4;
      };
      // data-strip-start: arranca con tarjetas enteras centradas y una
      // cortada en cada borde, como en la referencia
      const start = +s.dataset.stripStart || 0;
      if (start) {
        const st = step();
        const n = Math.max(1, Math.floor(vp.clientWidth / st));
        vp.scrollLeft = Math.max(0, start * st - (vp.clientWidth - n * st + 10) / 2);
      }
      // data-strip-auto: ciclo infinito que avanza solo (ver loop())
      if (s.hasAttribute('data-strip-auto')) return loop(s, vp, step, prev, next);
      prev.addEventListener('click', () => vp.scrollBy({ left: -step(), behavior: 'smooth' }));
      next.addEventListener('click', () => vp.scrollBy({ left: step(), behavior: 'smooth' }));
      vp.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
      sync();
    });
  }

  /* Tira infinita (portada): avanza sola de a una tarjeta, siempre, con una
     pausa corta entre paso y paso; no es un desplazamiento continuo.
     Nunca vuelve al principio: cuando una tarjeta termina de salir por la
     izquierda se pasa al final de la fila y se corrige el scroll en el mismo
     cuadro, así el corrimiento no se ve y la fila no se termina nunca. Las
     flechas usan el mismo ciclo y no se apagan. Solo descansa cuando la tira
     no está en pantalla o la pestaña está oculta (no se nota y ahorra
     batería). Con movimiento reducido no avanza sola, pero las flechas
     siguen funcionando. */
  function loop(s, vp, step, prev, next) {
    const DELAY = 1150;   // pausa entre paso y paso
    const DUR = 500;      // duración del deslizamiento de una tarjeta
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let busy = false, timer = null, visible = true;

    // mover un nodo con <video> lo pausa: se vuelve a reproducir (mudo, en loop)
    const replay = el => el.querySelectorAll('video').forEach(v => { const r = v.play(); if (r) r.catch(() => {}); });
    const ease = t => 1 - Math.pow(1 - t, 3);
    const slide = (to, dur) => new Promise(done => {
      if (!dur) { vp.scrollLeft = to; return done(); }
      const from = vp.scrollLeft, t0 = performance.now();
      const f = now => {
        const k = Math.min(1, (now - t0) / dur);
        vp.scrollLeft = from + (to - from) * ease(k);
        k < 1 ? requestAnimationFrame(f) : done();
      };
      requestAnimationFrame(f);
    });

    async function forward() {
      if (busy) return; busy = true;
      const st = step();
      await slide(vp.scrollLeft + st, reduced ? 0 : DUR);
      const moved = vp.firstElementChild;
      vp.appendChild(moved);                    // la que salió va al final
      replay(moved);
      vp.scrollLeft -= st;                      // y el scroll se corrige sin que se vea
      replay(vp);                               // y todos los videos de la tira siguen andando
      busy = false;
    }
    async function backward() {
      if (busy) return; busy = true;
      const st = step();
      const moved = vp.lastElementChild;
      vp.insertBefore(moved, vp.firstElementChild);
      replay(moved);
      vp.scrollLeft += st;
      await slide(vp.scrollLeft - st, reduced ? 0 : DUR);
      busy = false;
    }

    const running = () => !reduced && visible && !document.hidden;
    const schedule = () => {
      clearTimeout(timer);
      timer = running() ? setTimeout(async () => { await forward(); schedule(); }, DELAY) : null;
    };
    next.addEventListener('click', async () => { await forward(); schedule(); });
    prev.addEventListener('click', async () => { await backward(); schedule(); });
    prev.disabled = next.disabled = false;
    replay(vp);
    document.addEventListener('visibilitychange', schedule);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; schedule(); }, { threshold: 0.1 }).observe(s);
    }
    schedule();
  }

  function reveals() {
    const els = $$('[data-rv]');
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(el => io.observe(el));
  }

  /* Cards de precios en 3D. Todas llevan cuerpo: 8 capas de 3px detrás
     (24px de espesor) y un velo que apaga a las no elegidas.
     · Con mouse: se inclinan hacia el cursor (máx. ~12°) y el brillo lo sigue.
     · En táctil: se inclinan solas según su lugar en la pantalla (quedan
       derechas al pasar por el centro) y al tocarlas se levantan hacia el dedo.
     Todo el cálculo va en un rAF. Con movimiento reducido quedan planas. */
  function tilt() {
    const wrap = $('.plans');
    const cards = $$('.plans > .plan');
    if (!cards.length || !matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const MAX = 12;
    const set = (card, rx, ry) => {
      card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    };
    // inclina la card hacia un punto (cursor o dedo) y lleva el brillo ahí
    const aim = (card, cx, cy) => {
      const r = card.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (cx - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (cy - r.top) / r.height));
      set(card, (.5 - y) * MAX * 2, (x - .5) * MAX * 2);
      card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    };

    cards.forEach(card => {
      for (let i = 8; i >= 1; i--) {
        const slab = document.createElement('span');
        slab.className = 'plan__slab'; slab.setAttribute('aria-hidden', 'true');
        slab.style.setProperty('--i', i);
        card.prepend(slab);
      }
      const dim = document.createElement('span');
      dim.className = 'plan__dim'; dim.setAttribute('aria-hidden', 'true');
      card.append(dim);
    });

    if (fine) {
      cards.forEach(card => {
        let raf = 0, idle = 0;
        const move = e => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => aim(card, e.clientX, e.clientY));
        };
        card.addEventListener('pointerenter', e => {
          card.classList.add('is-tilt');
          clearTimeout(idle);
          idle = setTimeout(() => card.classList.add('is-move'), 300); // primero entra suave, después sigue al cursor
          move(e);
        });
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', () => {
          cancelAnimationFrame(raf); clearTimeout(idle);
          card.classList.remove('is-tilt', 'is-move');
          set(card, 0, 0);
        });
      });
      return;
    }

    // táctil
    wrap.classList.add('is-scroll');
    let raf = 0, visible = true;
    const scroll = () => {
      raf = 0;
      if (!visible) return;
      const vh = innerHeight;
      cards.forEach((card, i) => {
        if (card.classList.contains('is-tilt')) return; // el dedo manda
        const r = card.getBoundingClientRect();
        const p = Math.min(1, Math.max(-1, (r.top + r.height / 2 - vh / 2) / vh));
        set(card, p * 16, p * 7 * (i % 2 ? -1 : 1));
      });
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(scroll); };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; queue(); }).observe(wrap);
    }
    scroll();

    cards.forEach(card => {
      const touch = e => { const t = e.touches[0]; if (t) aim(card, t.clientX, t.clientY); };
      const release = () => { card.classList.remove('is-tilt'); queue(); };
      card.addEventListener('touchstart', e => { card.classList.add('is-tilt'); touch(e); }, { passive: true });
      card.addEventListener('touchmove', touch, { passive: true });
      card.addEventListener('touchend', release);
      card.addEventListener('touchcancel', release);
    });
  }

  /* La intro de la portada se saca del árbol cuando terminó de subir */
  function intro() {
    const el = $('.intro');
    if (!el) return;
    if (!root.classList.contains('intro-on')) { el.remove(); return; }
    el.addEventListener('animationend', e => { if (e.animationName === 'intro-up') el.remove(); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    header();
    footer();
    // el modal de casos se arma antes del idioma, así su primer render ya sale traducido
    if (window.__lcsProjects) window.__lcsProjects({ $, $$ });
    i18n();
    strips();
    reveals();
    tilt();
    intro();
  });
})();

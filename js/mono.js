/* ============================================================
   LCS — mono.js
   Motor de las páginas en blanco y negro (portada y Branding):
   header · menú móvil · footer · idioma ES|EN · tira de imágenes
   con flechas · reveals al entrar en pantalla.
   Sin dependencias.
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  root.dataset.anim = '1'; // el <head> no necesita la red de seguridad: los reveals los maneja este archivo

  const PAGE = document.body.dataset.page || '';
  const SECTION = document.body.dataset.section || 'portal';
  try { if (SECTION === 'branding') sessionStorage.setItem('lcs-path', 'branding'); } catch (e) {}

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
  };
  const NAV = NAVS[SECTION] || NAVS.portal;
  const WA = 'https://wa.me/543874834041';
  const IG = 'https://instagram.com/lcswebstudio';
  const MAIL = 'lcsdesignstudio1@gmail.com';

  const t = (es, en) => `data-es="${es}" data-en="${en}"`;
  const cur = (k) => (k === PAGE ? ' aria-current="page"' : '');

  function header() {
    const links = NAV.map(n => `<li><a href="${n.href}"${cur(n.key)} ${t(n.es, n.en)}>${n.es}</a></li>`).join('');
    const menuLinks = (SECTION === 'branding'
      ? [{ key: 'home', href: '/branding', es: 'Branding', en: 'Branding' }, ...NAV, { key: 'contacto', href: '/contacto', es: 'Contacto', en: 'Contact' }]
      : [...NAV, { key: 'contacto', href: '/contacto', es: 'Contacto', en: 'Contact' }])
      .map(n => `<li><a href="${n.href}"${cur(n.key)} ${t(n.es, n.en)}>${n.es}</a></li>`).join('');

    const html = `
      <a class="skip" href="#main" ${t('Saltar al contenido', 'Skip to content')}>Saltar al contenido</a>
      <header class="hd">
        <div class="wrap hd__in">
          <a class="hd__logo" href="${SECTION === 'branding' ? '/branding' : '/'}" aria-label="LCS">
            <img src="/assets/logo-isotipo-white.webp" alt="LCS" width="33" height="32">
          </a>
          <nav class="hd__nav" aria-label="Principal">
            <ul class="hd__links">${links}</ul>
            <a class="hd__cta" href="/contacto"${cur('contacto')} ${t('Contacto', 'Contact')}>Contacto</a>
            <div class="lang" role="group" aria-label="Idioma / Language">
              <button type="button" data-lang="es">ES</button><span aria-hidden="true">/</span><button type="button" data-lang="en">EN</button>
            </div>
            <button class="burger" type="button" aria-label="Menú" aria-expanded="false" aria-controls="mm"><span></span><span></span></button>
          </nav>
        </div>
      </header>
      <nav class="mm" id="mm" aria-label="Menú">
        <ul class="mm__links">${menuLinks}</ul>
        <div class="mm__foot">
          <a href="${IG}" target="_blank" rel="noopener">Instagram</a>
          <a href="${WA}" target="_blank" rel="noopener">WhatsApp</a>
          <a href="mailto:${MAIL}">Email</a>
          ${SECTION === 'branding' ? `<a href="/diseno-web" ${t('Diseño web', 'Web design')}>Diseño web</a>` : ''}
        </div>
      </nav>`;
    const mount = $('#chrome');
    if (mount) mount.outerHTML = html; else document.body.insertAdjacentHTML('afterbegin', html);

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
    const mount = $('#site-footer');
    if (!mount) return;
    const nav = [
      { href: '/', es: 'Inicio', en: 'Home' },
      { href: '/branding', es: 'Branding', en: 'Branding' },
      ...(SECTION === 'branding' ? NAVS.branding : []),
      { href: '/diseno-web', es: 'Diseño web', en: 'Web design' },
      { href: '/contacto', es: 'Contacto', en: 'Contact' },
    ].map(n => `<li><a href="${n.href}" ${t(n.es, n.en)}>${n.es}</a></li>`).join('');

    mount.outerHTML = `
      <footer class="ft">
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
            <a class="ft__logo" href="/" aria-label="LCS"><img src="/assets/logo-header.webp" alt="LCS" width="120" height="56" loading="lazy" decoding="async"></a>
            <div class="ft__legal">
              <span ${t('© 2026 LCS · Estudio de Branding y Diseño Web · Salta, Argentina', '© 2026 LCS · Branding &amp; Web Design Studio · Salta, Argentina')}>© 2026 LCS · Estudio de Branding y Diseño Web · Salta, Argentina</span>
              <a href="/terminos" ${t('Términos y condiciones', 'Terms &amp; conditions')}>Términos y condiciones</a>
            </div>
          </div>
        </div>
      </footer>`;
  }

  function i18n() {
    const KEY = 'lcs-lang';
    const md = $('meta[name="description"]');
    const META = {
      es: { title: document.title, desc: md ? md.content : '' },
      en: { title: document.body.dataset.titleEn || document.title, desc: document.body.dataset.descEn || '' },
    };
    let lang = 'es';
    try { lang = localStorage.getItem(KEY) === 'en' ? 'en' : 'es'; } catch (e) {}
    function apply(next) {
      lang = next === 'en' ? 'en' : 'es';
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
    }
    $$('.lang button').forEach(b => b.addEventListener('click', () => apply(b.dataset.lang)));
    apply(lang);
  }

  /* Tira de imágenes: scroll nativo con snap; las flechas avanzan de a
     una tarjeta y se apagan en los extremos (no hay vuelta infinita). */
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
      prev.addEventListener('click', () => vp.scrollBy({ left: -step(), behavior: 'smooth' }));
      next.addEventListener('click', () => vp.scrollBy({ left: step(), behavior: 'smooth' }));
      vp.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
      sync();
    });
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
    i18n();
    strips();
    reveals();
    intro();
  });
})();

/* ============================================================
   LCS — contacto.js
   Único gesto propio de la página: copiar el email al portapapeles.
   Se carga después de site.js (ambos con defer), así que el hook de
   idioma queda registrado antes de que corra el i18n inicial.
   ============================================================ */
/* Copiar el email al portapapeles, con vuelta atrás si el navegador
   no expone la Clipboard API (http, permisos denegados, etc.). */
(function () {
  var btn = document.querySelector('.ch__copy');
  if (!btn) return;
  var timer = null;
  var label = function (kind) {
    var en = (window.__lcsLang === 'en');
    return btn.getAttribute('data-' + kind + (en ? '-en' : '-es')) || btn.textContent;
  };
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    var okey = false;
    try { okey = document.execCommand('copy'); } catch (e) { okey = false; }
    document.body.removeChild(ta);
    return okey;
  }
  function done() {
    btn.classList.add('is-done');
    btn.textContent = label('done');
    clearTimeout(timer);
    timer = setTimeout(function () {
      btn.classList.remove('is-done');
      btn.textContent = label('copy');
    }, 1900);
  }
  /* site.js dispara este hook en cada cambio de idioma (y en el inicial):
     así el botón y su etiqueta accesible siguen al idioma vigente. */
  function syncLang() {
    if (!btn.classList.contains('is-done')) btn.textContent = label('copy');
    var en = (window.__lcsLang === 'en');
    btn.setAttribute('aria-label', (en ? 'Copy the email ' : 'Copiar el email ') + btn.getAttribute('data-copy'));
  }
  window.__lcsOnLang = syncLang;
  syncLang();

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    var text = btn.getAttribute('data-copy');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { if (legacyCopy(text)) done(); });
    } else if (legacyCopy(text)) {
      done();
    }
  });
})();

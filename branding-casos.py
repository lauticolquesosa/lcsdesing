# python branding-casos.py — reescribe el <main> de branding/la-vaca.html y branding/yerba-mix.html (modelo bcase.css + bcase.js).
# Fotos: Documents/Fotos casos branding/<marca>/{originales,psd,2x}; versiones web en assets/branding/casos (-800/-1400/-2000).
import os, re
from PIL import Image
R = r'C:\Users\Lauti\Documents\LCS - Mi Web'
A = '/assets/branding/casos/'
SZ = {}
for f in os.listdir(os.path.join(R, 'assets', 'branding', 'casos')):
    m = re.match(r'(.+)-2000\.webp$', f)
    if m: SZ[m.group(1)] = Image.open(os.path.join(R, 'assets', 'branding', 'casos', f)).size

def ph(name, cap, sizes, eager=False):
    w, h = SZ[name]
    return (f'<figure class="bc-ph" data-bc><img src="{A}{name}-1400.webp" srcset="{A}{name}-800.webp 800w, {A}{name}-1400.webp 1400w, {A}{name}-2000.webp 2000w" '
            f'sizes="{sizes}" alt="{cap[1]}" width="{w}" height="{h}"{"" if eager else " loading=\"lazy\""} decoding="async"><figcaption>{cap[0]}</figcaption></figure>')
def vid(name, cap):
    return (f'<figure class="bc-ph" data-bc><video src="{A}{name}.mp4" poster="{A}{name}-poster.webp" muted loop playsinline preload="none" data-auto aria-label="{cap[1]}"></video><figcaption>{cap[0]}</figcaption></figure>')
S2 = '(max-width: 760px) 100vw, 50vw'; S3 = '(max-width: 760px) 78vw, 33vw'

def use(sym, vb, cls='', label=None):
    x, y, w, h = vb.split()
    lab = f' role="img" aria-label="{label}"' if label else ' aria-hidden="true"'
    return f'<svg class="{cls}" viewBox="{vb}"{lab} focusable="false"><use href="#{sym}" x="{x}" y="{y}" width="{w}" height="{h}"/></svg>'

def page(c):
    pal = ''.join(f'<button class="bc-pal__c" type="button" data-hex="{hx}"{" data-light" if light else ""} aria-label="{n}, {hx}. Tocá para copiar"><span class="bc-pal__n">{n}</span><span class="bc-pal__v">{hx}<small>RGB {rgb}</small></span><span class="bc-pal__ok">Copiado</span></button>' for n, hx, rgb, light in c['pal'])
    icons = ''.join(f'<div class="bc-icon">{ic}</div>' for ic in c['icons'])
    facts = ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in c['facts'])
    cred = ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in c['cred'])
    return f'''<main id="main" class="bc bc--{c['k']}">

  <!-- ============ 01 · PORTADA ============ -->
  <section class="bc-hero" aria-label="{c['name']}">
    <div class="bc-hero__logo">
      <div data-in="drop">{c['hero']}</div>
      <p class="bc-hero__sub d1" data-in>{c['sub']}</p>
    </div>
    <div class="bc-hero__row d2" data-in>
      <h1 class="bc-hero__name">{c['name']}</h1>
      <p>{c['line']}</p>
      <p>{c['year']}</p>
    </div>
  </section>

  <div class="bc-body">

    <!-- ============ 02 · LA IDEA ============ -->
    <section class="bc-idea" aria-label="El proyecto">
      <p class="bc-idea__big bc-disp" data-rv>{c['big']}</p>
      <div class="bc-idea__side" data-rv>
        {''.join(f'<p>{p}</p>' for p in c['about'])}
      </div>
    </section>
    <dl class="bc-facts" data-rv>{facts}</dl>

    <!-- ============ FOTOS ============ -->
    <div class="bc-row bc-row--2">{ph(*c['r1'][0], S2, True)}{ph(*c['r1'][1], S2, True)}</div>
    <div class="bc-split">{ph(*c['split'][0], S2)}
      <div class="bc-panel bc-panel--{c['split'][1]}" data-rv>
        <p class="bc-panel__top"><span>{c['split'][2]}</span><span>{c['split'][3]}</span></p>
        <div class="bc-panel__mid">{c['split'][4]}</div>
        <p class="bc-panel__foot">{c['split'][5]}</p>
      </div>
    </div>

    <!-- ============ 03 · LA MARCA ============ -->
    <section class="bc-sys" aria-labelledby="sys-t">
      <header class="bc-sys__hd" data-rv>
        <h2 class="display" id="sys-t">La marca</h2>
        <p>{c['sys']}</p>
      </header>
      <div class="bc-logos">
        {''.join(f'<div class="bc-logo bc-panel--{t}" data-rv>{svg}<span class="bc-logo__k">{k}</span></div>' for t, svg, k in c['logos'])}
      </div>
      <div class="bc-pal" data-rv>{pal}</div>
      <div class="bc-type" data-rv>
        <div class="bc-type__aa{c.get('aa_cls', '')}" aria-hidden="true"><b>Aa</b></div>
        <div class="bc-type__list">{c['type']}</div>
      </div>
      <div class="bc-icons bc-icons--{len(c['icons'])}" data-rv>{icons}</div>
    </section>

    {c['band']}

    <div class="bc-row bc-row--3">{''.join(ph(*x, S3) for x in c['r3'])}</div>
    <div class="bc-row bc-row--2">{''.join((vid(*x[1:]) if x[0] == 'v' else ph(*x[1:], S2)) for x in c['r2b'])}</div>

    <!-- ============ CIERRE ============ -->
    <section class="bc-end" aria-label="Créditos">
      <p class="bc-idea__side" data-rv><span class="display">{c['end']}</span></p>
      <dl class="bc-cred" data-rv>{cred}</dl>
    </section>
    <a class="bc-next bc-next--{c['next'][5]}" href="{c['next'][0]}">
      <span class="bc-next__k">Siguiente caso</span>
      <span class="bc-next__t">{c['next'][1]}</span>
      <span class="bc-next__img" aria-hidden="true"><img src="{A}{c['next'][2]}-800.webp" alt="" width="800" height="1000" loading="lazy" decoding="async"></span>
    </a>

  </div>
</main>'''

LV = dict(k='lv', name='La Vaca', year='2026', line='Identidad para un bar de barrio en Grand Bourg, Salta',
  hero=use('lv-isologo', '97.47 99.95 231.47 180.62', '', 'La Vaca'), sub='COMÉ · QUEDATE · COMPARTÍ',
  big='Comé.<br>Quedate.<br>Compartí.',
  about=['<b>El proyecto.</b> La identidad completa de La Vaca: logo, sistema gráfico, packaging, señalética, piezas para redes y la web del local.',
         '<b>Quiénes son.</b> Un bar de comidas rápidas en el corazón de Grand Bourg, Salta: sándwiches, hamburguesas y papas para el ritmo nocturno del barrio, entre amigos y en familia.'],
  facts=[('Cliente', 'La Vaca'), ('Rubro', 'Gastronomía'), ('Alcance', 'Identidad, packaging y web'), ('Año', '2026')],
  r1=[('lv-afiche', ('Campaña', 'Afiche de La Vaca: una persona con la bolsa de papel en la cabeza sobre la pared roja')), ('lv-gorra', ('Merch', 'Gorra roja con el logotipo de La Vaca, mientras alguien muerde una hamburguesa'))],
  split=[('lv-bolsa', ('Bolsa de delivery', 'Bolsa de papel kraft con la frase El bajón viaja acá y el isotipo')), 2, 'Isotipo', 'Cabeza de vaca',
         use('lv-isotipo', '94.66 198.06 225.74 183.06'), 'Una cabeza de vaca construida con formas geométricas y trazos sólidos: simple, fuerte y fácil de recordar.'],
  sys='Rojo fuerte, negro y beige; dos tipografías con roles claros e íconos propios que salen del menú.',
  logos=[(1, f'<span class="bc-lock">{use("lv-isologo", "97.47 99.95 231.47 180.62", "", "La Vaca")}<span>COMÉ · QUEDATE · COMPARTÍ</span></span>', 'Isologo'),
         (2, use('lv-isotipo', '94.66 198.06 225.74 183.06'), 'Isotipo'),
         (3, use('lv-word', '493.55 445.91 256.56 69.59', '', 'La Vaca'), 'Logotipo')],
  pal=[('Rojo fuerte', '#CF1417', '207 · 20 · 23', False), ('Negro', '#1D1D1B', '29 · 29 · 27', False), ('Blanco', '#FFFFFF', '255 · 255 · 255', True), ('Beige claro', '#F7EAE5', '247 · 234 · 229', True)],
  type='<div class="bc-type__f bc-type__f--disp"><h3>Bebas Neue Pro · títulos</h3><p>COMÉ, QUEDATE, COMPARTÍ</p><small>Fuerte y compacta: la voz de los carteles, el menú y la comunicación principal.</small></div>'
       '<div class="bc-type__f bc-type__f--sans"><h3>Montserrat · textos</h3><p>Sándwiches y papas para compartir</p><small>Para el cuerpo de texto y la información, por su legibilidad.</small></div>',
  icons=[use('lv-ic-burger', '178.63 144.81 129.55 81.60', 'lv-ic'), use('lv-ic-fries', '331.88 140.02 85.79 98.02', 'lv-ic'), use('lv-ic-cow', '429.07 137.62 119.00 98.35', 'lv-ic'), use('lv-ic-burger2', '565.77 147.05 92.85 94.47', 'lv-ic')],
  band='<div class="bc-band" data-rv><p class="bc-band__t bc-disp">El bajón viaja acá</p></div>',
  r3=[('lv-envoltorio', ('Envoltorios', 'Lomito y hamburguesa envueltos en papel rojo con el logotipo')), ('lv-papas', ('Papas', 'Cajas de papas con la frase Robá una')), ('lv-menu', ('Menú', 'Menú impreso de La Vaca sobre una silla roja'))],
  r2b=[('p', 'lv-papel', ('Papel de envolver', 'Papel rojo con el patrón de íconos')), ('p', 'lv-cartel', ('Cartel', 'Cartel de vereda rojo con el logotipo')), ('v', 'lv-logo-anim', ('Logo animado', 'Animación del logo de La Vaca')), ('p', 'lv-web', ('Web', 'La web de La Vaca en un celular junto a una hamburguesa'))],
  end='El sabor<br>del barrio.',
  cred=[('Estudio', 'LCS'), ('Dirección y diseño', 'Lautaro Colque Sosa'), ('Alcance', 'Identidad, packaging, señalética y web'), ('Caso web', '<a class="txtlink arw" href="/proyectos#p1">Ver el sitio de La Vaca</a>')],
  next=('/branding/yerba-mix', 'Yerba Mix', 'ym-afiche', '#094121', '#f1e4c8', 'ym'))

YM = dict(k='ym', name='Yerba Mix', year='2025', line='Yerba mate funcional con hongos medicinales',
  hero=use('ym-logo', '61.4 57.2 692.2 358.3', '', 'Yerba Mix'), sub='YERBA FUNCIONAL',
  big='Energía natural para tu mente y tu día.',
  about=['<b>El proyecto.</b> Identidad y lanzamiento de Yerba Mix: logo, packaging, íconos, campaña y merch.',
         '<b>Qué es.</b> Una yerba mate combinada con Melena de León y Cordyceps, pensada para estudiantes y jóvenes que buscan concentración y energía sin dejar el mate.'],
  facts=[('Cliente', 'Yerba Mix'), ('Rubro', 'Yerba funcional'), ('Alcance', 'Identidad, packaging y campaña'), ('Año', '2025')],
  r1=[('ym-afiche', ('Afiche', 'Afiche de Yerba Mix: la mano sostiene un mate delante del nombre en verde')), ('ym-retrato', ('Packaging', 'Una persona sostiene el paquete de Yerba Mix frente a la cara'))],
  split=[('ym-paquete', ('Paquete de 500 g', 'Paquete de Yerba Mix y un termo negro al sol')), 2, 'Isotipo', 'Dos hojas de yerba',
         use('ym-mark', '280.7 57.2 247.8 240.8'), 'Dos hojas de yerba entre dos arcos, con el logotipo en Reforma 1918: clásico, cercano y natural.'],
  sys='Verdes y cremas que van del bosque al papel, una serif con historia e íconos ligados al campo y al mate.',
  logos=[(1, f'<span class="bc-lock">{use("ym-logo", "61.4 57.2 692.2 358.3", "", "Yerba Mix")}<span>YERBA FUNCIONAL</span></span>', 'Logo'),
         (2, use('ym-mark', '280.7 57.2 247.8 240.8'), 'Isotipo'),
         (3, use('ym-word', '61.4 293.9 692.2 121.6', '', 'Yerba Mix'), 'Logotipo')],
  pal=[('Bosque', '#094121', '9 · 65 · 33', False), ('Oliva', '#3D533B', '61 · 83 · 59', False), ('Salvia', '#7C8E5C', '124 · 142 · 92', False), ('Tierra', '#85502A', '133 · 80 · 42', False), ('Crema', '#F1E4C8', '241 · 228 · 200', True), ('Papel', '#F6F1E6', '246 · 241 · 230', True)],
  aa_cls=' bc-type__aa--sans',
  type=f'<div class="bc-type__f bc-type__f--word"><h3>Reforma 1918 · logotipo y titulares</h3><p>{use("ym-word", "61.4 293.9 692.2 121.6", "", "Yerba Mix")}</p><small>Una serif clásica, cálida y con historia.</small></div>'
       '<div class="bc-type__f bc-type__f--sans"><h3>Montserrat · bajada y textos</h3><p>Yerba funcional</p><small>Para la bajada y la información de producto, por su claridad.</small></div>',
  icons=[use('ym-ic-hoja', '490.0 453.6 85.0 68.4'), use('ym-ic-mate', '490.0 72.5 96.1 131.1'), use('ym-ic-arbol', '193.0 271.0 83.5 83.5'), use('ym-ic-helecho', '480.1 276.8 115.8 124.4'), use('ym-ic-herradura', '194.9 434.5 78.5 87.1')],
  band='<div class="bc-mate" aria-label="Calmate y tomate un mate"><p aria-hidden="true"><span><i>CAL</i><b>MATE</b></span><span><i>Y TO</i><b>MATE</b></span><span><i>UN </i><b>MATE</b></span></p></div>',
  r3=[('ym-gorra', ('Gorra', 'Gorra verde bordada con el logo de Yerba Mix')), ('ym-iconos', ('Íconos', 'Los íconos de Yerba Mix en crema sobre verde')), ('ym-industria', ('Industria Argentina', 'Sello Industria Argentina en crema sobre tierra'))],
  r2b=[('v', 'ym-logo-anim', ('Logo animado', 'Animación del logo de Yerba Mix')), ('p', 'ym-picnic', ('Picnic', 'Mate, paquete de Yerba Mix y frasco de miel sobre un mantel a cuadros'))],
  end='Con nuestra yerba,<br>rendí mejor.',
  cred=[('Estudio', 'LCS'), ('Dirección y diseño', 'Lautaro Colque Sosa'), ('Alcance', 'Identidad, packaging, campaña y merch'), ('Público', 'Estudiantes y jóvenes adultos')],
  next=('/branding/la-vaca', 'La Vaca', 'lv-afiche', '#cf1417', '#ffffff', 'lv'))

for slug, c in [('la-vaca', LV), ('yerba-mix', YM)]:
    p = os.path.join(R, 'branding', slug + '.html')
    h = open(p, encoding='utf8').read()
    a = h.index('<main'); b = h.index('</main>') + len('</main>')
    h = h[:a] + page(c) + h[b:]
    h = h.replace('<link rel="stylesheet" href="/css/caso.css" />', '<link rel="stylesheet" href="/css/bcase.css" />')
    if '/js/bcase.js' not in h:
        h = h.replace('<script src="/js/mono.js" defer></script>', '<script src="/js/bcase.js" defer></script>\n<script src="/js/mono.js" defer></script>')
    open(p, 'w', encoding='utf8', newline='\n').write(h)
    print(slug, len(h))

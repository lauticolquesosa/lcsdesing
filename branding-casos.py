# python branding-casos.py — reescribe el <main> de branding/la-vaca.html y branding/yerba-mix.html
# (estilo en css/bcase.css, movimiento en js/bcase.js). Los logos son los <symbol> vectoriales que
# ya están en cada página. Fotos: Documents/Fotos casos branding/<marca>/{originales,psd,2x};
# versiones web en assets/branding/casos (-800/-1400/-2000). No se publica (.vercelignore).
import os, re
from PIL import Image
R = os.path.dirname(os.path.abspath(__file__))
A = '/assets/branding/casos/'
SZ = {}
for f in os.listdir(os.path.join(R, 'assets', 'branding', 'casos')):
    m = re.match(r'(.+)-1400\.webp$', f)
    if m: SZ[m.group(1)] = Image.open(os.path.join(R, 'assets', 'branding', 'casos', f)).size

S_COL = '(max-width: 560px) 100vw, (max-width: 860px) 50vw, 32vw'
S_COV = '(max-width: 760px) 100vw, 40vw'

def ph(name, cap, alt, sizes=S_COL, cls='', eager=False):
    w, h = SZ[name]
    big = f', {A}{name}-2000.webp 2000w' if os.path.exists(os.path.join(R, 'assets', 'branding', 'casos', f'{name}-2000.webp')) else ''
    return (f'<figure class="bc-ph{cls}"><img src="{A}{name}-1400.webp" srcset="{A}{name}-800.webp 800w, {A}{name}-1400.webp 1400w{big}" '
            f'sizes="{sizes}" alt="{alt}" width="{w}" height="{h}"{"" if eager else " loading=\"lazy\""} decoding="async"><figcaption>{cap}</figcaption></figure>')

def vid(name, cap, alt):
    return (f'<figure class="bc-ph"><video src="{A}{name}.mp4" poster="{A}{name}-poster.webp" muted loop playsinline autoplay preload="metadata" data-auto aria-label="{alt}"></video><figcaption>{cap}</figcaption></figure>')

def media(x):
    kind, *rest = x
    return vid(*rest) if kind == 'v' else ph(*rest)

def use(sym, vb, cls='', label=None):
    x, y, w, h = vb.split()
    lab = f' role="img" aria-label="{label}"' if label else ' aria-hidden="true"'
    return f'<svg class="{cls}" viewBox="{vb}"{lab} focusable="false"><use href="#{sym}" x="{x}" y="{y}" width="{w}" height="{h}"/></svg>'

def cols(c1, c2):
    return f'<div class="bc-cols"><div class="bc-cols__c">{"".join(media(x) for x in c1)}</div><div class="bc-cols__c">{"".join(media(x) for x in c2)}</div></div>'

def aside(n, t, p, extra=''):
    return f'<div class="bc-ch__aside" data-rv><p class="bc-ch__n">{n}</p><h2 class="display bc-ch__t">{t}</h2><p class="bc-ch__p">{p}</p>{extra}</div>'

def page(c):
    meta = ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in c['meta'])
    pal = ''.join(f'<button class="bc-pal__c" type="button" data-hex="{hx}"{" data-light" if light else ""} aria-label="{n}, {hx}. Tocá para copiar"><span class="bc-pal__n">{n}</span><span class="bc-pal__v">{hx}<small>RGB {rgb}</small></span><span class="bc-pal__ok">Copiado</span></button>' for n, hx, rgb, light in c['pal'])
    logos = ''.join(f'<div class="bc-tile bc-tile--{t}">{svg}<span class="bc-tile__k">{k}</span></div>' for t, svg, k in c['logos'])
    icons = ''.join(f'<div class="bc-icon">{ic}</div>' for ic in c['icons'])
    nx = c['next']
    return f'''<main id="main" class="bc bc--{c['k']}">
  <div class="wrap">

    <!-- ============ ENCABEZADO ============ -->
    <header class="bc-head">
      <a class="bc-back" href="/branding/proyectos">Proyectos de branding</a>
      <h1 class="display bc-title">{c['name']}</h1>
      <p class="bc-lede">{c['lede']}</p>
      <dl class="bc-meta">{meta}</dl>
    </header>

    <!-- ============ PORTADA: la marca y una foto ============ -->
    <div class="bc-cover">
      <div class="bc-cover__brand"><span class="bc-cover__lock">{c['logo']}<span>{c['sub']}</span></span></div>
      {ph(*c['cover'], sizes=S_COV, eager=True)}
    </div>

    <!-- ============ 01 · LA IDEA ============ -->
    <section class="bc-ch" aria-labelledby="ch1">
      {aside('01', 'La idea', c['idea_p'], f'<p class="bc-ch__big">{c["big"]}</p>').replace('<h2 class="display bc-ch__t">', '<h2 class="display bc-ch__t" id="ch1">', 1)}
      {cols(*c['idea'])}
    </section>

    <!-- ============ 02 · LA MARCA ============ -->
    <section class="bc-ch" aria-labelledby="ch2">
      {aside('02', 'La marca', c['sys']).replace('<h2 class="display bc-ch__t">', '<h2 class="display bc-ch__t" id="ch2">', 1)}
      <div class="bc-stack">
        <div class="bc-logos">{logos}</div>
        <div class="bc-pal">{pal}</div>
        <div class="bc-type"><div class="bc-type__aa" aria-hidden="true"><b>Aa</b></div><div class="bc-type__list">{c['type']}</div></div>
        <div class="bc-icons bc-icons--{len(c['icons'])}">{icons}</div>
      </div>
    </section>

    {c['band']}

    <!-- ============ 03 · APLICACIONES ============ -->
    <section class="bc-ch" aria-labelledby="ch3">
      {aside('03', 'Aplicaciones', c['apps_p'], c.get('apps_x', '')).replace('<h2 class="display bc-ch__t">', '<h2 class="display bc-ch__t" id="ch3">', 1)}
      {cols(*c['apps'])}
    </section>

    <!-- ============ SIGUIENTE CASO ============ -->
    <a class="bc-next bc-next--{nx[3]}" href="{nx[0]}">
      <span class="bc-next__img" aria-hidden="true"><img src="{A}{nx[2]}-800.webp" alt="" width="800" height="1000" loading="lazy" decoding="async"></span>
      <span><span class="bc-next__k">Siguiente caso</span><span class="bc-next__t">{nx[1]}</span></span>
      <span class="bc-next__go" aria-hidden="true"></span>
    </a>

  </div>
</main>'''

LV = dict(k='lv', name='La Vaca', sub='COMÉ · QUEDATE · COMPARTÍ',
  lede='Identidad para un bar de comidas rápidas en Grand Bourg, Salta: marca, packaging, señalética y la web del local.',
  meta=[('Cliente', 'La Vaca'), ('Rubro', 'Gastronomía'), ('Alcance', 'Identidad, packaging y web'), ('Año', '2026')],
  logo=use('lv-isologo', '97.47 99.95 231.47 180.62', '', 'La Vaca'),
  cover=('lv-afiche', 'Campaña', 'Afiche de La Vaca: una persona con la bolsa de papel en la cabeza sobre la pared roja'),
  idea_p='Un bar de barrio para el ritmo nocturno de Grand Bourg: sándwiches, hamburguesas y papas para comer entre amigos o en familia. La marca tenía que sonar como habla el barrio.',
  big='Comé.<br>Quedate.<br>Compartí.',
  idea=([('p', 'lv-bolsa', 'Bolsa de delivery', 'Bolsa de papel kraft con la frase El bajón viaja acá'), ('p', 'lv-papas', 'Papas', 'Cajas de papas con la frase Robá una')],
        [('p', 'lv-gorra', 'Merch', 'Gorra roja con el logotipo de La Vaca'), ('p', 'lv-envoltorio', 'Envoltorios', 'Lomito y hamburguesa envueltos en papel rojo con el logotipo')]),
  sys='Una cabeza de vaca hecha con formas geométricas y trazo sólido; rojo fuerte, negro y beige; Bebas Neue Pro para la voz y Montserrat para leer, e íconos que salen del menú.',
  logos=[(1, f'<span class="bc-lock">{use("lv-isologo", "97.47 99.95 231.47 180.62", "", "La Vaca")}<span>COMÉ · QUEDATE · COMPARTÍ</span></span>', 'Isologo'),
         (2, use('lv-isotipo', '94.66 198.06 225.74 183.06'), 'Isotipo'),
         (3, use('lv-word', '493.55 445.91 256.56 69.59', '', 'La Vaca'), 'Logotipo')],
  pal=[('Rojo fuerte', '#CF1417', '207 · 20 · 23', False), ('Negro', '#1D1D1B', '29 · 29 · 27', False), ('Blanco', '#FFFFFF', '255 · 255 · 255', True), ('Beige claro', '#F7EAE5', '247 · 234 · 229', True)],
  type='<div class="bc-type__f bc-type__f--disp"><h3>Bebas Neue Pro · títulos</h3><p>COMÉ, QUEDATE, COMPARTÍ</p></div>'
       '<div class="bc-type__f bc-type__f--sans"><h3>Montserrat · textos</h3><p>Sándwiches y papas para compartir</p></div>',
  icons=[use('lv-ic-burger', '178.63 144.81 129.55 81.60', 'lv-ic'), use('lv-ic-fries', '331.88 140.02 85.79 98.02', 'lv-ic'), use('lv-ic-cow', '429.07 137.62 119.00 98.35', 'lv-ic'), use('lv-ic-burger2', '565.77 147.05 92.85 94.47', 'lv-ic')],
  band='<div class="bc-band" role="img" aria-label="Patrón de íconos de La Vaca con la frase El bajón viaja acá"><p class="bc-band__t" aria-hidden="true">El bajón viaja acá</p></div>',
  apps_p='Del envoltorio al cartel de la vereda y la web: el mismo rojo, los mismos íconos y la misma voz.',
  apps_x='<p class="bc-ch__p"><a class="txtlink arw" href="/proyectos#p1">Ver el sitio de La Vaca</a></p>',
  apps=([('p', 'lv-menu', 'Menú', 'Menú impreso de La Vaca sobre una silla roja'), ('p', 'lv-papel', 'Papel de envolver', 'Papel rojo con el patrón de íconos'), ('v', 'lv-logo-anim', 'Logo animado', 'Animación del logo de La Vaca')],
        [('p', 'lv-cartel', 'Cartel', 'Cartel de vereda rojo con el logotipo'), ('p', 'lv-web', 'Web', 'La web de La Vaca en un celular junto a una hamburguesa')]),
  next=('/branding/yerba-mix', 'Yerba Mix', 'ym-afiche', 'ym'))

YM = dict(k='ym', name='Yerba Mix', sub='YERBA FUNCIONAL',
  lede='Identidad y lanzamiento de una yerba mate funcional con hongos medicinales: marca, packaging, íconos, campaña y merch.',
  meta=[('Cliente', 'Yerba Mix'), ('Rubro', 'Yerba funcional'), ('Alcance', 'Identidad, packaging y campaña'), ('Año', '2025')],
  logo=use('ym-logo', '61.4 57.2 692.2 358.3', '', 'Yerba Mix'),
  cover=('ym-afiche', 'Afiche', 'Afiche de Yerba Mix: la mano sostiene un mate delante del nombre en verde'),
  idea_p='Una yerba mate con Melena de León y Cordyceps, pensada para estudiantes y jóvenes que buscan concentración y energía sin dejar el mate.',
  big='Energía natural para tu mente y tu día.',
  idea=([('p', 'ym-retrato', 'Packaging', 'Una persona sostiene el paquete de Yerba Mix frente a la cara'), ('p', 'ym-gorra', 'Gorra', 'Gorra verde bordada con el logo de Yerba Mix')],
        [('p', 'ym-paquete', 'Paquete de 500 g', 'Paquete de Yerba Mix y un termo negro al sol'), ('p', 'ym-picnic', 'Picnic', 'Mate, paquete de Yerba Mix y frasco de miel sobre un mantel a cuadros')]),
  sys='Dos hojas de yerba entre dos arcos y el logotipo en Reforma 1918; verdes y cremas que van del bosque al papel, e íconos ligados al campo y al mate.',
  logos=[(1, f'<span class="bc-lock">{use("ym-logo", "61.4 57.2 692.2 358.3", "", "Yerba Mix")}<span>YERBA FUNCIONAL</span></span>', 'Logo'),
         (2, use('ym-mark', '280.7 57.2 247.8 240.8'), 'Isotipo'),
         (3, use('ym-word', '61.4 293.9 692.2 121.6', '', 'Yerba Mix'), 'Logotipo')],
  pal=[('Bosque', '#094121', '9 · 65 · 33', False), ('Oliva', '#3D533B', '61 · 83 · 59', False), ('Salvia', '#7C8E5C', '124 · 142 · 92', False), ('Tierra', '#85502A', '133 · 80 · 42', False), ('Crema', '#F1E4C8', '241 · 228 · 200', True), ('Papel', '#F6F1E6', '246 · 241 · 230', True)],
  type=f'<div class="bc-type__f bc-type__f--word"><h3>Reforma 1918 · logotipo y titulares</h3><p>{use("ym-word", "61.4 293.9 692.2 121.6", "", "Yerba Mix")}</p></div>'
       '<div class="bc-type__f bc-type__f--sans"><h3>Montserrat · bajada y textos</h3><p>Yerba funcional</p></div>',
  icons=[use('ym-ic-hoja', '490.0 453.6 85.0 68.4'), use('ym-ic-mate', '490.0 72.5 96.1 131.1'), use('ym-ic-arbol', '193.0 271.0 83.5 83.5'), use('ym-ic-helecho', '480.1 276.8 115.8 124.4'), use('ym-ic-herradura', '194.9 434.5 78.5 87.1')],
  band='<div class="bc-mate" role="img" aria-label="Calmate y tomate un mate"><p aria-hidden="true"><span><i>CAL</i>MATE</span><span><i>Y TO</i>MATE</span><span><i>UN </i>MATE</span></p></div>',
  apps_p='Paquete, merch y campaña con la misma calma: el verde del monte, el crema del papel y la tradición del mate.',
  apps=([('p', 'ym-iconos', 'Íconos', 'Los íconos de Yerba Mix en crema sobre verde'), ('v', 'ym-logo-anim', 'Logo animado', 'Animación del logo de Yerba Mix')],
        [('p', 'ym-industria', 'Industria Argentina', 'Sello Industria Argentina en crema sobre tierra')]),
  next=('/branding/la-vaca', 'La Vaca', 'lv-afiche', 'lv'))

if __name__ == '__main__':
    for slug, c in [('la-vaca', LV), ('yerba-mix', YM)]:
        p = os.path.join(R, 'branding', slug + '.html')
        h = open(p, encoding='utf8').read()
        a = h.index('<main'); b = h.index('</main>') + len('</main>')
        h = h[:a] + page(c) + h[b:]
        h = h.replace('<link rel="stylesheet" href="/css/caso.css" />', '<link rel="stylesheet" href="/css/bcase.css" />')
        open(p, 'w', encoding='utf8', newline='\n').write(h)
        print('ok ·', slug)

# LCS — Manual de marca

**Estudio de Branding y Diseño Web · Salta, Argentina**

Documento de referencia del estudio: quién es, cómo habla, cómo se ve y qué dice cada
página del sitio. Todos los datos salen del código de `lcsdesignstudio.com.ar`, no de una
interpretación: los hex son los tokens de `css/base.css`, las frases son las que están
publicadas y los precios son los que hoy figuran en `inversion.html` y `branding/inversion.html`.

Última revisión: **7 de octubre de 2026**

---

## 1 · La agencia

| | |
|---|---|
| **Nombre** | LCS — Estudio de Branding y Diseño Web |
| **Nombre alternativo** | LCS Web Studio · LCS Design Studio |
| **Titular** | Lautaro Colque Sosa — Diseñador de marca, web y UX/UI |
| **Base** | Salta, Argentina · trabajo 100% remoto |
| **Zona atendida** | Argentina y Colombia |
| **Formación** | Universidad Católica de Salta (UCASAL) · Coderhouse |
| **Idiomas** | Español e inglés |
| **Sitio** | https://lcsdesignstudio.com.ar — dominio propio en NIC.ar, DNS apuntado a Vercel |
| **Dominio anterior** | `lcsdesign.vercel.app` redirige con 301 permanente a cada ruta del dominio propio (`vercel.json`) |
| **Email** | lcsdesignstudio1@gmail.com — único email del estudio, no se usa otro en ningún lado |
| **Teléfono / WhatsApp** | +54 387 483 4041 |
| **Instagram** | [@lcswebstudio](https://instagram.com/lcswebstudio) |
| **Copyright del pie** | © 2026 LCS · Estudio de Branding y Diseño Web · Salta, Argentina |

### Qué hace

Dos servicios bajo un mismo estudio: **branding** (identidad visual completa, de la
estrategia al manual de marca) y **diseño web** (sitios a medida, del concepto al sitio
publicado). Sin plantillas ni page builders en ninguno de los dos: cada marca y cada sitio
se construyen a mano.

En diseño web se puede contratar el paquete completo, **solo el diseño UX/UI** (con
prototipo listo para desarrollar) o **solo el desarrollo** a partir de un diseño existente.
En branding, los tres paquetes publicados son una guía que se combina y ajusta por charla.

### Para quién

- Negocios locales que quieren una presencia seria.
- Profesionales y portfolios.
- Marcas que necesitan convertir visitas.
- Quien busca código propio, no plantillas.

### Descripción corta (la del pie del sitio)

> LCS es un estudio de branding y diseño web con identidad propia. De la marca al sitio en
> vivo, desde Salta para todos lados.

### Rubros donde ya trabajó

Gastronomía · salud y medicina estética · construcción y desarrolladoras · arquitectura ·
paisajismo · fitness · veterinaria · inmobiliaria · industria y distribución ·
institucional · clubes · marketing · deporte (proyecto propio, sin cliente).

---

## 2 · Arquitectura del sitio — dos caminos desde el 2026-10-05

Desde el 5 de octubre de 2026 la portada (`/`) dejó de ser la home de "diseño web" y pasó a
ser un **portal con dos caminos**: Branding y Diseño web. Cada camino tiene su propia home,
sus propios servicios, proyectos e inversión, y comparte el mismo `site.js`, el mismo pie y
el mismo sistema visual. Sin barra final y con URLs limpias (`cleanUrls`).

| N.º | Ruta | Qué es |
|---|---|---|
| — | `/` | **Portal.** Dos cards —Branding y Diseño web— con su propio hero, sin servir de home de ninguno de los dos caminos. |
| 01 | `/branding` | Home del camino de branding: hero, por qué, qué te llevás, el caso La Vaca y proceso. |
| 02 | `/branding/servicios` | Qué incluye el servicio de identidad visual. |
| 03 | `/branding/proyectos` | El brandbook de La Vaca, página por página. |
| 04 | `/branding/inversion` | Los tres paquetes de branding. |
| 01 | `/diseno-web` | Home del camino de diseño web: hero, manifiesto, los seis argumentos, el carrusel de 24 casos, el proceso y las dudas. Es, en estructura, la antigua home del sitio. |
| 02 | `/servicios` | Qué incluye el servicio de diseño web. |
| 03 | `/proyectos` | Grilla de los 24 casos de diseño web. |
| 04 | `/inversion` | Los tres planes de diseño web, con precio. |
| 05 | `/contacto` | Canales de contacto, común a los dos caminos. |
| — | `/terminos` | Términos y condiciones. No está en el sitemap. |

**Redirecciones permanentes:** `/proceso` → `/servicios#proceso` · `/sobre` → `/diseno-web#beneficios`
· cualquier ruta de `lcsdesign.vercel.app` → la misma ruta en `lcsdesignstudio.com.ar`.

**Sitemap:** diez URLs (`sitemap.xml`), con prioridad 1.0 para `/`, 0.9 para las dos homes de
camino, 0.8 para servicios/proyectos de cada uno y 0.7 para las dos inversiones y contacto.

---

## 3 · Posicionamiento

### La portada (el portal)

El portal no vende un servicio: deja elegir. Titular **"Diseñamos marcas y sitios web."**,
bajada **"Branding, diseño gráfico y sitios a medida, desde Salta. Elegí por dónde
empezar."** y cierre **"De la marca al sitio en vivo, todo en un mismo estudio."** — el
argumento de que separar las dos patas no significa perder cohesión.

### El camino de diseño web

**La promesa:** *Tu web puede vender por vos todos los días.*

Todo el camino está construido sobre un solo argumento, repetido en tres alturas distintas:

1. **El problema** — «Si no te encuentran, no te compran. Y hoy la primera visita a tu
   negocio pasa por una pantalla.»
2. **El reencuadre** — «No comprás una web. Comprás un canal que trabaja.»
3. **La prueba** — «No son promesas: son sitios en vivo. Entrá y miralos antes de decidir.»

#### Los seis argumentos del estudio

Numerados 01–06 en `/diseno-web`, sobre banda verde:

| N.º | Argumento | Cómo se dice |
|---|---|---|
| 01 | Diseño a medida | Nada de plantillas: tu sitio se parece a tu negocio y no al de otros cuarenta. |
| 02 | Pensada para convertir | Cada pantalla lleva a una acción clara: escribir, llamar, reservar o comprar. |
| 03 | Rápida de verdad | Código propio y liviano. Una web lenta pierde la visita antes del primer scroll. |
| 04 | Impecable en el celular | Ahí ocurre la mayoría de las visitas, así que se diseña primero para esa pantalla. |
| 05 | Lista para Google | Estructura, textos y datos en orden para que te encuentren por lo que hacés. |
| 06 | Trato directo | Hablás siempre con quien hace el trabajo, y el soporte sigue después del lanzamiento. |

### El camino de branding

**La promesa:** *Una marca que se reconoce antes de leerse.*

Diseña identidades visuales completas —logo, color, tipografía y manual de marca— para
negocios que quieren verse serios desde el primer vistazo y sostenerlo en cada pieza. El
caso que lo sostiene hoy es uno solo, La Vaca, mostrado como brandbook completo: portada,
isologo, isotipo, retícula, áreas de reserva, versiones, tipografías, paleta, recursos
gráficos y siete aplicaciones (servilletas, vasos, productos, individuales, bolsa, envase de
papas, menú e interfaz web).

### Los cuatro diferenciales operativos

*Cómo se siente trabajar con LCS — «Pocas promesas, muchos detalles.»* Comunes a los dos
caminos:

1. **Comunicación directa** — hablás directo con el estudio, no con un intermediario.
2. **Código propio** — sin builders pesados ni plantillas.
3. **Bilingüe por defecto** — el sitio se puede entregar en español e inglés.
4. **Pensado para crecer** — estructura escalable: sumar secciones después no es empezar
   de cero.

---

## 4 · Tono de voz

### El principio

**Pocas promesas, muchos detalles.** El texto no adjetiva: nombra el problema del
cliente, da un número concreto y termina en una acción. Si una frase se puede reemplazar
por un dato, va el dato.

### Las diez reglas

1. **Voseo argentino, siempre.** *Contame, escribinos, entrá, mirá, sabés, tenés, hacés.*
   Nunca «tú» ni «usted».
2. **Segunda persona al cliente, tercera al estudio.** El lector es «vos»; el estudio es
   «LCS» o «el estudio». Se admite «nosotros» en la promesa de apertura («Diseñamos marcas y
   sitios web»). Nunca «yo».
3. **El problema antes que la solución.** Cada sección arranca por lo que le duele al
   lector, no por lo que ofrece el estudio.
4. **Números en lugar de adjetivos.** «24–48 h», «2 a 4 semanas», «24 casos», «USD 500»,
   «treinta mil cabezas por año». Nada de «rápido», «excelente», «de calidad».
5. **Frases cortas, verbo concreto.** Escribir, llamar, reservar, comprar, publicar, medir.
6. **Cero jerga de agencia.** No aparecen —y no deben aparecer— *solución integral,
   sinergia, transformación digital, innovador, líder, pasión, excelencia*. Está
   verificado: cero ocurrencias en todo el sitio.
7. **Admitir límites vende.** «A medida» en los paquetes de branding en vez de un precio
   inventado. «Versión de muestra» cuando el caso no está aprobado. «Todavía no hicieron una
   obra de ese tamaño» cuando es cierto. «Proyecto propio» cuando no hay cliente real detrás.
8. **La raya (—) para el inciso.** Es el signo de puntuación de la marca: abre una
   aclaración sin cortar la frase. Se usa mucho; los paréntesis casi nunca.
9. **Los dos puntos como bisagra.** «El riesgo era el opuesto al habitual: una web
   demasiado prolija…». Enuncia y después explica.
10. **Todo cierra en una acción.** Ninguna sección termina en una reflexión: termina en
    un enlace, un teléfono o un botón.

### Cómo suena en cada idioma

Los dos caminos son bilingües ES/EN con selector en el encabezado y persistencia en
`localStorage`. El inglés no es una traducción literal: es el mismo tono en registro
neutro («enquiries», «brochure site», «no strings attached»). El voseo se convierte en un
«you» directo, nunca en pasiva corporativa.

---

## 5 · Frases de marca

### Titulares (los que llevan `<em>` como remate)

> **Diseñamos marcas <em>y sitios web.</em>** *(portal, `/`)*
> **Una marca que se reconoce <em>antes de leerse.</em>** *(branding, `/branding`)*
> **Tu web puede vender por vos todos los días.** *(diseño web, `/diseno-web`)*
> **Identidad <em>visual.</em>** *(branding servicios)*
> **Diseño <em>Web.</em>** *(diseño web servicios)*
> **Marcas con <em>sistema.</em>** *(branding proyectos)*
> **Trabajo <em>seleccionado.</em>** *(diseño web proyectos)*
> **Cada marca, <em>a medida.</em>** *(branding inversión)*
> **Precios <em>claros.</em>** *(diseño web inversión)*
> **Trabajemos <em>juntos.</em>** *(contacto)*
> **Contame tu <em>marca.</em>** / **Contame tu <em>proyecto.</em>** *(CTA de cierre, por camino)*

### Manifiestos

> Si no te **encuentran**, no te **compran**. Y hoy la primera visita a tu negocio pasa
> por una **pantalla**. *(diseño web)*

> No comprás una web. Comprás **un canal que trabaja**. *(diseño web)*

> Cada decisión de diseño apunta a lo mismo: que quien entra entienda qué hacés, confíe y
> te escriba. Todo lo demás es decoración.

> No son promesas: son sitios en vivo. Entrá y miralos antes de decidir.

> Cuatro pasos, plazos cerrados y una sola persona respondiendo. Sabés siempre en qué
> etapa está tu web.

> Pocas promesas, muchos detalles.

> Condiciones claras, sin letra chica.

> De la marca al sitio en vivo, todo en un mismo estudio. *(portal)*

### Frases de apoyo

- «Sin plantillas.»
- «Una web lenta pierde la visita antes del primer scroll.»
- «Nada de plantillas: tu sitio se parece a tu negocio y no al de otros cuarenta.»
- «Hablás siempre con quien hace el trabajo.»
- «Contesta la misma persona que va a diseñar y programar tu sitio.»
- «En 24–48 h tenés una respuesta concreta: qué haría falta, cuánto sale y en cuánto
  tiempo está en vivo (o lista tu marca). Sin compromiso.»
- «Ves el diseño antes de que exista una sola línea de código, y opinás.»
- «Escribinos y te pasamos el precio de la tuya.»
- «Elegí por dónde empezar.» *(portal)*

### Llamados a la acción (literal, no reescribir)

| ES | EN | Dónde |
|---|---|---|
| Quiero mi web | I want my site | Hero de diseño web, servicios |
| Quiero mi marca | I want my brand | Hero de branding, servicios |
| Ver proyectos | View work | Hero de diseño web |
| Ver el brandbook | See the brandbook | Hero de branding |
| Empecemos | Let us start | CTA de cierre |
| Contame tu proyecto / tu marca | Tell me about your project / brand | CTA, FAQ |
| Ver caso | View case | Tarjetas de proyecto |
| Ver todos los proyectos | View all projects | Grilla de diseño web |
| Pedir presupuesto | Request a quote | Tarjetas de paquete de branding |
| Consultar | Inquire | Tarjetas de precio de diseño web |
| Ver rangos de inversión | See investment ranges | Pie de las dudas |
| Ver el proceso completo | See the full process | Sección de proceso |
| Escribile a LCS | Write to LCS | Contacto |

### La voz en los case studies

Cada caso de diseño web cierra con un **aprendizaje** en primera persona del oficio. Es el
lugar donde la marca se permite una tesis. Ejemplos publicados:

> «El diseño tiene que sonar como habla el cliente.» *(La Vaca)*

> «En B2B alimentario la confianza no se declara, se documenta.» *(Brunetti)*

> «Cuando un local no toma reservas ni tiene delivery, la web no está para vender online:
> está para ahorrar llamadas.» *(Doña Salta)*

> «En salud, decir que no también vende.» *(La Condesa)*

> «En una urgencia nadie lee: toca.» *(PReMeVetNOA)*

> «En una desarrolladora, la desconfianza no se vence explicando el proceso: se vence con
> fecha.» *(JMS Constructora)*

> «En un tratamiento caro, lo que decide no es el tratamiento sino quién lo hace.»
> *(Odontología Integral)*

> «Contra la desconfianza no funciona prometer más, sino dar la vara con la que te van a
> medir.» *(Nostra Construcción)*

> «Sin cliente, lo que se demuestra no es conversión: es hasta dónde llega el estudio en
> motion.» *(Leo Messi — sitio homenaje, proyecto propio)*

---

## 6 · Color

Todos los valores viven como custom properties en `:root` (`css/base.css`). Sin cambios
frente a la revisión anterior: el verde de marca sigue intacto.

### Paleta base

| Token | Hex | Nombre | Uso |
|---|---|---|---|
| `--green` | `#018751` | Verde de marca | Acento único. Fondos de banda, bordes, botones sólidos, subrayados, caret del typewriter, barra de progreso. **No se toca.** |
| `--green-d` | `#0c6e4d` | Verde profundo | Reserva para estados presionados. |
| `--green-l` | `#6df3b8` | Verde claro | Texto de acento sobre fondo oscuro: subtítulos, encabezados del pie, enlaces con flecha en banda `ink`. |
| `--cream` | `#F7F6F3` | Crema | Fondo de las bandas claras y color de texto sobre fondo oscuro. |
| `--ink` | `#0A0A0A` | Tinta | Fondo de las bandas oscuras, del `<body>` y del `theme-color` del navegador. |
| `--paper` | `#111111` | Papel | Color de texto sobre fondo claro. |
| `--gray` | `#6b6a66` | Gris | Texto secundario. Elegido por contraste: da 5:1 sobre papel; el anterior, `#8b8a86`, daba 3.2 y no pasaba. |
| `--amber` | `#e0a93e` | Ámbar | Señalización puntual. |

### Acentos derivados

| Token | Hex / valor | Por qué existe |
|---|---|---|
| `--accent` | = `--green` | Alias semántico. Todo el CSS pide `--accent`, nunca `--green` directo. |
| `--accent-text` | `#017245` | **Solo para texto chico sobre fondo claro.** El verde de marca sobre papel da 4.24:1 y no llega al mínimo legal; este tono de la misma familia llega a 5.6:1. Los fondos y bordes siguen con el verde de marca, donde el contraste no se mide. |
| `--line` | `rgba(247,246,243,.16)` | Filete sobre fondo oscuro. |
| `--line-d` | `rgba(17,17,17,.14)` | Filete sobre fondo claro. |

### Colores fuera del sistema (deliberados)

| Hex | Dónde | Por qué |
|---|---|---|
| `#F03E7C` | Punto del cursor propio | Rosa magenta: el único color ajeno a la paleta. Existe para que el cursor se lea sobre las tres bandas y para dar un guiño de personalidad. Al pasar sobre un interactivo se convierte en un anillo verde de 36 px. |
| `#25D366` | Botón flotante de WhatsApp | Verde oficial de WhatsApp. Se respeta porque el reconocimiento del ícono es el punto. |
| `#fff` | Blanco puro | Solo en `::selection`, en el `<em>` sobre banda verde, en el papel del intro de la home y en los rótulos sobre fotografía. El blanco de la marca es el crema. |

### Las tres bandas

El sitio no tiene un fondo: tiene **tres bandas de color que alternan** y le dan ritmo al
scroll, en los dos caminos. La clase de la sección define el par fondo/texto, y el
encabezado cambia de tema automáticamente al entrar en cada una.

| Clase | Fondo | Texto | Filete |
|---|---|---|---|
| `.section--paper` | `--cream` `#F7F6F3` | `--paper` `#111111` | `--line-d` |
| `.section--accent` | `--green` `#018751` | `--cream` `#F7F6F3` | — |
| `.section--ink` | `--ink` `#0A0A0A` | `--cream` `#F7F6F3` | `--line` |

### Reglas de color

- **Un solo acento.** El verde es el único color de marca. Nada de paletas secundarias.
- **El verde no se toca.** Ni el hex ni su rol.
- **Texto chico y verde sobre claro → `--accent-text`.** Nunca `--green`.
- **Verde sobre oscuro → `--green-l`.** Ahí el verde de marca sí contrasta, pero el claro
  es más legible en cuerpos chicos.
- **Bordes en vez de sombras.** Las sombras solo aparecen en el hover de las tarjetas de
  precio y en el botón flotante.

---

## 7 · Tipografía

Dos familias, ambas variables y **servidas desde el propio dominio** en `.woff2`, en dos
cortes (`latin` y `latin-ext`) con `font-display: swap`. Nada sale a un servidor de
terceros: la página carga antes y ningún externo ve a quién la visita. Las dos caras
`latin` van con `<link rel="preload">`.

| Rol | Familia | Pesos | Token | Fallback |
|---|---|---|---|---|
| **Display** | Space Grotesk | 400–700 | `--display` | "Helvetica Neue", sans-serif |
| **Texto** | Montserrat | 300–700 | `--body` | "Helvetica Neue", sans-serif |

**Space Grotesk** lleva todos los titulares, los números de sección, los botones, los
nombres de plan y los rótulos. **Montserrat** lleva el cuerpo, los leads y las listas.

### Escala tipográfica

Todo es fluido con `clamp()`: no hay breakpoints tipográficos.

| Clase | Tamaño | Peso | Interlínea | Tracking |
|---|---|---|---|---|
| `.big` (titular gigante) | `clamp(48px, 9.5vw, 168px)` | 700 | .9 | −.035em |
| `.page-hero__title` | `clamp(38px, 6.6vw, 100px)` | 700 | .92 | −.035em |
| `.hero-title` (homes de camino) | `clamp(40px, 5.6vw, 88px)` | 700 | .9 | −.035em |
| `.portal__title` (portal) | `clamp(34px, 4.6vw, 72px)` | 700 | .95 | −.035em |
| `.manifesto__text` | `clamp(28px, 4.6vw, 66px)` | 600 | 1.12 | −.025em |
| `h2.title` | `clamp(34px, 5.2vw, 76px)` | 700 | .96 | −.03em |
| `h2.title--md` | `clamp(19px, 3.4vw, 42px)` | 700 | .96 | −.03em |
| `h2.title--sm` | `clamp(24px, 2.8vw, 38px)` | 700 | .96 | −.03em |
| `.lead` | `clamp(17px, 1.7vw, 23px)` | 300 | 1.42 | −.005em |
| Cuerpo de tarjeta | `clamp(14px, 1.3vw, 16px)` | 300 | 1.55 | — |
| Nav del encabezado | 14px | 600 | — | .1em, mayúsculas |
| `.page-hero__kicker` | 12px | 600 | — | .2em, mayúsculas |
| `.link-arrow` | 12px | 700 | — | .14em, mayúsculas |
| Numeración `01`–`06` | 12–13px | 600–700 | — | .12–.14em |

### Reglas tipográficas

- **Titulares apretados.** Tracking negativo e interlínea por debajo de 1. Cuanto más
  grande el texto, más apretado.
- **Cuerpo liviano.** Montserrat 300 para leads y párrafos; 600 solo en rótulos.
- **Mayúsculas solo en etiquetas.** Nav, kickers, enlaces con flecha y números. Jamás en
  un titular ni en un párrafo.
- **`<em>` no es itálica.** En toda la marca `em { font-style: normal }`: marca el remate
  de la frase, no un énfasis tipográfico.
- **Los titulares de página van enteros en negro.** El `<em>` del `.page-hero__title`
  hereda el color del titular.
- **Medida de lectura acotada.** `.measure` = 60ch, leads de hero = 60ch, hero de cada
  camino = 38ch, bajadas de tarjeta = 46–52ch.
- **`text-wrap: balance`** en titulares de página, para que no quede una palabra colgando.

---

## 8 · Estilo visual

### Carácter

Editorial, de alto contraste y con mucho aire. Bordes finos en lugar de sombras,
tipografía grande y apretada, numeración visible y fotografía real a sangre. La página se
lee como una publicación impresa que se mueve, no como una landing de plantilla.

### Grilla y ritmo

| Token | Valor |
|---|---|
| `--maxw` (ancho útil) | `1500px` |
| `--gutter` (margen lateral) | `clamp(20px, 4.5vw, 64px)` |
| `--section-pad` (aire vertical) | `clamp(72px, 11vh, 150px)` |
| `--ease` (curva de toda la marca) | `cubic-bezier(0.16, 1, 0.3, 1)` |

Todo el contenido vive dentro de `.shell`, que centra a `--maxw` y aplica el gutter.

### Geometría

- **Esquinas rectas por defecto.** No hay radios generales.
- **`999px`** en píldoras: botones, etiqueta «Más elegido», chips.
- **`50%`** en círculos: cursor, botón flotante, avatares.
- **`10–18px`** solo en miniaturas de proyecto y tarjetas sociales.

### Componentes

| Componente | Cómo se ve |
|---|---|
| **Botón** | Píldora, borde `1.5px currentColor`, padding `15px 26px`, Space Grotesk 600 de 14px. `--solid` va en verde; `--ghost` es transparente. Al hover sube 2px e invierte fondo y texto. |
| **Enlace con flecha** | Mayúsculas de 12px con tracking .14em y flecha diagonal SVG que se desplaza 3px al hover. |
| **Tarjeta genérica** | Borde de 1px, fondo con 3% de mezcla, sube 5px al hover y el borde vira a verde. |
| **Tarjeta de precio** | Borde `1.5px`, sube 8px al hover, sombra profunda, el precio escala 1.06 y vira a verde. La destacada lleva borde verde y la etiqueta «Más elegido». |
| **Card del portal** (`.path`) | Las dos cards de camino (Branding / Diseño web), con un visual propio por camino —brandbook en abanico para Branding, navegador con captura real para Diseño web— e inclinación 3D al mouse (`data-tilt`). |
| **Columnas problema/solución** | Dos listas enfrentadas: la del dolor en gris con una cruz, la de la ganancia en verde con un tilde. Se entiende de un vistazo sin leer las dos. |
| **Fila del índice** | Filete arriba, título grande, número al costado, barra verde de 2px que crece desde arriba al hover y desplaza la fila 20px. |
| **FAQ** | `<details>` nativo con filete y un ícono que rota. Sin JavaScript. |
| **Tarjeta de proyecto** | Captura del sitio real a 1200×825 con la etiqueta «Ver caso» y la meta debajo. |

### Movimiento

Con **GSAP + ScrollTrigger** sobre el scroll nativo del navegador —sin secuestro— para
que vaya 1:1 con el gesto.

- **Intro del logo (solo portal, `/`).** Al recargar o llegar desde afuera (nunca al volver
  desde otra página ni con el botón atrás, ni con movimiento reducido), papel blanco y el
  logo completo de LCS —sin la bajada "DISEÑO WEB": el portal es del estudio entero— entra
  de izquierda a derecha de un solo golpe, como un auto de carrera: `translateX(-150%)` con
  un leve `skewX` que simula el estirón de la velocidad, frena con
  `cubic-bezier(.22,1,.36,1)` en .7 s y la cortina sube. Todo en CSS puro (`introSlide`,
  `introMarkOut`, `introOut` en `css/pages.css`): arranca en el primer cuadro sin esperar a
  ningún script y termina sola aunque falle el JS.
- **Typewriter.** Los titulares de página y **todos** los `h2.title` se tipean al entrar
  en pantalla, con un caret verde que parpadea. 26 ms por carácter en los heroes, 20 ms en
  los títulos de sección.
- **Revelado por líneas.** Los titulares gigantes suben desde `yPercent: 110` con stagger
  de .12–.13 s.
- **Revelado por clip-path.** Los leads se descubren de arriba hacia abajo.
- **Stagger.** Las grillas entran escalonadas cada .1 s.
- **Manifiesto palabra por palabra.** El texto del manifiesto se rellena de color a medida
  que se scrollea.
- **Botones magnéticos.** Los CTA marcados con `data-magnetic` siguen levemente al cursor.
- **Parallax.** Imágenes de hero con desplazamiento suave.
- **Carrusel arrastrable.** Los 24 casos de diseño web en un track finito —sin loop, sin
  degradés— recorrible con flechas, arrastre o teclado, con barra de avance.

**Reglas de movimiento:**

- Todo usa `--ease`, la misma curva.
- `prefers-reduced-motion` desactiva absolutamente todo.
- Red de seguridad: si a los 4 segundos nadie confirmó que las animaciones corren (GSAP
  caído, error de red), se quita la marca `.js` y **todo el texto queda visible igual**. El
  sitio nunca se queda en blanco.

### Chrome fijo

- **Barra de progreso** de 2px en verde, arriba de todo.
- **Encabezado fijo** transparente que al pasar los 60px de scroll se vuelve
  `rgba(10,10,10,.9)` con `blur(16px)`. El logo y el nav invierten a tinta sobre las bandas
  claras.
- **Selector ES/EN** siempre visible, junto a la hamburguesa.
- **Menú a pantalla completa** que entra con `clip-path` desde la derecha en .7 s.
- **Cursor propio** rosa `#F03E7C` de 10px que se abre a un anillo verde de 36px sobre
  cualquier interactivo. Desactivado en pantallas táctiles.
- **Botón flotante de WhatsApp** verde `#25D366` de 56px abajo a la derecha, inyectado por
  JS en todas las páginas (oculto en celular en el portal). Desaparece con el menú abierto.
- **Marca de agua** del isotipo en los heroes, al 5% de opacidad, invertida.

### Iconografía

Ocho íconos SVG en línea, guardados como custom properties y aplicados con `-webkit-mask`
/ `mask` para que se tiñan solos con `currentColor`: flecha diagonal, flecha arriba, flecha
este, Instagram, WhatsApp, tilde, cruz y sobre. Trazo de 1.8–2.6, extremos redondeados.
**No hay librería de íconos.**

### Fotografía

- Capturas **reales** de los sitios en producción, siempre a 1200×825, en `.webp`.
- Cuando un caso usa imágenes generadas con IA, **se declara en el pie del sitio**.
- El caso Leo Messi usa fotos de Wikimedia Commons bajo licencia Creative Commons, con
  créditos declarados en un diálogo propio del sitio — mismo principio que las imágenes de
  IA: la fuente nunca se esconde.
- Regla heredada de los casos: nada de bancos de imágenes en sitios de cliente, y cuando
  una foto es de referencia, se dice.
- Los assets se versionan en el nombre (`-v2`, `-v3`) al reemplazarlos, para no pelear con
  el caché inmutable de un año.

---

## 9 · Página por página

### El portal — `/`

**Título SEO:** LCS — Branding, diseño gráfico y diseño web en Salta
**Descripción:** Estudio de branding, diseño gráfico y diseño web en Salta, Argentina:
identidad visual, logo, manual de marca y sitios web a medida que venden.

Encabezado («Diseñamos marcas *y sitios web.*» + bajada), las dos cards de camino
(Branding / Diseño web, cada una con su visual, sus tags y su CTA propio), una cinta
decorativa de servicios solo en celular, y el pie con el claim «De la marca al sitio en
vivo, todo en un mismo estudio.» más WhatsApp y «Contame tu proyecto».

---

### Camino 1 · Branding

#### `/branding` — home del camino

**Título SEO:** Branding y diseño gráfico en Salta — LCS
Hero oscuro («Una marca que se reconoce *antes de leerse.*») con la construcción
geométrica del isotipo en vivo y los tres swatches de marca. Sigue con el problema que
resuelve una identidad, qué te llevás (el sistema, no un logo suelto), el caso La Vaca
mostrado página por página dentro de la misma home, el proceso y las dudas.

#### `/branding/servicios`

**Título SEO:** Identidad *visual.* Diseño de marca de punta a punta: estrategia, logo,
color, tipografía, manual y aplicaciones.

**Qué incluye:** logo (isologo, isotipo y versiones) · paleta de color · sistema
tipográfico · manual de marca · aplicaciones. Banda de trabajo (La Vaca) y la oferta de
diseño gráfico y piezas sueltas para marcas que ya tienen identidad.

#### `/branding/proyectos`

**Título SEO:** Proyectos de branding — Brandbook La Vaca · LCS
**Un solo caso publicado**, mostrado como brandbook completo en vez de grilla: La Vaca,
bar de Grand Bourg, Salta. Punto de partida, estrategia (cuatro valores y la bajada «Comé ·
Quedate · Compartí»), el sistema (isologo con cabeza de vaca geométrica, tres tipografías,
paleta de rojo/negro/blanco/beige), nueve piezas de «La marca» y siete de «Aplicaciones»,
y el enlace cruzado al caso web del mismo cliente en `/proyectos#p1`.

#### `/branding/inversion`

**Título SEO:** Precios de branding e identidad visual — LCS · Salta
**Titular:** Cada marca, *a medida.*

Tres paquetes, **todos sin precio fijo publicado** (`A medida` / `Tailored`, pendiente de
definir precios): Logo esencial, Identidad visual (*Más elegido*) y Marca completa.
Condiciones: 50% para arrancar, 1 ronda de ajustes, y el puente «Marca + web» —si después
se hace el sitio con LCS, la identidad ya queda lista para pantalla.

---

### Camino 2 · Diseño web

#### `/diseno-web` — home del camino

**Título SEO:** LCS — Diseño y desarrollo web en Salta · Sitios que venden
Es, en estructura, la antigua home del sitio completo (antes en `/`): hero en tres líneas
con el logo animado, el manifiesto y las columnas «Sin web propia» / «Con tu web hecha por
LCS», la banda verde con los seis argumentos, el carrusel de los 24 casos, el proceso en
cuatro pasos, las cuatro dudas (también `FAQPage`) y el CTA de cierre.

**Sin web propia / Con tu web hecha por LCS**

| Sin web propia | Con tu web hecha por LCS |
|---|---|
| Te buscan en Google y aparece tu competencia. | Te encuentran por lo que hacés, con tu nombre arriba. |
| Contestás las mismas preguntas diez veces por día. | El sitio responde esas preguntas por vos, a toda hora. |
| Tu marca se ve improvisada al lado de la de al lado. | Tu marca se ve profesional en la primera pantalla. |
| Todo depende de que alguien te recomiende. | Llegan consultas mientras dormís o atendés. |
| Una red social decide quién te ve, y cuándo. | El canal es tuyo: nadie te cambia el alcance. |

**El proceso (4 pasos)**

| | Paso | Qué pasa |
|---|---|---|
| 01 | Entender tu negocio | Charlamos qué vendés, a quién y qué te está frenando hoy. |
| 02 | Definir el plan | Secciones, textos y objetivo de cada pantalla. Presupuesto y plazo cerrados. |
| 03 | Diseñar y mostrar | Ves el diseño antes de que exista una sola línea de código, y opinás. |
| 04 | Publicar y acompañar | Sale en vivo, medimos qué pasa y seguimos disponibles después. |

**Las cuatro dudas** (también publicadas como `FAQPage` en datos estructurados):

- **¿Cuánto sale una web?** — Depende de cuántas secciones necesites y de si hay tienda,
  reservas o catálogo. Los rangos están publicados en la página de inversión.
- **¿Cuánto tarda?** — Un sitio institucional suele estar en vivo entre dos y cuatro
  semanas desde que están los contenidos. El plazo se cierra en el presupuesto y no se
  estira sobre la marcha.
- **Ya tengo una web, ¿sirve rehacerla?** — Si tarda en cargar, se ve mal en el celular o
  nadie te escribe desde ahí, sí. Se puede rehacer conservando dominio, contenidos y
  posicionamiento ganado.
- **¿Después la puedo actualizar yo?** — Sí. Si el proyecto lo pide, se entrega con un
  panel para cambiar textos, fotos y precios sin tocar código.

#### `/servicios`

**Titular:** Diseño *Web.*
**Qué incluye:** diseño a medida en Figma · maquetado HTML/CSS/JS · 100% responsive
(mobile-first) · animaciones y microinteracciones · listo para Google · publicación y
dominio. **Plazos:** landing 1–2 semanas · web institucional 3–4 · proyecto complejo 6–8.

#### `/proyectos`

**Titular:** Trabajo *seleccionado.*
**24 casos.** La grilla muestra seis y el resto aparece al tocar «Ver todos los
proyectos». Cada tarjeta abre un modal a pantalla completa con la estructura fija:
**Problema → Objetivo → Proceso (4 pasos) → Resultado → Aprendizaje**, más el año, la URL
en vivo, las herramientas y la captura de página completa. Los cuatro pasos del proceso se
nombran siempre igual: **01 Descubrir · 02 Definir · 03 Diseñar · 04 Entregar**
(*Discover · Define · Design · Deliver*).

#### `/inversion`

**Titular:** Precios *claros.*

| | Plan | Precio estimado | Entrega |
|---|---|---|---|
| 01 | **Landing Page** | USD 250 | 1–2 semanas |
| 02 | **Web Institucional** *(Más elegido)* | USD 500 | 3–4 semanas |
| 03 | **Web Compleja** | USD 900 | 6–8 semanas |

Condiciones: 50% para arrancar, 1 ronda de ajustes, precios en USD (pagable en pesos al
cambio del día). Extras gratis: bilingüe ES/EN, copywriting y blog/noticias; mantenimiento
mensual a cotizar.

---

### Contacto — `/contacto`

**Titular:** Trabajemos *juntos.* Común a los dos caminos.

| Canal | Dato | Para qué |
|---|---|---|
| **WhatsApp** | +54 387 483 4041 | El canal más rápido — se responde el mismo día |
| **Instagram** | @lcswebstudio | Mirá el trabajo del estudio y escribí por DM |
| **Email** | lcsdesignstudio1@gmail.com | Para briefs largos, referencias y archivos *(con botón de copiar)* |
| **Teléfono** | +54 387 483 4041 | — |
| **Ubicación** | Salta, Argentina · Remoto | — |

Antes de escribir: tipo de proyecto, identidad existente, cantidad de secciones, plazo
ideal y rango de presupuesto; videollamada después del primer contacto; respuesta dentro
de las 24–48 horas hábiles.

### Términos y condiciones — `/terminos`

El sitio pertenece a LCS, estudio operado por Lautaro Colque Sosa con base en Salta.
Alcances, plazos y precios se acuerdan de forma particular con cada cliente y quedan
reflejados en la propuesta enviada por email. El contenido del sitio es propiedad de LCS,
salvo el material de clientes usado con su autorización. Los datos del formulario se usan
únicamente para responder la consulta y no se comparten con terceros.

---

## 10 · Los 24 proyectos de diseño web

En el orden de la grilla publicada en `/proyectos` y del carrusel de `/diseno-web` (el
mismo orden en los dos lugares); los seis primeros son los visibles antes de desplegar
«Ver todos los proyectos».

| # | Proyecto | Año | Rubro / cliente | Stack | En vivo |
|---|---|---|---|---|---|
| p15 | **Hierronort** | 2026 | Distribuidor de hierro · Salta | Figma · HTML/CSS · JS | hierronort.vercel.app |
| p1 | **La Vaca** | 2025 | Bar de barrio · Grand Bourg, Salta | Figma · HTML/CSS · JS | la-vaca-web.vercel.app |
| p16 | **Paravicini Arquitectura** | 2026 | Estudio de arquitectura · Salta | Figma · Next.js · React | paraviciniarquitectura.vercel.app |
| p22 | **PReMeVetNOA** | 2026 | Policlínico veterinario · Salta | Figma · Next.js · React | premevetnoa.vercel.app |
| p23 | **Mundo Verde** | 2026 | Paisajismo · Salta y Jujuy | Figma · Next.js · React | mundo-verde-three.vercel.app |
| p6 | **IPV** | 2026 | Instituto Provincial de Vivienda · Salta | Figma · HTML/CSS · JS | ipv-salta.vercel.app |
| **p26** | **Leo Messi — sitio homenaje** | **2026** | **Proyecto propio · sin cliente, sin afiliación con el jugador** | **Figma · HTML/CSS · JS · Three.js · GSAP** | **messiweb.vercel.app** |
| p9 | **Daniel Villa Real Estate** | 2026 | Inmobiliaria · Salta | Figma · HTML/CSS · JS · Supabase | danielvilla.vercel.app |
| p20 | **Vero Saguier** | 2026 | Diseño del paisaje · Salta y Bs. As. | Figma · Next.js · React | vero-saguier.vercel.app |
| p18 | **JMS Constructora** | 2026 | Desarrolladora · La Plata | Figma · Next.js · React | jms-constructora.vercel.app |
| p25 | **Nostra Construcción** | 2026 | Desarrolladora · Villa María, Córdoba | Figma · Next.js · React | nostra-construccion.vercel.app |
| p24 | **Odontología Integral Salta** | 2026 | Odontología · Salta capital | Figma · Next.js · React | odontologia-integral-salta.vercel.app |
| p7 | **Dra. Karina Forlani** | 2026 | Odontología · Campana, Bs. As. | Figma · HTML/CSS · JS | odontologiaforlani.vercel.app |
| p10 | **Total Gym Salta** | 2026 | Gimnasio y pilates · Salta | Figma · HTML/CSS · JS | totalgymsalta.vercel.app |
| p2 | **Frigorífico Brunetti** | 2025 | Frigorífico · Salta | Figma · HTML/CSS · JS | brunetti-jade.vercel.app |
| p8 | **Baltazar Aguiar** | 2026 | Marketing gastronómico | Figma · Next.js · React | baltazar-aguiar.vercel.app |
| p3 | **Doña Salta** | 2026 | Bodegón · Salta capital | Figma · HTML/CSS · JS | dona-salta-landing.vercel.app |
| p13 | **La Condesa** | 2026 | Medicina estética · Bucaramanga, Colombia | Figma · HTML/CSS · JS | lacondesa-one.vercel.app |
| p14 | **Piel Canela** | 2026 | Spa & bronceo · Bucaramanga, Colombia | Figma · HTML/CSS · JS | pielcanela-spa.vercel.app |
| p17 | **Todo Áridos Salta** | 2026 | Áridos y piscinas · Salta | Figma · Next.js · React | todosaridosalta.vercel.app |
| p19 | **Dr. Petersen Pfister** | 2026 | Cirugía · Salta | Figma · Next.js · React | dr-petersen-pfister.vercel.app |
| p4 | **Espacio Zur** | 2026 | Movimiento consciente · Salta | Figma · HTML/CSS · JS | espacio-zur.vercel.app |
| p5 | **Jockey Club Salta** | 2026 | Club deportivo · Salta | Figma · HTML/CSS · JS | jockeyclubsalta.vercel.app |
| p21 | **Van Strate Cortese** | 2026 | Estudio de arquitectura · Santa Fe | Figma · Next.js · React | van-strate-cortese.vercel.app |

**Distribución:** 2 casos de 2025 y 22 de 2026 · 21 en Argentina, 2 en Colombia y 1 sin
geografía de cliente (proyecto propio) · 12 sitios en HTML/CSS/JS a mano, 11 en Next.js +
React y 1 (Leo Messi) que suma Three.js y GSAP sobre HTML/CSS/JS · 1 con Supabase.

**p26 — Leo Messi, el único caso sin cliente.** Sitio homenaje no oficial, sin vínculo con
Lionel Messi ni sus representantes, hecho como pieza propia del estudio para mostrar motion
avanzado: canvas 3D en el héroe, galería con profundidad real, scroll narrado con GSAP y
Lenis, sala de trofeos (8 Balones de Oro, la Copa del Mundo de Qatar 2022, 4 Champions
League, 2 Copa América, 6 Botas de Oro, el oro olímpico de Pekín 2008, 10 Ligas españolas y
la Finalissima) y la sección «Campeón del mundo» sobre Lusail, 18.12.2022. Todas las fotos
son de Wikimedia Commons con licencia Creative Commons, acreditadas en un diálogo propio
del sitio, y el pie lleva la aclaración legal fija: «Sitio homenaje no oficial. No afiliado
a Lionel Messi ni a sus representantes.»

### El caso de branding

| Proyecto | Año | Rubro / cliente | Entregables | Página |
|---|---|---|---|---|
| **La Vaca** | — | Bar de barrio · Grand Bourg, Salta | Estrategia, isologo, paleta, tipografías, brandbook, aplicaciones y web | `/branding/proyectos` |

Es el único caso de branding publicado hasta ahora, y el mismo cliente del caso web p1: el
sitio lo señala con el enlace cruzado «Ver el caso web de La Vaca».

---

## 11 · Stack y decisiones técnicas

| Capa | Qué se usa |
|---|---|
| **Diseño** | Figma |
| **Sitio propio** | HTML + CSS + JavaScript escritos a mano. Sin framework, sin build. |
| **Animación del sitio propio** | GSAP + ScrollTrigger, vendorizados localmente |
| **Proyectos de cliente** | HTML/CSS/JS a mano o Next.js + React según el caso; Supabase cuando hace falta panel; Three.js + Lenis en el proyecto propio de Leo Messi |
| **Hosting** | Vercel, con dominio propio en NIC.ar (`lcsdesignstudio.com.ar`) y DNS de Vercel |
| **Fuentes** | Self-hosted `.woff2`, dos cortes, con preload |

### Decisiones que definen el sitio

- **Portal + dos caminos, un solo motor.** `site.js` inyecta el encabezado, el menú, el
  cursor, la barra de progreso, el botón de WhatsApp y el pie en **todas** las páginas de
  los dos caminos: el marcado no se repite en ningún HTML. La navegación tiene una única
  fuente de verdad (el array `NAV`) y los datos de contacto otra (`SOCIAL`). `portal.js`
  es exclusivo de `/` y solo maneja las dos cards y la transición al entrar a un camino.
- **Bilingüe sin duplicar páginas.** Cada nodo traducible lleva `data-es` y `data-en`; el
  selector recorre el DOM y cambia también el `<title>` y la meta description. La elección
  persiste en `localStorage` bajo `lcs-lang`.
- **Accesibilidad de serie.** `prefers-reduced-motion` respetado en todo, foco visible con
  anillo verde de 2px, textos solo para lectores de pantalla (`.sr-only`), `aria-current` en
  la página activa y contrastes verificados uno por uno.
- **Sin JavaScript, se lee igual.** Los reveals arrancan ocultos solo si hay JS, y una red
  de seguridad de 4 segundos los muestra si las animaciones no llegaron a correr.
- **Seguridad por cabeceras.** CSP estricta sin `unsafe-inline` —los scripts en línea de
  cada página van por hash SHA-256—, HSTS con preload, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Permissions-Policy` con todo apagado y `frame-ancestors: none`. La
  lista de hashes se regenera con `node csp-hashes.mjs` cada vez que se toca un script en
  línea; `node csp-hashes.mjs --check` la valida antes de publicar.
- **Caché en dos velocidades.** `/assets/*` inmutable por un año; HTML, CSS y JS siempre
  revalidados. Por eso los assets se renombran con sufijo de versión al reemplazarlos.
- **SEO estructurado.** `ProfessionalService` + `Organization` + `WebSite` + `FAQPage` +
  `BreadcrumbList` en JSON-LD por página, canónicas, Open Graph y Twitter Card completos,
  sitemap de diez URLs y geolocalización declarada (`AR-A`, Salta).
- **Redirección de dominio.** Todo lo que llega a `lcsdesign.vercel.app` redirige 301 a la
  misma ruta en `lcsdesignstudio.com.ar`, para no perder el posicionamiento ganado con el
  dominio viejo.

---

## 12 · Reglas que no se negocian

1. **El verde `#018751` no se toca** — ni el hex ni su rol de acento único.
2. **Texto verde chico sobre fondo claro va en `#017245`** — el de marca no pasa contraste.
3. **Un solo email del estudio:** `lcsdesignstudio1@gmail.com`.
4. **Nada de plantillas** — es el argumento de venta y la práctica real, en los dos caminos.
5. **`<em>` nunca es itálica** — es el remate de color o de peso de una frase.
6. **Los titulares de página van enteros en negro.**
7. **Mayúsculas solo en etiquetas**, jamás en titulares ni párrafos.
8. **Toda la animación usa `--ease`** y muere con `prefers-reduced-motion`.
9. **Cero jerga de agencia** — la lista de la regla 4.6 se mantiene en cero.
10. **Los assets se renombran `-v2`, `-v3`… al reemplazarlos**, por el caché inmutable.
11. **Después de tocar un script en línea, se regenera la CSP** con `csp-hashes.mjs`.
12. **Si un dato no está confirmado, se escribe «a confirmar» o «a medida»** — no se inventa.
13. **El portal (`/`) no es la home de ningún camino** — es el selector entre Branding y
    Diseño web, y cada camino tiene su propia home, servicios, proyectos e inversión.
14. **Un caso sin cliente real se marca como tal** — «proyecto propio», sin inventar un
    brief ni una marca que no existió.

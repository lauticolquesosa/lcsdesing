# LCS Portfolio — Reestructuración de Voz de Marca
## Prompt para Claude Code · "LCS como Estudio"

> Este prompt redefine la VOZ de toda la web. No cambia el diseño visual ni la estructura
> de secciones que ya funcionan — cambia el TONO y los TEXTOS para posicionar LCS como
> un estudio de diseño web (no como un freelancer/persona).
>
> Stack: HTML plano · CSS embebido · JS vanilla · Toggle ES/EN ya funcionando.

---

## REGLA MAESTRA DE VOZ — leer antes de tocar nada

La web pasa de "Lautaro freelance" a **"LCS, estudio de diseño web"**. La voz es de **marca impersonal**.

**El sujeto de las frases es siempre LCS o el trabajo. NUNCA "nosotros" ni "yo".**

✅ Correcto: "LCS diseña…", "El estudio trabaja…", "Cada proyecto se construye…", "El enfoque de LCS…"
❌ Prohibido: "Diseñamos…", "Nuestro equipo…", "Soy diseñador…", "Trabajo con…"

**Dos únicas excepciones donde se permite voz personal:**
1. **Bloque "Dirección"** dentro de Identidad → ahí habla Lautaro en primera persona (es el director del estudio).
2. **Sección Contacto** → segunda persona hacia el cliente ("¿Tenés un proyecto?", "Escribí a LCS").

Si una frase no entra en esas dos excepciones y usa "yo/nosotros", está mal. Reescribir en voz de marca.

---

## CAMBIO 0 — NAVEGACIÓN

Renombrar el ítem de navegación:
- **"Sobre mí" → "Identidad"** (data-es="Identidad" data-en="Identity")

El resto de los ítems de nav se mantienen. Verificar que todos tengan data-es/data-en:

```html
<a href="#inicio"    data-es="Inicio"    data-en="Home">Inicio</a>
<a href="#identidad" data-es="Identidad" data-en="Identity">Identidad</a>
<a href="#servicios" data-es="Servicios" data-en="Services">Servicios</a>
<a href="#proceso"   data-es="Proceso"   data-en="Process">Proceso</a>
<a href="#proyectos" data-es="Proyectos" data-en="Work">Proyectos</a>
<!-- si existe la sección Inversión, ver CAMBIO 6 -->
<a href="#contacto"  data-es="Contacto"  data-en="Contact">Contacto</a>
```

> NOTA: el `id` de la sección puede seguir siendo `#about` internamente si cambiarlo rompe los anchors.
> Lo importante es el TEXTO visible del link ("Identidad" / "Identity").

---

## CAMBIO 1 — HEAD & META

```html
<title>LCS — Estudio de Diseño Web · Salta</title>

<meta name="description" content="LCS — Estudio de Diseño Web y UX/UI en Salta, Argentina. Diseño y desarrollo de sitios web con criterio editorial y foco en la experiencia de usuario." />
```

Actualizar también el title/description dinámicos del script del toggle (CAMBIO 10 del MD original):
- ES: `LCS — Estudio de Diseño Web · Salta`
- EN: `LCS — Web Design Studio · Salta`

---

## CAMBIO 2 — INICIO (HERO)

**Subsecciones del hero:**
1. Logo LCS jaguar (se mantiene)
2. Tag de estudio
3. Claim principal
4. Subclaim
5. CTAs
6. Barra de identidad (si existe, ajustar valores)

```html
<!-- TAG DE ESTUDIO (reemplaza "Diseñador Web · Salta") -->
<span data-es="Estudio de Diseño Web · UX/UI · Salta, Argentina"
      data-en="Web Design Studio · UX/UI · Salta, Argentina">
  Estudio de Diseño Web · UX/UI · Salta, Argentina
</span>

<!-- CLAIM PRINCIPAL -->
<h1 data-es="Presencia digital que no se discute — se construye."
    data-en="Digital presence that isn't questioned — it's built.">
  Presencia digital que no se discute — se construye.
</h1>

<!-- SUBCLAIM -->
<p data-es="LCS diseña y desarrolla sitios web para negocios que quieren ser reconocidos antes de hablar."
   data-en="LCS designs and builds websites for businesses that want to be recognized before they speak.">
  LCS diseña y desarrolla sitios web para negocios que quieren ser reconocidos antes de hablar.
</p>

<!-- CTAs -->
<a href="#proyectos" data-es="Ver proyectos →" data-en="See work →">Ver proyectos →</a>
<a href="#contacto"  data-es="Iniciar un proyecto" data-en="Start a project">Iniciar un proyecto</a>
```

Barra de identidad (si existe) — ajustar a voz de estudio:
```html
<!-- Base → Salta, Argentina | Énfasis → Web · UX/UI | Estado → Aceptando proyectos -->
<span data-es="Estudio" data-en="Studio">Estudio</span> <span>LCS · MMXXVI</span>
<span data-es="Base" data-en="Based in">Base</span> <span>Salta, Argentina</span>
<span data-es="Énfasis" data-en="Focus">Énfasis</span> <span>Web · UX/UI · Branding</span>
<span data-es="Estado" data-en="Status">Estado</span> <span data-es="Aceptando proyectos" data-en="Taking on projects">Aceptando proyectos</span>
```

---

## CAMBIO 3 — IDENTIDAD (reemplaza "Sobre mí" completo)

Esta sección se divide en **4 subsecciones** en este orden:

### Subsección 3.1 — El estudio

```html
<h2 data-es="El estudio" data-en="The studio">El estudio</h2>

<p data-es="LCS es un estudio de diseño web con base en Salta, Argentina. Diseña y desarrolla sitios para negocios que necesitan una presencia digital que los represente de verdad — con criterio editorial, atención al detalle y foco en la experiencia del usuario."
   data-en="LCS is a web design studio based in Salta, Argentina. It designs and builds websites for businesses that need a digital presence that truly represents them — with editorial judgment, attention to detail, and a focus on user experience.">
  LCS es un estudio de diseño web con base en Salta, Argentina. Diseña y desarrolla sitios para negocios que necesitan una presencia digital que los represente de verdad — con criterio editorial, atención al detalle y foco en la experiencia del usuario.
</p>

<p data-es="Cada proyecto se trabaja de forma integral: de la estrategia y la identidad visual al diseño de interfaz y el desarrollo final. El resultado son sitios que no solo se ven bien, sino que funcionan y comunican."
   data-en="Every project is handled end to end: from strategy and visual identity to interface design and final development. The result: websites that don't just look good, but work and communicate.">
  Cada proyecto se trabaja de forma integral: de la estrategia y la identidad visual al diseño de interfaz y el desarrollo final. El resultado son sitios que no solo se ven bien, sino que funcionan y comunican.
</p>
```

### Subsección 3.2 — Enfoque (filosofía del estudio)

```html
<h3 data-es="Enfoque" data-en="Approach">Enfoque</h3>

<p data-es="LCS combina la base conceptual del diseño gráfico con la metodología centrada en el usuario del UX/UI. Cada decisión visual tiene un porqué; cada interfaz, una intención. El diseño no es decoración: es la forma en que un negocio se presenta antes de decir una palabra."
   data-en="LCS combines the conceptual foundation of graphic design with the user-centered methodology of UX/UI. Every visual decision has a reason; every interface, an intention. Design isn't decoration: it's how a business introduces itself before saying a word.">
  LCS combina la base conceptual del diseño gráfico con la metodología centrada en el usuario del UX/UI. Cada decisión visual tiene un porqué; cada interfaz, una intención. El diseño no es decoración: es la forma en que un negocio se presenta antes de decir una palabra.
</p>
```

### Subsección 3.3 — Dirección (ACÁ habla Lautaro, primera persona)

```html
<h3 data-es="Dirección" data-en="Direction">Dirección</h3>

<p data-es="LCS está dirigido por Lautaro Colque Sosa, diseñador web formado en UX/UI y comunicación visual."
   data-en="LCS is led by Lautaro Colque Sosa, a web designer trained in UX/UI and visual communication.">
  LCS está dirigido por <strong>Lautaro Colque Sosa</strong>, diseñador web formado en UX/UI y comunicación visual.
</p>

<blockquote data-es="“Diseño desde Salta para negocios que quieren destacar. Mi enfoque combina la base conceptual del diseño gráfico con la metodología centrada en el usuario del UX/UI — para que cada sitio tenga criterio detrás de cada decisión.”"
            data-en="“I design from Salta for businesses that want to stand out. My approach combines the conceptual foundation of graphic design with the user-centered methodology of UX/UI — so every site has sound reasoning behind each decision.”">
  “Diseño desde Salta para negocios que quieren destacar. Mi enfoque combina la base conceptual del diseño gráfico con la metodología centrada en el usuario del UX/UI — para que cada sitio tenga criterio detrás de cada decisión.”
</blockquote>
```

### Subsección 3.4 — Formación

```html
<h3 data-es="Formación" data-en="Education">Formación</h3>

<p class="formacion-intro"
   data-es="Una formación que combina la profundidad conceptual de la academia con la especialización técnica en producto digital."
   data-en="A background that combines the conceptual depth of academia with technical specialization in digital product.">
  Una formación que combina la profundidad conceptual de la academia con la especialización técnica en producto digital.
</p>

<!-- FORMACIÓN 1 — Coderhouse -->
<div class="formacion-item">
  <div class="formacion-header">
    <h4 data-es="Carrera de Diseño UX/UI" data-en="UX/UI Design Career">Carrera de Diseño UX/UI</h4>
    <span class="formacion-meta">Coderhouse · 2023 — 2024</span>
  </div>
  <p data-es="Plan completo de 4 cursos especializados (39 semanas), del research a la interfaz final: Diseño UX/UI · Diseño UX/UI Avanzado · UX Research · UX Writing. Fundamentos de experiencia e interfaz, Design Thinking, arquitectura de información, sistemas de diseño escalables en Figma, prototipado de alta fidelidad, pruebas de usabilidad y microcopy."
     data-en="Full 4-course specialized program (39 weeks), from research to final interface: UX/UI Design · Advanced UX/UI · UX Research · UX Writing. UX and UI fundamentals, Design Thinking, information architecture, scalable design systems in Figma, high-fidelity prototyping, usability testing, and microcopy.">
    Plan completo de 4 cursos especializados (39 semanas), del research a la interfaz final: Diseño UX/UI · Diseño UX/UI Avanzado · UX Research · UX Writing. Fundamentos de experiencia e interfaz, Design Thinking, arquitectura de información, sistemas de diseño escalables en Figma, prototipado de alta fidelidad, pruebas de usabilidad y microcopy.
  </p>
  <div class="formacion-tools">
    <span data-es="Metodologías: Design Thinking · Doble Diamante"
          data-en="Methodologies: Design Thinking · Double Diamond">Metodologías: Design Thinking · Doble Diamante</span>
    <span>Figma · Miro · Maze · Hotjar · Notion</span>
  </div>
</div>

<!-- FORMACIÓN 2 — UCASAL -->
<div class="formacion-item">
  <div class="formacion-header">
    <h4 data-es="Licenciatura en Diseño Gráfico" data-en="Bachelor's in Graphic Design">Licenciatura en Diseño Gráfico</h4>
    <span class="formacion-meta"
          data-es="UCASAL · 2024 — Actualidad · 3er año"
          data-en="UCASAL · 2024 — Present · 3rd year">UCASAL · 2024 — Actualidad · 3er año</span>
  </div>
  <p data-es="Carrera universitaria de grado en comunicación visual, dictada en la Facultad de Arte y Ciencias de la Universidad Católica de Salta. Base académica sólida en los pilares del diseño: tipografía, teoría del color, morfología, semiótica, dirección de arte, identidad de marca y diseño editorial."
     data-en="University degree in visual communication, taught at the Faculty of Art and Sciences of the Catholic University of Salta. A solid academic foundation in the pillars of design: typography, color theory, morphology, semiotics, art direction, brand identity, and editorial design.">
    Carrera universitaria de grado en comunicación visual, dictada en la Facultad de Arte y Ciencias de la Universidad Católica de Salta. Base académica sólida en los pilares del diseño: tipografía, teoría del color, morfología, semiótica, dirección de arte, identidad de marca y diseño editorial.
  </p>
  <div class="formacion-tools">
    <span>Adobe Photoshop · Illustrator · InDesign</span>
  </div>
</div>
```

### Subsección 3.5 — Bento Grid (datos rápidos del estudio)

Mantener el bento si ya existe, ajustando textos a voz de estudio:

```html
<div class="bento-grid">
  <div class="bento-tile bento-tile--wide">
    <span class="bento-label" data-es="Stack del estudio" data-en="Studio stack">Stack del estudio</span>
    <div class="bento-tags">
      <span>HTML</span><span>CSS</span><span>JavaScript</span>
      <span>Figma</span><span>Adobe CC</span><span>WordPress</span>
    </div>
  </div>
  <div class="bento-tile bento-tile--accent">
    <span class="bento-status-dot"></span>
    <span class="bento-value" data-es="Disponible" data-en="Available">Disponible</span>
    <span class="bento-label" data-es="Para nuevos proyectos" data-en="For new projects">Para nuevos proyectos</span>
  </div>
  <div class="bento-tile">
    <span class="bento-value">Salta · ARG</span>
    <span class="bento-label" data-es="Local & Remoto" data-en="Local & Remote">Local & Remoto</span>
  </div>
  <div class="bento-tile">
    <span class="bento-label" data-es="Trabaja para" data-en="Works with">Trabaja para</span>
    <div class="bento-list">
      <span data-es="Gastronomía" data-en="Gastronomy">Gastronomía</span>
      <span data-es="Servicios" data-en="Services">Servicios</span>
      <span data-es="Instituciones" data-en="Institutions">Instituciones</span>
    </div>
  </div>
  <div class="bento-tile bento-tile--wide bento-tile--links">
    <a href="#" target="_blank" class="bento-link">Instagram</a>
    <a href="#" target="_blank" class="bento-link">WhatsApp</a>
    <a href="#" target="_blank" class="bento-link">Email</a>
  </div>
</div>
```

CSS de la subsección Formación (agregar al `<style>`):
```css
.formacion-intro { color: var(--muted); font-style: italic; margin: 0.5rem 0 1.5rem; }
.formacion-item {
  border-left: 2px solid rgba(17,152,102,0.35);
  padding-left: 1.25rem;
  margin-bottom: 1.5rem;
}
.formacion-header {
  display: flex; flex-wrap: wrap; align-items: baseline;
  gap: 0.5rem 1rem; margin-bottom: 0.5rem;
}
.formacion-header h4 { font-size: 1rem; color: var(--bg-light); margin: 0; }
.formacion-meta {
  font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--accent);
}
.formacion-item p { font-size: 0.85rem; line-height: 1.7; color: rgba(255,255,255,0.7); }
.formacion-tools {
  display: flex; flex-wrap: wrap; gap: 0.4rem 1.25rem; margin-top: 0.6rem;
  font-size: 0.72rem; color: var(--muted);
}
```

---

## CAMBIO 4 — SERVICIOS

**Subsecciones:** título + 3 servicios.

```html
<h2 data-es="Qué hace LCS" data-en="What LCS does">Qué hace LCS</h2>

<!-- SERVICIO 01 -->
<h3 data-es="Diseño &amp; Desarrollo Web" data-en="Web Design &amp; Development">Diseño & Desarrollo Web</h3>
<p data-es="LCS diseña y construye sitios web completos, del concepto al deploy. Performance, experiencia de usuario y una presencia que convierte visitantes en clientes."
   data-en="LCS designs and builds complete websites, from concept to deploy. Performance, user experience, and a presence that turns visitors into clients.">
  LCS diseña y construye sitios web completos, del concepto al deploy. Performance, experiencia de usuario y una presencia que convierte visitantes en clientes.
</p>

<!-- SERVICIO 02 -->
<h3 data-es="UX/UI Design" data-en="UX/UI Design">UX/UI Design</h3>
<p data-es="Investigación, estructura y diseño de interfaces centradas en el usuario. Del problema real a una solución visual que fluye sin necesidad de explicación."
   data-en="Research, structure, and user-centered interface design. From the real problem to a visual solution that flows without explanation.">
  Investigación, estructura y diseño de interfaces centradas en el usuario. Del problema real a una solución visual que fluye sin necesidad de explicación.
</p>

<!-- SERVICIO 03 -->
<h3 data-es="Branding &amp; Identidad" data-en="Branding &amp; Identity">Branding & Identidad</h3>
<p data-es="Sistemas de marca que funcionan dentro y fuera de la web. La identidad visual como base para que un sitio tenga personalidad antes de cargar la primera imagen."
   data-en="Brand systems that work on and off the web. Visual identity as the foundation for a site to have personality before the first image loads.">
  Sistemas de marca que funcionan dentro y fuera de la web. La identidad visual como base para que un sitio tenga personalidad antes de cargar la primera imagen.
</p>
```

---

## CAMBIO 5 — PROCESO

Mantener los nombres de pasos que YA están implementados (NO volver a los del jaguar). Solo ajustar los textos descriptivos a voz de marca: el sujeto es "LCS" o "el estudio", nunca "yo/nosotros".

Ejemplo de ajuste de voz por paso:
```html
<!-- Si un paso dice "Investigo el contexto del cliente…" cambiarlo a: -->
<p data-es="LCS investiga el negocio del cliente: brief, objetivos, audiencia y competencia. Antes de diseñar una pantalla, el estudio entiende qué debe resolver la web."
   data-en="LCS researches the client's business: brief, objectives, audience, and competition. Before designing a screen, the studio understands what the website must solve.">
  ...
</p>
```

Aplicar el mismo criterio a las 4 etapas: reemplazar cualquier "yo/nosotros" por "LCS / el estudio / el proceso".

---

## CAMBIO 6 — INVERSIÓN (si la sección existe)

> NOTA: detectamos una sección "Inversión" que se agregó. Si existe, ajustarla a voz de marca.
> Si tiene contenido genérico de placeholder, usar esta estructura. Si Lauti no quiere
> mostrar precios todavía, esta sección puede comunicar el "cómo se cotiza" sin números.

**Subsecciones sugeridas:**

```html
<h2 data-es="Inversión" data-en="Investment">Inversión</h2>

<p data-es="Cada proyecto de LCS se cotiza según su alcance: cantidad de páginas, complejidad funcional, diseño a medida y necesidades de identidad. No hay plantillas: hay soluciones."
   data-en="Every LCS project is quoted by scope: number of pages, functional complexity, custom design, and identity needs. No templates — solutions.">
  Cada proyecto de LCS se cotiza según su alcance: cantidad de páginas, complejidad funcional, diseño a medida y necesidades de identidad. No hay plantillas: hay soluciones.
</p>

<!-- Tres tipos de proyecto (sin precios fijos, o con "desde") -->
<div class="inversion-tipo">
  <h3 data-es="Landing Page" data-en="Landing Page">Landing Page</h3>
  <p data-es="Sitio de una página, ideal para presentar un negocio, producto o servicio con impacto."
     data-en="Single-page site, ideal for presenting a business, product, or service with impact.">
    Sitio de una página, ideal para presentar un negocio, producto o servicio con impacto.
  </p>
</div>
<div class="inversion-tipo">
  <h3 data-es="Sitio Multi-página" data-en="Multi-page Site">Sitio Multi-página</h3>
  <p data-es="Sitios institucionales o de catálogo con navegación completa y arquitectura de información."
     data-en="Institutional or catalog sites with full navigation and information architecture.">
    Sitios institucionales o de catálogo con navegación completa y arquitectura de información.
  </p>
</div>
<div class="inversion-tipo">
  <h3 data-es="Proyecto Integral" data-en="Full Project">Proyecto Integral</h3>
  <p data-es="Identidad de marca + diseño + desarrollo, de cero. La solución completa para un negocio que arranca o se reinventa."
     data-en="Brand identity + design + development, from scratch. The complete solution for a business launching or reinventing itself.">
    Identidad de marca + diseño + desarrollo, de cero. La solución completa para un negocio que arranca o se reinventa.
  </p>
</div>

<p class="inversion-cta"
   data-es="Cada proyecto es único. Escribí a LCS para una cotización a medida."
   data-en="Every project is unique. Contact LCS for a custom quote.">
  Cada proyecto es único. Escribí a LCS para una cotización a medida.
</p>
```

> Si Lauti prefiere eliminar la sección Inversión, dejar el contenido comentado y quitar el link del nav.

---

## CAMBIO 7 — PROYECTOS

**MANTENER la subsección "Todos los proyectos" tal como está implementada** (las 6 cards y sus modales con el mini-browser). NO tocar esa estructura.

Solo ajustar los textos de encabezado a voz de marca:

```html
<h2 data-es="Trabajos del estudio" data-en="Studio work">Trabajos del estudio</h2>
<p data-es="Sitios diseñados y desarrollados por LCS para negocios reales."
   data-en="Websites designed and developed by LCS for real businesses.">
  Sitios diseñados y desarrollados por LCS para negocios reales.
</p>
```

En los modales, donde diga "Rol: Diseñador Web" cambiar a:
```html
<span class="meta-value" data-es="LCS · Diseño &amp; Desarrollo Web" data-en="LCS · Web Design &amp; Development">LCS · Diseño & Desarrollo Web</span>
```

La subsección "Todos los proyectos" / contador / grilla → **se mantiene intacta.**

---

## CAMBIO 8 — CONTACTO

**Acá se permite segunda persona (calidez hacia el cliente).**

**Subsecciones:** título + intro + formulario.

```html
<h2 data-es="Trabajemos juntos" data-en="Let's work together">Trabajemos juntos</h2>

<p data-es="¿Tenés un proyecto en mente? Escribí a LCS y empecemos a darle forma."
   data-en="Got a project in mind? Get in touch with LCS and let's start shaping it.">
  ¿Tenés un proyecto en mente? Escribí a LCS y empecemos a darle forma.
</p>
```

Select "Tipo de proyecto" (voz de marca, sin "yo"):
```html
<option value=""            data-es="Seleccionar" data-en="Select">Seleccionar</option>
<option value="landing"     data-es="Landing Page" data-en="Landing Page">Landing Page</option>
<option value="multipagina" data-es="Sitio Multi-página" data-en="Multi-page Site">Sitio Multi-página</option>
<option value="integral"    data-es="Proyecto Integral" data-en="Full Project">Proyecto Integral</option>
<option value="uxui"        data-es="UX/UI" data-en="UX/UI">UX/UI</option>
<option value="branding"    data-es="Branding &amp; Identidad" data-en="Branding &amp; Identity">Branding & Identidad</option>
<option value="otro"        data-es="A definir" data-en="To be defined">A definir</option>
```

---

## CAMBIO 9 — FOOTER

```html
<span data-es="LCS · Estudio de Diseño Web" data-en="LCS · Web Design Studio">LCS · Estudio de Diseño Web</span>

<span data-es="© MMXXVI LCS · Estudio de Diseño Web · Salta, Argentina"
      data-en="© MMXXVI LCS · Web Design Studio · Salta, Argentina">
  © MMXXVI LCS · Estudio de Diseño Web · Salta, Argentina
</span>
```

---

## CRITERIOS DE CALIDAD — verificar antes de terminar

- [ ] **NO queda ningún "yo" ni "nosotros"** fuera del bloque Dirección y de Contacto. Buscar en TODO el sitio: "diseño", "trabajo", "soy", "diseñamos", "nuestro", "nuestra" → reescribir en voz de marca.
- [ ] El nav dice "Identidad / Identity" (ya no "Sobre mí")
- [ ] El title del tab dice "LCS — Estudio de Diseño Web · Salta"
- [ ] El hero presenta LCS como ESTUDIO, no como persona
- [ ] La sección Identidad tiene las 4 subsecciones: El estudio · Enfoque · Dirección · Formación (+ bento)
- [ ] El bloque Dirección es el ÚNICO lugar donde Lautaro habla en primera persona
- [ ] La Formación muestra Coderhouse (2023-24) y UCASAL (2024-actualidad, 3er año)
- [ ] Servicios, Proceso e Inversión usan "LCS / el estudio" como sujeto
- [ ] La subsección "Todos los proyectos" quedó INTACTA (cards + modales + mini-browser)
- [ ] Los modales dicen "LCS · Diseño & Desarrollo Web" en el Rol
- [ ] Contacto usa segunda persona (cálido) — permitido
- [ ] El footer dice "LCS · Estudio de Diseño Web"
- [ ] Todos los textos nuevos tienen data-es y data-en y el toggle los traduce

---

## RESUMEN DE LA TRANSFORMACIÓN

| Antes | Ahora |
|---|---|
| Lautaro freelance | LCS, estudio de diseño web |
| "Soy diseñador…" | "LCS diseña…" |
| "Sobre mí" | "Identidad" |
| Voz personal en todo | Voz de marca (excepto Dirección y Contacto) |
| Lautaro = la web | Lautaro = director del estudio |

El logo jaguar es ahora oficialmente la marca del estudio LCS.

---

*Fin del prompt. Voz de marca impersonal, decidida por Lautaro. Formación verificada vía fuentes oficiales de Coderhouse y UCASAL.*

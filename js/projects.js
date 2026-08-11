/* ============================================================
   LCS — projects.js
   Case-study data + full-screen modal.
   Loaded only on the Proyectos page; site.js calls
   window.__lcsProjects(ctx) during boot.
   ============================================================ */
(function () {
  'use strict';

  const PROJECTS = {
    p1: {
      year: '2025', url: 'la-vaca-web.vercel.app', full: ['lavaca-fullpage-v2.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web + UX/UI', title: 'La Vaca — Restaurante', role: 'LCS · Diseño & Desarrollo Web', client: 'La Vaca · Salta',
        problem: 'La Vaca, una propuesta gastronómica de Salta, no tenía una web que estuviera a la altura de su carta ni de su experiencia en salón. El cliente potencial llegaba desde redes y no encontraba menú, ubicación ni una forma directa de reservar.',
        goal: 'Construir una presencia web con identidad propia que transmita la calidad del lugar y convierta la visita en una reserva por WhatsApp, sin fricción.',
        steps: [['01','Descubrir','Research del público local y de turismo gastronómico'],['02','Definir','Foco en menú, ambiente y reserva por WhatsApp'],['03','Diseñar','Wireframes mobile-first → alta fidelidad en Figma'],['04','Entregar','Desarrollo responsive, optimización de carga y CTA']],
        result: 'Sitio en vivo, responsive y con estética cálida y regional. Menú claro, galería del salón y CTA de reserva por WhatsApp presente en todo el scroll.',
        learn: 'En gastronomía, la foto y la cercanía al botón de reserva mandan: cuanto más corto el camino a WhatsApp, mayor la conversión.' },
      en: { cat: 'Web Design + UX/UI', title: 'La Vaca — Restaurant', role: 'LCS · Web Design & Development', client: 'La Vaca · Salta',
        problem: 'La Vaca, a Salta dining spot, had no website that matched its menu or its in-room experience. Potential guests arrived from social media and found no menu, location, or a direct way to book.',
        goal: 'Build a web presence with its own identity that conveys the quality of the place and turns the visit into a WhatsApp booking, friction-free.',
        steps: [['01','Discover','Research on the local audience and food tourism'],['02','Define','Focus on menu, atmosphere and WhatsApp booking'],['03','Design','Mobile-first wireframes → high fidelity in Figma'],['04','Deliver','Responsive build, load optimization and CTA']],
        result: 'Live, responsive site with a warm, regional aesthetic. Clear menu, room gallery and a WhatsApp booking CTA present throughout the scroll.',
        learn: 'In hospitality, photos and proximity to the booking button rule: the shorter the path to WhatsApp, the higher the conversion.' }
    },
    p2: {
      year: '2025', url: 'brunetti-jade.vercel.app', full: ['brunetti-fullpage.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web', title: 'Frigorífico Brunetti', role: 'LCS · Diseño & Desarrollo Web', client: 'Frigorífico Brunetti · Salta',
        problem: 'Frigorífico Brunetti, empresa de la industria alimentaria de Salta, necesitaba una web institucional que comunicara seriedad, trazabilidad y escala a clientes mayoristas, distinguiéndose de la competencia regional.',
        goal: 'Posicionar a la empresa como referente confiable del rubro y generar contacto comercial directo con compradores y distribuidores.',
        steps: [['01','Descubrir','Análisis del rubro y de la audiencia B2B'],['02','Definir','Mensaje central: calidad, trazabilidad y capacidad'],['03','Diseñar','Identidad sobria y estructura institucional en Figma'],['04','Entregar','Desarrollo responsive y vías de contacto comercial']],
        result: 'Sitio institucional en vivo, sobrio y profesional, con secciones de productos, procesos y contacto comercial directo, optimizado para mobile y desktop.',
        learn: 'En B2B alimentario, la confianza se diseña: la consistencia visual y la claridad de la información pesan más que cualquier efecto.' },
      en: { cat: 'Web Design', title: 'Frigorífico Brunetti', role: 'LCS · Web Design & Development', client: 'Frigorífico Brunetti · Salta',
        problem: 'Frigorífico Brunetti, a Salta food-industry company, needed a corporate site that conveyed credibility, traceability and scale to wholesale clients, standing apart from regional competitors.',
        goal: 'Position the company as a trusted reference in its sector and open direct commercial contact with buyers and distributors.',
        steps: [['01','Discover','Sector analysis and B2B audience'],['02','Define','Core message: quality, traceability and capacity'],['03','Design','Sober identity and corporate structure in Figma'],['04','Deliver','Responsive build and commercial contact channels']],
        result: 'Live corporate site, sober and professional, with product, process and direct commercial-contact sections, optimized for mobile and desktop.',
        learn: 'In B2B food, trust is designed: visual consistency and clear information matter more than any effect.' }
    },
    p3: {
      year: '2026', url: 'dona-salta-landing.vercel.app', full: ['donasalta-fullpage.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web + UX/UI', title: 'Doña Salta', role: 'LCS · Diseño & Desarrollo Web', client: 'Doña Salta · Salta capital',
        problem: 'Doña Salta es un bodegón histórico frente a la Basílica de San Francisco, con 25.000+ reseñas en Google, 4,5 estrellas y el Travelers\' Choice 2025 de TripAdvisor. Toda esa reputación vivía en plataformas de terceros: no había un sitio propio donde el turista viera la carta, los horarios ni entendiera qué hace distinta a una empanada al horno de barro.',
        goal: 'Convertir la reputación dispersa en una web propia que ordene carta, horarios y ubicación, y que empuje al take-out por teléfono — el canal real del local, que no toma reservas ni tiene delivery propio.',
        steps: [['01','Descubrir','Reseñas, público turista y competencia del casco histórico'],['02','Definir','Prioridad: empanadas, horno de barro, carta y cómo llegar'],['03','Diseñar','Dirección de arte de bodegón: ladrillo, barro y tipografía con carácter'],['04','Entregar','Sitio responsive con click-to-call, WhatsApp y mapa']],
        result: 'Landing larga con las cuatro empanadas explicadas una por una, la sección del horno de barro y el repulgue, carta completa con precios, prueba social (25.000 reseñas, TripAdvisor, 16.000 seguidores) y CTA de take-out siempre a mano.',
        learn: 'Cuando el producto tiene un ritual detrás — el repulgue de trece pliegues, la leña que nunca se apaga — contarlo vende más que cualquier foto suelta.' },
      en: { cat: 'Web Design + UX/UI', title: 'Doña Salta', role: 'LCS · Web Design & Development', client: 'Doña Salta · Salta',
        problem: 'Doña Salta is a historic bodegón facing the San Francisco Basilica, with 25,000+ Google reviews, 4.5 stars and TripAdvisor\'s 2025 Travelers\' Choice. All that reputation lived on third-party platforms: there was no site of its own where visitors could see the menu, the hours, or understand what makes a clay-oven empanada different.',
        goal: 'Turn scattered reputation into an owned site that organizes menu, hours and location, and pushes phone take-out — the venue\'s real channel, since it takes no bookings and has no delivery of its own.',
        steps: [['01','Discover','Reviews, tourist audience and old-town competition'],['02','Define','Priority: empanadas, clay oven, menu and directions'],['03','Design','Bodegón art direction: brick, clay and type with character'],['04','Deliver','Responsive site with click-to-call, WhatsApp and map']],
        result: 'A long landing page explaining all four empanadas one by one, a section on the clay oven and the hand-crimped edge, a full priced menu, social proof (25,000 reviews, TripAdvisor, 16,000 followers) and a take-out CTA always within reach.',
        learn: 'When the product has a ritual behind it — thirteen hand folds, a fire that never goes out — telling it sells more than any standalone photo.' }
    },
    p4: {
      year: '2026', url: 'espacio-zur.vercel.app', full: ['zur-fullpage.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web + UX/UI', title: 'Espacio Zur', role: 'LCS · Diseño & Desarrollo Web', client: 'Espacio Zur · Barrio Casa del Sol, Salta',
        problem: 'Espacio Zur no es un gimnasio y no quería parecerlo. Su propuesta —movimiento consciente, seis disciplinas y clases personalizadas de recuperación— se confundía con la de cualquier gym de barrio en el momento en que alguien la buscaba online.',
        goal: 'Construir una identidad digital que separe a Zur del gimnasio tradicional y lleve la consulta al WhatsApp, que es donde se reserva la clase.',
        steps: [['01','Descubrir','Qué buscan quienes llegan por dolor, postura o vuelta a la actividad'],['02','Definir','Mensaje: "más que un gimnasio", cuerpo + mente + identidad'],['03','Diseñar','Sistema sobrio y editorial, secciones numeradas 01–04'],['04','Entregar','Sitio responsive con FAQ, WhatsApp e Instagram directos']],
        result: 'Sitio en vivo con las seis disciplinas explicadas una a una, un bloque dedicado a clases personalizadas de recuperación con sus seis beneficios, FAQ que resuelve las dudas de entrada ("¿necesito experiencia previa?") y reserva por WhatsApp desde cualquier punto del scroll.',
        learn: 'Cuando la categoría está saturada, el diseño tiene que decir primero lo que la marca no es. Todo el sistema visual se construyó alrededor de esa distancia.' },
      en: { cat: 'Web Design + UX/UI', title: 'Espacio Zur', role: 'LCS · Web Design & Development', client: 'Espacio Zur · Casa del Sol, Salta',
        problem: 'Espacio Zur is not a gym and did not want to look like one. Its offer — conscious movement, six disciplines and personalized recovery sessions — blended into any neighbourhood gym the moment someone searched for it online.',
        goal: 'Build a digital identity that separates Zur from the traditional gym and drives the enquiry to WhatsApp, where classes are actually booked.',
        steps: [['01','Discover','What people arriving with pain, posture or a comeback are looking for'],['02','Define','Message: "more than a gym", body + mind + identity'],['03','Design','Sober, editorial system with numbered 01–04 sections'],['04','Deliver','Responsive site with FAQ and direct WhatsApp/Instagram']],
        result: 'Live site with all six disciplines explained one by one, a dedicated block for personalized recovery sessions and their six benefits, an FAQ that clears entry doubts ("do I need previous experience?"), and WhatsApp booking from anywhere in the scroll.',
        learn: 'When a category is crowded, design has to say first what the brand is not. The whole visual system was built around that distance.' }
    },
    p5: {
      year: '2026', url: 'jockeyclubsalta.vercel.app', full: ['jockey-fullpage.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web + UX/UI', title: 'Jockey Club Salta', role: 'LCS · Diseño & Desarrollo Web', client: 'Jockey Club de Salta · Sede Limache',
        problem: 'El Jockey Club de Salta —el Rojo y Blanco desde 1965, campeón 2026, con seis deportes y dos sedes— necesitaba una home que no fuera un tablón de anuncios institucional. El desafío era transmitirle a alguien de afuera algo que los socios solo saben desde adentro: qué es ser del Jockey.',
        goal: 'Diseñar una home-manifiesto que haga sentir la pertenencia antes de informar, y recién después abra las seis puertas del club: historia, camadas, espacios, vida social, disciplinas y experiencia.',
        steps: [['01','Descubrir','Historia del club, camadas, rituales y tercer tiempo'],['02','Definir','Home como manifiesto, no como índice de secciones'],['03','Diseñar','Scroll narrado en siete tiempos, con sonido y paleta rojo/blanco'],['04','Entregar','Prototipo de alta fidelidad + navegación a seis secciones']],
        result: 'Home-manifiesto con scroll narrativo ("acá no se viene a mirar, se viene a pertenecer"), capa de sonido opcional y una grilla de seis puertas que ordena todo el club. Cierra con la sede de Limache, el anexo Las Costas y el CTA de hacerse socio.',
        learn: 'En una institución con historia, el mejor argumento de conversión no es la información: es el sentido de pertenencia. La arquitectura se ordenó para que la emoción venga primero y el dato después.' },
      en: { cat: 'Web Design + UX/UI', title: 'Jockey Club Salta', role: 'LCS · Web Design & Development', client: 'Jockey Club de Salta · Limache',
        problem: 'Jockey Club de Salta — the Red and White since 1965, 2026 champions, six sports and two grounds — needed a homepage that was not an institutional noticeboard. The challenge was conveying to an outsider something only members know from the inside: what it means to belong to the Jockey.',
        goal: 'Design a manifesto-homepage that makes belonging felt before it informs, and only then opens the club\'s six doors: history, cohorts, grounds, social life, sports and experience.',
        steps: [['01','Discover','Club history, cohorts, rituals and the third half'],['02','Define','Home as a manifesto, not a section index'],['03','Design','Narrated scroll in seven beats, with sound and a red/white palette'],['04','Deliver','High-fidelity prototype + navigation to six sections']],
        result: 'A manifesto homepage with narrative scroll ("you don\'t come here to watch, you come to belong"), an optional sound layer and a six-door grid that organizes the whole club. It closes with the Limache grounds, the Las Costas annex and a membership CTA.',
        learn: 'In an institution with history, the strongest conversion argument is not information — it is belonging. The architecture was ordered so emotion comes first and data second.' }
    },
    p6: {
      year: '2026', url: 'ipv-salta.vercel.app', full: ['ipv-fullpage.webp', 'ipv-fullpage2.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web + UX/UI', title: 'IPV', role: 'LCS · Diseño & Desarrollo Web', client: 'Instituto Provincial de Vivienda · Salta',
        problem: 'El IPV concentra trámites de altísimo volumen y muy alta ansiedad: inscripción a vivienda, boletas, turnos, sorteos, cambios de titularidad. Todo eso convivía sin jerarquía, y la persona que entra con una sola pregunta ("¿salí sorteada?", "¿dónde pago?") tenía que adivinar el camino.',
        goal: 'Rediseñar la arquitectura de información alrededor de las cinco tareas más buscadas, para que se resuelvan desde la primera pantalla sin navegar de más.',
        steps: [['01','Descubrir','Inventario de trámites y volumen real de consultas'],['02','Definir','Cinco accesos directos por encima de todo lo demás'],['03','Diseñar','Sistema institucional accesible, agrupado por intención'],['04','Entregar','Sitio responsive con noticias, programas y sedes']],
        result: 'Home con cinco accesos directos arriba de todo (inscribirme, pagar boleta, sacar turno, ver requisitos, consultar estado), trámites agrupados por intención en seis bloques, calendario de sorteos con fechas y cupos, y las cuatro sedes con dirección y teléfono. Incluye alerta de falsos gestores.',
        learn: 'En un sitio público el éxito no se mide en tiempo de permanencia sino en lo contrario: cuánto tarda alguien en resolver e irse. La home se diseñó para vaciarse rápido.' },
      en: { cat: 'Web Design + UX/UI', title: 'IPV', role: 'LCS · Web Design & Development', client: 'Provincial Housing Institute · Salta',
        problem: 'IPV concentrates high-volume, high-anxiety procedures: housing registration, bills, appointments, draws, title transfers. All of it coexisted without hierarchy, and someone arriving with a single question ("did my number come up?", "where do I pay?") had to guess the path.',
        goal: 'Redesign the information architecture around the five most-sought tasks, so they resolve from the first screen without extra navigation.',
        steps: [['01','Discover','Inventory of procedures and real query volume'],['02','Define','Five shortcuts above everything else'],['03','Design','Accessible institutional system, grouped by intent'],['04','Deliver','Responsive site with news, programs and offices']],
        result: 'A homepage with five shortcuts above the fold (register, pay bill, book appointment, see requirements, check status), procedures grouped by intent into six blocks, a draw calendar with dates and quotas, and all four offices with address and phone. Includes a fake-agents warning.',
        learn: 'On a public site, success is not measured in time on page but the opposite: how fast someone resolves and leaves. The homepage was designed to empty out quickly.' }
    },
    p7: {
      year: '2026', url: 'odontologiaforlani.vercel.app', full: ['forlani-fullpage.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web + UX/UI', title: 'Dra. Karina Forlani', role: 'LCS · Diseño & Desarrollo Web', client: 'Dra. Karina Forlani · Campana, Buenos Aires',
        problem: 'La Dra. Forlani lleva más de quince años haciendo ortodoncia estética en Campana y ya cambió más de doscientas sonrisas, pero no tenía dónde mostrarlo. Quien buscaba alineadores invisibles en la zona encontraba solo cadenas y precios, sin poder ver a la profesional que iba a atenderlo.',
        goal: 'Poner la confianza en el centro: mostrar resultados reales y llevar la consulta directo al WhatsApp, sin formularios ni intermediarios.',
        steps: [['01','Descubrir','Dudas reales del paciente antes de empezar un tratamiento'],['02','Definir','Eje: mínima invasión, plan digital 3D y trato directo'],['03','Diseñar','Estética clínica cálida, con foco en el antes/después'],['04','Entregar','Sitio responsive, comparador y WhatsApp en todo el scroll']],
        result: 'Sitio en vivo con comparador deslizable de antes y después sobre un caso real publicado con permiso, el tratamiento explicado sin tecnicismos, el proceso en cuatro pasos (consulta y escaneo, plan 3D, entrega, seguimiento) y seis preguntas frecuentes que responden lo que frena la decisión: cuánto dura, si duele, cuánto sale.',
        learn: 'En salud, el antes y después hace el trabajo pesado — pero solo si va acompañado de la persona que atiende. Mostrar la cara de la profesional convirtió más que cualquier listado de tecnología.' },
      en: { cat: 'Web Design + UX/UI', title: 'Dra. Karina Forlani', role: 'LCS · Web Design & Development', client: 'Dra. Karina Forlani · Campana, Buenos Aires',
        problem: 'Dr. Forlani has spent over fifteen years doing aesthetic orthodontics in Campana and has changed more than two hundred smiles, but had nowhere to show it. Anyone searching for invisible aligners nearby found only chains and prices, never the professional who would treat them.',
        goal: 'Put trust at the centre: show real results and take the enquiry straight to WhatsApp, with no forms and no middlemen.',
        steps: [['01','Discover','Real patient doubts before starting treatment'],['02','Define','Core: minimal invasion, 3D digital plan and direct care'],['03','Design','Warm clinical aesthetic focused on before/after'],['04','Deliver','Responsive site, comparison slider and WhatsApp throughout']],
        result: 'Live site with a draggable before/after slider on a real case published with the patient\'s permission, the treatment explained without jargon, a four-step process (consultation and scan, 3D plan, delivery, follow-up) and six FAQs answering what actually stalls the decision: how long, does it hurt, what does it cost.',
        learn: 'In healthcare the before/after does the heavy lifting — but only alongside the person providing care. Showing the practitioner\'s face converted better than any list of technology.' }
    },
    p8: {
      year: '2026', url: 'baltazar-aguiar.vercel.app', full: ['baltazar-fullpage.webp'], tools: ['Figma', 'Next.js', 'React'],
      es: { cat: 'Diseño Web + UX/UI', title: 'Baltazar Aguiar', role: 'LCS · Diseño & Desarrollo Web', client: 'Baltazar Aguiar · Marketing gastronómico',
        problem: 'Baltazar asesora a dueños de restaurantes y tiene una comunidad de casi treinta mil personas, pero toda su autoridad vivía en Instagram y TikTok. Sin un sitio propio, el seguidor que quería contratarlo no tenía dónde entender la oferta ni ver la prueba de que el sistema funciona.',
        goal: 'Transformar audiencia en clientes: una landing de venta que ordene diagnóstico, método, resultados y programa, y termine en una llamada agendada.',
        steps: [['01','Descubrir','Objeciones reales del dueño de restaurante antes de contratar'],['02','Definir','Estructura de venta: diagnóstico → método → prueba → oferta'],['03','Diseñar','Dirección editorial oscura, tipografía display y números grandes'],['04','Entregar','Desarrollo en Next.js, responsive y con CTA por WhatsApp']],
        result: 'Landing larga de conversión: diagnóstico en tres causas, método en cuatro etapas, bloque de resultados con cifras ($26M de facturación mensual partiendo de 15M, +20 negocios, ×2 en promedio), cuatro casos cortos, el programa desglosado en cuatro preguntas y seis FAQ que desarman las objeciones de precio y tiempo.',
        learn: 'Para vender un servicio de marketing, la web tiene que demostrar el marketing. Cada sección se ordenó como un argumento y no como un apartado del sitio.' },
      en: { cat: 'Web Design + UX/UI', title: 'Baltazar Aguiar', role: 'LCS · Web Design & Development', client: 'Baltazar Aguiar · Restaurant marketing',
        problem: 'Baltazar advises restaurant owners and has a community of nearly thirty thousand people, but all his authority lived on Instagram and TikTok. With no site of his own, a follower ready to hire him had nowhere to understand the offer or see proof that the system works.',
        goal: 'Turn audience into clients: a sales landing organizing diagnosis, method, results and program, ending in a booked call.',
        steps: [['01','Discover','Real owner objections before hiring'],['02','Define','Sales structure: diagnosis → method → proof → offer'],['03','Design','Dark editorial direction, display type and big numbers'],['04','Deliver','Next.js build, responsive, with WhatsApp CTA']],
        result: 'A long conversion landing: a three-cause diagnosis, a four-stage method, a results block with figures ($26M monthly revenue up from $15M, 20+ businesses, ×2 on average), four short cases, the program broken into four questions, and six FAQs dismantling price and time objections.',
        learn: 'To sell a marketing service, the site has to demonstrate the marketing. Every section was ordered as an argument, not as a page area.' }
    },
    p9: {
      year: '2026', url: 'danielvilla.vercel.app', full: ['danielvilla-fullpage.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript', 'Supabase'],
      es: { cat: 'Diseño Web + Producto', title: 'Daniel Villa Real Estate', role: 'LCS · Diseño, Desarrollo & Panel', client: 'Daniel Villa Real Estate · Salta',
        problem: 'Daniel Villa es corredor matriculado y fue reconocida como la mejor inmobiliaria de Salta, pero su catálogo vivía en redes: cada propiedad se publicaba suelta, sin ficha, sin historial de operaciones cerradas y sin forma de actualizar precios rápido.',
        goal: 'Darle un catálogo propio y actualizable sin depender de nadie, y usar las ventas cerradas como prueba comercial para captar propietarios que quieran vender.',
        steps: [['01','Descubrir','Cómo se publica hoy y qué mira el comprador en Salta'],['02','Definir','Catálogo + zonas + vendidas + tasación como cuatro pilares'],['03','Diseñar','Estética sobria de real estate, foto grande y ficha clara'],['04','Entregar','Sitio + panel privado con Supabase para autogestión']],
        result: 'Sitio con catálogo en vivo (venta y alquiler, con precio, dormitorios, baños y m²), sección de zonas, una vitrina de operaciones cerradas que funciona como prueba de ventas y un flujo de tasación por WhatsApp. Detrás, un panel privado con Supabase donde se cargan, ordenan, editan y marcan como vendidas las propiedades, con subida de fotos.',
        learn: 'En inmobiliaria, publicar lo vendido convence más que publicar lo disponible: es la única prueba de que el trabajo se cierra. Y si el cliente no puede actualizar solo, el catálogo envejece en una semana.' },
      en: { cat: 'Web Design + Product', title: 'Daniel Villa Real Estate', role: 'LCS · Design, Development & Admin panel', client: 'Daniel Villa Real Estate · Salta',
        problem: 'Daniel Villa is a licensed broker and was named Salta\'s best real estate agency, but the catalogue lived on social media: each property posted standalone, with no listing page, no record of closed deals and no fast way to update prices.',
        goal: 'Provide an owned, self-updatable catalogue, and use closed sales as commercial proof to attract owners looking to sell.',
        steps: [['01','Discover','How listings are published today and what buyers in Salta look at'],['02','Define','Catalogue + areas + sold + valuation as four pillars'],['03','Design','Sober real-estate aesthetic, big photography, clear listing'],['04','Deliver','Site + private Supabase-backed admin panel']],
        result: 'A site with a live catalogue (sale and rental, with price, bedrooms, bathrooms and m²), an areas section, a closed-deals showcase that works as sales proof, and a WhatsApp valuation flow. Behind it, a private Supabase panel to add, reorder, edit and mark properties as sold, with photo uploads.',
        learn: 'In real estate, publishing what sold convinces more than publishing what is available: it is the only proof the work closes. And if the client cannot update it alone, the catalogue ages within a week.' }
    },
    p10: {
      year: '2026', url: 'totalgymsalta.vercel.app', full: ['totalgym-fullpage.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web + UX/UI', title: 'Total Gym Salta', role: 'LCS · Diseño & Desarrollo Web', client: 'Total Gym Salta · Dos sedes',
        problem: 'Total Gym opera dos sedes con lógicas distintas: el gimnasio de Vicente López 770 (musculación, funcional, boxeo, spinning, GAP y estética) y el studio de pilates reformer de Leguizamón 321, con turnos por hora. Contarlas juntas confundía, y separarlas en dos sitios rompía la marca.',
        goal: 'Unificar las dos sedes en una sola web sin que ninguna pierda identidad, y que el visitante llegue a reservar su clase de prueba por WhatsApp.',
        steps: [['01','Descubrir','Diferencias reales de público entre el gym y el studio'],['02','Definir','Una marca, dos sedes: jerarquía y horarios propios'],['03','Diseñar','Sistema de alto contraste con foto de entrenamiento real'],['04','Entregar','Sitio responsive con horarios por pestaña y WhatsApp por sede']],
        result: 'One-page con las dos sedes diferenciadas desde el hero, seis actividades con sus turnos, horarios navegables por pestañas, una sección propia para el reformer con sus franjas de mañana y tarde, estética corporal, tres planes y el WhatsApp correspondiente a cada sede.',
        learn: 'Dos sedes no son dos sitios: son dos jerarquías dentro del mismo relato. Separar los horarios por pestañas evitó la página kilométrica sin esconder información.' },
      en: { cat: 'Web Design + UX/UI', title: 'Total Gym Salta', role: 'LCS · Web Design & Development', client: 'Total Gym Salta · Two locations',
        problem: 'Total Gym runs two locations with different logics: the gym at Vicente López 770 (weights, functional, boxing, spinning, GAP and body aesthetics) and the reformer pilates studio at Leguizamón 321, booked by the hour. Telling them together confused; splitting them into two sites broke the brand.',
        goal: 'Unify both locations in one site without either losing identity, and get visitors to book a trial class over WhatsApp.',
        steps: [['01','Discover','Real audience differences between gym and studio'],['02','Define','One brand, two locations: hierarchy and separate schedules'],['03','Design','High-contrast system with real training photography'],['04','Deliver','Responsive site with tabbed schedules and per-location WhatsApp']],
        result: 'A one-pager distinguishing both locations from the hero, six activities with their time slots, tab-navigable schedules, a dedicated reformer section with morning and afternoon bands, body aesthetics, three plans and the right WhatsApp per location.',
        learn: 'Two locations are not two sites: they are two hierarchies inside one story. Splitting schedules into tabs avoided an endless page without hiding information.' }
    },
    p11: {
      year: '2026', url: 'hotelposadadelsol.vercel.app', full: ['posadadelsol-fullpage.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web + UX/UI', title: 'Hotel Posada del Sol', role: 'LCS · Diseño & Desarrollo Web', client: 'Hotel Posada del Sol · Salta capital',
        problem: 'Hotel 3★ en Alvarado 646, a metros de la peatonal, con 8,1 en Booking y más de 2.000 opiniones. Todas esas reservas llegaban por plataformas que se llevan su comisión, y el hotel no tenía un canal propio que compitiera con ellas.',
        goal: 'Recuperar la reserva directa: dejar claro que reservando en el sitio se paga menos, y bajar la fricción a un WhatsApp con respuesta humana.',
        steps: [['01','Descubrir','Por qué el huésped reserva en plataformas y qué lo haría cambiar'],['02','Definir','Argumento central: mismo hotel, mejor precio, sin comisiones'],['03','Diseñar','Sistema cálido con buscador de disponibilidad arriba de todo'],['04','Entregar','Sitio bilingüe ES/EN, responsive, con WhatsApp directo']],
        result: 'Sitio bilingüe con buscador de fechas y huéspedes en el hero, cinco tipos de habitación con capacidad y equipamiento, distancias reales a los puntos turísticos (peatonal 2 min, Catedral y MAAM 5 min, teleférico 1 km), doce servicios, el restaurante Bávaro y testimonios de Booking y TripAdvisor. El mensaje "reservá directo y pagá menos" se repite en hero, banda y footer.',
        learn: 'Contra las OTAs no se compite con fotos: se compite con precio explícito y respuesta humana. Poner el ahorro en palabras, y no insinuarlo, es todo el argumento.' },
      en: { cat: 'Web Design + UX/UI', title: 'Hotel Posada del Sol', role: 'LCS · Web Design & Development', client: 'Hotel Posada del Sol · Salta',
        problem: 'A 3★ hotel at Alvarado 646, steps from the pedestrian street, rated 8.1 on Booking with over 2,000 reviews. All those bookings came through platforms taking their commission, and the hotel had no owned channel to compete.',
        goal: 'Win back direct booking: make it clear that booking on the site costs less, and reduce friction to a WhatsApp with a human reply.',
        steps: [['01','Discover','Why guests book on platforms and what would change that'],['02','Define','Core argument: same hotel, better price, no commissions'],['03','Design','Warm system with an availability search above everything'],['04','Deliver','Bilingual ES/EN responsive site with direct WhatsApp']],
        result: 'A bilingual site with a date and guest search in the hero, five room types with capacity and amenities, real walking distances to landmarks (pedestrian street 2 min, Cathedral and MAAM 5 min, cable car 1 km), twelve services, the Bávaro restaurant and Booking/TripAdvisor testimonials. "Book direct and pay less" repeats in hero, banner and footer.',
        learn: 'You do not beat OTAs with photos: you beat them with an explicit price and a human reply. Putting the saving into words, rather than implying it, is the whole argument.' }
    },
    p12: {
      year: '2026', url: 'la-vieja-estacion.vercel.app', full: ['viejaestacion-fullpage.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web + UX/UI', title: 'Peña La Vieja Estación', role: 'LCS · Diseño & Desarrollo Web', client: 'La Vieja Estación · Paseo Balcarce, Salta',
        problem: 'La peña más conocida de la Balcarce —4,5 estrellas con 9.500 reseñas en Google, #9 de 377 en TripAdvisor y 35.000 seguidores— dependía de terceros para algo tan básico como explicar a qué hora empieza el show y cómo se reserva una mesa.',
        goal: 'Ordenar la noche completa en una sola página y llevar la reserva online, que es la acción que el local necesita antes de que el salón se llene.',
        steps: [['01','Descubrir','Dudas del turista: horario, precio, si hace falta reservar'],['02','Definir','La noche como línea de tiempo, de 20:00 a 03:00'],['03','Diseñar','Dirección cálida de peña, con foto de show en vivo'],['04','Entregar','Sitio responsive con reserva de mesa y mapa']],
        result: 'Sitio en vivo con la noche contada como cronología (20:00 puertas, 21:00 cena, 22:00 show con dos grupos de folklore y dos ballets, 03:00 cierre), carta regional de referencia, prueba social arriba, cómo llegar con estacionamiento y reserva de mesa desde cualquier punto del scroll.',
        learn: 'En un espectáculo, la información que más se busca es la más simple: a qué hora empieza. Estructurar la página como una línea de tiempo respondió eso antes de que el visitante tuviera que preguntarlo.' },
      en: { cat: 'Web Design + UX/UI', title: 'Peña La Vieja Estación', role: 'LCS · Web Design & Development', client: 'La Vieja Estación · Paseo Balcarce, Salta',
        problem: 'The best-known peña on Balcarce — 4.5 stars across 9,500 Google reviews, #9 of 377 on TripAdvisor and 35,000 followers — relied on third parties for something as basic as explaining when the show starts and how to book a table.',
        goal: 'Organize the whole night on a single page and move booking online, the action the venue needs before the room fills up.',
        steps: [['01','Discover','Visitor doubts: time, price, whether booking is needed'],['02','Define','The night as a timeline, 20:00 to 03:00'],['03','Design','Warm peña direction with live-show photography'],['04','Deliver','Responsive site with table booking and map']],
        result: 'Live site telling the night as a timeline (20:00 doors, 21:00 dinner, 22:00 show with two folk groups and two ballets, 03:00 close), a reference regional menu, social proof up top, directions with parking, and table booking from anywhere in the scroll.',
        learn: 'For a show, the most-searched information is the simplest: what time it starts. Structuring the page as a timeline answered that before the visitor had to ask.' }
    },
    p13: {
      year: '2026', url: 'lacondesa.vercel.app', full: ['lacondesa-fullpage.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web', title: 'La Condesa', role: 'LCS · Diseño & Desarrollo Web', client: 'La Condesa · Austin, Texas',
        problem: 'Restaurante de cocina mexicana moderna en el centro de Austin, con 1.778 reseñas acumuladas. El desafío fue trabajar por primera vez para un mercado en inglés y fuera de Argentina, donde el visitante decide en segundos entre llamar, ver el mapa o seguir buscando.',
        goal: 'Resolver la decisión rápido: dejar el teléfono y la dirección al alcance inmediato, y usar la reputación existente como argumento de entrada.',
        steps: [['01','Descubrir','Qué mira alguien que elige restaurante en Austin'],['02','Definir','Dos acciones por encima de todo: llamar y cómo llegar'],['03','Diseñar','Estética premium bilingüe, cálida y de alto contraste'],['04','Entregar','Sitio responsive en inglés con CTA duplicado en el cierre']],
        result: 'Sitio en inglés con hero de reputación (3,6 sobre 1.778 reseñas) y los dos CTA principales visibles de entrada, relato de la propuesta gastronómica, seis servicios (salón, coctelería, eventos privados, catering, gift cards y reservas online), galería y reseñas destacadas.',
        learn: 'Primer proyecto para el mercado estadounidense: el patrón de decisión es más corto que en Argentina. Llamar y cómo llegar tienen que estar antes que cualquier relato de marca.' },
      en: { cat: 'Web Design', title: 'La Condesa', role: 'LCS · Web Design & Development', client: 'La Condesa · Austin, Texas',
        problem: 'A modern Mexican restaurant in downtown Austin with 1,778 accumulated reviews. The challenge was working for the first time for an English-speaking market outside Argentina, where visitors decide in seconds between calling, checking the map, or moving on.',
        goal: 'Resolve the decision fast: keep phone and address immediately reachable, and use existing reputation as the entry argument.',
        steps: [['01','Discover','What people choosing a restaurant in Austin look at'],['02','Define','Two actions above all: call and get directions'],['03','Design','Premium, warm, high-contrast aesthetic'],['04','Deliver','Responsive English site with the CTA repeated at the close']],
        result: 'An English site with a reputation hero (3.6 across 1,778 reviews) and both primary CTAs visible on arrival, the culinary story, six offerings (dining, cocktail program, private events, catering, gift cards and online reservations), gallery and featured reviews.',
        learn: 'First project for the US market: the decision pattern is shorter than in Argentina. Call and directions must come before any brand storytelling.' }
    },
    p14: {
      year: '2026', url: 'pielcanela.vercel.app', full: ['pielcanela-fullpage.webp'], tools: ['Figma', 'HTML / CSS', 'JavaScript'],
      es: { cat: 'Diseño Web + Producto', title: 'Piel Canela', role: 'LCS · Diseño & Desarrollo Web', client: 'Piel Canela · Experiencia karaoke',
        problem: 'Piel Canela no es un sitio institucional sino una experiencia: una app de karaoke pensada para usarse dentro del local, en pantalla y con música. El desafío fue diseñar algo que no se navega como una web común, sino que se activa.',
        goal: 'Diseñar una entrada de una sola pantalla que funcione como telón: sin menú, sin scroll, con una única acción posible.',
        steps: [['01','Descubrir','Contexto de uso real: pantalla del local, no navegador de escritorio'],['02','Definir','Una sola pantalla, una sola acción: empezar'],['03','Diseñar','Paleta negro y dorado, tipografía itálica y notas en movimiento'],['04','Entregar','Interfaz responsive que arranca con un toque']],
        result: 'Pantalla de entrada a oscuras con el nombre en dorado, notas musicales flotando y un único botón de play que abre la experiencia. Todo lo demás se corrió fuera de la vista para que no compita con esa única decisión.',
        learn: 'Cuando la interfaz se usa de pie y en grupo, cada elemento extra estorba. Quitar el menú, el scroll y el texto fue la decisión de diseño más importante del proyecto.' },
      en: { cat: 'Web Design + Product', title: 'Piel Canela', role: 'LCS · Web Design & Development', client: 'Piel Canela · Karaoke experience',
        problem: 'Piel Canela is not a corporate site but an experience: a karaoke app meant to be used inside the venue, on screen and with music. The challenge was designing something you do not browse like a normal site — you activate it.',
        goal: 'Design a single-screen entry that works like a curtain: no menu, no scroll, one possible action.',
        steps: [['01','Discover','Real usage context: venue screen, not a desktop browser'],['02','Define','One screen, one action: start'],['03','Design','Black and gold palette, italic type and drifting notes'],['04','Deliver','Responsive interface that starts with one tap']],
        result: 'A dark entry screen with the name in gold, floating musical notes and a single play button that opens the experience. Everything else was moved out of sight so nothing competes with that one decision.',
        learn: 'When an interface is used standing up and in a group, every extra element gets in the way. Removing the menu, the scroll and the copy was the most important design decision of the project.' }
    }
  };

  const L = {
    es: { role: 'Rol', year: 'Año', client: 'Cliente', tools: 'Herramientas', problem: 'Problema / Desafío', goal: 'Objetivo', process: 'Proceso', result: 'Resultado', learn: 'Aprendizajes clave', stack: 'Stack' },
    en: { role: 'Role', year: 'Year', client: 'Client', tools: 'Tools', problem: 'Problem / Challenge', goal: 'Goal', process: 'Process', result: 'Result', learn: 'Key takeaways', stack: 'Stack' }
  };

  function buildModalShell() {
    if (document.getElementById('modal')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal" id="modal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Case study">
        <div class="modal__scrim"></div>
        <div class="modal__panel" data-lenis-prevent>
          <button class="modal__close" aria-label="Cerrar">
            <span data-es="Cerrar" data-en="Close">Cerrar</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div class="modal__body"></div>
        </div>
      </div>`);
  }

  window.__lcsProjects = function init(ctx) {
    const { $, $$, getLenis } = ctx;
    if (!$('[data-project]')) return; // only on Proyectos page

    buildModalShell();
    const m = $('#modal');
    const panel = $('.modal__body', m);
    let key = null;

    function render(k) {
      const base = PROJECTS[k]; if (!base) return;
      const lang = window.__lcsLang === 'en' ? 'en' : 'es';
      const p = base[lang] || base.es, T = L[lang] || L.es;
      const hint = lang === 'en' ? '↕ Scroll · click to visit the live site ↗' : '↕ Scrolleá · clic para visitar el sitio real ↗';
      const shots = (base.full || []).map(f =>
        `<img src="assets/${f}" alt="${p.title} — preview" loading="lazy" onerror="this.remove()">`).join('');
      const preview = `
        <a class="modal-preview" href="https://${base.url}" target="_blank" rel="noopener noreferrer" aria-label="${lang === 'en' ? 'Visit live site' : 'Visitar sitio real'}: ${base.url}">
          <div class="modal-preview__bar">
            <span class="modal-preview__dot modal-preview__dot--red"></span>
            <span class="modal-preview__dot modal-preview__dot--yellow"></span>
            <span class="modal-preview__dot modal-preview__dot--green"></span>
            <span class="modal-preview__url">${base.url}</span>
          </div>
          <div class="modal-preview__screen" data-empty="${lang === 'en' ? 'Screenshot coming soon' : 'Screenshot pendiente'}">${shots}</div>
          <div class="modal-preview__hint">${hint}</div>
        </a>`;
      panel.innerHTML = `
        <div class="cs-inner">
          ${preview}
          <div class="cs-cat">${p.cat}</div>
          <h2 class="cs-title">${p.title}</h2>
          <div class="cs-meta">
            <div class="cs-meta__cell"><div class="k">${T.role}</div><div class="v">${p.role}</div></div>
            <div class="cs-meta__cell"><div class="k">${T.year}</div><div class="v">${base.year}</div></div>
            <div class="cs-meta__cell"><div class="k">${T.client}</div><div class="v">${p.client}</div></div>
            <div class="cs-meta__cell"><div class="k">${T.tools}</div><div class="v">${base.tools.join(' · ')}</div></div>
          </div>
          <div class="cs-body">
            <div>
              <div class="cs-block"><h4>${T.problem}</h4><p>${p.problem}</p></div>
              <div class="cs-block"><h4>${T.goal}</h4><p>${p.goal}</p></div>
            </div>
            <div>
              <div class="cs-block"><h4>${T.result}</h4><p>${p.result}</p></div>
              <div class="cs-block"><h4>${T.learn}</h4><p>${p.learn}</p></div>
            </div>
          </div>
          <div class="cs-block"><h4>${T.process}</h4>
            <div class="cs-steps">${p.steps.map(s => `<div class="cs-step"><b>${s[0]} ${s[1]}</b><span>${s[2]}</span></div>`).join('')}</div>
          </div>
          <div class="cs-block"><h4>${T.stack}</h4>
            <div class="cs-stack">${base.tools.map(t => `<span class="cs-tag">${t}</span>`).join('')}</div>
          </div>
        </div>`;
    }

    function open(k) {
      if (!PROJECTS[k]) return;
      key = k; render(k);
      m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const lenis = getLenis(); if (lenis) lenis.stop();
    }
    function close() {
      m.classList.remove('open'); m.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; key = null;
      const lenis = getLenis(); if (lenis) lenis.start();
    }

    window.__modalRerender = () => { if (key && m.classList.contains('open')) render(key); };
    $$('[data-project]').forEach(c => c.addEventListener('click', () => open(c.getAttribute('data-project'))));

    /* "Ver todos los proyectos" — despliega los casos que van más allá de los 6
       primeros. Las etiquetas se guardan en data-es/data-en para que el switch
       de idioma las siga traduciendo después de togglear. */
    const moreBtn = $('[data-work-more]');
    const grid = $('#work-grid');
    if (moreBtn && grid) {
      const LABELS = {
        show: { es: 'Ver todos los proyectos', en: 'View all projects' },
        hide: { es: 'Ver menos', en: 'Show less' }
      };
      const label = $('span', moreBtn) || moreBtn;
      moreBtn.addEventListener('click', () => {
        const expanded = grid.classList.toggle('is-expanded');
        const next = expanded ? LABELS.hide : LABELS.show;
        label.setAttribute('data-es', next.es);
        label.setAttribute('data-en', next.en);
        label.textContent = window.__lcsLang === 'en' ? next.en : next.es;
        moreBtn.setAttribute('aria-expanded', String(expanded));
        if (!expanded) {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // el grid cambió de alto: ScrollTrigger tiene que recalcular
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    }
    $('.modal__scrim', m).addEventListener('click', close);
    $('.modal__close', m).addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) close(); });
  };
})();

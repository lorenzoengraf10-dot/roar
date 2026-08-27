/* ============================================================
   PRODUCTS.JS — ROAR Joyería Urbana
   ============================================================

   ESTE ES EL ÚNICO ARCHIVO QUE NECESITÁS TOCAR PARA:
   - Cambiar el WhatsApp, Instagram, ciudad o datos de pago.
   - Agregar, editar o borrar productos.
   - Agregar o sacar categorías y subcategorías.
   - Agregar o sacar testimonios de clientes.

   No hace falta saber programar. Solo tenés que respetar el formato
   (las comas, las comillas, las llaves { }). Si algo se rompe después
   de editar, revisá que no te haya faltado una coma "," entre un
   producto y el siguiente.

   ----------------------------------------------------------------
   CÓMO AGREGAR UN PRODUCTO NUEVO
   ----------------------------------------------------------------
   1. Buscá la categoría dentro de PRODUCTOS (por ejemplo PRODUCTOS.anillos).
   2. Copiá un producto que ya esté cargado (desde la { hasta la }, con
      la coma al final) y pegalo antes del corchete de cierre "]".
   3. Cambiá los datos: nombre, precio, descripción, etc.
   4. Para la foto: subí el archivo a assets/images/ y poné acá la ruta,
      por ejemplo: img: "assets/images/mi-foto.jpg"
      Si todavía no tenés la foto, dejá: img: null
      (el sitio va a mostrar un cartel de "Foto próximamente" solito).
      Podés sumar más fotos del mismo producto con "img2", "img3" e "img4"
      (por ejemplo, una foto de estudio y otra puesta o en la cajita) — en
      la ficha del producto van a aparecer como una mini-galería.
      Para ANILLOS: en todos los anillos hay que sumar como última foto
      (img4, o la que corresponda) la guía de talles:
      "assets/images/guia-talles-anillos.jpg"
   5. Si el producto ya no tiene stock, agregá: agotado: true
   6. Para la etiqueta (Nuevo, Hot, etc.) el color puede ser: "gold",
      "emerald", "navy" o "agotado" — son los colores de la marca.
   7. Si el mismo producto viene en más de un color/material (por ejemplo
      dorado y plateado), agregá "variantes" con una foto para cada uno:
      variantes: [
        { nombre: "Dorado", img: "assets/images/mi-foto-dorado.jpg", img2: "assets/images/mi-foto-dorado-2.jpg" },
        { nombre: "Plateado", img: "assets/images/mi-foto-plateado.jpg" },
      ]
      (el "img2" es opcional, es una segunda foto de ese color). En la
      ficha del producto va a aparecer un selector para elegir el color,
      y el pedido por WhatsApp o el carrito van a aclarar cuál se eligió.
      Si un color cuesta distinto que el resto, agregale "precio" a esa
      variante puntual (por ejemplo el dorado más caro que el plateado):
      { nombre: "Dorado", precio: 31000, img: "..." }
      El precio de arriba de todo (el que va afuera de "variantes") queda
      como el que se ve en la tarjeta del catálogo cuando los colores
      cuestan distinto — ahí el sitio muestra "Desde $lo más barato".
   8. Material por defecto: todo es acero quirúrgico, salvo que se
      aclare lo contrario (por ejemplo plata 900). No hace falta
      preguntar por el material en cada producto nuevo.

   Cada vez que edites este archivo, subí en 1 el número de versión al
   final de la etiqueta <script> en index.html (products.js?v=1 pasa a
   ?v=2), así el celular del cliente no se queda con la versión vieja
   guardada en caché.
   ============================================================ */


/* ----------------------------------------------------------------
   1. CONFIGURACIÓN GENERAL DEL NEGOCIO
   ---------------------------------------------------------------- */
const CONFIG = {
  nombre: "ROAR",
  tagline: "Joyas de acero",

  // Número real. Formato: 549 + código de área + número, sin espacios.
  whatsapp: "5492920588604",
  whatsappVisible: true,

  // Dejalo vacío ("") para ocultar el botón si algún día no tenés Instagram.
  instagram: "roar.access",

  // Igual que Instagram: dejalo vacío ("") para ocultarlo.
  facebook: "https://www.facebook.com/share/1K4b7zMFwN/?mibextid=wwXIfr",

  ciudad: "Viedma",
  provincia: "Río Negro",
  direccion: "Brown 690",
  origenCP: "8500",
  moneda: "ARS",

  // A partir de qué monto de pedido el envío a todo el país sale gratis
  // (el retiro en Viedma ya es siempre sin cargo). Es el mismo número que
  // se muestra en el hero — si lo cambiás acá, actualizalo también ahí.
  envioGratisDesde: 45000,

  // Datos para transferencia por Mercado Pago. Dejalo en null si algún
  // día hay que sacarlos — el checkout por WhatsApp funciona igual,
  // el cliente coordina el pago por chat.
  pago: {
    titular: "Enzo Martín Camperi Melo",
    alias: "joyasdeacero.mp",
    cvu: "0000003100071501389000",
  },

  // Pagar con Mercado Pago desde el carrito (cobra el total automático,
  // sin coordinar la transferencia a mano). Para activarlo:
  // 1. Cargá la clave MP_ACCESS_TOKEN en Vercel (ver api/crear-preferencia.js
  //    para el paso a paso de dónde sacarla).
  // 2. Cambiá esto a true.
  // Mientras esté en false, el botón no aparece y el pedido se sigue
  // coordinando por WhatsApp como siempre.
  mercadoPagoVisible: false,

  // Google Analytics: para saber cuánta gente entra al sitio y desde dónde.
  // 1. Andá a https://analytics.google.com, creá una cuenta (es gratis) y
  //    una "propiedad" para este sitio.
  // 2. Te va a dar un ID que empieza con "G-" (por ejemplo "G-ABC1234XYZ").
  // 3. Pegalo acá abajo entre las comillas. Mientras esté vacío (""),
  //    el sitio funciona igual pero no se manda ninguna estadística.
  googleAnalyticsId: "",
};


/* ----------------------------------------------------------------
   2. CATEGORÍAS Y SUBCATEGORÍAS
   El "foto" de cada categoría es la imagen grande que aparece en la
   vidriera de categorías, arriba del catálogo. Usá una foto real y
   representativa (subida a assets/images/). Si la dejás en null,
   esa categoría se muestra igual pero sin foto, con un fondo liso.
   ---------------------------------------------------------------- */
const CATEGORIAS = {
  anillos: {
    nombre: "Anillos",
    foto: "assets/images/anillo-italia.jpg",
    subs: {
      plata: "Plata 925",
      acero: "Acero Quirúrgico",
      titanio: "Titanio",
    },
  },
  cadenas: {
    nombre: "Cadenas y Collares",
    foto: "assets/images/collar-gloria-dorado-modelo.jpg",
    subs: {
      plata: "Plata 925",
      oro: "Baño de Oro 18K",
      pantalon: "Para Pantalón",
    },
  },
  pulseras: {
    nombre: "Pulseras",
    foto: "assets/images/pulsera-san-benito-dorado.jpg",
    subs: {
      plata: "Plata 925",
      oro: "Baño de Oro 18K",
      cuero: "Cuero",
    },
  },
  aros: {
    nombre: "Aros",
    foto: "assets/images/aro-shine-dorado.jpg",
    subs: {
      plata: "Plata 925",
      oro: "Baño de Oro 18K",
      acero: "Acero Quirúrgico",
    },
  },
  accesorios: {
    nombre: "Combos",
    foto: "assets/images/combo-cuba-silver.jpg",
  },
};


/* ----------------------------------------------------------------
   Peso promedio por categoría (kg), para estimar el costo de envío.
   Son cifras de referencia con embalaje incluido — no hace falta pesar
   cada producto, y se pueden ajustar acá si algo queda mal calculado.
   ---------------------------------------------------------------- */
const PESO_CATEGORIA_KG = {
  anillos: 0.05,
  cadenas: 0.08,
  pulseras: 0.06,
  aros: 0.03,
  accesorios: 0.15,
};


/* ----------------------------------------------------------------
   Cuánto cobrar de envío por zona (estimado, hasta que esté conectada
   la cotización real de Correo Argentino — ver assets/js/shipping.js).
   "base" es el precio hasta 1 kg. "porKgExtra" se suma por cada kg que
   pasa de eso.

   Esto NO sale de ningún lado fijo: son números de referencia. Es
   PERFECTAMENTE VÁLIDO tocarlos cuando quieras — si cambiaron las
   tarifas reales de Correo Argentino, o simplemente porque preferís
   cobrar más o menos de envío. Es tu decisión, no la de nadie más, y no
   hace falta pedir ayuda para editar estos números.

   Las provincias de cada zona están en assets/js/shipping.js (ZONAS_ENVIO):
     cercania     → Buenos Aires, CABA, Río Negro
     centroCuyo   → Córdoba, Santa Fe, Entre Ríos, La Pampa, Mendoza, San Luis, San Juan
     patagoniaSur → Neuquén, Chubut, Santa Cruz, Tierra del Fuego
     norte        → Formosa, Chaco, Misiones, Corrientes, Salta, Jujuy, Tucumán, Santiago del Estero, Catamarca, La Rioja
   ---------------------------------------------------------------- */
const TARIFAS_ENVIO = {
  cercania: { base: 4600, porKgExtra: 1050 },
  centroCuyo: { base: 5600, porKgExtra: 1150 },
  patagoniaSur: { base: 6000, porKgExtra: 1300 },
  norte: { base: 7500, porKgExtra: 1600 },
};


/* ----------------------------------------------------------------
   3. TESTIMONIOS DE CLIENTES
   Son fotos reales de historias de Instagram de clientes usando piezas
   de ROAR (etiquetados @roar.access). Para agregar una nueva, subí la
   foto a assets/images/ y sumá un objeto { img, autor } acá abajo.
   Si borrás todos los que hay acá y dejás la lista vacía ([]),
   la sección de testimonios directamente no se muestra en el sitio.
   ---------------------------------------------------------------- */
const TESTIMONIOS = [
  {
    img: "assets/images/testimonio-guadaeg.jpg",
    autor: "@guadaeg",
  },
  {
    img: "assets/images/testimonio-agustin.jpg",
    autor: "@agusestevanacio",
  },
  {
    img: "assets/images/testimonio-fran.jpg",
    autor: "@fran.melignerr",
  },
  {
    img: "assets/images/testimonio-manutatts.jpg",
    autor: "@_manutatts",
  },
];


/* ----------------------------------------------------------------
   4. CATÁLOGO DE PRODUCTOS
   Organizado por categoría. Cada categoría es un array de productos.
   ---------------------------------------------------------------- */
const PRODUCTOS = {

  cadenas: [
    {
      nombre: "Collar Leo Gold",
      precio: 32000,
      desc: "Collar con dije macizo pesado de camiseta con el número 10 en micropavé, cadena gruesa.",
      img: "assets/images/collar-leo-gold.jpg",
      img2: "assets/images/collar-leo-gold-modelo.jpg",
      img3: "assets/images/collar-leo-gold-layered.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero con micropavé",
        "Dije macizo pesado de 5 x 4 cm",
        "Medidas de cadena disponibles: 50 o 55 cm (a elección)",
      ],
    },
    {
      nombre: "Collar Gloria",
      precio: 24000,
      desc: "Colgante medallón circular con el Sol de Mayo, insignia nacional argentina, en relieve. Acero quirúrgico. Cadena rolo con cierre de mosquetón. Disponible en dorado o plateado.",
      img: "assets/images/collar-gloria-dorado-modelo.jpg",
      img2: "assets/images/collar-gloria-dorado-modelo2.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      variantes: [
        { nombre: "Dorado", img: "assets/images/collar-gloria-dorado-modelo.jpg", img2: "assets/images/collar-gloria-dorado-modelo2.jpg" },
        { nombre: "Plateado", img: "assets/images/collar-gloria-oxidado-modelo.jpg", img2: "assets/images/collar-gloria-oxidado.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: medallón circular con el Sol de Mayo en relieve",
        "Cadena: rolo, cierre de mosquetón",
      ],
    },
    {
      nombre: "Collar Enzo",
      precio: 21000,
      desc: "Colgante de cruz con textura tejida en relieve. Acero quirúrgico. Disponible en cadena soga dorada o cadena rolo plateada.",
      img: "assets/images/collar-enzo-dorado-modelo.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      variantes: [
        { nombre: "Dorado", img: "assets/images/collar-enzo-dorado-modelo.jpg" },
        { nombre: "Plateado", img: "assets/images/collar-enzo-oxidado-modelo.jpg", img2: "assets/images/collar-enzo-oxidado.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: colgante cruz con textura tejida en relieve",
        "Cadena: soga (dorado) o rolo (plateado)",
      ],
    },
    {
      nombre: "Collar Soga Gold",
      precio: 16000,
      desc: "Collar cadena soga (rope chain) de acero macizo, con cierre de mosquetón.",
      img: "assets/images/collar-soga-dorado-modelo.jpg",
      img2: "assets/images/collar-soga-dorado-modelo2.jpg",
      img3: "assets/images/collar-soga-dorado.jpg",
      detalles: [
        "Material: acero macizo dorado",
        "Largos disponibles: 50 y 55 cm",
      ],
    },
    {
      nombre: "Rosarios",
      precio: 16000,
      desc: "Rosario con dije de cruz y medalla de la Virgen, cadena de bolitas. Acero quirúrgico. Disponible combinado (bolitas doradas y plateadas) o plateado.",
      img: "assets/images/rosario-combinado-modelo.jpg",
      img2: "assets/images/rosario-combinado.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      variantes: [
        { nombre: "Combinado", precio: 16000, img: "assets/images/rosario-combinado-modelo.jpg", img2: "assets/images/rosario-combinado.jpg" },
        { nombre: "Plateado", precio: 13000, img: "assets/images/rosario-plateado-modelo.jpg", img2: "assets/images/rosario-plateado.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: rosario con dije de cruz y medalla de la Virgen",
      ],
    },
    {
      nombre: "Collar Santos",
      precio: 26000,
      desc: "Collar personalizado con doble cadena combinada (box y bolitas), con dijes de cruz. Acero quirúrgico.",
      img: "assets/images/collar-santos-modelo.jpg",
      img2: "assets/images/collar-santos.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: doble cadena combinada (box y bolitas) con dijes de cruz",
      ],
    },
    {
      nombre: "Collar Equilibrio",
      precio: 26000,
      desc: "Cadena combinada (box y cubana) con dije colgante de barra rectangular. Acero quirúrgico.",
      img: "assets/images/collar-equilibrio-modelo.jpg",
      img2: "assets/images/collar-equilibrio.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: cadena combinada (box y cubana) con dije de barra rectangular",
      ],
    },
    {
      nombre: "Collar Mito",
      precio: 31000,
      desc: "Cadena personalizada con estilo único: doble cadena (cubana y box) con dije de cruz desmontable. Acero quirúrgico.",
      img: "assets/images/collar-mito-modelo.jpg",
      img2: "assets/images/collar-mito-modelo2.jpg",
      img3: "assets/images/collar-mito.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: doble cadena (cubana y box) con dije de cruz desmontable",
      ],
    },
    {
      nombre: "Collar Wolf",
      precio: 26000,
      desc: "Collar con dije de cabeza de lobo y piedras ónix naturales sobre cadena combinada.",
      img: "assets/images/collar-wolf-modelo.jpg",
      img2: "assets/images/collar-wolf-modelo2.jpg",
      img3: "assets/images/collar-wolf.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      detalles: [
        "Material: acero quirúrgico con piedras ónix naturales",
        "Diseño: dije cabeza de lobo, cadena combinada",
      ],
    },
    {
      nombre: "Cadena Groumet Gold",
      precio: 12000,
      desc: "Cadena groumet color dorado, 3 mm de ancho.",
      img: "assets/images/cadena-groumet-gold.jpg",
      img2: "assets/images/cadena-groumet-gold-modelo.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico",
        "Cadena: groumet, 3 mm de ancho, 50 cm",
      ],
    },
    {
      nombre: "Collar Nicky",
      precio: 15000,
      desc: "Collar tipo tennis con piedras blancas y negras alternadas, color dorado.",
      img: "assets/images/collar-nicky-modelo.jpg",
      img2: "assets/images/collar-nicky.jpg",
      img3: "assets/images/collar-nicky-detalle.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero dorado",
        "Diseño: piedras blancas y negras alternadas",
        "Medidas: 45 cm + 5 cm (extensión)",
      ],
    },
    {
      nombre: "Collar Cali",
      precio: 15000,
      desc: "Collar tipo tennis con piedras baguette engarzadas, color dorado.",
      img: "assets/images/collar-cali-modelo.jpg",
      img2: "assets/images/collar-cali.jpg",
      img3: "assets/images/collar-cali-detalle.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero dorado con piedras baguette",
        "Medidas: 40 cm + 10 cm (extensión)",
      ],
    },
    {
      nombre: "Collar Blessed Gold",
      precio: 16000,
      desc: "Cadena groumet dorada de 50 cm con dije de cruz macizo en acero combinado (dorado y plateado).",
      img: "assets/images/collar-blessed-gold-modelo.jpg",
      img2: "assets/images/collar-blessed-gold.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico",
        "Cadena: groumet, 3 mm de ancho, 50 cm",
        "Dije: cruz maciza en acero combinado, 4,5 cm de alto",
      ],
    },
    {
      nombre: "Cadena Cuba Silver",
      precio: 12000,
      desc: "Cadena cubana (curb chain) color plateado, 50 cm. Acero quirúrgico.",
      img: "assets/images/cadena-cuba-silver.jpg",
      img2: "assets/images/cadena-cuba-silver-2.jpg",
      img3: "assets/images/cadena-cuba-silver-modelo.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: cadena cubana (curb chain)",
        "Largo: 50 cm",
      ],
    },
    {
      nombre: "Cadena XL",
      sub: "pantalon",
      precio: 18000,
      desc: "Cadena gruesa tipo Figaro con mosquetones giratorios en ambos extremos: se puede usar como collar o como cadena de pantalón.",
      img: "assets/images/cadena-xl-plata.jpg",
      img2: "assets/images/cadena-xl-plata-modelo-cuello.jpg",
      img3: "assets/images/cadena-xl-plata-modelo-pantalon.jpg",
      etiqueta: "Hot",
      color: "navy",
      detalles: [
        "Material: acero quirúrgico 316L",
        "Uso: collar o cadena de pantalón",
      ],
    },
    {
      nombre: "Cadena Angel",
      sub: "pantalon",
      precio: 28000,
      desc: "Cadena de pantalón triple, con tres texturas combinadas (trenzada, rolo y cadena fina) y un dije de cruz alada desmontable en una cadena aparte. Acero quirúrgico.",
      img: "assets/images/cadena-angel.jpg",
      img2: "assets/images/cadena-angel-modelo.jpg",
      img3: "assets/images/cadena-angel-detalle.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: triple cadena + dije de cruz alada desmontable",
        "Cierre: mosquetones giratorios",
      ],
    },
    {
      nombre: "Cadena Box Triple",
      sub: "pantalon",
      precio: 22000,
      desc: "Cadena de pantalón triple, combinando cadena tipo box (cuadrada), rolo y cable fina. Mosquetones giratorios en ambos extremos.",
      img: "assets/images/cadena-box-triple.jpg",
      img2: "assets/images/cadena-box-triple-modelo.jpg",
      detalles: [
        "Material: acero quirúrgico inoxidable",
        "Diseño: triple cadena (box, rolo y cable)",
      ],
    },
    {
      nombre: "Cadena Genesis",
      sub: "pantalon",
      precio: 25000,
      desc: "Doble cadena de pantalón con dos texturas combinadas y un dije de cruz con circonias, desmontable, en una cadena aparte.",
      img: "assets/images/cadena-genesis.jpg",
      img2: "assets/images/cadena-genesis-modelo.jpg",
      img3: "assets/images/cadena-genesis-detalle.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: doble cadena + dije de cruz desmontable",
      ],
    },
    {
      nombre: "Collar Malfoy",
      precio: 17000,
      desc: "Collar con dije macizo de dragón, cadena tipo soga (rope chain).",
      img: "assets/images/collar-malfoy-modelo.jpg",
      img2: "assets/images/collar-malfoy.jpg",
      img3: "assets/images/collar-malfoy-caja.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: dije macizo de dragón",
        "Medidas de cadena disponibles: 50, 60 o 70 cm (a elección)",
      ],
    },
    {
      nombre: "Collar Bvlgari",
      precio: 16000,
      desc: "Cadena cubana con dije cuadrado y piedra blanca engarzada.",
      img: "assets/images/collar-bvlgari-modelo.jpg",
      img2: "assets/images/collar-bvlgari.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero dorado",
        "Medidas: cadena de 50 cm + dije de 2,5 cm",
      ],
    },
    {
      nombre: "Collar Campeones",
      precio: 21000,
      desc: "Collar con dije macizo de copa del mundo, acero dorado.",
      img: "assets/images/collar-campeones-modelo.jpg",
      img2: "assets/images/collar-campeones.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero dorado macizo",
        "Medidas: cadena de 50 cm",
      ],
    },
    {
      nombre: "Collar Ice",
      precio: 18000,
      desc: "Collar cadena cubana con eslabones engarzados en strass. Cierre clip. Disponible en plateado o dorado.",
      img: "assets/images/collar-ice-dorado-modelo.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      variantes: [
        { nombre: "Dorado", img: "assets/images/collar-ice-dorado-modelo.jpg" },
        { nombre: "Plateado", img: "assets/images/collar-ice-plateado-modelo.jpg", img2: "assets/images/collar-ice-plateado.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: cadena cubana con eslabones engarzados en strass",
        "Medidas: 45 cm de largo",
        "Cierre: clip",
      ],
    },
  ],

  pulseras: [
    {
      nombre: "Pulsera Tennis Silver",
      precio: 15000,
      desc: "Pulsera tennis con circonias engarzadas, color plateado. Acero quirúrgico.",
      img: "assets/images/pulsera-tennis-silver.jpg",
      img2: "assets/images/pulsera-tennis-silver-modelo.jpg",
      img3: "assets/images/pulsera-tennis-silver-modelo2.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      detalles: [
        "Material: acero quirúrgico",
        "Medidas: 2,5 mm x 18 cm + 3 cm (alargue)",
      ],
    },
    {
      nombre: "Pulsera Royal",
      precio: 18000,
      desc: "Pulsera tennis con circonias engarzadas y una piedra ovalada central de mayor tamaño. Acero dorado.",
      img: "assets/images/pulsera-royal.jpg",
      img2: "assets/images/pulsera-royal-modelo.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero dorado",
        "Diseño: tennis con piedra ovalada central",
        "Medidas: 17 cm + 4 cm de extensión",
      ],
    },
    {
      nombre: "Pulsera Cuba Silver",
      precio: 12000,
      desc: "Pulsera cadena cubana (curb chain) color plateado. Acero quirúrgico.",
      img: "assets/images/pulsera-cuba-silver.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: cadena cubana (curb chain)",
        "Medidas disponibles: 18 a 22 cm",
      ],
    },
    {
      nombre: "Pulsera Darkness",
      precio: 14000,
      desc: "Pulsera cadena cubana (curb chain) color acero negro.",
      img: "assets/images/pulsera-darkness.jpg",
      img2: "assets/images/pulsera-darkness-modelo.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      detalles: [
        "Material: acero negro",
        "Medidas: 20 cm de largo",
      ],
    },
    {
      nombre: "Pulsera San Benito",
      precio: 17000,
      desc: "Pulsera con esferas y medalla circular tipo San Benito, con grabado en relieve en ambos lados. Cierre de mosquetón con cadena extensora para ajustar el largo. Disponible en dorado o plateado.",
      img: "assets/images/pulsera-san-benito-dorado.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      variantes: [
        { nombre: "Dorado", img: "assets/images/pulsera-san-benito-dorado.jpg" },
        { nombre: "Plateado", img: "assets/images/pulsera-san-benito-plateado.jpg", img2: "assets/images/pulsera-san-benito-plateado-modelo.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico 316L, dorado o plateado",
        "Diseño: esferas + medalla circular, cierre ajustable",
      ],
    },
    {
      nombre: "Pulsera Soga Gold",
      precio: 13000,
      desc: "Pulsera cadena soga (rope chain) con cierre de mosquetón y cadena extensora para ajustar el largo. Acero quirúrgico. Disponible en dorado o plateado.",
      img: "assets/images/pulsera-soga-dorado.jpg",
      variantes: [
        { nombre: "Dorado", img: "assets/images/pulsera-soga-dorado.jpg", img2: "assets/images/pulsera-soga-dorado-modelo.jpg" },
        { nombre: "Plateado", img: "assets/images/pulsera-soga-plateado.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico",
        "Medidas: 4,5 mm x 19 cm + 5 cm (alargue)",
      ],
    },
    {
      nombre: "Pulsera Soguita",
      precio: 13000,
      desc: "Pulsera cadena soga (rope chain) tourbillon, más fina que la Pulsera Soga Gold. Acero quirúrgico.",
      img: "assets/images/pulsera-soguita.jpg",
      img2: "assets/images/pulsera-soguita-modelo.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico",
        "Medidas: 2 mm x 17 cm + 5 cm (alargue)",
      ],
    },
    {
      nombre: "Pulsera Chunky Silver",
      precio: 13000,
      desc: "Pulsera cadena tipo paperclip con eslabones esféricos, color plateado. Acero quirúrgico.",
      img: "assets/images/pulsera-chunky-silver-modelo2.jpg",
      img2: "assets/images/pulsera-chunky-silver.jpg",
      img3: "assets/images/pulsera-chunky-silver-modelo.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      detalles: [
        "Material: acero quirúrgico",
        "Medidas: 18 cm + 4 cm de extensión",
      ],
    },
    {
      nombre: "Pulsera Snake Gold",
      precio: 12000,
      desc: "Pulsera cadena plana tipo snake/herringbone, con cadena extensora para ajustar a cualquier medida de muñeca. Acero quirúrgico.",
      img: "assets/images/pulsera-snake-dorado.jpg",
      img2: "assets/images/pulsera-snake-dorado-detalle.jpg",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: cadena plana snake, con extensible ajustable",
        "Medidas: 0,5 mm x 17 cm + 5 cm (extensor)",
      ],
    },
    {
      nombre: "Pulsera Light",
      precio: 21000,
      desc: "Pulsera cadena curva (curb chain) maciza con un eslabón oval engastado con microcirconias. Cadena extensora para ajustar a cualquier medida de muñeca.",
      img: "assets/images/pulsera-light-dorado.jpg",
      img2: "assets/images/pulsera-light-dorado-modelo.jpg",
      img3: "assets/images/pulsera-light-dorado-detalle.jpg",
      detalles: [
        "Material: acero dorado macizo",
        "Cadena extensora ajustable",
      ],
    },
    {
      nombre: "Pulsera Rolex",
      precio: 31000,
      desc: "Pulsera estilo Presidential con eslabones extraíbles, regulable a la medida de la muñeca.",
      img: "assets/images/pulsera-rolex-dorado.jpg",
      img2: "assets/images/pulsera-rolex-dorado-modelo.jpg",
      etiqueta: "Hot",
      color: "navy",
      variantes: [
        { nombre: "Dorado", precio: 31000, img: "assets/images/pulsera-rolex-dorado.jpg", img2: "assets/images/pulsera-rolex-dorado-modelo.jpg" },
        { nombre: "Acero Blanco", precio: 27000, img: "assets/images/pulsera-rolex-blanco-modelo.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico, dorado o blanco",
        "Eslabones extraíbles para regular la medida",
      ],
    },
    {
      nombre: "Pulseras Van Cleef",
      precio: 14000,
      desc: "Pulsera con eslabones tipo trébol (clover), cadena con mosquetón y cadena extensora. Acero quirúrgico. Disponible en muchos colores — entrá para verlos todos.",
      img: "assets/images/pulsera-vancleef-dorada-negra-modelo.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      variantes: [
        { nombre: "Plateada negra", img: "assets/images/pulsera-vancleef-plateada-negra.jpg" },
        { nombre: "Plateada blanca", img: "assets/images/pulsera-vancleef-plateada-blanca.jpg" },
        { nombre: "Plateada verde", img: "assets/images/pulsera-vancleef-plateada-verde.jpg", img2: "assets/images/pulsera-vancleef-plateada-verde-modelo2.jpg" },
        { nombre: "Doradas blanca y negra", img: "assets/images/pulsera-vancleef-dorada-blanca-negra.jpg" },
        { nombre: "Doradas y negra", img: "assets/images/pulsera-vancleef-dorada-negra-modelo.jpg" },
        { nombre: "Doradas blanca", img: "assets/images/pulsera-vancleef-dorada-blanca.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: eslabones tipo trébol en la cadena",
        "Cierre: mosquetón con cadena extensora",
      ],
    },
  ],

  aros: [
    {
      nombre: "Aros Shine",
      sub: "acero",
      precio: 9000,
      desc: "Aro pequeño estilo huggie con micropavé de piedras engastadas en todo el frente. Diseño unisex, cierre de bisagra con broche de seguridad. Disponible en dorado o plateado.",
      img: "assets/images/aro-shine-dorado.jpg",
      img2: "assets/images/aro-shine-dorado-modelo.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      variantes: [
        { nombre: "Dorado", img: "assets/images/aro-shine-dorado.jpg", img2: "assets/images/aro-shine-dorado-modelo.jpg" },
        { nombre: "Plateado", img: "assets/images/aro-shine-plateado.jpg", img2: "assets/images/aro-shine-plateado-modelo.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico, dorado o plateado",
        "Diseño: micropavé, cierre de bisagra",
        "Uso: unisex",
      ],
    },
    {
      nombre: "Aros Rock",
      sub: "acero",
      precio: 16000,
      desc: "Aro tipo hoop con remaches en punta (spikes) alrededor de todo el aro. Cierre de bisagra con broche de seguridad. Disponible en dorado, plateado o negro.",
      img: "assets/images/aro-rock-dorado.jpg",
      img2: "assets/images/aro-rock-dorado-modelo.jpg",
      etiqueta: "Hot",
      color: "navy",
      variantes: [
        { nombre: "Dorado", img: "assets/images/aro-rock-dorado.jpg", img2: "assets/images/aro-rock-dorado-modelo.jpg" },
        { nombre: "Plateado", img: "assets/images/aro-rock-plateado.jpg", img2: "assets/images/aro-rock-plateado-modelo.jpg" },
        { nombre: "Negro", img: "assets/images/aro-rock-negro.jpg", img2: "assets/images/aro-rock-negro-modelo.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico, dorado, plateado o negro",
        "Diseño: remaches en punta, cierre de bisagra",
        "Uso: unisex",
      ],
    },
    {
      nombre: "Aros Diamond",
      sub: "plata",
      precio: 14000,
      desc: "Aro abridor con piedra blanca facetada engarzada en garras, base plana.",
      img: "assets/images/aro-diamond-plata.jpg",
      img2: "assets/images/aro-diamond-plata-modelo.jpg",
      img3: "assets/images/aro-diamond-plata-caja.jpg",
      detalles: [
        "Material: plata 900 bañada en rodio",
        "Diseño: abridor con piedra facetada engarzada en garras",
      ],
    },
    {
      nombre: "Aros Cuba Gold",
      sub: "acero",
      precio: 10000,
      desc: "Aro huggie liso de caño ancho, cierre de bisagra con broche de seguridad.",
      img: "assets/images/aro-cuba-dorado.jpg",
      img2: "assets/images/aro-cuba-dorado-modelo.jpg",
      detalles: [
        "Material: acero quirúrgico 316L, dorado",
        "Diseño: huggie liso, cierre de bisagra",
      ],
    },
    {
      nombre: "Aros Sky",
      sub: "acero",
      precio: 9000,
      desc: "Aro chico tipo hoop con una franja de micropavé en el frente. Cierre de bisagra con broche de seguridad. Disponible en dorado o plateado.",
      img: "assets/images/aro-sky-dorado.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      variantes: [
        { nombre: "Dorado", img: "assets/images/aro-sky-dorado.jpg" },
        { nombre: "Plateado", img: "assets/images/aro-sky-plateado.jpg", img2: "assets/images/aro-sky-plateado-modelo.jpg", img3: "assets/images/aro-sky-plateado-modelo2.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico, dorado o plateado",
        "Diseño: micropavé, cierre de bisagra",
      ],
    },
    {
      nombre: "Aros Rubí",
      sub: "acero",
      precio: 16000,
      desc: "Aro pequeño con piedra rectangular facetada engarzada en garras. Cierre de bisagra con broche de seguridad. Disponible en dorado o plateado.",
      img: "assets/images/aro-rubi-dorado.jpg",
      img2: "assets/images/aro-rubi-dorado-modelo.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      variantes: [
        { nombre: "Dorado", precio: 16000, img: "assets/images/aro-rubi-dorado.jpg", img2: "assets/images/aro-rubi-dorado-modelo.jpg" },
        { nombre: "Plateado", precio: 14000, img: "assets/images/aro-rubi-plateado.jpg", img2: "assets/images/aro-rubi-plateado-modelo.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico 316L, dorado o plateado",
        "Diseño: piedra facetada rectangular, cierre de bisagra",
      ],
    },
    {
      nombre: "Aros Ney",
      sub: "acero",
      precio: 10000,
      desc: "Aro abridor con strass engarzado, cierre a rosca.",
      img: "assets/images/aros-ney-2.jpg",
      img2: "assets/images/aros-ney.jpg",
      img3: "assets/images/aros-ney-modelo.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      detalles: [
        "Material: acero quirúrgico 316L",
        "Diseño: strass engarzado de 3 mm",
        "Cierre: a rosca",
      ],
    },
    {
      nombre: "Aros Santos Black",
      sub: "acero",
      precio: 8000,
      desc: "Aro huggie negro con dije de cruz colgante, cierre clip.",
      img: "assets/images/aros-santos-black.jpg",
      img2: "assets/images/aros-santos-black-modelo.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      detalles: [
        "Material: acero quirúrgico negro",
        "Diseño: dije de cruz colgante",
        "Cierre: clip",
      ],
    },
    {
      nombre: "Aros Cleef White",
      sub: "acero",
      precio: 9000,
      desc: "Aro con dije colgante tipo trébol (clover) blanco nácar, acero dorado, cierre clip.",
      img: "assets/images/aros-cleef-white.jpg",
      img2: "assets/images/aros-cleef-white-modelo.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero dorado",
        "Diseño: dije colgante tipo trébol, blanco nácar",
        "Cierre: clip",
      ],
    },
    {
      nombre: "Aros Cleef Black",
      sub: "acero",
      precio: 9000,
      desc: "Aro con dije colgante tipo trébol (clover) negro ónix, acero dorado, cierre clip.",
      img: "assets/images/aros-cleef-black.jpg",
      img2: "assets/images/aros-cleef-black-modelo.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero dorado",
        "Diseño: dije colgante tipo trébol, negro ónix",
        "Cierre: clip",
      ],
    },
    {
      nombre: "Aros Angel",
      sub: "acero",
      precio: 8000,
      desc: "Aro huggie con dije colgante de ala, acero quirúrgico.",
      img: "assets/images/aro-angel.jpg",
      img2: "assets/images/aro-angel-modelo.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: dije colgante de ala",
        "Cierre: clip",
      ],
    },
  ],

  anillos: [
    {
      nombre: "Anillo Cali",
      sub: "acero",
      precio: 12000,
      desc: "Anillo con piedras baguette engarzadas, color dorado.",
      img: "assets/images/anillo-cali.jpg",
      img2: "assets/images/anillo-cali-modelo.jpg",
      img3: "assets/images/anillo-cali-modelo2.jpg",
      img4: "assets/images/guia-talles-anillos.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero dorado con piedras baguette",
        "Talles disponibles: 17, 18 y 19",
      ],
    },
    {
      nombre: "Anillo Italia",
      sub: "acero",
      precio: 23000,
      desc: "Anillo sello con piedra ónix rectangular, acero quirúrgico dorado macizo.",
      img: "assets/images/anillo-italia.jpg",
      img2: "assets/images/anillo-italia-caja.jpg",
      img3: "assets/images/anillo-italia-modelo.jpg",
      img4: "assets/images/guia-talles-anillos.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico dorado macizo",
        "Talles disponibles: 18 y 19",
      ],
    },
    {
      nombre: "Anillo Rock",
      sub: "acero",
      precio: 21000,
      desc: "Anillo sello con placa rectangular lisa, acero macizo 316L. Disponible en negro, plateado o dorado.",
      img: "assets/images/anillo-rock-negro.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      variantes: [
        { nombre: "Negro", img: "assets/images/anillo-rock-negro.jpg", img2: "assets/images/anillo-rock-negro-detalle.jpg", img3: "assets/images/anillo-rock-negro-modelo.jpg", img4: "assets/images/guia-talles-anillos.jpg" },
        { nombre: "Plateado", img: "assets/images/anillo-rock-plateado.jpg", img2: "assets/images/anillo-rock-plateado-caja.jpg", img3: "assets/images/guia-talles-anillos.jpg" },
        { nombre: "Dorado", img: "assets/images/anillo-rock-dorado.jpg", img2: "assets/images/anillo-rock-dorado-modelo.jpg", img3: "assets/images/guia-talles-anillos.jpg" },
      ],
      detalles: [
        "Material: acero macizo 316L",
        "Talles disponibles: 18, 19 y 20",
      ],
    },
    {
      nombre: "Anillo Cuba Silver",
      sub: "acero",
      precio: 12000,
      desc: "Anillo plano color plateado. Acero quirúrgico.",
      img: "assets/images/anillo-cuba-silver.jpg",
      img2: "assets/images/anillo-cuba-silver-modelo.jpg",
      img3: "assets/images/guia-talles-anillos.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: banda lisa plana, 7 mm de grosor",
        "Talles disponibles: 18, 19, 20, 21 y 22",
      ],
    },
    {
      nombre: "Anillo Bvlgari",
      sub: "acero",
      precio: 9000,
      desc: "Anillo sello con medallón circular de ónix negro, bordeado con texto grabado en relieve. Banda lisa, acero quirúrgico plateado.",
      img: "assets/images/anillo-bvlgari.jpg",
      img2: "assets/images/anillo-bvlgari-modelo.jpg",
      img3: "assets/images/guia-talles-anillos.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: medallón circular de ónix negro con texto grabado",
        "Talles disponibles: 18, 19, 20, 21 y 22",
      ],
    },
    {
      nombre: "Anillo Royal",
      sub: "acero",
      precio: 12000,
      desc: "Anillo sello con emblema de corona en micropavé, acero dorado.",
      img: "assets/images/anillo-royal.jpg",
      img2: "assets/images/anillo-royal-caja.jpg",
      img3: "assets/images/guia-talles-anillos.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero dorado con micropavé",
        "Talles disponibles: 19 y 20",
      ],
    },
    {
      nombre: "Anillo Spike",
      sub: "acero",
      precio: 8000,
      desc: "Anillo abierto con diseño cruzado (X). Acero quirúrgico, regulable.",
      img: "assets/images/anillo-spike.jpg",
      img2: "assets/images/anillo-spike-modelo.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: abierto, regulable (talle único)",
      ],
    },
    {
      nombre: "Anillo Lazo",
      sub: "acero",
      precio: 8000,
      desc: "Anillo abierto con doble banda entrelazada. Acero quirúrgico, regulable.",
      img: "assets/images/anillo-lazo.jpg",
      img2: "assets/images/anillo-lazo-modelo.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: doble banda entrelazada, regulable (talle único)",
      ],
    },
    {
      nombre: "Anillos Chunky",
      sub: "acero",
      precio: 8000,
      desc: "Anillo abierto de diseño escultural. Acero quirúrgico, regulable. Disponible en 2 modelos.",
      img: "assets/images/anillo-chunky-ola.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      variantes: [
        { nombre: "Modelo 1", img: "assets/images/anillo-chunky-ola.jpg", img2: "assets/images/anillo-chunky-modelo.jpg" },
        { nombre: "Modelo 2", img: "assets/images/anillo-chunky-ovalo.jpg", img2: "assets/images/anillo-chunky-modelo.jpg" },
      ],
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: escultural, regulable (talle único)",
        "Disponible en 2 modelos",
      ],
    },
    {
      nombre: "Anillo Tear",
      sub: "acero",
      precio: 8000,
      desc: "Anillo abierto con doble gota (bypass). Acero quirúrgico, regulable.",
      img: "assets/images/anillo-tear.jpg",
      img2: "assets/images/anillo-tear-modelo.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      detalles: [
        "Material: acero quirúrgico",
        "Diseño: doble gota (bypass), regulable (talle único)",
      ],
    },
  ],

  accesorios: [
    {
      nombre: "Combo Cuba Silver",
      precio: 30000,
      desc: "Combo de 3 piezas color plateado, cadena cubana (curb chain): pulsera, cadena de 50 cm y anillo plano. Acero quirúrgico.",
      img: "assets/images/combo-cuba-silver.jpg",
      img2: "assets/images/combo-cuba-silver-modelo.jpg",
      img3: "assets/images/combo-cuba-silver-modelo2.jpg",
      img4: "assets/images/combo-cuba-silver-modelo3.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      detalles: [
        "Material: acero quirúrgico",
        "Incluye: pulsera + cadena (50 cm) + anillo",
        "Talles de anillo disponibles: 18 a 22",
        "Medidas de pulsera disponibles: 18 a 22 cm",
        "Cada pieza también se vende por separado a $12.000",
      ],
    },
    {
      nombre: "Combo Cleef Green",
      precio: 25000,
      desc: "Combo de 2 piezas con eslabones tipo trébol (clover) color verde: pulsera y collar. Acero quirúrgico.",
      img: "assets/images/combo-cleef-green.jpg",
      img2: "assets/images/combo-cleef-green-modelo.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      detalles: [
        "Material: acero quirúrgico",
        "Incluye: pulsera + collar",
        "Medidas de pulsera: 18 cm + 3 cm de extensión",
        "Medidas de collar: 45 cm + 5 cm de extensión",
      ],
    },
    {
      nombre: "Combo Cleef White",
      precio: 25000,
      desc: "Combo de 2 piezas con eslabones tipo trébol (clover) color blanco nácar: pulsera y collar. Acero quirúrgico.",
      img: "assets/images/combo-cleef-white-modelo.jpg",
      img2: "assets/images/combo-cleef-white.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico",
        "Incluye: pulsera + collar",
        "Medidas de pulsera: 18 cm + 3 cm de extensión",
        "Medidas de collar: 45 cm + 5 cm de extensión",
      ],
    },
    {
      nombre: "Combo Cleef Black",
      precio: 25000,
      desc: "Combo de 2 piezas con eslabones tipo trébol (clover) color negro ónix: pulsera y collar. Acero quirúrgico.",
      img: "assets/images/combo-cleef-black.jpg",
      img2: "assets/images/combo-cleef-black-modelo.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      detalles: [
        "Material: acero quirúrgico",
        "Incluye: pulsera + collar",
        "Medidas de pulsera: 18 cm + 3 cm de extensión",
        "Medidas de collar: 45 cm + 5 cm de extensión",
      ],
    },
  ],

};

/* Este archivo corre tal cual en el navegador (con <script>, variables
   globales) y también se puede reusar desde funciones serverless de
   Vercel (que sí entienden módulos de Node). "module" no existe en el
   navegador, así que esto no hace nada ahí — solo lo usan cosas como
   api/crear-preferencia.js para recalcular precios del lado del
   servidor y no confiar nunca en un precio que mande el navegador. */
if (typeof module !== "undefined") {
  module.exports = { CONFIG, CATEGORIAS, PRODUCTOS, PESO_CATEGORIA_KG, TARIFAS_ENVIO };
}

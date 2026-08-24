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
      Podés sumar más fotos del mismo producto con "img2" e "img3" (por
      ejemplo, una foto de estudio y otra puesta o en la cajita) — en la
      ficha del producto van a aparecer como una mini-galería.
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
  tagline: "Joyería Urbana",

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

  // Datos para transferencia por Mercado Pago. Dejalo en null si algún
  // día hay que sacarlos — el checkout por WhatsApp funciona igual,
  // el cliente coordina el pago por chat.
  pago: {
    titular: "Enzo Martín Camperi Melo",
    alias: "joyasdeacero.mp",
    cvu: "0000003100071501389000",
  },

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
    foto: null,
    subs: {
      plata: "Plata 925",
      acero: "Acero Quirúrgico",
      titanio: "Titanio",
    },
  },
  cadenas: {
    nombre: "Cadenas y Collares",
    foto: "assets/images/cadena-cruz-box.jpg",
    subs: {
      plata: "Plata 925",
      oro: "Baño de Oro 18K",
      acero: "Acero Quirúrgico",
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
    nombre: "Accesorios",
    foto: "assets/images/cadena-angel.jpg",
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
];


/* ----------------------------------------------------------------
   4. CATÁLOGO DE PRODUCTOS
   Organizado por categoría. Cada categoría es un array de productos.
   ---------------------------------------------------------------- */
const PRODUCTOS = {

  cadenas: [
    {
      nombre: "Cadena Box Chain con Cruz Cincelada Silver",
      sub: "acero",
      precio: 49999,
      precioAntes: 59000,
      desc: "Cruz con detalles labrados en relieve de alta definición, montada sobre una robusta cadena Box de 3mm. Resistente al agua, perfumes y sudor gracias al acero 316L.",
      img: "assets/images/cadena-cruz-box.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      detalles: [
        "Material: acero quirúrgico 316L (no se oxida ni despinta)",
        "Largos disponibles: 50, 55 y 60 cm",
      ],
    },
    {
      nombre: "Colgante Medallón Sol Radiante con Cadena Rope Gold",
      sub: "oro",
      precio: 54999,
      precioAntes: 65000,
      desc: "Medallón con diseño solar central en relieve oxidado y marco con brillo pulido. Cadena trenzada estilo Rope de 2.5mm con cierre de mosquetón reforzado.",
      img: "assets/images/collar-sol-dorado.jpg",
      etiqueta: "Más Vendido",
      color: "gold",
      detalles: [
        "Material: acero quirúrgico con triple baño de oro 18K",
        "Largos disponibles: 50, 55 y 60 cm",
      ],
    },
    {
      nombre: "Cadena Eslabón Cubano Miami Cuban 8mm Silver",
      sub: "acero",
      precio: 58999,
      desc: "La cadena cubana definitiva. Eslabones pulidos con corte diamante que reflejan la luz desde todos los ángulos. Peso sólido y caída perfecta.",
      img: null,
      detalles: [
        "Material: acero inoxidable quirúrgico 316L",
        "Largos disponibles: 50 y 55 cm",
      ],
    },
    {
      nombre: "Collar Soga Gold",
      sub: "acero",
      precio: 16000,
      desc: "Collar cadena soga (rope chain) de acero macizo, con cierre de mosquetón.",
      img: "assets/images/collar-soga-dorado.jpg",
      img2: "assets/images/collar-soga-dorado-modelo.jpg",
      img3: "assets/images/collar-soga-dorado-modelo2.jpg",
      detalles: [
        "Material: acero macizo dorado",
        "Largos disponibles: 50 y 55 cm",
      ],
    },
    {
      nombre: "Collar Enzo",
      precio: 21000,
      desc: "Colgante de cruz con textura tejida en relieve. Disponible en cadena soga dorada o cadena rolo en tono envejecido oxidado.",
      img: "assets/images/collar-enzo-dorado-modelo.jpg",
      etiqueta: "Nuevo",
      color: "gold",
      variantes: [
        { nombre: "Dorado", img: "assets/images/collar-enzo-dorado-modelo.jpg" },
        { nombre: "Oxidado", img: "assets/images/collar-enzo-oxidado.jpg", img2: "assets/images/collar-enzo-oxidado-modelo.jpg" },
      ],
      detalles: [
        "Diseño: colgante cruz con textura tejida en relieve",
        "Cadena: soga (dorado) o rolo (oxidado)",
      ],
    },
    {
      nombre: "Collar Gloria",
      precio: 24000,
      desc: "Colgante medallón circular con el Sol de Mayo, insignia nacional argentina, en relieve. Cadena rolo con cierre de mosquetón. Disponible en dorado u oxidado.",
      img: "assets/images/collar-gloria-dorado-modelo.jpg",
      img2: "assets/images/collar-gloria-dorado-modelo2.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      variantes: [
        { nombre: "Dorado", img: "assets/images/collar-gloria-dorado-modelo.jpg", img2: "assets/images/collar-gloria-dorado-modelo2.jpg" },
        { nombre: "Oxidado", img: "assets/images/collar-gloria-oxidado.jpg", img2: "assets/images/collar-gloria-oxidado-modelo.jpg" },
      ],
      detalles: [
        "Diseño: medallón circular con el Sol de Mayo en relieve",
        "Cadena: rolo, cierre de mosquetón",
      ],
    },
    {
      nombre: "Rosarios",
      precio: 16000,
      desc: "Rosario con dije de cruz y medalla de la Virgen, cadena de bolitas. Disponible combinado (bolitas doradas y plateadas) o plateado.",
      img: "assets/images/rosario-combinado.jpg",
      img2: "assets/images/rosario-combinado-modelo.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      variantes: [
        { nombre: "Combinado", precio: 16000, img: "assets/images/rosario-combinado.jpg", img2: "assets/images/rosario-combinado-modelo.jpg" },
        { nombre: "Plateado", precio: 13000, img: "assets/images/rosario-plateado.jpg", img2: "assets/images/rosario-plateado-modelo.jpg" },
      ],
      detalles: [
        "Diseño: rosario con dije de cruz y medalla de la Virgen",
      ],
    },
  ],

  pulseras: [
    {
      nombre: "Pulsera Cuban Chain Paved Zirconia Gold",
      sub: "oro",
      precio: 46999,
      precioAntes: 56000,
      desc: "Eslabón cubano de 7mm con sección central engastada con microcirconias suizas de brillo diamantado. Baño de oro 18K de máxima duración.",
      img: "assets/images/pulsera-cuban-pave.jpg",
      etiqueta: "Hot",
      color: "navy",
      detalles: [
        "Material: acero 316L + baño oro 18K + circonias AAA",
        "Medidas disponibles: 18, 20 y 22 cm",
      ],
    },
    {
      nombre: "Pulsera Tennis Iced Out 4mm Silver",
      sub: "plata",
      precio: 52999,
      desc: "Pulsera Tennis clásica con circonias de 4mm engarzadas en garra de 4 puntas. Cierre de caja con doble traba de seguridad.",
      img: null,
      etiqueta: "Nuevo",
      color: "emerald",
      detalles: [
        "Material: plata 925 / acero quirúrgico silver + circonia cúbica",
        "Medidas disponibles: 17, 19 y 21 cm",
      ],
    },
    {
      nombre: "Pulsera Cuero Trenzado Black con Broche Magnético Silver",
      sub: "cuero",
      precio: 34999,
      desc: "Cuero genuino trenzado doble con cierre magnético y traba de seguridad en acero quirúrgico cepillado.",
      img: null,
      detalles: [
        "Material: cuero genuino + acero 316L",
        "Medidas disponibles: 19 y 21 cm",
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
      desc: "Pulsera cadena soga (rope chain) con cierre de mosquetón y cadena extensora para ajustar el largo.",
      img: "assets/images/pulsera-soga-dorado.jpg",
      img2: "assets/images/pulsera-soga-dorado-modelo.jpg",
      detalles: [
        "Material: acero quirúrgico 316L, dorado",
        "También disponible en versión más fina — consultá por WhatsApp",
      ],
    },
    {
      nombre: "Pulsera Snake Gold",
      precio: 12000,
      desc: "Pulsera cadena plana tipo snake/herringbone, con cadena extensora para ajustar a cualquier medida de muñeca.",
      img: "assets/images/pulsera-snake-dorado.jpg",
      detalles: [
        "Diseño: cadena plana snake, con extensible ajustable",
      ],
    },
    {
      nombre: "Pulsera Light",
      precio: 21000,
      desc: "Pulsera cadena curva (curb chain) maciza con un eslabón oval engastado con microcirconias. Cadena extensora para ajustar a cualquier medida de muñeca.",
      img: "assets/images/pulsera-light-dorado.jpg",
      img2: "assets/images/pulsera-light-dorado-modelo.jpg",
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
      precio: 13000,
      desc: "Pulsera con eslabones tipo trébol (clover), cadena con mosquetón y cadena extensora. Elegí el color de cadena y de los tréboles.",
      img: "assets/images/pulsera-vancleef-plateada-negra.jpg",
      etiqueta: "Nuevo",
      color: "emerald",
      variantes: [
        { nombre: "Plateada negra", img: "assets/images/pulsera-vancleef-plateada-negra.jpg" },
        { nombre: "Plateada blanca", img: "assets/images/pulsera-vancleef-plateada-blanca.jpg" },
        { nombre: "Plateada verde", img: "assets/images/pulsera-vancleef-plateada-verde.jpg", img2: "assets/images/pulsera-vancleef-plateada-verde-modelo2.jpg" },
        { nombre: "Doradas blanca y negra", img: "assets/images/pulsera-vancleef-dorada-blanca-negra.jpg" },
        { nombre: "Doradas y negra", img: null },
        { nombre: "Doradas blanca", img: null },
      ],
      detalles: [
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
        { nombre: "Plateado", img: "assets/images/aro-rock-plateado.jpg" },
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
  ],

  anillos: [
    {
      nombre: "Anillo Black Titanio & Tungsteno Bisel Pulido",
      sub: "titanio",
      precio: 36999,
      precioAntes: 44000,
      desc: "Banda ergonómica en acabado negro satinado mate con bordes biselados pulidos al espejo. Ultra resistente a rayones y al desgaste diario.",
      img: null,
      etiqueta: "Más Vendido",
      color: "gold",
      detalles: [
        "Material: carburo de tungsteno y titanio negro",
        "Talles disponibles: 17, 19 y 21",
      ],
    },
    {
      nombre: "Anillo Sello Lion ROAR Silver & Gold",
      sub: "acero",
      precio: 42999,
      desc: "Sello macizo grabado en 3D con la cabeza de león rugiente, emblema de fuerza de la marca ROAR. Laterales texturizados con acabados oxidados.",
      img: null,
      etiqueta: "Hot",
      color: "navy",
      detalles: [
        "Material: acero quirúrgico 316L macizo",
        "Talles disponibles: 17, 19 y 21",
      ],
    },
    {
      nombre: "Anillo Giratorio Spinner Anti-Stress Silver",
      sub: "acero",
      precio: 31999,
      desc: "Anillo con mecanismo giratorio central de eslabón cubano continuo. Ideal como pieza de estilo y relajación anti-estrés.",
      img: null,
      detalles: [
        "Material: acero quirúrgico 316L",
        "Talles disponibles: 17, 19 y 21",
      ],
    },
  ],

  accesorios: [
    {
      nombre: "Cadena de Pantalón Double Curb Chain Silver",
      precio: 32999,
      desc: "Doble hilera de cadena para pantalón o billetera con mosquetones giratorios de liberación rápida.",
      img: null,
      etiqueta: "Nuevo",
      color: "emerald",
      detalles: [
        "Material: aleación de acero de alta resistencia",
        "Talle único (45 y 55 cm)",
      ],
    },
    {
      nombre: "Kit Oficial ROAR Care: Paño Microfibra + Spray Protector",
      precio: 14999,
      desc: "Paño de pulido doble capa impregnado con limpiador para metales preciosos y spray antihuellas. Mantiene tus joyas relucientes.",
      img: null,
      detalles: [
        "Material: microfibra premium de grado óptico",
        "Kit completo",
      ],
    },
    {
      nombre: "Cadena XL",
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
      precio: 28000,
      desc: "Cadena de pantalón triple, con tres texturas combinadas (trenzada, rolo y cadena fina) y un dije de cruz alada desmontable en una cadena aparte.",
      img: "assets/images/cadena-angel.jpg",
      img2: "assets/images/cadena-angel-modelo.jpg",
      img3: "assets/images/cadena-angel-detalle.jpg",
      etiqueta: "Nuevo",
      color: "navy",
      detalles: [
        "Diseño: triple cadena + dije de cruz alada desmontable",
        "Cierre: mosquetones giratorios",
      ],
    },
    {
      nombre: "Cadena Box Triple",
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
  ],

};

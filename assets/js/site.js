/* ============================================================
   SITE.JS — ROAR Joyería Urbana
   Arma todo el sitio (header, nav de categorías, hero, catálogo,
   testimonios, carrito y modal de producto) a partir de los datos
   de products.js. No tiene dependencias externas.
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     Helpers generales
  ------------------------------------------------------------ */
  var fmtMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: CONFIG.moneda || 'ARS',
    maximumFractionDigits: 0,
  });

  function money(n) {
    return fmtMoneda.format(n);
  }

  /* Precio real de un producto, según el color elegido (si tiene variantes
     y esa variante trae su propio precio). Si no, usa el precio general
     del producto. Puede devolver null/undefined ("Consultar precio"). */
  function precioDeItem(product, color) {
    if (color && product.variantes) {
      var v = product.variantes.filter(function (x) { return x.nombre === color; })[0];
      if (v && v.precio != null) return v.precio;
    }
    return product.precio;
  }

  /* El precio más bajo entre las variantes de un producto (o su precio
     general si no tiene variantes con precio propio) — para mostrar
     "Desde $X" en la tarjeta del catálogo cuando los colores no cuestan
     lo mismo. */
  function precioDesde(product) {
    if (!product.variantes) return product.precio;
    var precios = product.variantes
      .map(function (v) { return v.precio != null ? v.precio : product.precio; })
      .filter(function (p) { return p != null; });
    return precios.length ? Math.min.apply(null, precios) : product.precio;
  }

  function variantesConPrecioDistinto(product) {
    if (!product.variantes) return false;
    var precios = product.variantes.map(function (v) { return v.precio != null ? v.precio : product.precio; });
    return precios.some(function (p) { return p !== precios[0]; });
  }

  /* Para poder VER los colores (no solo leerlos) en la tarjeta y en la
     ficha: un circulito de color al lado de cada opción, calculado a
     partir del nombre de la variante — no hace falta cargar un color
     hex por producto en products.js. Si el nombre no menciona ningún
     color conocido (ej. "Talle único"), no se muestra circulito, solo
     el texto. Para nombres compuestos (ej. "Plateada verde", el caso
     de Pulseras Van Cleef) se usa el primer color que aparece en el
     texto — la cadena, que es lo que más se ve del conjunto. */
  var COLOR_HEX = {
    dorado: '#c99a2e', dorada: '#c99a2e', doradas: '#c99a2e',
    plateado: '#c7c9cc', plateada: '#c7c9cc', plateadas: '#c7c9cc',
    negro: '#1a1a1a', negra: '#1a1a1a', negras: '#1a1a1a',
    blanco: '#e9e6df', blanca: '#e9e6df', blancas: '#e9e6df',
    oxidado: '#4a4742', oxidada: '#4a4742',
    verde: '#145c3f',
  };
  function colorHexDeNombre(nombre) {
    var texto = String(nombre).toLowerCase();
    var mejorClave = null, mejorPos = Infinity;
    Object.keys(COLOR_HEX).forEach(function (clave) {
      var pos = texto.indexOf(clave);
      if (pos !== -1 && pos < mejorPos) { mejorPos = pos; mejorClave = clave; }
    });
    return mejorClave ? COLOR_HEX[mejorClave] : null;
  }

  function slugify(str) {
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  var SVG_TAGS = { svg: 1, circle: 1, path: 1, rect: 1, line: 1, polygon: 1, polyline: 1, ellipse: 1, g: 1 };
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs) {
    var node = SVG_TAGS[tag] ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
    attrs = attrs || {};
    for (var key in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, key)) continue;
      var val = attrs[key];
      if (val === null || val === undefined || val === false) continue;
      if (key === 'text') node.textContent = val;
      else if (key === 'html') node.innerHTML = val;
      else if (key.indexOf('on') === 0 && typeof val === 'function') node.addEventListener(key.slice(2), val);
      else node.setAttribute(key, val);
    }
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (child === null || child === undefined) continue;
      if (Array.isArray(child)) {
        child.forEach(function (c) { if (c) node.appendChild(c); });
      } else {
        node.appendChild(child);
      }
    }
    return node;
  }

  function waLink(numero, texto) {
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
  }

  function toast(msg) {
    var existing = document.getElementById('site-toast');
    if (existing) existing.remove();
    var t = el('div', { id: 'site-toast', class: 'toast' }, document.createTextNode(msg));
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('toast-visible'); });
    setTimeout(function () {
      t.classList.remove('toast-visible');
      setTimeout(function () { t.remove(); }, 250);
    }, 2200);
  }

  /* ------------------------------------------------------------
     Índice plano de productos (para buscar por categoria:slug)
  ------------------------------------------------------------ */
  var CATALOGO = []; // { catKey, catNombre, slug, product }

  Object.keys(PRODUCTOS).forEach(function (catKey) {
    var lista = PRODUCTOS[catKey] || [];
    lista.forEach(function (p) {
      CATALOGO.push({
        catKey: catKey,
        catNombre: (CATEGORIAS[catKey] && CATEGORIAS[catKey].nombre) || catKey,
        slug: slugify(p.nombre),
        product: p,
      });
    });
  });

  function findEntry(catKey, slug) {
    for (var i = 0; i < CATALOGO.length; i++) {
      if (CATALOGO[i].catKey === catKey && CATALOGO[i].slug === slug) return CATALOGO[i];
    }
    return null;
  }

  function entryKey(entry) {
    return entry.catKey + ':' + entry.slug;
  }

  /* ------------------------------------------------------------
     Carrito — 100% client-side, persistido en localStorage
  ------------------------------------------------------------ */
  var CART_KEY = 'roar_cart_v1';
  var cart = loadCart(); // [{ catKey, slug, cantidad }]
  var entrega = { tipo: 'retiro', provincia: '', precio: null, cp: '', esReal: false };

  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      /* localStorage no disponible: el carrito no persiste, pero el sitio sigue funcionando */
    }
  }

  function cartCount() {
    return cart.reduce(function (sum, item) { return sum + item.cantidad; }, 0);
  }

  function cartAdd(catKey, slug, cantidad, color) {
    cantidad = cantidad || 1;
    var existing = cart.filter(function (i) { return i.catKey === catKey && i.slug === slug && i.color === color; })[0];
    if (existing) {
      existing.cantidad += cantidad;
    } else {
      cart.push({ catKey: catKey, slug: slug, cantidad: cantidad, color: color });
    }
    saveCart();
    renderCartCount();
    renderCartDrawer();
    recalcularEnvioSiCorresponde();
    toast('Agregado al pedido');
  }

  function cartSetQty(catKey, slug, cantidad, color) {
    if (cantidad <= 0) {
      cart = cart.filter(function (i) { return !(i.catKey === catKey && i.slug === slug && i.color === color); });
    } else {
      var existing = cart.filter(function (i) { return i.catKey === catKey && i.slug === slug && i.color === color; })[0];
      if (existing) existing.cantidad = cantidad;
    }
    saveCart();
    renderCartCount();
    renderCartDrawer();
    recalcularEnvioSiCorresponde();
  }

  function cartTotal() {
    return cart.reduce(function (sum, item) {
      var entry = findEntry(item.catKey, item.slug);
      var precio = entry ? (precioDeItem(entry.product, item.color) || 0) : 0;
      return sum + precio * item.cantidad;
    }, 0);
  }

  function cartWeight() {
    var EMBALAJE_KG = 0.1;
    return cart.reduce(function (kg, item) {
      return kg + (PESO_CATEGORIA_KG[item.catKey] || 0) * item.cantidad;
    }, EMBALAJE_KG);
  }

  function setEntregaTipo(tipo) {
    entrega.tipo = tipo;
    renderCartDrawer();
  }

  /* Calcula el envío a una provincia (usa shipping.js): si ya se cargó un
     código postal, intenta primero la cotización real contra Correo
     Argentino; si no hay CP, o la cotización real no está disponible o
     falla, usa la tabla estimada de siempre como respaldo. */
  function actualizarEnvio(provincia) {
    if (!provincia) return;

    if (CONFIG.envioGratisDesde != null && cartTotal() >= CONFIG.envioGratisDesde) {
      entrega.provincia = provincia;
      entrega.precio = 0;
      entrega.esReal = false;
      renderCartDrawer();
      return;
    }

    var peso = cartWeight();

    function pintar(resultado, esReal) {
      if (!resultado.ok) return false;
      entrega.provincia = provincia;
      entrega.precio = resultado.precio;
      entrega.esReal = esReal;
      renderCartDrawer();
      return true;
    }

    function conTablaLocal() {
      estimateEnvio(provincia, peso, TARIFAS_ENVIO).then(function (resultado) { pintar(resultado, false); });
    }

    if (entrega.cp && /^\d{4}$/.test(entrega.cp)) {
      cotizarEnvioReal(entrega.cp, peso).then(function (real) {
        if (!pintar(real, true)) conTablaLocal();
      });
    } else {
      conTablaLocal();
    }
  }

  /* Si ya se eligió una provincia, cada vez que cambia lo que hay en el
     carrito (agregar, sumar/restar, sacar) hay que volver a pedir el
     envío: el peso del pedido cambió y el precio de $/kg extra también
     puede cambiar. No pasa nada si todavía no se eligió ninguna. */
  function recalcularEnvioSiCorresponde() {
    if (entrega.tipo === 'envio' && entrega.provincia) actualizarEnvio(entrega.provincia);
  }

  /* ------------------------------------------------------------
     Header
  ------------------------------------------------------------ */
  function renderHeader() {
    var header = document.getElementById('site-header');
    header.appendChild(
      el('div', { class: 'header-inner' },
        el('a', { href: '#hero', class: 'brand', 'aria-label': CONFIG.nombre + ' — inicio' },
          el('img', {
            src: 'assets/images/logo-roar.jpg',
            alt: CONFIG.nombre,
            class: 'brand-logo',
            width: '48',
            height: '48',
          }),
          el('span', { class: 'brand-text' },
            el('strong', { text: CONFIG.nombre }),
            el('small', { text: CONFIG.tagline })
          )
        ),
        el('button', {
          class: 'cart-btn',
          type: 'button',
          'aria-label': 'Ver carrito de pedido',
          onclick: openCart,
        },
          el('svg', { viewBox: '0 0 24 24', width: '22', height: '22', 'aria-hidden': 'true', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            el('circle', { cx: '9', cy: '21', r: '1' }),
            el('circle', { cx: '20', cy: '21', r: '1' }),
            el('path', { d: 'M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' })
          ),
          el('span', { class: 'cart-count', id: 'cart-count', text: String(cartCount()) })
        )
      )
    );
  }

  function renderCartCount() {
    var badge = document.getElementById('cart-count');
    if (badge) badge.textContent = String(cartCount());
  }

  /* ------------------------------------------------------------
     Barra de categorías (pastillas, sticky)
  ------------------------------------------------------------ */
  var activeCategory = null;

  function categoriasConProductos() {
    return Object.keys(CATEGORIAS).filter(function (key) {
      return (PRODUCTOS[key] || []).length > 0;
    });
  }

  /* Vidriera de categorías: tarjetas grandes con foto, arriba del
     catálogo. Comparte la lógica de cambio de categoría (setActiveCategory)
     con la barra de pastillas de más abajo. */
  function renderCategoryShowcase() {
    var section = document.getElementById('category-showcase');
    if (!section) return;
    var claves = categoriasConProductos();

    section.appendChild(
      el('div', { class: 'section-inner' },
        el('h2', { class: 'section-title', text: 'Explorá el catálogo' }),
        el('div', { class: 'showcase-grid' },
          claves.map(function (key) {
            var cat = CATEGORIAS[key];
            return el('button', {
              type: 'button',
              class: 'category-tile' + (cat.foto ? '' : ' category-tile-sinfoto') + (key === activeCategory ? ' category-tile-active' : ''),
              'data-cat': key,
              onclick: function () { setActiveCategory(key); },
            },
              cat.foto
                ? el('img', { src: cat.foto, alt: '', 'aria-hidden': 'true', class: 'category-tile-photo', loading: 'lazy' })
                : null,
              el('span', { class: 'category-tile-scrim' }),
              el('span', { class: 'category-tile-name', text: cat.nombre })
            );
          })
        )
      )
    );
  }

  function renderCategoryNav() {
    var nav = document.getElementById('category-nav');
    nav.innerHTML = '';
    var claves = categoriasConProductos();

    claves.forEach(function (key) {
      var pill = el('button', {
        class: 'pill' + (key === activeCategory ? ' pill-active' : ''),
        type: 'button',
        'data-cat': key,
        onclick: function () { setActiveCategory(key); },
      }, document.createTextNode(CATEGORIAS[key].nombre));
      nav.appendChild(pill);
    });
  }

  function setActiveCategory(key) {
    activeCategory = key;
    renderCategoryNav();
    document.querySelectorAll('.category-tile').forEach(function (tile) {
      tile.classList.toggle('category-tile-active', tile.getAttribute('data-cat') === key);
    });
    document.querySelectorAll('.cat-section').forEach(function (section) {
      section.hidden = section.getAttribute('data-cat') !== key;
    });
    var section = document.querySelector('.cat-section[data-cat="' + key + '"]');
    if (section) {
      var top = section.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  function getHeaderOffset() {
    var header = document.getElementById('site-header');
    var nav = document.getElementById('category-nav');
    return (header ? header.offsetHeight : 0) + (nav ? nav.offsetHeight : 0) + 8;
  }

  /* ------------------------------------------------------------
     Hero
  ------------------------------------------------------------ */
  function renderHero() {
    var hero = document.getElementById('hero');

    // El slogan y los datos de envío/material ya vienen incorporados en el
    // diseño de la foto — este bloque los repite oculto visualmente, solo
    // para lectores de pantalla y buscadores.
    hero.appendChild(
      el('h1', { class: 'sr-only', text: 'Que tu joya hable por vos' })
    );
    hero.appendChild(
      el('p', { class: 'sr-only', text: 'Envío gratis a todo el país a partir de $45.000. Acero quirúrgico 316L: no mancha, no irrita, no se oxida.' })
    );

    hero.appendChild(
      el('img', {
        src: 'assets/images/showroom-pared-roar.jpg',
        alt: 'Que tu joya hable por vos — envío gratis a todo el país a partir de $45.000, acero quirúrgico 316L',
        class: 'hero-bg-photo',
        fetchpriority: 'high',
      })
    );
  }

  /* ------------------------------------------------------------
     Catálogo — secciones por categoría, con sub-pastillas
  ------------------------------------------------------------ */
  /* Devuelve SIEMPRE el <img> o el placeholder "en crudo", sin clases de
     tamaño propias. El tamaño lo define el contenedor que lo envuelve
     (.card-photo, .modal-photo, .cart-item-photo) vía selector descendiente
     en el CSS — así evitamos pelear con la especificidad de clases combinadas. */
  function renderPhoto(product) {
    if (product.img) {
      return el('img', {
        src: product.img,
        alt: product.nombre,
        class: 'photo-img',
        loading: 'lazy',
        width: '400',
        height: '400',
      });
    }
    return el('div', { class: 'photo-placeholder' },
      el('img', {
        src: 'assets/images/logo-roar-mono.png',
        alt: '',
        'aria-hidden': 'true',
        class: 'placeholder-logo',
        loading: 'lazy',
      }),
      el('span', { text: 'Foto próximamente' })
    );
  }

  function renderBadges(product) {
    var badges = [];
    if (product.etiqueta) {
      badges.push(el('span', { class: 'badge badge-' + (product.color || 'gold'), text: product.etiqueta }));
    }
    if (product.agotado) {
      badges.push(el('span', { class: 'badge badge-agotado', text: 'Sin stock' }));
    }
    return badges.length ? el('div', { class: 'card-badges' }, badges) : null;
  }

  function renderCard(catKey, catNombre, product) {
    var slug = slugify(product.nombre);
    var waTexto = 'Hola ' + CONFIG.nombre + '! Quiero consultar por: ' + product.nombre;

    var precioBase = precioDesde(product);
    var precioNode = precioBase
      ? el('span', { class: 'card-price', text: (variantesConPrecioDistinto(product) ? 'Desde ' : '') + money(precioBase) })
      : el('span', { class: 'card-price card-price-consultar', text: 'Consultar precio' });

    var precioAntesNode = product.precioAntes
      ? el('span', { class: 'card-price-before', text: money(product.precioAntes) })
      : null;

    /* Circulitos de color en la tarjeta: se ven de entrada, antes de abrir
       la ficha, para que quede claro que hay más de un color. Tocar uno
       abre la ficha con ese color ya elegido (agregar al pedido se sigue
       confirmando ahí, igual que tocando la foto o "Agregar al pedido").

       Con pocos colores (hasta MAX_SWATCHES_EN_TARJETA) se ven los
       circulitos. Con más, ponerlos todos queda amontonado — en vez de
       eso se ve un aviso genérico ("Muchos colores"): la selección
       completa, con foto de cada uno, se ve al entrar a la ficha. */
    var MAX_SWATCHES_EN_TARJETA = 3;
    var variantesNode = null;
    if (product.variantes && product.variantes.length > 1) {
      if (product.variantes.length > MAX_SWATCHES_EN_TARJETA) {
        variantesNode = el('button', {
          type: 'button', class: 'card-muchos-colores',
          onclick: function () { openProductModal(catKey, slug); },
        }, document.createTextNode('Muchos colores — ver todos'));
      } else {
        var todosColoresTarjeta = product.variantes.every(function (v) { return colorHexDeNombre(v.nombre); });
        variantesNode = el('div', { class: 'card-variantes', 'aria-label': todosColoresTarjeta ? 'Colores disponibles' : 'Opciones disponibles' },
          product.variantes.map(function (v) {
            var hex = colorHexDeNombre(v.nombre);
            return hex
              ? el('button', {
                  type: 'button', class: 'card-swatch',
                  style: 'background:' + hex,
                  'aria-label': v.nombre,
                  onclick: function () { openProductModal(catKey, slug, v.nombre); },
                })
              : el('button', {
                  type: 'button', class: 'pill pill-sm',
                  onclick: function () { openProductModal(catKey, slug, v.nombre); },
                }, document.createTextNode(v.nombre));
          })
        );
      }
    }

    return el('article', { class: 'card', 'data-sub': product.sub || '' },
      el('button', {
        class: 'card-photo',
        type: 'button',
        'aria-label': 'Ver detalle de ' + product.nombre,
        onclick: function () { openProductModal(catKey, slug); },
      },
        renderPhoto(product),
        renderBadges(product)
      ),
      el('div', { class: 'card-body' },
        el('span', { class: 'card-cat', text: catNombre }),
        el('h3', { class: 'card-name' },
          el('button', {
            type: 'button',
            class: 'card-name-btn',
            onclick: function () { openProductModal(catKey, slug); },
          }, document.createTextNode(product.nombre))
        ),
        el('div', { class: 'card-price-row' }, [precioNode, precioAntesNode]),
        variantesNode,
        el('div', { class: 'card-actions' },
          el('button', {
            class: 'btn btn-add',
            type: 'button',
            disabled: product.agotado ? 'disabled' : null,
            onclick: function () {
              // Si tiene variantes (colores/materiales), hay que elegir una
              // primero — se abre la ficha en vez de agregar un color al azar.
              if (product.variantes && product.variantes.length) {
                openProductModal(catKey, slug);
              } else {
                cartAdd(catKey, slug, 1);
              }
            },
          }, document.createTextNode(product.agotado ? 'Sin stock' : 'Agregar al pedido')),
          (CONFIG.whatsappVisible && CONFIG.whatsapp)
            ? el('a', {
                href: waLink(CONFIG.whatsapp, waTexto),
                target: '_blank',
                rel: 'noopener noreferrer',
                class: 'card-wa-link',
              }, document.createTextNode('Consultar por WhatsApp'))
            : null
        )
      )
    );
  }

  function renderSubPills(catKey, subsUsados) {
    var subsDef = (CATEGORIAS[catKey] && CATEGORIAS[catKey].subs) || {};
    var claves = Object.keys(subsDef).filter(function (k) { return subsUsados.indexOf(k) !== -1; });
    if (!claves.length) return null;

    var wrap = el('div', { class: 'subpills', 'data-cat': catKey });
    wrap.appendChild(
      el('button', {
        class: 'subpill subpill-active',
        type: 'button',
        'data-sub': '',
        onclick: function (e) { filterSub(catKey, '', e.currentTarget); },
      }, document.createTextNode('Todas'))
    );
    claves.forEach(function (subKey) {
      wrap.appendChild(
        el('button', {
          class: 'subpill',
          type: 'button',
          'data-sub': subKey,
          onclick: function (e) { filterSub(catKey, subKey, e.currentTarget); },
        }, document.createTextNode(subsDef[subKey]))
      );
    });
    return wrap;
  }

  function filterSub(catKey, subKey, btn) {
    var section = document.querySelector('.cat-section[data-cat="' + catKey + '"]');
    if (!section) return;
    section.querySelectorAll('.subpill').forEach(function (p) { p.classList.remove('subpill-active'); });
    btn.classList.add('subpill-active');
    section.querySelectorAll('.card').forEach(function (card) {
      var matches = !subKey || card.getAttribute('data-sub') === subKey;
      card.hidden = !matches;
    });
  }

  function renderCatalogo() {
    var catalogo = document.getElementById('catalogo');
    catalogo.innerHTML = '';

    var claves = categoriasConProductos();
    if (!activeCategory || claves.indexOf(activeCategory) === -1) {
      activeCategory = claves[0] || null;
    }

    claves.forEach(function (catKey) {
      var productos = PRODUCTOS[catKey] || [];
      var subsUsados = [];
      productos.forEach(function (p) { if (p.sub && subsUsados.indexOf(p.sub) === -1) subsUsados.push(p.sub); });

      var grid = el('div', { class: 'grid' },
        productos.map(function (p) { return renderCard(catKey, CATEGORIAS[catKey].nombre, p); })
      );

      var section = el('div', {
        class: 'cat-section',
        'data-cat': catKey,
        hidden: catKey === activeCategory ? null : 'hidden',
      },
        el('h2', { class: 'cat-title', text: CATEGORIAS[catKey].nombre }),
        renderSubPills(catKey, subsUsados),
        grid
      );

      catalogo.appendChild(section);
    });

    renderCategoryNav();
  }

  /* ------------------------------------------------------------
     Modal de producto (con mini-galería si hay img2)
  ------------------------------------------------------------ */
  function openProductModal(catKey, slug, varianteInicial) {
    var entry = findEntry(catKey, slug);
    if (!entry) return;
    var product = entry.product;
    var modal = document.getElementById('product-modal');
    modal.innerHTML = '';

    var variantes = (product.variantes && product.variantes.length) ? product.variantes : null;
    var varianteActual = 0;
    if (varianteInicial && variantes) {
      var idxInicial = variantes.findIndex(function (v) { return v.nombre === varianteInicial; });
      if (idxInicial !== -1) varianteActual = idxInicial;
    }

    function fotosActuales() {
      var base = variantes ? variantes[varianteActual] : product;
      return [base.img, base.img2, base.img3, base.img4].filter(Boolean);
    }

    var fotos = fotosActuales();
    var fotoActual = 0;

    var fotoBox = el('div', { class: 'modal-photo' });
    function pintarFoto() {
      fotoBox.innerHTML = '';
      if (fotos.length) {
        fotoBox.appendChild(el('img', { src: fotos[fotoActual], alt: product.nombre, class: 'modal-photo-img' }));
      } else {
        // Ojo: si el producto tiene variantes, hay que mostrar el placeholder
        // de "sin foto" para LA VARIANTE actual, no la foto general del
        // producto (que puede ser la de otro color y confundir).
        fotoBox.appendChild(renderPhoto(variantes ? variantes[varianteActual] : product));
      }
    }
    pintarFoto();

    function irAFoto(i) {
      if (fotos.length < 2) return;
      fotoActual = ((i % fotos.length) + fotos.length) % fotos.length;
      pintarFoto();
      pintarDots();
    }

    var dotsBox = el('div', { class: 'modal-dots' });
    function pintarDots() {
      dotsBox.innerHTML = '';
      dotsBox.hidden = fotos.length <= 1;
      fotos.forEach(function (_, i) {
        dotsBox.appendChild(
          el('button', {
            class: 'modal-dot' + (i === fotoActual ? ' modal-dot-active' : ''),
            type: 'button',
            'aria-label': 'Ver foto ' + (i + 1),
            onclick: function () { irAFoto(i); },
          })
        );
      });
    }
    pintarDots();

    // Deslizar la foto con el dedo para cambiar de imagen, sin tener que
    // acertarle al puntito (que es un blanco chico en el celular).
    (function () {
      var touchX = 0, touchY = 0, swiping = false;
      fotoBox.addEventListener('touchstart', function (e) {
        if (fotos.length < 2) return;
        var t = e.touches[0];
        touchX = t.clientX;
        touchY = t.clientY;
        swiping = false;
      }, { passive: true });
      fotoBox.addEventListener('touchmove', function (e) {
        if (fotos.length < 2) return;
        var t = e.touches[0];
        var dx = t.clientX - touchX;
        var dy = t.clientY - touchY;
        if (!swiping && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) swiping = true;
        if (swiping) e.preventDefault();
      }, { passive: false });
      fotoBox.addEventListener('touchend', function (e) {
        if (!swiping) return;
        swiping = false;
        var t = e.changedTouches[0];
        var dx = t.clientX - touchX;
        var umbral = 40;
        if (dx <= -umbral) irAFoto(fotoActual + 1);
        else if (dx >= umbral) irAFoto(fotoActual - 1);
      });
    })();

    var qty = 1;
    var qtyLabel = el('span', { class: 'qty-value', text: String(qty) });

    var detallesList = (product.detalles || []).length
      ? el('ul', { class: 'modal-detalles' }, product.detalles.map(function (d) { return el('li', { text: d }); }))
      : null;

    var precioRow = el('div', { class: 'modal-precio-row' });
    function pintarPrecio() {
      precioRow.innerHTML = '';
      var precio = variantes ? precioDeItem(product, variantes[varianteActual].nombre) : product.precio;
      precioRow.appendChild(
        precio ? el('span', { class: 'modal-precio', text: money(precio) }) : el('span', { class: 'modal-precio', text: 'Consultar precio' })
      );
      if (product.precioAntes) {
        precioRow.appendChild(el('span', { class: 'card-price-before', text: money(product.precioAntes) }));
      }
    }
    pintarPrecio();

    function waTextoActual() {
      var base = 'Hola ' + CONFIG.nombre + '! Quiero consultar por: ' + product.nombre;
      return variantes ? base + ' (color: ' + variantes[varianteActual].nombre + ')' : base;
    }

    var waAnchor = (CONFIG.whatsappVisible && CONFIG.whatsapp)
      ? el('a', {
          href: waLink(CONFIG.whatsapp, waTextoActual()),
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'btn btn-whatsapp btn-block',
        }, document.createTextNode('Consultar por WhatsApp'))
      : null;

    var variantSelector = null;
    if (variantes) {
      var variantBtns = variantes.map(function (v, i) {
        var hex = colorHexDeNombre(v.nombre);
        var dot = hex ? el('span', { class: 'variant-pill-dot', style: 'background:' + hex, 'aria-hidden': 'true' }) : null;
        return el('button', {
          class: 'variant-pill' + (i === varianteActual ? ' variant-pill-active' : ''),
          type: 'button',
          onclick: function (e) {
            varianteActual = i;
            fotos = fotosActuales();
            fotoActual = 0;
            pintarFoto();
            pintarDots();
            pintarPrecio();
            if (waAnchor) waAnchor.href = waLink(CONFIG.whatsapp, waTextoActual());
            e.currentTarget.parentElement.querySelectorAll('.variant-pill').forEach(function (b, bi) {
              b.classList.toggle('variant-pill-active', bi === i);
            });
          },
        }, dot, document.createTextNode(v.nombre));
      });
      // Si todas las variantes son colores reconocidos, el selector dice
      // "Color"; si son otra cosa (ej. dos modelos/formas distintas de un
      // mismo anillo), dice "Modelo" para no llamar "color" a lo que no lo es.
      var todasSonColores = variantes.every(function (v) { return colorHexDeNombre(v.nombre); });
      variantSelector = el('div', { class: 'modal-variant-row' },
        el('span', { class: 'modal-qty-label', text: todasSonColores ? 'Color' : 'Modelo' }),
        el('div', { class: 'variant-pills' }, variantBtns)
      );
    }

    modal.appendChild(
      el('div', { class: 'modal-backdrop', onclick: closeProductModal },
        el('div', { class: 'modal-card', onclick: function (e) { e.stopPropagation(); } },
          el('button', { class: 'modal-close', type: 'button', 'aria-label': 'Cerrar', onclick: closeProductModal }, document.createTextNode('✕')),
          fotoBox,
          dotsBox,
          el('div', { class: 'modal-body' },
            el('span', { class: 'card-cat', text: entry.catNombre }),
            el('h2', { class: 'modal-nombre', text: product.nombre }),
            precioRow,
            variantSelector,
            el('p', { class: 'modal-desc', text: product.desc || '' }),
            detallesList,
            el('div', { class: 'modal-qty-row' },
              el('span', { class: 'modal-qty-label', text: 'Cantidad' }),
              el('div', { class: 'qty-stepper' },
                el('button', { type: 'button', class: 'qty-btn', 'aria-label': 'Restar', onclick: function () { qty = Math.max(1, qty - 1); qtyLabel.textContent = String(qty); } }, document.createTextNode('−')),
                qtyLabel,
                el('button', { type: 'button', class: 'qty-btn', 'aria-label': 'Sumar', onclick: function () { qty = qty + 1; qtyLabel.textContent = String(qty); } }, document.createTextNode('+'))
              )
            ),
            el('div', { class: 'modal-actions' },
              el('button', {
                class: 'btn btn-add btn-block',
                type: 'button',
                disabled: product.agotado ? 'disabled' : null,
                onclick: function () {
                  cartAdd(catKey, slug, qty, variantes ? variantes[varianteActual].nombre : undefined);
                  closeProductModal();
                },
              }, document.createTextNode(product.agotado ? 'Sin stock' : 'Agregar al pedido')),
              waAnchor,
              el('button', {
                class: 'btn btn-link',
                type: 'button',
                onclick: function () { copiarLinkProducto(catKey, slug); },
              }, document.createTextNode('Copiar link de este producto'))
            )
          )
        )
      )
    );

    modal.hidden = false;
    document.body.classList.add('no-scroll');
    if (location.hash !== '#producto=' + catKey + ':' + slug) {
      history.replaceState(null, '', '#producto=' + catKey + ':' + slug);
    }
  }

  function closeProductModal() {
    var modal = document.getElementById('product-modal');
    modal.hidden = true;
    modal.innerHTML = '';
    document.body.classList.remove('no-scroll');
    if (location.hash.indexOf('#producto=') === 0) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  function copiarLinkProducto(catKey, slug) {
    var url = location.origin + location.pathname + '#producto=' + catKey + ':' + slug;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        toast('¡Link copiado!');
      }).catch(function () {
        toast('No se pudo copiar. Copiá manualmente: ' + url);
      });
    } else {
      toast('No se pudo copiar. Copiá manualmente: ' + url);
    }
  }

  function abrirProductoDesdeHash() {
    var m = /^#producto=([^:]+):(.+)$/.exec(location.hash);
    if (!m) return;
    var catKey = m[1];
    var slug = m[2];
    var entry = findEntry(catKey, slug);
    if (!entry) return;
    if (categoriasConProductos().indexOf(catKey) !== -1) {
      setActiveCategory(catKey);
    }
    openProductModal(catKey, slug);
  }

  /* ------------------------------------------------------------
     Carrito — drawer lateral
  ------------------------------------------------------------ */

  /* Bloque "¿Cómo lo recibís?" — retiro sin cargo, o envío con selector
     de provincia (usa shipping.js, ver estimateEnvio). */
  function renderEntregaBlock() {
    var precioEnvioTexto = entrega.precio === 0 ? 'Gratis' : entrega.precio != null ? money(entrega.precio) : 'A coordinar';

    var selectEnvio = entrega.tipo === 'envio'
      ? el('select', {
          id: 'envio-select',
          class: 'delivery-select',
          'aria-label': 'Provincia de destino del envío',
          onchange: function (e) { actualizarEnvio(e.target.value); },
        },
          [el('option', {
            value: '',
            selected: entrega.provincia ? null : 'selected',
            disabled: entrega.provincia ? null : 'disabled',
          }, document.createTextNode('Elegí tu provincia…'))].concat(
            PROVINCIAS_ENVIO.map(function (p) {
              return el('option', { value: p, selected: p === entrega.provincia ? 'selected' : null }, document.createTextNode(p));
            })
          )
        )
      : null;

    var cpInput = entrega.tipo === 'envio'
      ? el('input', {
          type: 'text',
          id: 'envio-cp',
          class: 'delivery-select',
          inputmode: 'numeric',
          pattern: '[0-9]{4}',
          maxlength: '4',
          placeholder: 'Código postal (opcional, para el precio real)',
          'aria-label': 'Código postal de destino',
          value: entrega.cp || null,
          oninput: function (e) {
            entrega.cp = e.target.value;
            /* Con provincia ya elegida, un CP de 4 dígitos dispara la
               cotización real. Sin provincia todavía no hay de dónde sacar
               un precio de respaldo si la real fallara, así que esperamos
               a que se elija una. */
            if (entrega.provincia && /^\d{4}$/.test(entrega.cp)) actualizarEnvio(entrega.provincia);
          },
        })
      : null;

    var notaEnvio = entrega.tipo === 'envio' && entrega.precio != null
      ? el('small', { class: 'delivery-nota' + (entrega.precio === 0 || entrega.esReal ? ' delivery-nota-real' : '') },
          document.createTextNode(entrega.precio === 0
            ? '✓ Envío gratis por superar los ' + money(CONFIG.envioGratisDesde) + ' en productos'
            : entrega.esReal
              ? '✓ Cotización real de Correo Argentino'
              : 'Estimado — puede variar, se confirma por WhatsApp'))
      : null;

    return el('div', { class: 'delivery' },
      el('span', { class: 'delivery-title', text: '¿Cómo lo recibís?' }),
      el('label', { class: 'delivery-option' },
        el('input', {
          type: 'radio', name: 'entrega', value: 'retiro',
          checked: entrega.tipo === 'retiro' ? 'checked' : null,
          onchange: function () { setEntregaTipo('retiro'); },
        }),
        el('span', { class: 'delivery-option-name', text: 'Retiro en Viedma' }),
        el('span', { class: 'delivery-option-price delivery-option-price-free', text: 'Sin cargo' })
      ),
      el('label', { class: 'delivery-option' },
        el('input', {
          type: 'radio', name: 'entrega', value: 'envio',
          checked: entrega.tipo === 'envio' ? 'checked' : null,
          onchange: function () { setEntregaTipo('envio'); },
        }),
        el('span', { class: 'delivery-option-name', text: 'Envío a todo el país' }),
        el('span', { class: 'delivery-option-price', text: precioEnvioTexto })
      ),
      selectEnvio,
      cpInput,
      notaEnvio
    );
  }

  function openCart() {
    renderCartDrawer();
    document.getElementById('cart-drawer').hidden = false;
    document.getElementById('cart-backdrop').hidden = false;
    document.body.classList.add('no-scroll');
  }

  function closeCart() {
    document.getElementById('cart-drawer').hidden = true;
    document.getElementById('cart-backdrop').hidden = true;
    document.body.classList.remove('no-scroll');
  }

  function renderCartDrawer() {
    var drawer = document.getElementById('cart-drawer');
    drawer.innerHTML = '';

    var itemsNode;
    if (!cart.length) {
      itemsNode = el('div', { class: 'cart-empty' },
        el('p', { text: 'Tu pedido está vacío.' }),
        el('button', { class: 'btn btn-primary', type: 'button', onclick: closeCart }, document.createTextNode('Ver catálogo'))
      );
    } else {
      itemsNode = el('div', { class: 'cart-items' },
        cart.map(function (item) {
          var entry = findEntry(item.catKey, item.slug);
          if (!entry) return null;
          var product = entry.product;
          var variante = (item.color && product.variantes)
            ? product.variantes.filter(function (v) { return v.nombre === item.color; })[0]
            : null;
          var nombreConColor = product.nombre + (item.color ? ' — ' + item.color : '');
          var fotoItem = variante ? { img: variante.img, nombre: nombreConColor } : product;
          return el('div', { class: 'cart-item' },
            el('div', { class: 'cart-item-photo' }, renderPhoto(fotoItem)),
            el('div', { class: 'cart-item-info' },
              el('span', { class: 'cart-item-name', text: nombreConColor }),
              el('span', { class: 'cart-item-price', text: (function () { var p = precioDeItem(product, item.color); return p ? money(p) : 'Consultar precio'; })() }),
              el('div', { class: 'qty-stepper qty-stepper-sm' },
                el('button', { type: 'button', class: 'qty-btn', 'aria-label': 'Restar', onclick: function () { cartSetQty(item.catKey, item.slug, item.cantidad - 1, item.color); } }, document.createTextNode('−')),
                el('span', { class: 'qty-value', text: String(item.cantidad) }),
                el('button', { type: 'button', class: 'qty-btn', 'aria-label': 'Sumar', onclick: function () { cartSetQty(item.catKey, item.slug, item.cantidad + 1, item.color); } }, document.createTextNode('+'))
              )
            ),
            el('button', {
              class: 'cart-item-remove',
              type: 'button',
              'aria-label': 'Quitar del pedido',
              onclick: function () { cartSetQty(item.catKey, item.slug, 0, item.color); },
            }, document.createTextNode('✕'))
          );
        })
      );
    }

    var footer = cart.length
      ? el('div', { class: 'cart-footer' },
          renderEntregaBlock(),
          el('div', { class: 'cart-total-row' },
            el('span', { text: 'Total' }),
            el('strong', { text: money(cartTotal()) })
          ),
          CONFIG.mercadoPagoVisible
            ? el('button', {
                class: 'btn btn-mercadopago btn-block', type: 'button',
                onclick: function (e) { pagarConMercadoPago(e.currentTarget); },
              }, document.createTextNode('Pagar con Mercado Pago'))
            : null,
          (CONFIG.whatsappVisible && CONFIG.whatsapp)
            ? el('button', { class: 'btn btn-whatsapp btn-block', type: 'button', onclick: enviarPedidoWhatsApp }, document.createTextNode('Enviar pedido por WhatsApp'))
            : el('p', { class: 'cart-wa-pendiente', text: 'El WhatsApp todavía no está configurado.' })
        )
      : null;

    drawer.appendChild(
      el('div', { class: 'cart-inner' },
        el('div', { class: 'cart-header' },
          el('h2', { text: 'Tu pedido' }),
          el('button', { class: 'modal-close', type: 'button', 'aria-label': 'Cerrar carrito', onclick: closeCart }, document.createTextNode('✕'))
        ),
        itemsNode,
        footer
      )
    );
  }

  function enviarPedidoWhatsApp() {
    if (!cart.length) return;
    var lineas = ['Hola ' + CONFIG.nombre + '! Quiero hacer este pedido:', ''];
    cart.forEach(function (item, i) {
      var entry = findEntry(item.catKey, item.slug);
      if (!entry) return;
      var product = entry.product;
      var precioItem = precioDeItem(product, item.color);
      var precioTxt = precioItem ? money(precioItem * item.cantidad) : 'a consultar';
      var nombreConColor = product.nombre + (item.color ? ' (' + item.color + ')' : '');
      lineas.push((i + 1) + '. ' + nombreConColor + ' x' + item.cantidad + ' — ' + precioTxt);
    });
    lineas.push('');
    lineas.push('Total: ' + money(cartTotal()));
    if (entrega.tipo === 'envio' && entrega.provincia && entrega.precio != null) {
      var etiquetaEnvio = entrega.precio === 0 ? 'gratis' : entrega.esReal ? 'cotización real' : 'estimado';
      var precioEnvioTxt = entrega.precio === 0 ? 'Gratis' : money(entrega.precio);
      lineas.push('Envío a ' + entrega.provincia + ' (' + etiquetaEnvio + '): ' + precioEnvioTxt);
      if (entrega.cp) lineas.push('Código postal: ' + entrega.cp);
    }
    lineas.push('');
    lineas.push('Quedo a la espera de los datos para coordinar el pago y el envío. ¡Gracias!');
    window.open(waLink(CONFIG.whatsapp, lineas.join('\n')), '_blank');
  }

  /* Arma los ítems del pedido (productos + envío, si corresponde) y le pide
     a /api/crear-preferencia un link de pago de Mercado Pago. Si Mercado
     Pago todavía no está configurado (o falla), avisa por toast — el
     pedido por WhatsApp sigue funcionando igual como alternativa. */
  function pagarConMercadoPago(btn) {
    if (!cart.length) return;
    var items = [];
    cart.forEach(function (item) {
      var entry = findEntry(item.catKey, item.slug);
      if (!entry) return;
      var product = entry.product;
      var precioItem = precioDeItem(product, item.color);
      if (!precioItem) return; // "Consultar precio": no se puede cobrar un monto que no existe
      var nombreConColor = product.nombre + (item.color ? ' (' + item.color + ')' : '');
      items.push({ title: nombreConColor, quantity: item.cantidad, unit_price: precioItem });
    });
    if (entrega.tipo === 'envio' && entrega.precio) {
      items.push({ title: 'Envío a ' + entrega.provincia, quantity: 1, unit_price: entrega.precio });
    }
    if (!items.length) {
      toast('Ningún producto del pedido tiene precio cargado todavía');
      return;
    }

    var textoOriginal = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Preparando el pago…';

    fetch('/api/crear-preferencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items, siteUrl: window.location.origin + window.location.pathname }),
    })
      .then(function (r) { return r.ok ? r.json() : { ok: false }; })
      .catch(function () { return { ok: false }; })
      .then(function (data) {
        if (data.ok && data.init_point) {
          window.location.href = data.init_point;
          return;
        }
        btn.disabled = false;
        btn.textContent = textoOriginal;
        toast('Mercado Pago no está disponible ahora — probá con el pedido por WhatsApp');
      });
  }

  /* ------------------------------------------------------------
     Franja de confianza (materiales, envío, atención)
  ------------------------------------------------------------ */
  function trustIcon(d, extra) {
    var children = Array.isArray(d) ? d : [el('path', { d: d })];
    return el('svg', { viewBox: '0 0 24 24', width: '24', height: '24', 'aria-hidden': 'true', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, children);
  }

  function renderTrustStrip() {
    var section = document.getElementById('confianza');
    if (!section) return;
    var items = [
      {
        icon: trustIcon([
          el('path', { d: 'M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z' }),
          el('path', { d: 'M9 12l2 2 4-4' }),
        ]),
        titulo: 'Acero 316L y Plata 925',
        texto: 'Materiales hipoalergénicos que no se oxidan ni despintan',
      },
      {
        icon: trustIcon([
          el('rect', { x: '1', y: '5', width: '14', height: '11' }),
          el('polygon', { points: '15 9 19 9 22 12 22 16 15 16 15 9' }),
          el('circle', { cx: '6', cy: '18.5', r: '2' }),
          el('circle', { cx: '18', cy: '18.5', r: '2' }),
        ]),
        titulo: 'Envíos a todo el país',
        texto: 'Coordinado por Correo Argentino, cotizado al instante',
      },
      {
        icon: trustIcon('M21 11.5a8.4 8.4 0 01-8.4 8.4 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.8a8.4 8.4 0 01-.9-3.8A8.4 8.4 0 0112.5 3h.1a8.4 8.4 0 018.4 8.4v.1z'),
        titulo: 'Atención personalizada',
        texto: 'Coordinás tu pedido directo por WhatsApp',
      },
      {
        icon: trustIcon([
          el('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z' }),
          el('circle', { cx: '12', cy: '10', r: '3' }),
        ]),
        titulo: 'Showroom en ' + CONFIG.ciudad,
        texto: CONFIG.provincia + ' — ' + (CONFIG.direccion || 'visitanos'),
      },
    ];
    section.appendChild(
      el('div', { class: 'section-inner' },
        el('div', { class: 'trust-grid' },
          items.map(function (it) {
            return el('div', { class: 'trust-item' },
              el('div', { class: 'trust-icon' }, it.icon),
              el('div', { class: 'trust-copy' },
                el('strong', { text: it.titulo }),
                el('span', { text: it.texto })
              )
            );
          })
        )
      )
    );
  }

  /* ------------------------------------------------------------
     Testimonios
  ------------------------------------------------------------ */
  function renderTestimonios() {
    var section = document.getElementById('testimonios');
    if (!TESTIMONIOS || !TESTIMONIOS.length) {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    section.appendChild(
      el('div', { class: 'section-inner' },
        el('h2', { class: 'section-title', text: 'Clientes que eligieron a ROAR' }),
        el('div', { class: 'testimonios-grid' },
          TESTIMONIOS.map(function (t) {
            return el('figure', { class: 'testimonio-card' },
              el('img', { src: t.img, alt: 'Cliente de ROAR luciendo su pieza' + (t.autor ? ' — ' + t.autor : ''), class: 'testimonio-img', loading: 'lazy' }),
              t.autor ? el('figcaption', { text: t.autor }) : null
            );
          })
        )
      )
    );
  }

  /* ------------------------------------------------------------
     Footer
  ------------------------------------------------------------ */
  function renderFooter() {
    var footer = document.getElementById('site-footer');
    var claves = categoriasConProductos();

    footer.appendChild(
      el('img', { src: 'assets/images/logo-roar-claw-white.png', alt: '', 'aria-hidden': 'true', class: 'footer-watermark' })
    );

    var redes = [];
    if (CONFIG.whatsappVisible && CONFIG.whatsapp) {
      redes.push(
        el('a', {
          href: waLink(CONFIG.whatsapp, 'Hola ' + CONFIG.nombre + '! Quiero hacer una consulta.'),
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'footer-social',
        }, document.createTextNode('WhatsApp'))
      );
    }
    if (CONFIG.instagram) {
      redes.push(
        el('a', {
          href: 'https://instagram.com/' + CONFIG.instagram.replace(/^@/, ''),
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'footer-social',
        }, document.createTextNode('Instagram'))
      );
    }
    if (CONFIG.facebook) {
      redes.push(
        el('a', {
          href: CONFIG.facebook,
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'footer-social',
        }, document.createTextNode('Facebook'))
      );
    }

    var pagoCol = CONFIG.pago
      ? el('div', { class: 'footer-col' },
          el('h3', { text: 'Medios de pago' }),
          el('p', { text: 'Transferencia / Mercado Pago' }),
          el('p', { class: 'footer-pago-line' }, el('strong', { text: 'Alias: ' }), document.createTextNode(CONFIG.pago.alias)),
          el('p', { class: 'footer-pago-line' }, el('strong', { text: 'CVU: ' }), document.createTextNode(CONFIG.pago.cvu)),
          el('p', { class: 'footer-pago-line' }, el('strong', { text: 'Titular: ' }), document.createTextNode(CONFIG.pago.titular))
        )
      : null;

    footer.appendChild(
      el('div', { class: 'footer-inner' },
        el('div', { class: 'footer-brand' },
          el('img', { src: 'assets/images/logo-roar.jpg', alt: CONFIG.nombre, class: 'footer-logo', width: '40', height: '40' }),
          el('span', { text: CONFIG.nombre + ' · ' + CONFIG.tagline })
        ),
        el('div', { class: 'footer-col' },
          el('h3', { text: 'Categorías' }),
          el('ul', {},
            claves.map(function (key) {
              return el('li', {},
                el('button', { type: 'button', class: 'footer-link', onclick: function () { setActiveCategory(key); closeCart(); } }, document.createTextNode(CATEGORIAS[key].nombre))
              );
            })
          )
        ),
        el('div', { class: 'footer-col' },
          el('h3', { text: 'Contacto' }),
          CONFIG.direccion ? el('p', { text: CONFIG.direccion + ', ' + CONFIG.ciudad }) : el('p', { text: CONFIG.ciudad + ', ' + CONFIG.provincia }),
          redes.length ? el('div', { class: 'footer-socials' }, redes) : null
        ),
        pagoCol
      )
    );

    footer.appendChild(
      el('div', { class: 'footer-bottom', text: '© ' + new Date().getFullYear() + ' ' + CONFIG.nombre + '. Todos los derechos reservados.' })
    );
  }

  /* ------------------------------------------------------------
     Botón flotante de WhatsApp
  ------------------------------------------------------------ */
  function renderWhatsappFloat() {
    var wrap = document.getElementById('whatsapp-float');
    if (!CONFIG.whatsappVisible || !CONFIG.whatsapp) return;
    wrap.appendChild(
      el('a', {
        href: waLink(CONFIG.whatsapp, 'Hola ' + CONFIG.nombre + '! Quiero hacer una consulta.'),
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'whatsapp-float-btn',
        'aria-label': 'Consultar por WhatsApp',
      },
        el('svg', { viewBox: '0 0 24 24', width: '26', height: '26', 'aria-hidden': 'true', fill: 'currentColor' },
          el('path', { d: 'M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5 0-.1-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3z' }),
          el('path', { d: 'M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20z' })
        )
      )
    );
  }

  /* ------------------------------------------------------------
     Google Analytics (opcional): solo se activa si se cargó un ID
     en CONFIG.googleAnalyticsId — si está vacío, no se manda nada.
  ------------------------------------------------------------ */
  function initAnalytics() {
    var id = CONFIG.googleAnalyticsId;
    if (!id) return;
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', id);
  }

  /* ------------------------------------------------------------
     Inicialización
  ------------------------------------------------------------ */
  function init() {
    initAnalytics();
    renderHeader();
    renderHero();
    renderCatalogo();
    renderCategoryShowcase();
    renderTrustStrip();
    renderTestimonios();
    renderFooter();
    renderWhatsappFloat();

    document.getElementById('cart-backdrop').addEventListener('click', closeCart);
    window.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var modal = document.getElementById('product-modal');
      if (!modal.hidden) closeProductModal();
      else closeCart();
    });

    if (location.hash.indexOf('#producto=') === 0) {
      abrirProductoDesdeHash();
    }
    window.addEventListener('hashchange', function () {
      if (location.hash.indexOf('#producto=') === 0) abrirProductoDesdeHash();
    });

    manejarVueltaDeMercadoPago();
  }

  /* Cuando Mercado Pago devuelve al cliente al sitio después de pagar
     (ver back_urls en api/crear-preferencia.js), esto lee el resultado de
     la URL y actúa en consecuencia. Limpia el parámetro de la URL para
     que un F5 no repita el mensaje. */
  function manejarVueltaDeMercadoPago() {
    var params = new URLSearchParams(location.search);
    var pago = params.get('pago');
    if (!pago) return;

    if (pago === 'exito') {
      cart = [];
      saveCart();
      renderCartCount();
      toast('¡Pago recibido! Te vamos a escribir para coordinar el envío.');
    } else if (pago === 'fallo') {
      toast('El pago no se pudo completar. Tu pedido sigue guardado en el carrito.');
    } else if (pago === 'pendiente') {
      toast('Pago pendiente de confirmación (por ejemplo, Rapipago/Pago Fácil).');
    }

    params.delete('pago');
    var query = params.toString();
    history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

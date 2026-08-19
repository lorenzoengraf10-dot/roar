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
  var entrega = { tipo: 'retiro', provincia: '', precio: null };

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

  function cartAdd(catKey, slug, cantidad) {
    cantidad = cantidad || 1;
    var existing = cart.filter(function (i) { return i.catKey === catKey && i.slug === slug; })[0];
    if (existing) {
      existing.cantidad += cantidad;
    } else {
      cart.push({ catKey: catKey, slug: slug, cantidad: cantidad });
    }
    saveCart();
    renderCartCount();
    renderCartDrawer();
    toast('Agregado al pedido');
  }

  function cartSetQty(catKey, slug, cantidad) {
    if (cantidad <= 0) {
      cart = cart.filter(function (i) { return !(i.catKey === catKey && i.slug === slug); });
    } else {
      var existing = cart.filter(function (i) { return i.catKey === catKey && i.slug === slug; })[0];
      if (existing) existing.cantidad = cantidad;
    }
    saveCart();
    renderCartCount();
    renderCartDrawer();
  }

  function cartTotal() {
    return cart.reduce(function (sum, item) {
      var entry = findEntry(item.catKey, item.slug);
      var precio = entry && entry.product.precio ? entry.product.precio : 0;
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

  /* Calcula el envío a una provincia (usa shipping.js) y repinta el carrito */
  function actualizarEnvio(provincia) {
    if (!provincia) return;
    estimateEnvio(provincia, cartWeight()).then(function (resultado) {
      if (!resultado.ok) return;
      entrega.provincia = provincia;
      entrega.precio = resultado.precio;
      renderCartDrawer();
    });
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
    var facts = [
      '📦 Envíos a todo el país',
      '📍 Showroom en ' + CONFIG.ciudad + ', ' + CONFIG.provincia,
      '💬 Atención personalizada por WhatsApp',
    ];

    var ctas = [
      el('a', { href: '#catalogo', class: 'btn btn-primary', onclick: onHeroCatalogoClick }, document.createTextNode('Ver el catálogo')),
    ];
    if (CONFIG.whatsappVisible && CONFIG.whatsapp) {
      ctas.push(
        el('a', {
          href: waLink(CONFIG.whatsapp, 'Hola ' + CONFIG.nombre + '! Quiero hacer una consulta.'),
          class: 'btn btn-whatsapp',
          target: '_blank',
          rel: 'noopener noreferrer',
        }, document.createTextNode('Consultar por WhatsApp'))
      );
    }

    hero.appendChild(
      el('img', {
        src: 'assets/images/showroom-viedma.jpg',
        alt: '',
        'aria-hidden': 'true',
        class: 'hero-bg-photo',
        fetchpriority: 'high',
      })
    );
    hero.appendChild(el('div', { class: 'hero-bg-scrim' }));

    hero.appendChild(
      el('div', { class: 'hero-inner' },
        el('img', {
          src: 'assets/images/logo-roar.jpg',
          alt: CONFIG.nombre + ' — ' + CONFIG.tagline,
          class: 'hero-logo',
          width: '140',
          height: '140',
        }),
        el('p', { class: 'hero-tagline', text: CONFIG.tagline + ' en acero quirúrgico y plata 925' }),
        el('div', { class: 'hero-ctas' }, ctas),
        el('ul', { class: 'hero-facts' },
          facts.map(function (f) { return el('li', { text: f }); })
        )
      )
    );
  }

  function onHeroCatalogoClick(e) {
    e.preventDefault();
    var claves = categoriasConProductos();
    if (claves.length) setActiveCategory(activeCategory || claves[0]);
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
      el('svg', { viewBox: '0 0 24 24', width: '28', height: '28', 'aria-hidden': 'true', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
        el('path', { d: 'M4 7h3l1.5-2h7L17 7h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z' }),
        el('circle', { cx: '12', cy: '13', r: '3.2' })
      ),
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

    var precioNode = product.precio
      ? el('span', { class: 'card-price', text: money(product.precio) })
      : el('span', { class: 'card-price card-price-consultar', text: 'Consultar precio' });

    var precioAntesNode = product.precioAntes
      ? el('span', { class: 'card-price-before', text: money(product.precioAntes) })
      : null;

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
        el('div', { class: 'card-actions' },
          el('button', {
            class: 'btn btn-add',
            type: 'button',
            disabled: product.agotado ? 'disabled' : null,
            onclick: function () { cartAdd(catKey, slug, 1); },
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
  function openProductModal(catKey, slug) {
    var entry = findEntry(catKey, slug);
    if (!entry) return;
    var product = entry.product;
    var modal = document.getElementById('product-modal');
    modal.innerHTML = '';

    var fotos = [product.img, product.img2].filter(Boolean);
    var fotoActual = 0;

    var fotoBox = el('div', { class: 'modal-photo' });
    function pintarFoto() {
      fotoBox.innerHTML = '';
      if (fotos.length) {
        fotoBox.appendChild(el('img', { src: fotos[fotoActual], alt: product.nombre, class: 'modal-photo-img' }));
      } else {
        fotoBox.appendChild(renderPhoto(product));
      }
    }
    pintarFoto();

    var galeriaDots = null;
    if (fotos.length > 1) {
      galeriaDots = el('div', { class: 'modal-dots' },
        fotos.map(function (_, i) {
          return el('button', {
            class: 'modal-dot' + (i === fotoActual ? ' modal-dot-active' : ''),
            type: 'button',
            'aria-label': 'Ver foto ' + (i + 1),
            onclick: function (e) {
              fotoActual = i;
              pintarFoto();
              e.currentTarget.parentElement.querySelectorAll('.modal-dot').forEach(function (d, di) {
                d.classList.toggle('modal-dot-active', di === i);
              });
            },
          });
        })
      );
    }

    var qty = 1;
    var qtyLabel = el('span', { class: 'qty-value', text: String(qty) });

    var detallesList = (product.detalles || []).length
      ? el('ul', { class: 'modal-detalles' }, product.detalles.map(function (d) { return el('li', { text: d }); }))
      : null;

    var precioRow = el('div', { class: 'modal-precio-row' },
      product.precio ? el('span', { class: 'modal-precio', text: money(product.precio) }) : el('span', { class: 'modal-precio', text: 'Consultar precio' }),
      product.precioAntes ? el('span', { class: 'card-price-before', text: money(product.precioAntes) }) : null
    );

    var waTexto = 'Hola ' + CONFIG.nombre + '! Quiero consultar por: ' + product.nombre;

    modal.appendChild(
      el('div', { class: 'modal-backdrop', onclick: closeProductModal },
        el('div', { class: 'modal-card', onclick: function (e) { e.stopPropagation(); } },
          el('button', { class: 'modal-close', type: 'button', 'aria-label': 'Cerrar', onclick: closeProductModal }, document.createTextNode('✕')),
          fotoBox,
          galeriaDots,
          el('div', { class: 'modal-body' },
            el('span', { class: 'card-cat', text: entry.catNombre }),
            el('h2', { class: 'modal-nombre', text: product.nombre }),
            precioRow,
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
                onclick: function () { cartAdd(catKey, slug, qty); closeProductModal(); },
              }, document.createTextNode(product.agotado ? 'Sin stock' : 'Agregar al pedido')),
              (CONFIG.whatsappVisible && CONFIG.whatsapp)
                ? el('a', {
                    href: waLink(CONFIG.whatsapp, waTexto),
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    class: 'btn btn-whatsapp btn-block',
                  }, document.createTextNode('Consultar por WhatsApp'))
                : null,
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
    var precioEnvioTexto = entrega.precio != null ? money(entrega.precio) : 'A coordinar';

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
      selectEnvio
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
          return el('div', { class: 'cart-item' },
            el('div', { class: 'cart-item-photo' }, renderPhoto(product)),
            el('div', { class: 'cart-item-info' },
              el('span', { class: 'cart-item-name', text: product.nombre }),
              el('span', { class: 'cart-item-price', text: product.precio ? money(product.precio) : 'Consultar precio' }),
              el('div', { class: 'qty-stepper qty-stepper-sm' },
                el('button', { type: 'button', class: 'qty-btn', 'aria-label': 'Restar', onclick: function () { cartSetQty(item.catKey, item.slug, item.cantidad - 1); } }, document.createTextNode('−')),
                el('span', { class: 'qty-value', text: String(item.cantidad) }),
                el('button', { type: 'button', class: 'qty-btn', 'aria-label': 'Sumar', onclick: function () { cartSetQty(item.catKey, item.slug, item.cantidad + 1); } }, document.createTextNode('+'))
              )
            ),
            el('button', {
              class: 'cart-item-remove',
              type: 'button',
              'aria-label': 'Quitar del pedido',
              onclick: function () { cartSetQty(item.catKey, item.slug, 0); },
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
      var precioTxt = product.precio ? money(product.precio * item.cantidad) : 'a consultar';
      lineas.push((i + 1) + '. ' + product.nombre + ' x' + item.cantidad + ' — ' + precioTxt);
    });
    lineas.push('');
    lineas.push('Total: ' + money(cartTotal()));
    if (entrega.tipo === 'envio' && entrega.provincia && entrega.precio != null) {
      lineas.push('Envío a ' + entrega.provincia + ' (estimado): ' + money(entrega.precio));
    }
    lineas.push('');
    lineas.push('Quedo a la espera de los datos para coordinar el pago y el envío. ¡Gracias!');
    window.open(waLink(CONFIG.whatsapp, lineas.join('\n')), '_blank');
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
        el('h2', { class: 'section-title', text: 'Clientes con su ROAR' }),
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
     Inicialización
  ------------------------------------------------------------ */
  function init() {
    renderHeader();
    renderHero();
    renderCatalogo();
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

# ROAR Joyería Urbana

Sitio de catálogo de ROAR, joyería urbana en Carmen de Patagones, Buenos Aires.

Sitio estático puro: sin build, sin frameworks, sin `npm install`. Se
despliega tal cual a Vercel o GitHub Pages.

## Estructura

```
index.html              La página (una sola, todo el catálogo vive acá)
assets/css/styles.css   Toda la hoja de estilos
assets/js/products.js   Datos del negocio y del catálogo — EDITAR ACÁ
assets/js/site.js       Lógica del sitio (no hace falta tocarlo)
assets/images/          Fotos de producto y logo
manifest.json, robots.txt, sitemap.xml, vercel.json
```

## Para cargar productos, cambiar el WhatsApp, Instagram, etc.

Todo eso vive en **`assets/js/products.js`**. El archivo tiene instrucciones
en español arriba de todo, pensadas para alguien sin conocimientos técnicos.

## Para probarlo en tu computadora

No hace falta instalar nada. Basta con levantar un servidor estático en la
carpeta del proyecto, por ejemplo:

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000` en el navegador.

## Pago con Mercado Pago (opcional)

Por defecto el pedido se coordina por WhatsApp. Para que el cliente pueda
pagar el total del carrito directo con Mercado Pago:

1. Necesitás que el sitio esté desplegado en Vercel (no alcanza con
   GitHub Pages, que es 100% estático — la función que crea el pago
   necesita un servidor).
2. En Vercel → Project → Settings → Environment Variables, cargá
   `MP_ACCESS_TOKEN` con el Access Token de la cuenta de Mercado Pago del
   negocio (Developers → Credenciales, en mercadopago.com.ar).
3. En `assets/js/products.js`, cambiá `mercadoPagoVisible` a `true`.

Mientras el Access Token no esté cargado, el botón de Mercado Pago no
aparece (o avisa que no está disponible) y el pedido por WhatsApp sigue
funcionando exactamente igual.

## Al editar CSS o JS

Subí en 1 el número de versión de la etiqueta correspondiente en
`index.html` (`styles.css?v=1` → `?v=2`, etc.), así el celular del cliente
no se queda con la versión vieja guardada en caché.

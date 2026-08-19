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

## Al editar CSS o JS

Subí en 1 el número de versión de la etiqueta correspondiente en
`index.html` (`styles.css?v=1` → `?v=2`, etc.), así el celular del cliente
no se queda con la versión vieja guardada en caché.

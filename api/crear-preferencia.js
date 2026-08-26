/* =========================================================================
   CREAR PREFERENCIA — Checkout Pro de Mercado Pago
   -------------------------------------------------------------------------
   Esto corre en el servidor (función serverless de Vercel), nunca en el
   navegador del cliente: acá es el único lugar donde vive el Access Token
   de Mercado Pago, que nunca debe aparecer en el código del sitio.

   Para activar el pago con Mercado Pago hay que cargar, en Vercel →
   Project → Settings → Environment Variables:
     MP_ACCESS_TOKEN

   Lo sacás así:
   1. Entrá a https://www.mercadopago.com.ar/developers/panel con la
      cuenta de Mercado Pago de tu negocio (no la tuya si sos el
      desarrollador, la del dueño del negocio).
   2. Creá una aplicación (o usá la que ya tengas) y andá a "Credenciales
      de producción".
   3. Copiá el "Access Token" (empieza con APP_USR-) y pegalo en Vercel.

   Mientras esa clave no esté cargada, o si Mercado Pago falla por lo que
   sea, esta función devuelve { ok: false } y el sitio sigue funcionando
   igual con el pedido por WhatsApp de siempre — no hace falta ningún
   cambio de código para activarlo más adelante, alcanza con cargar la
   clave.

   Para probar sin arriesgar plata real, se puede cargar temporalmente un
   Access Token de PRUEBA (pestaña "Credenciales de prueba" en el mismo
   panel) y pagar con las tarjetas de test que da Mercado Pago.

   Referencia de la API: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing

   -------------------------------------------------------------------------
   IMPORTANTE — por qué el precio se recalcula acá y no se usa el que
   manda el navegador:
   El navegador no es de confianza: cualquiera puede abrir las
   herramientas de desarrollador e interceptar este pedido para mandar un
   precio inventado más bajo. Por eso desde acá SOLO se aceptan los
   identificadores del producto elegido (categoría + nombre + color) y
   la cantidad — el precio y el costo de envío se buscan siempre en
   products.js/shipping.js, la misma fuente de verdad que usa el sitio
   para mostrar los precios. Así, aunque alguien manipule el pedido, lo
   máximo que puede hacer es elegir mal un producto — nunca pagar de
   menos.
   ========================================================================= */

const { PRODUCTOS, CONFIG, PESO_CATEGORIA_KG, TARIFAS_ENVIO } = require("../assets/js/products.js");
const { claveZonaDeProvincia, ZONAS_ENVIO } = require("../assets/js/shipping.js");

const MP_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";
const EMBALAJE_KG = 0.1;

/* Mismo criterio que precioDeItem() en site.js: si el color elegido tiene
   su propio precio, se usa ese; si no, el precio general del producto. */
function precioDeItem(product, color) {
  if (color && product.variantes) {
    var variante = product.variantes.filter(function (v) { return v.nombre === color; })[0];
    if (variante && variante.precio != null) return variante.precio;
  }
  return product.precio;
}

function calcularEnvio(provincia, cartItems) {
  var clave = claveZonaDeProvincia(provincia);
  var zona = clave && ZONAS_ENVIO[clave];
  var tarifa = clave && TARIFAS_ENVIO[clave];
  if (!zona || !tarifa) return null;

  var pesoKg = cartItems.reduce(function (kg, it) {
    return kg + (PESO_CATEGORIA_KG[it.catKey] || 0) * it.cantidad;
  }, EMBALAJE_KG);
  var kgExtra = Math.max(0, Math.ceil(pesoKg - 1));
  return { zona: zona.nombre, precio: tarifa.base + kgExtra * tarifa.porKgExtra };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    res.status(200).json({ ok: false });
    return;
  }

  const { items: pedido, entrega, siteUrl } = req.body || {};
  if (!Array.isArray(pedido) || !pedido.length) {
    res.status(200).json({ ok: false });
    return;
  }

  // Cada línea del pedido llega como { catKey, nombre, color, cantidad } —
  // acá se busca el producto real en products.js y se toma SIEMPRE su
  // precio actual, ignorando cualquier precio que venga del navegador.
  const mpItems = [];
  for (const linea of pedido) {
    var lista = linea && linea.catKey && PRODUCTOS[linea.catKey];
    var product = lista && lista.filter(function (p) { return p.nombre === linea.nombre; })[0];
    if (!product) continue;
    var cantidad = Math.max(1, Math.round(Number(linea.cantidad) || 1));
    var precio = precioDeItem(product, linea.color);
    if (!precio) continue; // "Consultar precio": no se puede cobrar un monto que no existe
    var titulo = product.nombre + (linea.color ? " (" + linea.color + ")" : "");
    mpItems.push({ title: titulo.slice(0, 250), quantity: cantidad, unit_price: precio, currency_id: "ARS" });
  }
  if (!mpItems.length) {
    res.status(200).json({ ok: false });
    return;
  }

  if (entrega && entrega.tipo === "envio" && entrega.provincia) {
    var subtotal = mpItems.reduce(function (sum, it) { return sum + it.unit_price * it.quantity; }, 0);
    if (CONFIG.envioGratisDesde == null || subtotal < CONFIG.envioGratisDesde) {
      var envio = calcularEnvio(entrega.provincia, pedido);
      if (envio && envio.precio > 0) {
        mpItems.push({ title: "Envío a " + envio.zona, quantity: 1, unit_price: envio.precio, currency_id: "ARS" });
      }
    }
  }

  const base = typeof siteUrl === "string" && siteUrl ? siteUrl : "";

  try {
    const resp = await fetch(MP_PREFERENCES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: mpItems,
        back_urls: base
          ? {
              success: `${base}?pago=exito`,
              failure: `${base}?pago=fallo`,
              pending: `${base}?pago=pendiente`,
            }
          : undefined,
        auto_return: base ? "approved" : undefined,
        statement_descriptor: "ROAR",
      }),
    });
    if (!resp.ok) throw new Error("Mercado Pago no aceptó la preferencia");
    const data = await resp.json();
    if (!data.init_point) throw new Error("Mercado Pago no devolvió un link de pago");

    res.status(200).json({ ok: true, init_point: data.init_point });
  } catch (err) {
    res.status(200).json({ ok: false });
  }
};

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
   ========================================================================= */

const MP_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";

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

  const { items, siteUrl } = req.body || {};
  if (!Array.isArray(items) || !items.length) {
    res.status(200).json({ ok: false });
    return;
  }

  // Nunca confiamos en precios que vengan del navegador: acá solo se usan
  // el título y la cantidad, y el precio se vuelve a validar como número
  // positivo. Igual, la fuente de verdad de los precios es products.js.
  const mpItems = items
    .filter((it) => it && it.title && it.unit_price > 0 && it.quantity > 0)
    .map((it) => ({
      title: String(it.title).slice(0, 250),
      quantity: Math.max(1, Math.round(it.quantity)),
      unit_price: Math.round(it.unit_price * 100) / 100,
      currency_id: "ARS",
    }));
  if (!mpItems.length) {
    res.status(200).json({ ok: false });
    return;
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

import { ShippingOption } from '../types';
import { FREE_SHIPPING_THRESHOLD } from './currency';

export function calculateShippingByZipCode(zipCode: string, subtotal: number): {
  zone: string;
  options: ShippingOption[];
} {
  const cleanZip = zipCode.trim().replace(/\D/g, '');
  const zipNum = parseInt(cleanZip, 10);
  const isFreeEligible = subtotal >= FREE_SHIPPING_THRESHOLD;

  if (isNaN(zipNum) || cleanZip.length < 4) {
    return {
      zone: 'Argentina',
      options: [
        {
          id: 'correo-nacional',
          name: 'Envío Estándar a Domicilio',
          courier: 'Correo Argentino',
          price: isFreeEligible ? 0 : 5499,
          deliveryTime: '3 a 6 días hábiles',
          isFree: isFreeEligible,
        },
        {
          id: 'andreani-nacional',
          name: 'Envío Prioritario Andreani',
          courier: 'Andreani',
          price: isFreeEligible ? 0 : 6890,
          deliveryTime: '2 a 4 días hábiles',
          isFree: isFreeEligible,
        },
      ],
    };
  }

  // CABA (1000-1499)
  if (zipNum >= 1000 && zipNum <= 1499) {
    return {
      zone: 'Capital Federal (CABA)',
      options: [
        {
          id: 'caba-express',
          name: 'Moto Express en el día / 24hs',
          courier: 'Envío Express CABA/GBA',
          price: isFreeEligible ? 0 : 3800,
          deliveryTime: 'Llega hoy comprando antes de las 14hs',
          isFree: isFreeEligible,
        },
        {
          id: 'caba-correo',
          name: 'Correo Argentino Clásico a Domicilio',
          courier: 'Correo Argentino',
          price: isFreeEligible ? 0 : 3200,
          deliveryTime: '2 a 3 días hábiles',
          isFree: isFreeEligible,
        },
        {
          id: 'caba-retiro',
          name: 'Punto de Retiro Oficial (Palermo)',
          courier: 'Punto de Retiro',
          price: 0,
          deliveryTime: 'Listo para retirar en 24hs hábiles (Gratis)',
          isFree: true,
        },
      ],
    };
  }

  // GBA (1600-1899)
  if (zipNum >= 1500 && zipNum <= 1899) {
    return {
      zone: 'Gran Buenos Aires (GBA)',
      options: [
        {
          id: 'gba-express',
          name: 'Moto Express GBA Norte/Sur/Oeste',
          courier: 'Envío Express CABA/GBA',
          price: isFreeEligible ? 0 : 4900,
          deliveryTime: '24 a 48 hs hábiles',
          isFree: isFreeEligible,
        },
        {
          id: 'gba-correo',
          name: 'Correo Argentino a Domicilio',
          courier: 'Correo Argentino',
          price: isFreeEligible ? 0 : 4200,
          deliveryTime: '2 a 4 días hábiles',
          isFree: isFreeEligible,
        },
        {
          id: 'gba-andreani',
          name: 'Andreani Sucursal cercana',
          courier: 'Andreani',
          price: isFreeEligible ? 0 : 3900,
          deliveryTime: '2 a 3 días hábiles',
          isFree: isFreeEligible,
        },
      ],
    };
  }

  // Interior del País (Provincias: Córdoba, Santa Fe, Mendoza, etc.)
  return {
    zone: 'Interior del País / Provincias',
    options: [
      {
        id: 'interior-andreani',
        name: 'Andreani a Domicilio Express',
        courier: 'Andreani',
        price: isFreeEligible ? 0 : 6990,
        deliveryTime: '2 a 5 días hábiles',
        isFree: isFreeEligible,
      },
      {
        id: 'interior-correo',
        name: 'Correo Argentino a Domicilio',
        courier: 'Correo Argentino',
        price: isFreeEligible ? 0 : 5490,
        deliveryTime: '3 a 6 días hábiles',
        isFree: isFreeEligible,
      },
      {
        id: 'interior-sucursal',
        name: 'Retiro en Sucursal Correo Argentino',
        courier: 'Correo Argentino',
        price: isFreeEligible ? 0 : 4100,
        deliveryTime: '3 a 5 días hábiles',
        isFree: isFreeEligible,
      },
    ],
  };
}

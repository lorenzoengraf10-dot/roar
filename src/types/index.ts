export type ProductCategory = 'ofertas-combos' | 'cadenas' | 'pulseras' | 'anillos' | 'accesorios';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Talle 17", "50 cm", "Talle Único Regulable"
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  variants: ProductVariant[];
  tag?: 'NUEVO' | 'OFERTA' | 'HOT' | 'COMBO' | 'MÁS VENDIDO';
  material: string;
  isFeaturedCombo?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  courier: 'Correo Argentino' | 'Andreani' | 'Punto de Retiro' | 'Envío Express CABA/GBA';
  price: number;
  deliveryTime: string;
  isFree?: boolean;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
  verified: boolean;
  image?: string;
}

/**
 * useSEO hook — Updates document title and meta tags dynamically
 * for section-level SEO signals in a SPA (Single Page App).
 * Follows Google's recommended dynamic metadata approach for React SPAs.
 */
import { useEffect } from 'react';

interface SEOConfig {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
}

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    const baseTitle = 'ROAR | Joyería Urbana & Accesorios Premium Argentina';
    const baseDesc =
      'Tienda oficial ROAR Joyería Urbana. Cadenas, anillos, pulseras y combos de acero quirúrgico 316L y plata 925. 15% OFF con transferencia. Envíos a toda Argentina.';

    // Update title
    if (config.title) {
      document.title = `${config.title} | ROAR Joyería`;
    } else {
      document.title = baseTitle;
    }

    // Update description meta tag
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && config.description) {
      descMeta.setAttribute('content', config.description);
    } else if (descMeta) {
      descMeta.setAttribute('content', baseDesc);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImg = document.querySelector('meta[property="og:image"]');

    if (ogTitle) ogTitle.setAttribute('content', config.title || baseTitle);
    if (ogDesc) ogDesc.setAttribute('content', config.description || baseDesc);
    if (ogImg && config.ogImage) ogImg.setAttribute('content', config.ogImage);

    // Update canonical
    if (config.canonicalPath) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `https://www.roarjoyas.com.ar${config.canonicalPath}`);
    }
  }, [config.title, config.description, config.canonicalPath, config.ogImage]);
};

/**
 * Builds a Product JSON-LD snippet for structured data injection.
 * Inject via script tag on product page or modal open for Google Shopping eligibility.
 */
export interface ProductSEOData {
  name: string;
  description: string;
  price: number;
  image: string;
  sku: string;
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
}

export function buildProductJsonLD(product: ProductSEOData): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: `https://www.roarjoyas.com.ar${product.image}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'ROAR',
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `https://www.roarjoyas.com.ar/#${product.sku}`,
      priceCurrency: 'ARS',
      price: product.price.toString(),
      priceValidUntil: '2027-12-31',
      availability: product.inStock !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'ROAR Joyería Urbana',
      },
    },
    ...(product.rating && product.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating.toString(),
            reviewCount: product.reviewCount.toString(),
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  });
}

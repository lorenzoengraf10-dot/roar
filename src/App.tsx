import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { PRODUCTS } from './data/products';
import { Product, ProductCategory } from './types';
import { useSEO, buildProductJsonLD } from './utils/seo';


// Layout Components
import { MarqueeHeader } from './components/layout/MarqueeHeader';
import { Navbar } from './components/layout/Navbar';
import { BottomTabBar } from './components/layout/BottomTabBar';
import { Footer } from './components/layout/Footer';

// Home Components
import { HeroBanner } from './components/home/HeroBanner';
import { ValueProps } from './components/home/ValueProps';
import { ProductGrid } from './components/home/ProductGrid';
import { FeaturedCombos } from './components/home/FeaturedCombos';
import { SizeGuideModal } from './components/home/SizeGuideModal';
import { CustomerReviews } from './components/home/CustomerReviews';

// Product & UI Modals
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/ui/SearchModal';
import { ToastNotification } from './components/ui/ToastNotification';

export function App() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todos'>('todos');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // SEO: set base meta tags
  useSEO({
    title: 'Joyería Urbana & Accesorios Premium en Argentina',
    description:
      'Tienda oficial ROAR Joyería Urbana. Cadenas, anillos, pulseras y combos de acero quirúrgico 316L y plata 925. 15% OFF con transferencia. Envíos a toda Argentina.',
    canonicalPath: '/',
  });

  // SEO: inject per-product JSON-LD when quick view opens (Google Shopping signals)
  useEffect(() => {
    const existingScript = document.getElementById('product-jsonld');
    if (existingScript) existingScript.remove();

    if (activeProductModal) {
      const script = document.createElement('script');
      script.id = 'product-jsonld';
      script.type = 'application/ld+json';
      script.text = buildProductJsonLD({
        name: activeProductModal.name,
        description: activeProductModal.description,
        price: activeProductModal.price,
        image: activeProductModal.images[0],
        sku: activeProductModal.id,
        category: activeProductModal.category,
        rating: activeProductModal.rating,
        reviewCount: activeProductModal.reviewCount,
        inStock: activeProductModal.variants.some((v) => v.inStock),
      });
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById('product-jsonld');
      if (s) s.remove();
    };
  }, [activeProductModal]);


  const featuredCombos = PRODUCTS.filter((p) => p.isFeaturedCombo || p.category === 'ofertas-combos');

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (cat: ProductCategory | 'todos') => {
    setSelectedCategory(cat);
    scrollToCatalog();
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-dark-950 text-silver-200 flex flex-col selection:bg-gold-500 selection:text-dark-950">
        
        {/* 1. Animated Top Marquee Promo Bar */}
        <MarqueeHeader />

        {/* 2. Main Navigation Bar */}
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Main Content Area */}
        <main className="flex-grow">
          {/* Section 1: Hero Banner */}
          <HeroBanner
            onExploreClick={scrollToCatalog}
            onSelectCategory={handleSelectCategory}
          />

          {/* Section 2: Value Propositions & Benefits Bar */}
          <ValueProps />

          {/* Section 4: Featured Combos & Packs */}
          <FeaturedCombos
            combos={featuredCombos}
            onQuickView={(p) => setActiveProductModal(p)}
          />

          {/* Section 3: Product Grid & Category Filter Tabs */}
          <ProductGrid
            products={PRODUCTS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onQuickView={(p) => setActiveProductModal(p)}
          />

          {/* Section 6: Customer Reviews & Instagram Social Proof */}
          <CustomerReviews />
        </main>

        {/* Footer */}
        <Footer
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          onSelectCategory={handleSelectCategory}
        />

        {/* Mobile Bottom Navigation Bar */}
        <BottomTabBar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          onScrollToCatalog={scrollToCatalog}
        />

        {/* Modals & Overlays */}
        <CartDrawer />

        <ProductDetailModal
          product={activeProductModal}
          isOpen={!!activeProductModal}
          onClose={() => setActiveProductModal(null)}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        />

        <SizeGuideModal
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          products={PRODUCTS}
          onSelectProduct={(p) => setActiveProductModal(p)}
        />

        <ToastNotification />

      </div>
    </CartProvider>
  );
}

export default App;

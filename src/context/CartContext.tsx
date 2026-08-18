import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant, ShippingOption } from '../types';
import { 
  FREE_SHIPPING_THRESHOLD, 
  MINIMUM_PURCHASE_AMOUNT, 
  calculateTransferDiscount 
} from '../utils/currency';
import { calculateShippingByZipCode } from '../utils/shipping';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  zipCode: string;
  setZipCode: (zip: string) => void;
  shippingOptions: ShippingOption[];
  selectedShipping: ShippingOption | null;
  setSelectedShipping: (option: ShippingOption | null) => void;
  shippingZone: string;
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  transferTotal: number;
  freeShippingProgress: number;
  freeShippingRemaining: number;
  isFreeShipping: boolean;
  isMinimumMet: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'roar_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [zipCode, setZipCode] = useState('1425'); // Default CABA for immediate demo calculations
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const selectedVar = variant || product.variants[0];
    if (!selectedVar) return;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant.id === selectedVar.id
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...prevItems, { product, selectedVariant: selectedVar, quantity }];
    });

    showToast(`¡${product.name} (${selectedVar.name}) agregado al carrito!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setItems((prev) => prev.filter(
      (item) => !(item.product.id === productId && item.selectedVariant.id === variantId)
    ));
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedVariant.id === variantId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const isMinimumMet = subtotal >= MINIMUM_PURCHASE_AMOUNT;

  // Calculate Shipping based on zipCode and subtotal
  const shippingCalculation = calculateShippingByZipCode(zipCode, subtotal);
  const shippingOptions = shippingCalculation.options;
  const shippingZone = shippingCalculation.zone;

  // Default select first shipping option if not selected or update prices
  const activeShipping = selectedShipping 
    ? shippingOptions.find(o => o.id === selectedShipping.id) || shippingOptions[0]
    : (shippingOptions[0] || null);

  const shippingCost = activeShipping ? activeShipping.price : 0;
  const total = subtotal + shippingCost;
  const transferTotal = calculateTransferDiscount(subtotal) + shippingCost;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        zipCode,
        setZipCode,
        shippingOptions,
        selectedShipping: activeShipping,
        setSelectedShipping,
        shippingZone,
        itemCount,
        subtotal,
        shippingCost,
        total,
        transferTotal,
        freeShippingProgress,
        freeShippingRemaining,
        isFreeShipping,
        isMinimumMet,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

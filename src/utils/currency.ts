/**
 * Formats a number to Argentine Peso currency string ($XX.XXX)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates 15% discount on bank transfer
 */
export function calculateTransferDiscount(amount: number, discountPercent: number = 15): number {
  return Math.round(amount * (1 - discountPercent / 100));
}

/**
 * Calculates installment values
 */
export function calculateInstallment(amount: number, installments: number = 3): number {
  return Math.round(amount / installments);
}

export const FREE_SHIPPING_THRESHOLD = 90000;
export const MINIMUM_PURCHASE_AMOUNT = 10000;
export const TRANSFER_DISCOUNT_PERCENT = 15;
export const WHATSAPP_PHONE_NUMBER = '5491123456789'; // Example configurable WhatsApp number

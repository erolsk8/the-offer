import type { Offer, LogErrorDetails } from './types';

/**
 * Format price to show currency and commas.
 */
export function formatPrice(amountInCents: number): string {
  const formatter = new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: 'EUR',
  });

  // Divide by 100 to convert to euros and cents
  return formatter.format(amountInCents / 100);
}

/**
 * This could also log to external service (monitoring, etc.).
 */
export function logError(message: string, errorDetails?: LogErrorDetails): void {
  console.error(message, errorDetails ?? '');
}

/**
 * Log error message with response details.
 */
export function logResponseError(res: Response, message: string, errorDetails?: LogErrorDetails): void {
  logError(`[${res.status}] [${res.statusText}] ${message}`, errorDetails);
}

/**
 * Simple DESC sort.
 */
export function sortOffers(offers: Offer[]): Offer[] {
  return offers.sort((a, b) => b.price - a.price);
}

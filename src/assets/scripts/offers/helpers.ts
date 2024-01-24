import type { LogErrorDetails } from './types';

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
 * In real use case, this might push log to external service,
 * silence output (staging vs prod), etc.
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

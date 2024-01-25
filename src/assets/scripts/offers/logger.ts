import type { LogDetails } from './types';

/**
 * This could also log to external service (monitoring, etc.).
 */
export function logError(message: string, errorDetails?: LogDetails): void {
  console.error(message, errorDetails ?? '');
}

/**
 * Log error message with response details.
 */
export function logResponseError(res: Response, message: string, errorDetails?: LogDetails): void {
  logError(`[${res.status}] [${res.statusText}] ${message}`, errorDetails);
}

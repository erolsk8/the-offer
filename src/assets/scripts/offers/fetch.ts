import type { Offer, OfferResponseFailure, OfferFetchFailureResult, OfferFetchSuccessResult } from './types';
import { logError, logResponseError } from './logger';
import { simulateDelay } from './delay';
import { messages } from './messages';

// Would normally come from .env file or some other config
const API_SERVER_BASE_URL = 'http://localhost:8000';

/**
 * Fetch offers and log errors.
 */
export async function fetchOffers(address: string): Promise<OfferFetchSuccessResult | OfferFetchFailureResult> {
  try {
    await simulateDelay();

    const res = await fetch(`${API_SERVER_BASE_URL}/offers?address=${encodeURIComponent(address)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const contentType = res.headers.get('Content-Type');
    const isJson = typeof contentType === 'string' && contentType.includes('application/json');
    if (!isJson) {
      const textData = await res.text();
      logResponseError(res, 'Received invalid response type.', { textData });

      return {
        success: false,
        error: messages.fetchErrorGeneral,
      };
    }

    if (!res.ok || res.status !== 200) {
      const errorRes: OfferResponseFailure = await res.json();

      const { code, description } = errorRes;

      logResponseError(res, 'Response returned error.', { code, description });

      return {
        success: false,
        error: code === 'INVALID_PARAM' ? messages.fetchErrorAddressTooLong : messages.fetchErrorGeneral,
      };
    }

    const offers: Offer[] = await res.json();

    return {
      success: true,
      data: offers,
    };
  } catch (error) {
    logError('Fetching offers failed.', error as Error);
    return {
      success: false,
      error: messages.fetchErrorGeneral,
    };
  }
}

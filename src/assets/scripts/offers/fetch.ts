import type { Offer, OfferResponseFailure, OfferFetchFailureResult, OfferFetchSuccessResult } from './types';
import { logError, logResponseError } from './helpers';

const API_SERVER_BASE_URL = 'http://localhost:8000';

/**
 * User-facing messages
 */
const messages = {
  fetchErrorGeneral: 'Provided address could not be processed, please try again.',
  fetchErrorAddressTooLong: 'Provided address is too long, please try again.',
};

/**
 * Fetch offers and log errors.
 */
export async function fetchOffers(address: string): Promise<OfferFetchSuccessResult | OfferFetchFailureResult> {
  try {
    const res = await fetch(`${API_SERVER_BASE_URL}/offers?address=${encodeURIComponent(address)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const isJson = res.headers.get('Content-Type')?.includes('application/json');
    if (isJson !== true) {
      const textData = await res.text();
      logResponseError(res, 'Received invalid response type.', { textData });

      return {
        success: false,
        error: messages.fetchErrorGeneral,
      };
    }

    if (!res.ok) {
      logResponseError(res, 'Response was not ok.');

      return {
        success: false,
        error: messages.fetchErrorGeneral,
      };
    }

    if (res.status !== 200) {
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

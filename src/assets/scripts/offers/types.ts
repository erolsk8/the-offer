export interface Offer {
  name: string;
  price: number;
  description: string;
}

export interface OfferResponseFailure {
  code?: 'UNKNOWN_PARAM' | 'INVALID_PARAM';
  description?: string;
}

export interface OfferFetchFailureResult {
  success: false;
  // User-facing error message
  error: string;
}

export interface OfferFetchSuccessResult {
  success: true;
  data: Offer[];
}

export type LogErrorDetails = Error | string | object;

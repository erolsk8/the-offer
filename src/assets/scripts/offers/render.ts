import type { Offer } from './types';
import { render } from 'mustache';
import { logError } from './logger';
import { messages } from './messages';

const getResultsEl = (): HTMLElement | null => {
  const resultsEl = document.getElementById('js-offer-results');
  if (resultsEl === null) {
    logError('Could not find results DOM element.');
    return null;
  }

  return resultsEl;
};

/**
 * Render new error message or just clear if empty.
 */
export function renderError(message: string): void {
  const errorsEl = document.getElementById('js-address-errors');
  if (errorsEl === null) {
    return;
  }

  errorsEl.innerHTML = message === '' ? '' : `<p>${message}</p>`;
}

/**
 * Render specified number of loading elements (at least one, but could be 2, 3, etc.).
 */
export function renderLoading(numElements: number): void {
  const resultsEl = getResultsEl();
  const loadingEl = document.getElementById('js-offer-loading-template');
  if (resultsEl === null || loadingEl === null) {
    return;
  }

  resultsEl.innerHTML = Array.from({ length: numElements })
    .map(() => loadingEl.innerHTML)
    .join('');
}

/**
 * Simple DESC sort.
 */
const sortOffers = (offers: Offer[]): Offer[] => {
  return offers.sort((a, b) => b.price - a.price);
};

/**
 * Format price to show currency and commas.
 */
const formatPrice = (amountInCents: number): string => {
  const formatter = new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: 'EUR',
  });

  // Divide by 100 to convert to euros and cents
  return formatter.format(amountInCents / 100);
};

/**
 * Insert provided offers in DOM.
 */
export const renderOffers = (offers: Offer[]): void => {
  const resultsEl = getResultsEl();
  const offerTemplateEl = document.getElementById('js-offer-template');
  if (resultsEl === null || offerTemplateEl === null) {
    return;
  }

  if (offers.length === 0) {
    resultsEl.innerHTML = `<div class="no-offers">${messages.addressNoOffers}</div>`;
    return;
  }

  // Clear previous results
  resultsEl.innerHTML = '';

  const offerTemplate = offerTemplateEl.innerHTML;

  sortOffers(offers).forEach((offer, i) => {
    resultsEl.innerHTML += render(offerTemplate, {
      name: offer.name,
      price: formatPrice(offer.price),
      description: offer.description,
      // Highlight first cart if it's not the only one
      isHighlighted: i === 0 && offers.length !== 1,
    });
  });
};

/**
 * Handle events in offers DOM.
 * Added for whole results section - so it can be set once,
 * instead of adding new listeners whenever results are rendered.
 */
export function initResultsHandlers(): void {
  getResultsEl()?.addEventListener('click', (event) => {
    const resultsEl = event.target as HTMLDivElement;

    const readMoreBtn = resultsEl.closest('.js-toggle-description');
    if (readMoreBtn === null) {
      return;
    }
    const offerEl = readMoreBtn.closest('.js-offer');
    if (offerEl === null) {
      return;
    }

    // Toggle description
    const description = offerEl.querySelector('.js-description');
    if (description !== null) {
      description.classList.toggle('is-expanded');
    }

    // Toggle icon
    const toggleIcon = offerEl.querySelector('.js-toggle-icon');
    if (toggleIcon !== null) {
      toggleIcon.classList.toggle('is-expanded');
    }

    // Update aria-expanded attribute
    const isExpanded = description?.classList.contains('is-expanded');
    readMoreBtn.setAttribute('aria-expanded', String(isExpanded));
  });
}

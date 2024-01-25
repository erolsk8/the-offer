import '../../styles/offers/index.scss';

import { render } from 'mustache';
import type { Offer } from './types';
import { formatPrice, sortOffers, logError } from './helpers';
import { fetchOffers } from './fetch';

const MIN_ADDRESS_LENGTH = 5;

/**
 * User-facing messages
 */
const messages = {
  addressErrorLetters: `Address needs to contain at least ${MIN_ADDRESS_LENGTH} letters.`,
  addressErrorNumber: 'Address must include a number.',
  addressErrorSpace: 'Address must include a space.',
  addressNoOffers: 'No offers were found for the provided address, please try a different one.',
};

/**
 * Address validation:
 * - minimum required letters length,
 * - at least one number, and
 * - one space.
 */
const validateAddress = (address: string): string => {
  // Actual letters (without spaces or special characters)
  const letters = address.match(/\p{L}/gu)?.length ?? 0;
  if (letters < MIN_ADDRESS_LENGTH) {
    return messages.addressErrorLetters;
  }

  if (!/\d/.test(address)) {
    return messages.addressErrorNumber;
  }

  if (!/\s/.test(address.trim())) {
    return messages.addressErrorSpace;
  }

  // Empty string indicates a valid address
  return '';
};

const getResultsEl = (): HTMLElement | null => {
  const resultsEl = document.getElementById('js-offer-results');
  if (resultsEl === null) {
    logError('Could not find results DOM element.');
    return null;
  }

  return resultsEl;
};

/**
 * Render specified number of loading elements.
 * @param numElements
 */
const renderLoading = (numElements: number): void => {
  const resultsEl = getResultsEl();
  const loadingEl = document.getElementById('js-offer-loading-template');
  if (resultsEl === null || loadingEl === null) {
    return;
  }

  resultsEl.innerHTML = Array.from({ length: numElements })
    .map(() => loadingEl.innerHTML)
    .join('');
};

/**
 * Insert provided offers in DOM.
 */
const renderOffers = (offers: Offer[]): void => {
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
 */
const handleOffersEvents = (resultsEl: HTMLDivElement): void => {
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
};

const updateErrorEl = (message: string): void => {
  const errorsEl = document.getElementById('js-address-errors');
  if (errorsEl === null) {
    return;
  }

  errorsEl.innerHTML = message === '' ? '' : `<p>${message}</p>`;
};

let lastOfferCount = 0;
const handleAddressSubmit = async (address: string): Promise<void> => {
  // Clear previous error
  updateErrorEl('');

  const validationError = validateAddress(address);
  if (validationError !== '') {
    updateErrorEl(validationError);
    return;
  }

  const numLoadingElements = Math.max(lastOfferCount, 1);
  renderLoading(numLoadingElements);

  const response = await fetchOffers(address);
  if (!response.success) {
    updateErrorEl(response.error);
    return;
  }

  // Used in next call to keep same number of loading elements
  lastOfferCount = response.data.length;

  renderOffers(response.data);
};

export function initOffers(): void {
  const addressFormEl = document.getElementById('js-address-form') as HTMLFormElement | null;
  const addressInputEl = document.getElementById('js-address-input-field') as HTMLInputElement | null;

  if (addressFormEl === null || addressInputEl === null) {
    return;
  }

  addressFormEl.addEventListener('submit', (event) => {
    event.preventDefault();

    void handleAddressSubmit(addressInputEl.value);
  });

  // Add event listener only once
  getResultsEl()?.addEventListener('click', (event) => {
    handleOffersEvents(event.target as HTMLDivElement);
  });
}

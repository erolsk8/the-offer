import '../../styles/sections/offers.scss';

import { render } from 'mustache';
import type { Offer } from './types';
import { formatPrice, sortOffers } from './helpers';
import { fetchOffers } from './fetch';

const MIN_ADDRESS_LENGTH = 5;

/**
 * User-facing messages
 */
const messages = {
  addressErrorLetters: `Address needs to contain at least ${MIN_ADDRESS_LENGTH} letters.`,
  addressErrorNumber: 'Address must include a number.',
  addressErrorSpace: 'Address must include a space.',
  addressNoOffers: 'No offers were found for the provided address, please try again.',
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

/**
 * Insert provided offers in DOM.
 */
const renderOffers = (offers: Offer[]): void => {
  const offersEl = document.getElementById('js-offer-cards');
  const offerTemplateEl = document.getElementById('js-offer-template');
  if (offersEl === null || offerTemplateEl === null) {
    return;
  }

  if (offers.length === 0) {
    offersEl.innerHTML = `<div class="no-offers">${messages.addressNoOffers}</div>`;
    return;
  }

  // Clear previous results
  offersEl.innerHTML = '';

  // TODO: In the end, check if it would help to fetch external template
  const offerTemplate = offerTemplateEl.innerHTML;

  sortOffers(offers).forEach((offer, i) => {
    offersEl.innerHTML += render(offerTemplate, {
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
const handleOffersEvents = (offersEl: HTMLDivElement): void => {
  const readMoreBtn = offersEl.closest('.js-toggle-description');
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

/**
 * Clear or set new address error message.
 */
const updateErrorEl = (message: string): void => {
  const errorsEl = document.getElementById('js-address-errors');
  if (errorsEl === null) {
    return;
  }

  errorsEl.innerHTML = message === '' ? '' : `<p>${message}</p>`;
};

/**
 * Handle submitting address.
 */
const handleAddressSubmit = async (address: string): Promise<void> => {
  // Clear previous error
  updateErrorEl('');

  const validationError = validateAddress(address);
  if (validationError !== '') {
    updateErrorEl(validationError);
    return;
  }

  const offers = await fetchOffers(address);
  if (!offers.success) {
    updateErrorEl(offers.error);
    return;
  }

  renderOffers(offers.data);
};

export function initOffers(): void {
  const addressFormEl = document.getElementById('js-address-form') as HTMLFormElement | null;
  const addressInputEl = document.getElementById('js-address-input-field') as HTMLInputElement | null;
  const offersEl = document.getElementById('js-offer-cards');

  if (addressFormEl === null || addressInputEl === null || offersEl === null) {
    return;
  }

  addressFormEl.addEventListener('submit', (event) => {
    event.preventDefault();

    void handleAddressSubmit(addressInputEl.value);
  });

  // Add event listener only once
  offersEl.addEventListener('click', (event) => {
    handleOffersEvents(event.target as HTMLDivElement);
  });
}

import '../../styles/offers.scss';

import type { Offer } from './types';
import { fetchOffers } from './fetch';

const MIN_ADDRESS_LENGTH = 5;

/**
 * User-facing messages
 */
const messages = {
  addressErrorLetters: `Address needs to contain at least ${MIN_ADDRESS_LENGTH} letters.`,
  addressErrorNumber: 'Address must include a number.',
  addressErrorSpace: 'Address must include a space.',
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
  const offersSection = document.getElementById('js-offers');
  if (offersSection === null) {
    return;
  }

  // Clear previous results
  offersSection.innerHTML = '';

  // TODO: Consider SSR, templating engine, Web Components, or something better than this.
  offers.forEach((offer) => {
    const offerCard = document.createElement('div');
    offerCard.className = 'offer-card';
    offerCard.innerHTML = `
      <h3>${offer.name}</h3>
      <p>${offer.price}</p>
      <p>${offer.description}</p>
      <a href="https://example.com/order" target="_blank">Order</a>
    `;
    offersSection.appendChild(offerCard);
  });
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
 * Validate provided address and fetch offers.
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
  const addressForm = document.getElementById('js-address-form') as HTMLFormElement | null;
  const addressInput = document.getElementById('js-address-input-field') as HTMLInputElement | null;

  if (addressForm === null || addressInput === null) {
    return;
  }

  addressForm.addEventListener('submit', (event) => {
    event.preventDefault();

    void handleAddressSubmit(addressInput.value);
  });
}

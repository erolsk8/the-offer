import type { Offer } from './types';
import { formatPrice } from './helpers';
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
  const offersEl = document.getElementById('js-offer-cards');
  if (offersEl === null) {
    return;
  }

  // Clear previous results
  offersEl.innerHTML = '';

  // TODO: Consider SSR, templating engine, Web Components, or something better than this.
  offers.forEach((offer) => {
    const offerCard = document.createElement('div');
    offerCard.className = 'offer-card';
    offerCard.innerHTML = `
      <h3>${offer.name}</h3>
      <p>
      <span class="price-value">${formatPrice(offer.price)}</span>
      <span class="price-period">/ month</span>
      </p>
      <p>${offer.description}</p>
      <a class="btn" href="https://example.com/order" target="_blank">Order</a>
    `;
    offersEl.appendChild(offerCard);
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
  const addressFormEl = document.getElementById('js-address-form') as HTMLFormElement | null;
  const addressInputEl = document.getElementById('js-address-input-field') as HTMLInputElement | null;

  if (addressFormEl === null || addressInputEl === null) {
    return;
  }

  addressFormEl.addEventListener('submit', (event) => {
    event.preventDefault();

    void handleAddressSubmit(addressInputEl.value);
  });
}

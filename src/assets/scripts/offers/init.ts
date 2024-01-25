import '../../styles/offers/index.scss';

import { renderError, renderLoading, renderOffers, initResultsHandlers } from './render';
import { debounce } from './debounce';
import { fetchOffers } from './fetch';
import { messages } from './messages';

const MIN_ADDRESS_LENGTH = 5;

/**
 * Get error message if address validation does not meet requirements:
 * - minimum required letters length,
 * - at least one number, and
 * - one space.
 */
const validateAddress = (address: string): string => {
  // Actual letters (without spaces or special characters)
  const letters = address.match(/\p{L}/gu)?.length ?? 0;
  if (letters < MIN_ADDRESS_LENGTH) {
    return messages.addressErrorLetters.replace('{{min}}', MIN_ADDRESS_LENGTH.toString());
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
 * Used in next call to keep same number of loading elements.
 */
let lastOfferCount = 0;

/**
 * Process newly submitted address.
 */
const onSubmit = async (address: string): Promise<void> => {
  // Clear previous error
  renderError('');

  const validationError = validateAddress(address);
  if (validationError !== '') {
    renderError(validationError);
    return;
  }

  // Render at least 1 loading element - but keep previous number if there were more offers
  const numLoadingElements = Math.max(lastOfferCount, 1);
  renderLoading(numLoadingElements);

  const response = await fetchOffers(address);
  if (!response.success) {
    renderError(response.error);
    return;
  }

  renderOffers(response.data);

  lastOfferCount = response.data.length;
};

/**
 * Setup event handling with debounced address processing.
 */
export function initOffers(): void {
  const addressFormEl = document.getElementById('js-address-form') as HTMLFormElement | null;
  const addressInputEl = document.getElementById('js-address-input-field') as HTMLInputElement | null;
  const submitButton = document.getElementById('js-address-submit-button') as HTMLButtonElement | null;

  if (addressFormEl === null || addressInputEl === null || submitButton === null) {
    return;
  }

  // Handle form submit
  addressFormEl.addEventListener('submit', (event) => {
    event.preventDefault();

    submitButton.disabled = true;

    const debounceSubmit = debounce(() => {
      // Process submitted address
      void onSubmit(addressInputEl.value);
    }, 500);

    void debounceSubmit().then(() => {
      submitButton.disabled = false;
    });
  });

  // Add event listener only once
  initResultsHandlers();
}

import { debounce } from './debounce';
import { fetchOffers } from './fetch';
import { messages } from './messages';
import { logError } from './logger';
import type { Renderer } from './renderer';

export class FormHandler {
  private readonly renderer: Renderer;

  private addressFormEl?: HTMLFormElement;
  private addressInputEl?: HTMLInputElement;
  private submitButtonEl?: HTMLButtonElement;

  private isDomReady = false;

  /**
   * Used in next call to keep same number of loading elements.
   */
  private lastOfferCount: number = 0;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  /**
   * Get all required DOM elements and add event listeners.
   */
  public init(): void {
    this.initElements();

    if (this.isDomReady) {
      this.setupEventHandlers();
    }
  }

  /**
   * Get DOM elements and output errors for easier debugging.
   */
  private initElements(): void {
    this.addressFormEl = (document.getElementById('js-address-form') as HTMLFormElement) ?? undefined;
    this.addressInputEl = (document.getElementById('js-address-input-field') as HTMLInputElement) ?? undefined;
    this.submitButtonEl = (document.getElementById('js-address-submit-button') as HTMLButtonElement) ?? undefined;

    if (this.addressFormEl === undefined) {
      logError('FormHandler address form DOM not found.');
      return;
    }
    if (this.addressInputEl === undefined) {
      logError('FormHandler address input DOM not found.');
      return;
    }
    if (this.submitButtonEl === undefined) {
      logError('FormHandler submit DOM not found.');
      return;
    }

    this.isDomReady = true;
  }

  /**
   * Get error message if address validation does not meet requirements:
   * - minimum required letters length,
   * - at least one number, and
   * - one space.
   */
  private validateAddress(address: string): string {
    const MIN_ADDRESS_LENGTH = 5;

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
  }

  /**
   * Process newly submitted address.
   */
  private async onSubmit(address: string): Promise<void> {
    // Clear previous error
    this.renderer.renderError('');

    const validationError = this.validateAddress(address);
    if (validationError !== '') {
      this.renderer.renderError(validationError);
      return;
    }

    // Render at least 1 loading element - but keep previous number if there were more offers
    const numLoadingElements = Math.max(this.lastOfferCount, 1);
    this.renderer.renderLoading(numLoadingElements);

    const response = await fetchOffers(address);
    if (!response.success) {
      this.renderer.renderError(response.error);
      return;
    }

    this.renderer.renderOffers(response.data);

    this.lastOfferCount = response.data.length;
  }

  /**
   * Disable submit button and therefor form submission.
   */
  private setDisabledState(isDisabled: boolean): void {
    if (this.submitButtonEl === undefined) {
      return;
    }
    this.submitButtonEl.disabled = isDisabled;
  }

  private setupEventHandlers(): void {
    if (this.addressFormEl === undefined || this.addressInputEl === undefined) {
      return;
    }

    const addressInputEl = this.addressInputEl;

    this.addressFormEl.addEventListener('submit', (event) => {
      event.preventDefault();

      this.setDisabledState(true);

      const debounceSubmit = debounce(() => {
        // Process submitted address
        void this.onSubmit(addressInputEl.value);
      }, 500);

      void debounceSubmit().then(() => {
        this.setDisabledState(false);
      });
    });
  }
}

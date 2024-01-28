import { fetchOffers } from './fetch';
import { validateAddress } from './validation';
import { logError } from './logger';
import type { Renderer } from './renderer';

export class FormHandler {
  private readonly renderer: Renderer;

  private addressFormEl?: HTMLFormElement;
  private addressInputEl?: HTMLInputElement;
  private submitButtonEl?: HTMLButtonElement;

  private isDomReady = false;

  private isSubmitting = false;

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
      logError('FormHandler submit button DOM not found.');
      return;
    }

    this.isDomReady = true;
  }

  /**
   * Validate address and fetch offers.
   */
  private async processAddress(address: string): Promise<void> {
    // Clear previous error
    this.renderer.clearError();

    // Handle client side validation
    const validationError = validateAddress(address);
    if (validationError !== '') {
      this.renderer.renderError(validationError);
      return;
    }

    // Show loading, keeping previous number of offers
    this.renderer.renderLoading(this.lastOfferCount);

    // Fetch offers for submitter address
    const response = await fetchOffers(address);
    if (!response.success) {
      this.renderer.renderError(response.error);
      this.renderer.clearLoading();
      return;
    }

    this.renderer.clearLoading();

    // Preserve latest successful count
    this.lastOfferCount = response.data.length;

    // Show results
    this.renderer.renderOffers(response.data);
  }

  /**
   * Process newly submitted address.
   */
  private async handleSubmit(): Promise<void> {
    if (this.isSubmitting || this.submitButtonEl === undefined || this.addressInputEl === undefined) {
      return;
    }

    // Disable submitting
    this.isSubmitting = true;
    this.submitButtonEl.disabled = true;

    await this.processAddress(this.addressInputEl.value);

    // Enable submitting
    this.submitButtonEl.disabled = false;
    this.isSubmitting = false;
  }

  private setupEventHandlers(): void {
    if (this.addressFormEl !== undefined) {
      this.addressFormEl.addEventListener('submit', (event) => {
        event.preventDefault();

        void this.handleSubmit();
      });
    }
  }
}

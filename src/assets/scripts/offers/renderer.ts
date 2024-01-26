import type { Offer } from './types';
import { render } from 'mustache';
import { logError } from './logger';
import { messages } from './messages';

export class Renderer {
  private resultsEl?: HTMLElement;
  private errorsEl?: HTMLElement;
  private offerEl?: HTMLScriptElement;
  private loadingEl?: HTMLScriptElement;

  private isDomReady = false;

  /**
   * Get all required DOM elements and add event listeners.
   */
  public init(): void {
    this.initElements();

    if (this.isDomReady) {
      this.initResultsHandlers();
    }
  }

  /**
   * Get DOM elements and output errors for easier debugging.
   */
  private initElements(): void {
    this.resultsEl = document.getElementById('js-offer-results') ?? undefined;
    this.errorsEl = document.getElementById('js-address-errors') ?? undefined;
    this.offerEl = (document.getElementById('js-offer-template') as HTMLScriptElement) ?? undefined;
    this.loadingEl = (document.getElementById('js-offer-loading-template') as HTMLScriptElement) ?? undefined;

    if (this.resultsEl === undefined) {
      logError('Renderer results DOM not found.');
      return;
    }
    if (this.errorsEl === undefined) {
      logError('Renderer errors DOM not found.');
      return;
    }
    if (this.offerEl === undefined) {
      logError('Renderer offer template DOM not found.');
      return;
    }
    if (this.loadingEl === undefined) {
      logError('Renderer offer loading template DOM not found.');
      return;
    }

    this.isDomReady = true;
  }

  /**
   * Render new error message or just clear if empty.
   */
  public renderError(message: string): void {
    if (this.errorsEl === undefined) {
      return;
    }

    this.errorsEl.innerHTML = message === '' ? '' : `<p>${message}</p>`;
  }

  /**
   * Render specified number of loading elements (at least one, but could be 2, 3, etc.).
   */
  public renderLoading(numElements: number): void {
    if (this.resultsEl === undefined || this.loadingEl === undefined) {
      return;
    }

    const loadingTemplate = this.loadingEl.innerHTML;

    this.resultsEl.innerHTML = Array.from({ length: numElements })
      .map(() => loadingTemplate)
      .join('');
  }

  /**
   * Insert provided offers in DOM.
   */
  public renderOffers(offers: Offer[]): void {
    if (this.resultsEl === undefined || this.offerEl === undefined) {
      return;
    }

    if (offers.length === 0) {
      this.resultsEl.innerHTML = `<div class="no-offers">${messages.addressNoOffers}</div>`;
      return;
    }

    // Clear previous results
    this.resultsEl.innerHTML = '';

    const offerTemplate = this.offerEl.innerHTML;

    this.resultsEl.innerHTML = this.sortOffers(offers)
      .map((offer, i) =>
        render(offerTemplate, {
          name: offer.name,
          price: this.formatPrice(offer.price),
          description: offer.description,
          // Highlight first cart if it's not the only one
          isHighlighted: i === 0 && offers.length !== 1,
        }),
      )
      .join('');
  }

  /**
   * Handle events in offers DOM.
   * Added for whole results section - so it can be set once,
   * instead of adding new listeners whenever results are rendered.
   */
  private initResultsHandlers(): void {
    this.resultsEl?.addEventListener('click', (event) => {
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

  /**
   * Simple DESC sort.
   */
  private sortOffers(offers: Offer[]): Offer[] {
    return offers.sort((a, b) => b.price - a.price);
  }

  /**
   * Format price to show currency and commas.
   */
  private formatPrice(amountInCents: number): string {
    const formatter = new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR',
    });

    // Divide by 100 to convert to euros and cents
    return formatter.format(amountInCents / 100);
  }
}

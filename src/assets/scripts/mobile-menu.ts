export class MobileMenu {
  private readonly ACTIVE_CLASS = 'is-active';

  private navEl?: HTMLElement;
  private toggleEl?: HTMLElement;
  private closeEl?: HTMLElement;

  private isDomReady = false;

  /**
   * Get all required DOM elements and add event listeners.
   */
  public init(): void {
    this.initElements();

    if (this.isDomReady) {
      this.initEventListeners();
    }
  }

  /**
   * Get DOM elements and output errors for easier debugging.
   */
  private initElements(): void {
    this.navEl = document.getElementById('js-main-nav') ?? undefined;
    this.toggleEl = document.getElementById('js-toggle-mobile-menu') ?? undefined;
    this.closeEl = document.getElementById('js-close-mobile-menu') ?? undefined;

    if (this.navEl === undefined) {
      console.error('MobileMenu nav DOM not found.');
      return;
    }
    if (this.toggleEl === undefined) {
      console.error('MobileMenu toggle DOM not found.');
      return;
    }
    if (this.closeEl === undefined) {
      console.error('MobileMenu close DOM not found.');
      return;
    }

    this.isDomReady = true;
  }

  private toggleNav(): void {
    this.navEl?.classList.toggle(this.ACTIVE_CLASS);
  }

  private closeNav(): void {
    this.navEl?.classList.remove(this.ACTIVE_CLASS);
  }

  private initEventListeners(): void {
    // Toggle visibility
    this.toggleEl?.addEventListener('click', () => {
      this.toggleNav();
    });

    // Close menu on X icon click
    this.closeEl?.addEventListener('click', () => {
      this.closeNav();
    });

    // Close menu on outside click
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (
        this.navEl !== undefined &&
        !this.navEl.contains(target) &&
        this.toggleEl !== undefined &&
        !this.toggleEl.contains(target)
      ) {
        this.closeNav();
      }
    });
  }
}

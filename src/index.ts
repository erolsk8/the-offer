import './assets/styles/index.scss';

import { MobileMenu } from './assets/scripts/mobile-menu';

/**
 * Use dynamic import for content below the fold.
 * @link https://webpack.js.org/guides/code-splitting/#dynamic-imports
 */
const handleDynamicImports = async (): Promise<void> => {
  // Offers section
  const offers = await import('./assets/scripts/offers/init');
  offers.initOffers();

  // Footer
  import('./assets/scripts/footer-style');
};

/**
 * Main starting point.
 */
window.addEventListener('DOMContentLoaded', () => {
  const mobileMenu = new MobileMenu();
  mobileMenu.init();

  void handleDynamicImports();
});

import './assets/styles/index.scss';

import { initMenu } from './assets/scripts/header';

initMenu();

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

window.addEventListener('DOMContentLoaded', () => {
  void handleDynamicImports();
});

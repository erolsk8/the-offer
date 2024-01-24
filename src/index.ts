import './assets/styles/index.scss';

import { initMenu } from './assets/scripts/header';
import { initOffers } from './assets/scripts/offers/init';

// TODO: Implement real lazy loading (e.g. on first user interaction) - if performance score drops

initMenu();
initOffers();

window.addEventListener('DOMContentLoaded', () => {
  // Lazy load footer CSS
  import('./assets/scripts/lazy-footer');
});

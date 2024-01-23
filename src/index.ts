import './assets/styles/index.scss';

import './assets/scripts/header';

window.addEventListener('DOMContentLoaded', () => {
  // Lazy load footer CSS
  import('./assets/scripts/lazy-footer');
});

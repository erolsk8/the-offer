const ACTIVE_CLASS = 'is-active';

const getNavEl = (): HTMLElement | null => {
  const nav = document.getElementById('js-main-nav');
  if (nav === null) {
    console.error('Main navigation element not found');
    return null;
  }

  return nav;
};

const toggleNav = (): void => {
  getNavEl()?.classList.toggle(ACTIVE_CLASS);
};

const closeNav = (): void => {
  getNavEl()?.classList.remove(ACTIVE_CLASS);
};

window.addEventListener('DOMContentLoaded', () => {
  const toggleMobileMenu = document.getElementById('js-toggle-mobile-menu');
  if (toggleMobileMenu === null) {
    console.error('DOM element for toggling mobile menu not found');
    return;
  }
  toggleMobileMenu.addEventListener('click', toggleNav);

  // Close menu on X icon click
  const closeMobileMenu = document.getElementById('js-close-mobile-menu');
  if (closeMobileMenu === null) {
    console.error('DOM element for closing mobile menu not found');
    return;
  }
  closeMobileMenu.addEventListener('click', closeNav);

  // Close menu on outside click
  document.addEventListener('click', (event) => {
    const nav = getNavEl();
    const target = event.target as HTMLElement;

    if (nav !== null && !nav.contains(target) && !toggleMobileMenu.contains(target)) {
      closeNav();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Swup for SPA-like transitions
  const swup = new Swup({
    containers: ['#main-content']
  });

  // Re-initialize scripts after page replace
  swup.hooks.on('content:replace', () => {
    // Re-scan DOM for lightbox triggers
    if (window.lightbox && typeof window.lightbox.updateItems === 'function') {
      window.lightbox.updateItems();
    }
    
    // Close mobile menu if open
    const hamburger = document.querySelector('.site-header__hamburger');
    const nav = document.querySelector('.site-header__nav');
    if (hamburger && nav) {
      hamburger.classList.remove('is-active');
      nav.classList.remove('is-open');
    }
  });
});

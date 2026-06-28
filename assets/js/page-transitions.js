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
  });
});

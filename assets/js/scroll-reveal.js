class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal');
    this.options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    this.init();
  }

  init() {
    if (!('IntersectionObserver' in window)) {
      this.elements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, this.options);

    this.elements.forEach(el => {
      this.observer.observe(el);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ScrollReveal();
});

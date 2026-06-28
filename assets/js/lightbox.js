class Lightbox {
  constructor() {
    this.modal = document.getElementById('lightbox');
    if (!this.modal) return;

    this.content = this.modal.querySelector('.lightbox__content');
    this.closeBtn = this.modal.querySelector('.lightbox__close');
    this.prevBtn = this.modal.querySelector('.lightbox__nav--prev');
    this.nextBtn = this.modal.querySelector('.lightbox__nav--next');
    this.counter = this.modal.querySelector('.lightbox__counter');

    this.items = [];
    this.currentIndex = 0;
    this.isOpen = false;

    this.init();
  }

  init() {
    this.updateItems();

    // Event Listeners
    this.closeBtn.addEventListener('click', () => this.close());
    this.prevBtn.addEventListener('click', () => this.navigate(-1));
    this.nextBtn.addEventListener('click', () => this.navigate(1));

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal || e.target === this.content) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.navigate(-1);
      if (e.key === 'ArrowRight') this.navigate(1);
    });

    // Event delegation for triggers
    document.body.addEventListener('click', (e) => {
      const trigger = e.target.closest('.js-lightbox-trigger');
      if (trigger) {
        e.preventDefault();
        const index = this.items.findIndex(item => item.trigger === trigger);
        if (index > -1) this.open(index);
        return;
      }

      // Handle the "4+" overlay click
      const overlay = e.target.closest('.gallery-item__more-overlay');
      if (overlay) {
        e.preventDefault();
        this.open(3);
      }
    });
  }

  updateItems() {
    this.items = [];
    const triggers = document.querySelectorAll('.js-lightbox-trigger');
    triggers.forEach(trigger => {
      const type = trigger.dataset.type || 'image';
      const src = trigger.dataset.src;
      this.items.push({ type, src, trigger });
    });
  }

  open(index) {
    this.currentIndex = index;
    this.isOpen = true;
    this.modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    this.render();
  }

  close() {
    this.isOpen = false;
    this.modal.classList.remove('is-active');
    document.body.style.overflow = '';
    this.content.innerHTML = '';
  }

  navigate(direction) {
    this.currentIndex += direction;
    if (this.currentIndex < 0) {
      this.currentIndex = this.items.length - 1;
    } else if (this.currentIndex >= this.items.length) {
      this.currentIndex = 0;
    }
    this.render();
  }

  render() {
    this.content.innerHTML = '';
    const item = this.items[this.currentIndex];

    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.src;
      img.className = 'lightbox__item is-active';
      this.content.appendChild(img);
    } else if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      video.className = 'lightbox__item is-active';
      video.controls = true;
      video.autoplay = true;
      this.content.appendChild(video);
    }

    if (this.items.length > 1) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
      this.prevBtn.style.display = '';
      this.nextBtn.style.display = '';
      this.counter.style.display = '';
    } else {
      this.prevBtn.style.display = 'none';
      this.nextBtn.style.display = 'none';
      this.counter.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.lightbox = new Lightbox();
});

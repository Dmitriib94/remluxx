import { $, $$ } from '../core/dom.js';

export function initSliders(context = document) {
  const sliders = $$('[data-slider]', context);
  if (!sliders.length) return;

  sliders.forEach(initSlider);
}

function initSlider(slider) {
  if (slider.dataset.sliderInitialized === 'true') return;
  slider.dataset.sliderInitialized = 'true';

  const viewport = $('[data-slider-viewport]', slider);
  const track = $('[data-slider-track]', slider);
  const slides = $$('[data-slider-slide]', slider);
  const prevBtn = $('[data-slider-prev]', slider);
  const nextBtn = $('[data-slider-next]', slider);
  const pagination = $('[data-slider-pagination]', slider);
  const scrollbarThumb = $('[data-slider-scrollbar-thumb]', slider);

  if (!viewport || !track || !slides.length) return;

  let index = 0;
  let slidesPerView = getSlidesPerView();
  let maxIndex = getMaxIndex();

  createPagination();
  update();

  prevBtn?.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    update();
  });

  nextBtn?.addEventListener('click', () => {
    index = Math.min(maxIndex, index + 1);
    update();
  });

  let resizeFrame = null;

  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);

    resizeFrame = requestAnimationFrame(() => {
      slidesPerView = getSlidesPerView();
      maxIndex = getMaxIndex();
      index = Math.min(index, maxIndex);
      update();
    });
  });

  if (window.innerWidth <= 767) {
    let scrollFrame = null;

    viewport.addEventListener('scroll', () => {
      cancelAnimationFrame(scrollFrame);

      scrollFrame = requestAnimationFrame(() => {
        const step = getStepWidth();
        if (!step) return;

        index = clamp(Math.round(viewport.scrollLeft / step), 0, maxIndex);
        syncPagination();
        syncButtons();
        syncScrollbar();
      });
    }, { passive: true });
  }

  function getSlidesPerView() {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 1023) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, slides.length - getSlidesPerView());
  }

  function getGap() {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap || '0');
  }

  function getStepWidth() {
    const firstSlide = slides[0];
    if (!firstSlide) return 0;

    return firstSlide.getBoundingClientRect().width + getGap();
  }

  function update() {
    slidesPerView = getSlidesPerView();
    maxIndex = getMaxIndex();
    index = clamp(index, 0, maxIndex);

    if (window.innerWidth <= 767) {
      const step = getStepWidth();
      viewport.scrollTo({
        left: index * step,
        behavior: 'smooth'
      });
    } else {
      const step = getStepWidth();
      track.style.transform = `translate3d(-${index * step}px, 0, 0)`;
    }

    syncButtons();
    syncPagination();
    syncScrollbar();
  }

  function syncButtons() {
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= maxIndex;
  }

  function createPagination() {
    if (!pagination) return;

    pagination.innerHTML = '';

    const pages = maxIndex + 1;

    for (let i = 0; i < pages; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);

      dot.addEventListener('click', () => {
        index = i;
        update();
      });

      pagination.appendChild(dot);
    }

    syncPagination();
  }

  function syncPagination() {
    if (!pagination) return;

    const dots = $$('.slider__dot', pagination);
    const pages = maxIndex + 1;

    if (dots.length !== pages) {
      createPagination();
      return;
    }

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
      dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
    });
  }

  function syncScrollbar() {
    if (!scrollbarThumb) return;

    const pages = maxIndex + 1;
    const width = 100 / pages;
    const offset = width * index;

    scrollbarThumb.style.width = `${width}%`;
    scrollbarThumb.style.transform = `translateX(${offset}%)`;
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
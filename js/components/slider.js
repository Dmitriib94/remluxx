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

  if (!viewport || !track || !slides.length) {
    console.warn('[Slider] Не найдены обязательные элементы в', slider);
    return;
  }

  let index = 0;
  let slidesPerView = getSlidesPerView();
  let maxIndex = getMaxIndex();
  let isProgrammaticScroll = false;
  let scrollFrame = null;

  createPagination();
  update();

  prevBtn?.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
  nextBtn?.addEventListener('click', () => { index = Math.min(maxIndex, index + 1); update(); });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      slidesPerView = getSlidesPerView();
      maxIndex = getMaxIndex();
      index = Math.min(index, maxIndex);
      update();
    });
  });

  // Синхронизация UI при нативном свайпе (мобильные)
  viewport.addEventListener('scroll', () => {
    if (isProgrammaticScroll) return; // Игнорируем программный скролл

    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const step = getStepWidth();
      if (!step) return;
      
      index = clamp(Math.round(viewport.scrollLeft / step), 0, maxIndex);
      syncButtons();
      syncPagination();
      syncScrollbar();
    });
  }, { passive: true });

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
    const first = slides[0];
    if (!first) return 0;
    // offsetWidth стабильнее при скролле и ресайзе, чем getBoundingClientRect
    return first.offsetWidth + getGap();
  }

  function update() {
    slidesPerView = getSlidesPerView();
    maxIndex = getMaxIndex();
    index = clamp(index, 0, maxIndex);

    if (window.innerWidth <= 767) {
      const step = getStepWidth();
      if (!step) return;
      
      isProgrammaticScroll = true;
      // behavior: 'auto' не конфликтует с CSS scroll-snap и работает мгновенно
      viewport.scrollTo({ left: index * step, behavior: 'auto' });
      setTimeout(() => isProgrammaticScroll = false, 350);
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

    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
      dot.addEventListener('click', () => { index = i; update(); });
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

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-current', i === index ? 'true' : 'false');
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
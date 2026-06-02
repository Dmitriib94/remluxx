// js/sections/process.js
import { $, prefersReducedMotion } from '../core/dom.js';

const MOBILE_BREAKPOINT = 1023;
const VIDEO_SLIDER_BREAKPOINT = 767;

let sliderInitialized = false;
let activeVideoIndex = 0;

// --------------------------------------------------------------
// 1. Анимация появления секции
// --------------------------------------------------------------
export function initProcessTimeline() {
  const section = $('#process');
  if (!section) return;

  if (prefersReducedMotion || window.innerWidth <= MOBILE_BREAKPOINT) {
    section.classList.add('is-visible');
    return;
  }

  const observer = new IntersectionObserver(([entry], obs) => {
    if (!entry.isIntersecting) return;
    section.classList.add('is-visible');
    obs.unobserve(section);
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -60px 0px'
  });

  observer.observe(section);
}

// --------------------------------------------------------------
// 2. Ленивая загрузка видео
// --------------------------------------------------------------
function lazyLoadVideo(videoElement) {
  if (!videoElement) return;
  if (videoElement.src && videoElement.src !== '') return;

  const source = videoElement.querySelector('source');
  if (source && source.dataset.src) {
    source.src = source.dataset.src;
    videoElement.load();
  } else if (source && source.src && !videoElement.src) {
    videoElement.load();
  }
}

// --------------------------------------------------------------
// 3. Удаление слайдера (контролов)
// --------------------------------------------------------------
function destroyVideoSlider() {
  const controls = document.querySelector('.process-videos__slider-controls');
  if (controls) controls.remove();
  sliderInitialized = false;
  activeVideoIndex = 0;
}

// --------------------------------------------------------------
// 4. Инициализация слайдера с точками и стрелками
// --------------------------------------------------------------
function initVideoSlider() {
  const grid = document.querySelector('.process-videos__grid');
  if (!grid) return;

  const cards = document.querySelectorAll('.process-video-card');
  if (cards.length === 0) return;

  // Удаляем старые контролы, если есть
  destroyVideoSlider();

  // Создаём контейнер контролов
  const controlsWrapper = document.createElement('div');
  controlsWrapper.className = 'process-videos__slider-controls';

  // --- Пагинация (точки) ---
  const pagination = document.createElement('div');
  pagination.className = 'process-videos__pagination';
  for (let i = 0; i < cards.length; i++) {
    const dot = document.createElement('button');
    dot.className = 'process-videos__dot';
    dot.setAttribute('data-index', i);
    dot.addEventListener('click', () => scrollToCard(i));
    pagination.appendChild(dot);
  }
  controlsWrapper.appendChild(pagination);

  // --- Стрелки навигации ---
  const navPrev = document.createElement('button');
  navPrev.className = 'process-videos__nav process-videos__nav--prev';
  navPrev.setAttribute('aria-label', 'Предыдущее видео');
  navPrev.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const navNext = document.createElement('button');
  navNext.className = 'process-videos__nav process-videos__nav--next';
  navNext.setAttribute('aria-label', 'Следующее видео');
  navNext.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  controlsWrapper.appendChild(navPrev);
  controlsWrapper.appendChild(navNext);

  // Вставляем контролы после grid
  grid.parentNode.insertBefore(controlsWrapper, grid.nextSibling);

  // Функция прокрутки к карточке по индексу
  const scrollToCard = (index) => {
    const cardWidth = cards[0].offsetWidth;
    const marginRight = parseFloat(getComputedStyle(cards[0]).marginRight) || 0;
    const step = cardWidth + marginRight;
    grid.scrollTo({ left: index * step, behavior: 'smooth' });
  };

  // Получение текущего индекса на основе прокрутки
  const getCurrentIndex = () => {
    const scrollLeft = grid.scrollLeft;
    const cardWidth = cards[0].offsetWidth;
    const marginRight = parseFloat(getComputedStyle(cards[0]).marginRight) || 0;
    const step = cardWidth + marginRight;
    let index = Math.round(scrollLeft / step);
    index = Math.min(Math.max(0, index), cards.length - 1);
    return index;
  };

  // Обработчики стрелок
  navPrev.addEventListener('click', () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) scrollToCard(currentIndex - 1);
  });

  navNext.addEventListener('click', () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < cards.length - 1) scrollToCard(currentIndex + 1);
  });

  // Обновление активной точки и ленивая загрузка видео
  const updateActiveDotAndLazy = () => {
    const currentIndex = getCurrentIndex();
    const dots = document.querySelectorAll('.process-videos__dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    if (currentIndex !== activeVideoIndex) {
      activeVideoIndex = currentIndex;
      const activeCard = cards[activeVideoIndex];
      const video = activeCard?.querySelector('video');
      if (video) lazyLoadVideo(video);
    }
  };

  grid.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveDotAndLazy);
  });

  // При ресайзе корректируем активную точку и позицию
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateActiveDotAndLazy();
      const currentIndex = getCurrentIndex();
      scrollToCard(currentIndex);
    }, 150);
  });

  // Инициализация первого видео и активной точки
  const firstVideo = cards[0]?.querySelector('video');
  if (firstVideo) lazyLoadVideo(firstVideo);
  activeVideoIndex = 0;
  updateActiveDotAndLazy();

  sliderInitialized = true;
}

// --------------------------------------------------------------
// 5. Переключение между слайдером и сеткой
// --------------------------------------------------------------
function toggleVideoSlider() {
  const isMobile = window.innerWidth <= VIDEO_SLIDER_BREAKPOINT;
  const grid = document.querySelector('.process-videos__grid');

  if (!grid) return;

  if (isMobile) {
    if (!sliderInitialized) {
      grid.style.display = 'flex';
      initVideoSlider();
    }
  } else {
    if (sliderInitialized) {
      destroyVideoSlider();
      grid.style.display = '';
    }
  }
}

// --------------------------------------------------------------
// 6. Ленивая загрузка видео на десктопе (через Intersection Observer)
// --------------------------------------------------------------
function initDesktopVideoLazyLoad() {
  const videos = document.querySelectorAll('.process-video-card video');
  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        lazyLoadVideo(video);
        observer.unobserve(video);
      }
    });
  }, { threshold: 0.3, rootMargin: '100px' });

  videos.forEach(video => observer.observe(video));
}

// --------------------------------------------------------------
// 7. Главная функция инициализации (экспортируемая)
// --------------------------------------------------------------
export function initProcessSection() {
  initProcessTimeline();
  toggleVideoSlider();
  initDesktopVideoLazyLoad();

  window.addEventListener('resize', () => {
    toggleVideoSlider();
  });
}
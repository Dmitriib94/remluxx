// js/sections/process.js
import { $, prefersReducedMotion } from '../core/dom.js';

const MOBILE_BREAKPOINT = 1023;
const VIDEO_SLIDER_BREAKPOINT = 767; // ширина, на которой включаем слайдер

// --------------------------------------------------------------
// 1. Существующая анимация появления секции
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
// 2. Ленивая загрузка одного видео (устанавливает src, если его нет)
// --------------------------------------------------------------
function lazyLoadVideo(videoElement) {
  if (!videoElement) return;
  // Если видео уже имеет src (загружено) — не трогаем
  if (videoElement.src && videoElement.src !== '') return;

  const source = videoElement.querySelector('source');
  if (source && source.dataset.src) {
    // Поддержка data-src для более полной ленивой загрузки (опционально)
    source.src = source.dataset.src;
    videoElement.load();
  } else if (source && source.src && !videoElement.src) {
    // Если source.src уже прописан, но видео ещё не загружено — принудительно вызываем load
    videoElement.load();
  }
}

// --------------------------------------------------------------
// 3. Инициализация мобильного слайдера (только на экранах ≤ VIDEO_SLIDER_BREAKPOINT)
// --------------------------------------------------------------
let sliderInitialized = false;
let activeVideoIndex = 0;

function initVideoSlider() {
  const grid = document.querySelector('.process-videos__grid');
  if (!grid) return;

  const cards = document.querySelectorAll('.process-video-card');
  if (cards.length === 0) return;

  // Удаляем старую пагинацию, если есть
  const oldPagination = document.querySelector('.process-videos__pagination');
  if (oldPagination) oldPagination.remove();

  // Создаём пагинацию (точки)
  const pagination = document.createElement('div');
  pagination.className = 'process-videos__pagination';
  for (let i = 0; i < cards.length; i++) {
    const dot = document.createElement('button');
    dot.className = 'process-videos__dot';
    dot.setAttribute('data-index', i);
    dot.addEventListener('click', () => {
      const cardWidth = cards[0].offsetWidth;
      grid.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
    });
    pagination.appendChild(dot);
  }
  grid.parentNode.insertBefore(pagination, grid.nextSibling);

  // Функция обновления активной точки и ленивой загрузки видео
  function updateActiveDot() {
    const scrollLeft = grid.scrollLeft;
    const cardWidth = cards[0].offsetWidth;
    let newIndex = Math.round(scrollLeft / cardWidth);
    newIndex = Math.min(Math.max(0, newIndex), cards.length - 1);

    const dots = document.querySelectorAll('.process-videos__dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === newIndex);
    });

    // Ленивая загрузка: подгружаем видео только для активного слайда
    if (newIndex !== activeVideoIndex) {
      activeVideoIndex = newIndex;
      const activeCard = cards[activeVideoIndex];
      const video = activeCard?.querySelector('video');
      if (video) lazyLoadVideo(video);
    }
  }

  // Первоначальная загрузка первого видео
  const firstVideo = cards[0]?.querySelector('video');
  if (firstVideo) lazyLoadVideo(firstVideo);
  activeVideoIndex = 0;

  grid.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveDot);
  });

  // Пересчёт при ресайзе (чтобы корректно работала активная точка)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateActiveDot();
    }, 150);
  });

  updateActiveDot();
  sliderInitialized = true;
}

// --------------------------------------------------------------
// 4. Включение/выключение слайдера в зависимости от ширины экрана
// --------------------------------------------------------------
function toggleVideoSlider() {
  const isMobile = window.innerWidth <= VIDEO_SLIDER_BREAKPOINT;
  const grid = document.querySelector('.process-videos__grid');
  const pagination = document.querySelector('.process-videos__pagination');

  if (isMobile) {
    if (!sliderInitialized && grid) {
      initVideoSlider();
    }
  } else {
    // Удаляем пагинацию и сбрасываем флаг, чтобы при следующем сужении экрана слайдер создался заново
    if (pagination) pagination.remove();
    sliderInitialized = false;
    activeVideoIndex = 0;

    // На десктопе можно дополнительно загрузить все видео (по желанию)
    // но оставим их ленивую загрузку через Intersection Observer (см. ниже)
  }
}

// --------------------------------------------------------------
// 5. Ленивая загрузка видео на десктопе (через Intersection Observer)
// --------------------------------------------------------------
function initDesktopVideoLazyLoad() {
  const videos = document.querySelectorAll('.process-video-card video');
  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        lazyLoadVideo(video);
        observer.unobserve(video); // загружаем один раз
      }
    });
  }, { threshold: 0.3, rootMargin: '100px' }); // начинаем загрузку за 100px до появления

  videos.forEach(video => observer.observe(video));
}

// --------------------------------------------------------------
// 6. Главная функция инициализации всего функционала секции
// --------------------------------------------------------------
export function initProcessSection() {
  initProcessTimeline();   // анимация появления
  toggleVideoSlider();     // мобильный слайдер (проверяет ширину)
  initDesktopVideoLazyLoad(); // ленивая загрузка видео на десктопе

  // Подписываемся на ресайз, чтобы переключать режимы
  window.addEventListener('resize', () => {
    toggleVideoSlider();
  });
}

// Для обратной совместимости, если где-то в main.js вызывается initProcessTimeline,
// оставляем её, но рекомендуем использовать initProcessSection
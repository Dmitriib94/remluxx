// js/sections/services.js

import { $, $$ } from '../core/dom.js';

const MODE_WORKS = 'works';
const MODE_FULL  = 'full';
const MOBILE_BREAKPOINT = 767;

let sliderInitialized = false;

// --------------------------------------------------------------
// Переключение режимов (Только работы / Работы + материалы)
// --------------------------------------------------------------
export function initServicesToggle() {
  const toggle = $('[data-services-toggle]');
  const cards  = $$('[data-service-card]');

  if (!toggle || !cards.length) return;

  const buttons = $$('[data-services-mode]', toggle);
  if (!buttons.length) return;

  const setMode = (mode) => {
    toggle.dataset.mode = mode;

    buttons.forEach((button) => {
      const isActive = button.dataset.servicesMode === mode;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    cards.forEach((card) => {
      const worksText = $('[data-mode-works]', card);
      const fullText  = $('[data-mode-full]',  card);

      if (!worksText || !fullText) return;

      const showFull = mode === MODE_FULL;
      worksText.hidden = showFull;
      fullText.hidden  = !showFull;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      setMode(button.dataset.servicesMode);
    });
  });
}

// --------------------------------------------------------------
// Слайдер для карточек на мобильных устройствах (с точками и стрелками)
// --------------------------------------------------------------
function initServicesSlider() {
  const grid = $('.services__grid');
  if (!grid) return;

  const cards = $$('.services-card', grid);
  if (cards.length === 0) return;

  // Удаляем старые элементы, если были
  const oldControls = $('.services__slider-controls');
  if (oldControls) oldControls.remove();

  // Создаём контейнер для контролов
  const controlsWrapper = document.createElement('div');
  controlsWrapper.className = 'services__slider-controls';

  // --- Пагинация (точки) ---
  const pagination = document.createElement('div');
  pagination.className = 'services__pagination';
  for (let i = 0; i < cards.length; i++) {
    const dot = document.createElement('button');
    dot.className = 'services__dot';
    dot.setAttribute('data-index', i);
    dot.addEventListener('click', () => {
      scrollToCard(i);
    });
    pagination.appendChild(dot);
  }
  controlsWrapper.appendChild(pagination);

  // --- Стрелки навигации ---
  const navPrev = document.createElement('button');
  navPrev.className = 'services__nav services__nav--prev';
  navPrev.setAttribute('aria-label', 'Предыдущая услуга');
  navPrev.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const navNext = document.createElement('button');
  navNext.className = 'services__nav services__nav--next';
  navNext.setAttribute('aria-label', 'Следующая услуга');
  navNext.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  controlsWrapper.appendChild(navPrev);
  controlsWrapper.appendChild(navNext);

  // Вставляем контролы после grid
  grid.parentNode.insertBefore(controlsWrapper, grid.nextSibling);

  // Функция прокрутки к определённой карточке
  const scrollToCard = (index) => {
    const cardWidth = cards[0].offsetWidth;
    const marginRight = parseFloat(getComputedStyle(cards[0]).marginRight) || 0;
    const step = cardWidth + marginRight;
    grid.scrollTo({ left: index * step, behavior: 'smooth' });
  };

  // Обработчики стрелок
  navPrev.addEventListener('click', () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      scrollToCard(currentIndex - 1);
    }
  });

  navNext.addEventListener('click', () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < cards.length - 1) {
      scrollToCard(currentIndex + 1);
    }
  });

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

  // Обновление активной точки при скролле
  const updateActiveDot = () => {
    const currentIndex = getCurrentIndex();
    const dots = $$('.services__dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  grid.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveDot);
  });

  // При ресайзе пересчитываем активную точку и корректируем позицию, если нужно
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateActiveDot();
      // Принудительно корректируем прокрутку, чтобы активная карточка оставалась видимой
      const currentIndex = getCurrentIndex();
      scrollToCard(currentIndex);
    }, 150);
  });

  updateActiveDot();
  sliderInitialized = true;
}

// Удаление слайдера (возврат к сетке)
function destroyServicesSlider() {
  const controls = $('.services__slider-controls');
  if (controls) controls.remove();
  sliderInitialized = false;
}

// Переключение между обычной сеткой и слайдером в зависимости от ширины экрана
function toggleServicesSlider() {
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const grid = $('.services__grid');

  if (!grid) return;

  if (isMobile) {
    if (!sliderInitialized) {
      // Временно переключаем grid обратно на flex, чтобы слайдер работал
      grid.style.display = 'flex';
      initServicesSlider();
    }
  } else {
    if (sliderInitialized) {
      destroyServicesSlider();
      // Восстанавливаем исходный display сетки
      grid.style.display = '';
    }
  }
}

// --------------------------------------------------------------
// Главная инициализация секции услуг
// --------------------------------------------------------------
export function initServicesSection() {
  initServicesToggle();
  toggleServicesSlider();

  // Слушаем ресайз для адаптивного переключения
  window.addEventListener('resize', () => {
    toggleServicesSlider();
  });
}
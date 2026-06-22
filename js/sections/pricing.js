// js/sections/pricing.js
import { $, $$ } from '../core/dom.js';

const MOBILE_BREAKPOINT = 767;
let sliderInitialized = false;

// --------------------------------------------------------------
// Инициализация слайдера (точки + стрелки)
// --------------------------------------------------------------
function initPricingSlider() {
  const grid = $('.pricing__grid');
  if (!grid) return;

  const cards = $$('.pricing-card', grid);
  if (cards.length === 0) return;

  // Удаляем старые контролы, если есть
  const oldControls = $('.pricing__slider-controls');
  if (oldControls) oldControls.remove();

  // Создаём контейнер контролов
  const controlsWrapper = document.createElement('div');
  controlsWrapper.className = 'pricing__slider-controls';

  // --- Пагинация (точки) ---
  const pagination = document.createElement('div');
  pagination.className = 'pricing__pagination';
  for (let i = 0; i < cards.length; i++) {
    const dot = document.createElement('button');
    dot.className = 'pricing__dot';
    dot.setAttribute('data-index', i);
    dot.addEventListener('click', () => scrollToCard(i));
    pagination.appendChild(dot);
  }
  controlsWrapper.appendChild(pagination);

  // --- Стрелки навигации ---
  const navPrev = document.createElement('button');
  navPrev.className = 'pricing__nav pricing__nav--prev';
  navPrev.setAttribute('aria-label', 'Предыдущая цена');
  navPrev.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const navNext = document.createElement('button');
  navNext.className = 'pricing__nav pricing__nav--next';
  navNext.setAttribute('aria-label', 'Следующая цена');
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

  // Обновление активной точки при скролле
  const updateActiveDot = () => {
    const currentIndex = getCurrentIndex();
    const dots = $$('.pricing__dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  grid.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveDot);
  });

  // При ресайзе пересчитываем активную точку и корректируем позицию
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateActiveDot();
      const currentIndex = getCurrentIndex();
      scrollToCard(currentIndex);
    }, 150);
  });

  updateActiveDot();
  sliderInitialized = true;
}

// --------------------------------------------------------------
// Удаление слайдера (возврат к сетке)
// --------------------------------------------------------------
function destroyPricingSlider() {
  const controls = $('.pricing__slider-controls');
  if (controls) controls.remove();
  sliderInitialized = false;
}

// --------------------------------------------------------------
// Переключение между сеткой и слайдером в зависимости от ширины экрана
// --------------------------------------------------------------
function togglePricingSlider() {
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const grid = $('.pricing__grid');

  if (!grid) return;

  if (isMobile) {
    if (!sliderInitialized) {
      // Временно переключаем grid обратно на flex, чтобы слайдер работал
      grid.style.display = 'flex';
      initPricingSlider();
    }
  } else {
    if (sliderInitialized) {
      destroyPricingSlider();
      // Восстанавливаем исходный display сетки
      grid.style.display = '';
    }
  }
}

// --------------------------------------------------------------
// Главная инициализация секции цен
// --------------------------------------------------------------
export function initPricingSection() {
  togglePricingSlider();

  // Слушаем ресайз для адаптивного переключения
  window.addEventListener('resize', () => {
    togglePricingSlider();
  });
}
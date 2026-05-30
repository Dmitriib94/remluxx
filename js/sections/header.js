// js/sections/header.js
// Поведение «шапки» сайта: sticky-состояние при скролле,
// открытие/закрытие мобильного меню (бургер), закрытие по Esc, клику на оверлей и ресайзу.

import { $, $$ } from '../core/dom.js';

/**
 * Инициализирует поведение шапки сайта.
 */
export function initStickyHeader() {
  const header = $('[data-header]');
  if (!header) return;

  const burger = $('[data-burger]');
  const mobileMenu = $('[data-mobile-menu]');

  const SCROLL_THRESHOLD = 40;
  const DESKTOP_BREAKPOINT = 1023;

  // --- Sticky-состояние при скролле ---
  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  // --- Управление мобильным меню (без поломки fixed-элементов) ---
  let scrollPosition = 0;

  const openMenu = () => {
    header.classList.add('is-menu-open');
    burger?.setAttribute('aria-expanded', 'true');

    // Блокируем скролл без использования position:fixed (чтобы fixed-элементы не ломались)
    scrollPosition = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    // Сохраняем позицию для восстановления
    document.body.dataset.scrollY = scrollPosition;
  };

  const closeMenu = () => {
    if (!header.classList.contains('is-menu-open')) return;

    header.classList.remove('is-menu-open');
    burger?.setAttribute('aria-expanded', 'false');

    // Восстанавливаем скролл
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    const savedScroll = document.body.dataset.scrollY || '0';
    delete document.body.dataset.scrollY;
    window.scrollTo(0, parseInt(savedScroll, 10));
  };

  const toggleMenu = () => {
    if (header.classList.contains('is-menu-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // --- Закрытие по клику на оверлей (область вне меню) ---
  const handleOverlayClick = (event) => {
    if (!header.classList.contains('is-menu-open')) return;
    // Если клик пришёлся на сам header (оверлей создаётся через ::after) или на бургер — не закрываем
    const target = event.target;
    if (target === burger || burger?.contains(target)) return;
    if (target === mobileMenu || mobileMenu?.contains(target)) return;
    // В противном случае клик по оверлею — закрываем меню
    closeMenu();
  };

  // --- Подписки на события ---
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  burger?.addEventListener('click', toggleMenu);

  // Клик по любой ссылке в мобильном меню — закрываем его
  $$('a', mobileMenu).forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Закрытие по Esc
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Закрытие по клику на оверлей (вешаем на document, чтобы поймать клик вне меню)
  document.addEventListener('click', handleOverlayClick);

  // Переход на десктоп — гарантированно закрываем мобильное меню
  window.addEventListener('resize', () => {
    if (window.innerWidth > DESKTOP_BREAKPOINT) closeMenu();
  });
}
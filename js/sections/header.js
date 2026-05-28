// js/sections/header.js
// Поведение «шапки» сайта: sticky-состояние при скролле,
// открытие/закрытие мобильного меню (бургер), закрытие по Esc и ресайзу.

import { $, $$ } from '../core/dom.js';

/**
 * Инициализирует поведение шапки сайта.
 * Безопасно вызывать на страницах без шапки — функция тихо выйдет.
 */
export function initStickyHeader() {
  const header = $('[data-header]');
  if (!header) return;

  const burger = $('[data-burger]');
  const mobileMenu = $('[data-mobile-menu]');

  const SCROLL_THRESHOLD = 40;
  const DESKTOP_BREAKPOINT = 1023;

  // --- Sticky-состояние при скролле ---------------------------------------

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  // --- Управление мобильным меню ------------------------------------------

  const openMenu = () => {
    header.classList.add('is-menu-open');
    burger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    header.classList.remove('is-menu-open');
    burger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const toggleMenu = () => {
    if (header.classList.contains('is-menu-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  };
  

  // --- Подписки на события ------------------------------------------------

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  burger?.addEventListener('click', toggleMenu);

  // Клик по любой ссылке в мобильном меню — закрываем его
  $$('a', mobileMenu).forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Esc — закрыть меню
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Переход на десктоп — гарантированно закрываем мобильное меню
  window.addEventListener('resize', () => {
    if (window.innerWidth > DESKTOP_BREAKPOINT) closeMenu();
  });
}
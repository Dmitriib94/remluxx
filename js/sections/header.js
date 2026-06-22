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
  if (!mobileMenu) return;
  const menuCloseBtn = $('[data-mobile-menu-close]', mobileMenu);

  // Выносим панель меню в body, чтобы fixed-позиционирование
  // не зависело от контекста header.
  if (mobileMenu.parentElement !== document.body) {
    document.body.appendChild(mobileMenu);
  }

  const SCROLL_THRESHOLD = 40;
  const DESKTOP_BREAKPOINT = 1023;

  // --- Sticky-состояние при скролле ---
  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  // --- Управление мобильным меню ---
  // Надёжная блокировка скролла для mobile: фиксируем body и восстанавливаем позицию.
  let hadExternalBodyLock = false;
  let menuScrollY = 0;

  const openMenu = () => {
    header.classList.add('is-menu-open');
    document.body.classList.add('is-menu-open');
    burger?.setAttribute('aria-expanded', 'true');
    burger?.setAttribute('aria-label', 'Закрыть меню');
    document.dispatchEvent(new CustomEvent('menu-state-change'));

    // Сохраняем состояние, если body уже был заблокирован другим компонентом (например, модалкой).
    hadExternalBodyLock = document.body.classList.contains('is-locked');
    document.body.classList.add('is-locked');

    menuScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${menuScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  };

  const closeMenu = () => {
    if (!header.classList.contains('is-menu-open')) return;

    header.classList.remove('is-menu-open');
    document.body.classList.remove('is-menu-open');
    burger?.setAttribute('aria-expanded', 'false');
    burger?.setAttribute('aria-label', 'Открыть меню');
    document.dispatchEvent(new CustomEvent('menu-state-change'));

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, menuScrollY);

    // Возвращаем состояние блокировки только если поставили её сами.
    if (!hadExternalBodyLock) {
      document.body.classList.remove('is-locked');
    }
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
    const target = event.target;
    if (target === burger || burger?.contains(target)) return;

    // Клик по тёмной подложке меню закрывает панель.
    if (target === mobileMenu) {
      closeMenu();
    }
  };

  // --- Подписки на события ---
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  burger?.addEventListener('click', toggleMenu);
  menuCloseBtn?.addEventListener('click', closeMenu);

  // Клик по любой ссылке в мобильном меню — закрываем его
  $$('a', mobileMenu).forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Закрытие по Esc
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Закрытие по клику вне контента меню (по подложке).
  document.addEventListener('click', handleOverlayClick);

  // Переход на десктоп — гарантированно закрываем мобильное меню
  window.addEventListener('resize', () => {
    if (window.innerWidth > DESKTOP_BREAKPOINT) closeMenu();
  });
}
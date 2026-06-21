// js/sections/footer-accordion.js

import { $, $$ } from '../core/dom.js';

let initialized = false;

export function initFooterAccordion() {
  if (initialized) return;
  initialized = true;

  const footer = $('#footer');
  if (!footer) return;

  const columns = $$('.footer__column', footer);
  if (!columns.length) return;

  const isMobile = () => window.innerWidth <= 767;

  const closeColumn = (column) => {
    const trigger = $('.footer__accordion-trigger', column);
    if (!trigger) return;

    column.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  };

  const openColumn = (column) => {
    const trigger = $('.footer__accordion-trigger', column);
    if (!trigger) return;

    column.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  };

  const syncState = () => {
    columns.forEach((column, index) => {
      const trigger = $('.footer__accordion-trigger', column);
      const content = $('.footer__accordion-content', column);

      if (!trigger || !content) return;

      if (!isMobile()) {
        column.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = '';
        return;
      }

      if (index === 0) {
        openColumn(column);
      } else {
        closeColumn(column);
      }
    });
  };

  columns.forEach((column) => {
    const trigger = $('.footer__accordion-trigger', column);
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      if (!isMobile()) return;

      if (column.classList.contains('is-open')) {
        closeColumn(column);
      } else {
        openColumn(column);
      }
    });
  });

  syncState();
  window.addEventListener('resize', syncState);
}
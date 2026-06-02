// js/components/smooth-scroll.js
import { $, $$, prefersReducedMotion } from '../core/dom.js';

export function initSmoothScroll() {
  $$('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute('href');

    if (!href || href === '#') return;

    link.addEventListener('click', (event) => {
      const target = $(href);
      if (!target) return; // Якоря нет в DOM — отдаём управление браузеру.

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
}
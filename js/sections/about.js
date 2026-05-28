// js/sections/about.js
// Анимация появления секции «О нас» при попадании во вьюпорт.

import { $, $$, prefersReducedMotion } from '../core/dom.js';

export function initAboutReveal() {
  const section = $('#about');
  if (!section) return;

  if (prefersReducedMotion) {
    section.classList.add('is-visible');
    return;
  }

  // Если внутри нет ни одного элемента для анимации — просто показать секцию.
  const items = $$('[data-about-item]', section);
  if (!items.length) {
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
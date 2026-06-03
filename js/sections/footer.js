// js/sections/footer.js
// Анимация появления футера при скролле.

import { $, prefersReducedMotion } from '../core/dom.js';

export function initFooterReveal() {
  const footer = $('#footer');
  if (!footer) return;

  if (prefersReducedMotion) {
    footer.classList.add('is-visible');
    return;
  }

  const observer = new IntersectionObserver(([entry], obs) => {
    if (!entry.isIntersecting) return;

    footer.classList.add('is-visible');
    obs.unobserve(footer);
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  observer.observe(footer);
}
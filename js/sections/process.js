// js/sections/process.js
// Анимация появления секции «Как мы работаем».
// На мобильных и при reduce-motion — мгновенно показываем секцию без IntersectionObserver.

import { $, prefersReducedMotion } from '../core/dom.js';

const MOBILE_BREAKPOINT = 1023;

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
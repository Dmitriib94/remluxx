import { $, prefersReducedMotion } from '../utils.js';

export function initProcessTimeline() {
  const section = $('#process');
  if (!section) return;

  if (prefersReducedMotion || window.innerWidth <= 1023) {
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
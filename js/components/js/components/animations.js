import { $, $$, prefersReducedMotion } from '../utils.js';

export function initRevealAnimations() {
  if (prefersReducedMotion) return;

  const items = [
    ...$$('section'),
    ...$$('article'),
    ...$$('#portfolio figure'),
    ...$$('#why-us article'),
    ...$$('#services article'),
    ...$$('#pricing [data-reveal]'),
    ...$$('#hero ul li')
  ];

  items.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 500ms ease, transform 500ms ease';
    el.style.transitionDelay = `${Math.min(index % 6, 5) * 80}ms`;
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';

      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  });

  items.forEach((el) => observer.observe(el));
}
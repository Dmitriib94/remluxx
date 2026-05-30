// js/sections/contacts.js
// Анимация появления секции «Контакты» при попадании во вьюпорт.

import { $, $$, prefersReducedMotion } from '../core/dom.js';

export function initContactsReveal() {
  const section = $('#contacts');
  if (!section) return;

  if (prefersReducedMotion) {
    section.classList.add('is-visible');
    return;
  }

  const items = $$('[data-contacts-item]', section);
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
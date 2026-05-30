// js/sections/why-us.js
// Поочерёдное появление карточек в секции «Почему мы» (stagger-анимация).
// Инлайновые стили оставлены как в оригинале — не трогаем CSS-архитектуру.

import { $, $$, prefersReducedMotion } from '../core/dom.js';

const CARD_DELAY_STEP_MS = 100; // задержка между соседними карточками
const TRANSITION_MS = 500;

export function initWhyUsReveal() {
  const section = $('#why-us');
  if (!section) return;

  const cards = $$('[data-why-us-card]', section);
  if (!cards.length) return;

  // Уважаем системную настройку «уменьшить анимацию».
  if (prefersReducedMotion) {
    cards.forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    return;
  }

  // Стартовое состояние: скрываем и сдвигаем вниз.
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity ${TRANSITION_MS}ms ease-out, transform ${TRANSITION_MS}ms ease-out`;
    card.style.transitionDelay = `${index * CARD_DELAY_STEP_MS}ms`;
    card.style.willChange = 'transform, opacity';
  });

  const observer = new IntersectionObserver(([entry], obs) => {
    if (!entry.isIntersecting) return;

    cards.forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });

    obs.unobserve(section);
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
  });

  observer.observe(section);
}
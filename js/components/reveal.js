// js/components/reveal.js
// Глобальная reveal-анимация для типовых блоков: секций, карточек, элементов hero и т.д.
// Применяется к элементам, у которых нет своей отдельной reveal-логики
// (about, contacts, why-us, process — у них собственные модули).

import { $$, prefersReducedMotion } from '../core/dom.js';

const TRANSITION_MS = 500;
const DELAY_STEP_MS = 80;
const MAX_STAGGER_GROUP = 6; // карточки внутри одной «группы» получают delay 0..5 * step

export function initRevealAnimations() {
  if (prefersReducedMotion) return;

  // Уникальный список (Set) защищает от двойной анимации при пересечении селекторов
  // (например, <article> и #why-us article).
  const items = [...new Set([
    ...$$('section:not(#about):not(#contacts)'),
    ...$$('article'),
    ...$$('#portfolio figure'),
    ...$$('#why-us article'),
    ...$$('#services article'),
    ...$$('#pricing [data-reveal]'),
  ])];

  if (!items.length) return;

  // Стартовое состояние + ступенчатая задержка.
  items.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`;
    el.style.transitionDelay = `${Math.min(index % MAX_STAGGER_GROUP, MAX_STAGGER_GROUP - 1) * DELAY_STEP_MS}ms`;
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
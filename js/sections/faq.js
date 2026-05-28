// js/sections/faq.js
import { $, $$, prefersReducedMotion } from '../core/dom.js';

export function initFAQ() {
  const section = $('#faq');
  if (!section) return;

  const items = $$('[data-faq-item]', section);
  if (!items.length) return;

  // Защита от глобального reveal-скрипта
  section.dataset.noReveal = '';
  items.forEach((i) => { i.dataset.noReveal = ''; });

  const getContent = (item) => $('[data-faq-content]', item);

  const applyInitialState = (item) => {
    const content = getContent(item);
    if (!content) return;
    if (item.open) {
      content.style.height = 'auto';
      content.style.opacity = '1';
    } else {
      content.style.height = '0px';
      content.style.opacity = '0';
    }
  };

  const openItem = (item) => {
    const content = getContent(item);
    if (!content) return;

    item.classList.remove('is-closing');
    item.open = true;

    const target = content.scrollHeight;
    content.style.height = '0px';
    content.style.opacity = '0';

    requestAnimationFrame(() => {
      content.style.height = `${target}px`;
      content.style.opacity = '1';
    });

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      content.style.height = 'auto';
      content.removeEventListener('transitionend', onEnd);
    };
    content.addEventListener('transitionend', onEnd);
  };

  const closeItem = (item) => {
    const content = getContent(item);
    if (!content) return;

    item.classList.add('is-closing');
    content.style.height = `${content.scrollHeight}px`;
    content.style.opacity = '1';

    requestAnimationFrame(() => {
      content.style.height = '0px';
      content.style.opacity = '0';
    });

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      item.open = false;
      item.classList.remove('is-closing');
      content.removeEventListener('transitionend', onEnd);
    };
    content.addEventListener('transitionend', onEnd);
  };

  // 1. Сразу применяем стартовое состояние (до reveal)
  items.forEach(applyInitialState);

  // 2. Биндим клики
  items.forEach((item) => {
    const trigger = $('[data-faq-trigger]', item);
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.open) closeItem(item);
      else openItem(item);
    });
  });

  // 3. Reveal-анимация (опционально, не влияет на контент)
  if (prefersReducedMotion) return;

  items.forEach((item, i) => {
    item.classList.add('is-revealable');
    item.style.transitionDelay = `${i * 80}ms`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach((item) => io.observe(item));

  // 4. Resize: пересчёт открытых
  window.addEventListener('resize', () => {
    items.forEach((item) => {
      const content = getContent(item);
      if (content && item.open) content.style.height = 'auto';
    });
  });
}
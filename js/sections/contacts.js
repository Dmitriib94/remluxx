// js/sections/contacts.js
// Анимация появления секции «Контакты» + ленивая загрузка карты Яндекс.

import { $, $$, prefersReducedMotion } from '../core/dom.js';

export function initContactsReveal() {
  const section = $('#contacts');
  if (!section) return;

  initMapLazyLoad(section);

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

function initMapLazyLoad(section) {
  const container = $('[data-map-container]', section);
  if (!container || container.dataset.mapLoaded === 'true') return;

  const src = container.dataset.mapSrc;
  if (!src) return;

  const loadMap = () => {
    if (container.dataset.mapLoaded === 'true') return;
    container.dataset.mapLoaded = 'true';

    const script = document.createElement('script');
    script.src = src;
    script.charset = 'utf-8';
    script.async = true;
    container.appendChild(script);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry], obs) => {
      if (!entry.isIntersecting) return;
      loadMap();
      obs.disconnect();
    }, { rootMargin: '300px 0px' });

    observer.observe(container);
  } else {
    loadMap();
  }
}
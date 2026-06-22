import { $, onReady } from './core/dom.js';

import { initStickyHeader } from './sections/header.js';
import { initSmoothScroll } from './components/smooth-scroll.js';
import { initRevealAnimations } from './components/reveal.js';
import { initForms } from './components/forms.js';
import { initMobileBottomBar } from './components/mobile-bottom-bar.js';
import { initPortfolioModal } from './components/portfolio-modal.js';
import { initSliders } from './components/slider.js';
import { initPricingSection } from './sections/pricing.js';
import { initServicesSection } from './sections/services.js';
import { initFAQ } from './sections/faq.js';
import { initWhyUsReveal } from './sections/why-us.js';
import { initProcessSection } from './sections/process.js';
import { initAboutReveal } from './sections/about.js';
import { initContactsReveal } from './sections/contacts.js';
import { initFooterReveal } from './sections/footer.js';
import { initFooterAccordion } from './sections/footer-accordion.js';

function lazyInitOnVisible(selector, initFn, options = {}) {
  const target = $(selector);
  if (!target) return;

  let initialized = false;
  const run = () => {
    if (initialized) return;
    initialized = true;
    initFn(target);
  };

  if (!('IntersectionObserver' in window)) {
    run();
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run();
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.01,
    rootMargin: options.rootMargin ?? '240px 0px'
  });

  observer.observe(target);
}

function deferInit(initFn) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => initFn(), { timeout: 1500 });
    return;
  }
  setTimeout(() => initFn(), 0);
}

onReady(() => {
  // Критично для первого экрана.
  initStickyHeader();
  initSmoothScroll();
  initForms();
  initMobileBottomBar();
  initServicesSection();

  // Некритичную общую анимацию запускаем в idle.
  deferInit(initRevealAnimations);

  // Ленивая инициализация по секциям.
  lazyInitOnVisible('#why-us', () => initWhyUsReveal());
  lazyInitOnVisible('#process', () => initProcessSection());
  lazyInitOnVisible('#pricing', () => initPricingSection());
  lazyInitOnVisible('#faq', () => initFAQ());
  lazyInitOnVisible('#portfolio', (section) => {
    initSliders(section);
    initPortfolioModal();
  }, { rootMargin: '320px 0px' });
  lazyInitOnVisible('#design', (section) => {
    initSliders(section);
  }, { rootMargin: '320px 0px' });
  lazyInitOnVisible('#about', () => initAboutReveal(), { rootMargin: '300px 0px' });
  lazyInitOnVisible('#contacts', () => initContactsReveal(), { rootMargin: '320px 0px' });
  lazyInitOnVisible('#footer', () => {
    initFooterReveal();
    initFooterAccordion();
  }, { rootMargin: '380px 0px' });
});
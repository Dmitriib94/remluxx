import { onReady } from './core/dom.js';

import { initStickyHeader } from './sections/header.js';
import { initSmoothScroll } from './components/smooth-scroll.js';
import { initRevealAnimations } from './components/reveal.js';
import { initForms } from './components/forms.js';
import { initMobileBottomBar } from './components/mobile-bottom-bar.js';
import { initPortfolioModal } from './components/portfolio-modal.js';
import { initSliders } from './components/slider.js';
import { initServicesSection } from './sections/services.js';
import { initFAQ } from './sections/faq.js';
import { initWhyUsReveal } from './sections/why-us.js';
import { initProcessSection } from './sections/process.js';
import { initAboutReveal } from './sections/about.js';
import { initContactsReveal } from './sections/contacts.js';
import { initFooterReveal } from './sections/footer.js';
import { initFooterAccordion } from './sections/footer-accordion.js';

onReady(() => {
  initStickyHeader();
  initSmoothScroll();
  initRevealAnimations();
  initWhyUsReveal();
  initProcessSection();
  initFAQ();
  initSliders();
  initPortfolioModal();
  initForms();
  initMobileBottomBar();
  initServicesSection();
  initAboutReveal();
  initContactsReveal();
  initFooterReveal();
  initFooterAccordion();
});
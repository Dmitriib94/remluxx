import { initStickyHeader, initSmoothScroll, initMobileBottomBar } from './sections/header.js';
import { initRevealAnimations } from './components/animations.js';
import { initProcessTimeline } from './sections/process.js';
import { initFAQ } from './sections/faq.js';
import { initPortfolioModal } from './sections/portfolio.js';
import { initForms } from './components/forms.js';
import { initServicesToggle } from './sections/services.js';

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initSmoothScroll();
  initRevealAnimations();
  initProcessTimeline();
  initFAQ();
  initPortfolioModal();
  initForms();
  initMobileBottomBar();
  initServicesToggle();
});
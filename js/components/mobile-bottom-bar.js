// js/components/mobile-bottom-bar.js

import { $, $$ } from '../core/dom.js';

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';
const SHOW_AFTER_SCROLL = 200;

let initialized = false;

export function initMobileBottomBar() {
  if (initialized) return;
  initialized = true;

  const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
  const finalCta = $('#final-cta');
  const bar = createMobileBottomBar();

  let isFinalCtaVisible = false;

  document.body.appendChild(bar);

  const update = () => {
    const isMobile = mediaQuery.matches;
    const isMenuOpen = document.body.classList.contains('is-menu-open');
    const shouldShow = isMobile && window.scrollY > SHOW_AFTER_SCROLL && !isFinalCtaVisible && !isMenuOpen;

    bar.style.display = isMobile ? 'flex' : 'none';
    bar.style.transform = shouldShow ? 'translateY(0)' : 'translateY(100%)';
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  document.addEventListener('menu-state-change', update);

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', update);
  }

  if (finalCta) {
    const observer = new IntersectionObserver(([entry]) => {
      isFinalCtaVisible = entry.isIntersecting;
      update();
    }, {
      threshold: 0.2
    });

    observer.observe(finalCta);
  }

  update();
}

function createMobileBottomBar() {
  const bar = document.createElement('div');

  bar.dataset.mobileBottomBar = '';
  bar.innerHTML = `
    <a href="tel:+79015976868">Позвонить</a>
    <a href="https://wa.me/79015976868" target="_blank" rel="noopener">WhatsApp</a>
  `;

  Object.assign(bar.style, {
    position: 'fixed',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '1500',
    display: 'none',
    gap: '8px',
    padding: '8px 16px',
    background: '#1A1A1A',
    transform: 'translateY(100%)',
    transition: 'transform 250ms ease'
  });

  $$('a', bar).forEach((link, index) => {
    Object.assign(link.style, {
      flex: '1',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '4px',
      textDecoration: 'none',
      fontWeight: '600',
      color: '#fff',
      background: index === 1 ? '#C4963A' : 'transparent',
      border: index === 0 ? '1px solid rgba(255,255,255,.25)' : '0'
    });
  });

  return bar;
}
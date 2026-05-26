import { $, $$, prefersReducedMotion } from '../utils.js';

export function initStickyHeader() {
  const header = $('[data-header]');
  const burger = $('[data-burger]');
  const mobileMenu = $('[data-mobile-menu]');

  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  const closeMenu = () => {
    header.classList.remove('is-menu-open');
    burger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    header.classList.add('is-menu-open');
    burger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  updateHeader();

  window.addEventListener('scroll', updateHeader, { passive: true });

  burger?.addEventListener('click', () => {
    const isOpen = header.classList.contains('is-menu-open');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  $$('a', mobileMenu).forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1023) closeMenu();
  });
}

export function initSmoothScroll() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      const target = id && $(id);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
}

export function initMobileBottomBar() {
  if (window.innerWidth > 767) return;

  const finalCta = $('#final-cta');

  const bar = document.createElement('div');
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
    display: 'flex',
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

  document.body.appendChild(bar);

  const update = () => {
    const shouldShow = window.scrollY > 200;
    bar.style.transform = shouldShow ? 'translateY(0)' : 'translateY(100%)';
  };

  update();
  window.addEventListener('scroll', update, { passive: true });

  if (finalCta) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        bar.style.transform = 'translateY(100%)';
      }
    }, { threshold: 0.2 });

    observer.observe(finalCta);
  }
}
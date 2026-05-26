(() => {
  'use strict';

  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  function initStickyHeader() {
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

  function initSmoothScroll() {
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

  function initRevealAnimations() {
    if (prefersReducedMotion) return;

    const items = [
      ...$$('section'),
      ...$$('article'),
      ...$$('#portfolio figure'),
      ...$$('#why-us article'),
      ...$$('#services article'),
      ...$$('#pricing [data-reveal]'),
      ...$$('#hero ul li')
    ];

    items.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 500ms ease, transform 500ms ease';
      el.style.transitionDelay = `${Math.min(index % 6, 5) * 80}ms`;
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

  function initProcessTimeline() {
    const section = $('#process');
    if (!section) return;

    if (prefersReducedMotion || window.innerWidth <= 1023) {
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

  function initFAQ() {
    const detailsList = $$('details');
    if (!detailsList.length) return;

    detailsList.slice(0, 2).forEach((details) => {
      details.open = true;
    });

    detailsList.forEach((details) => {
      const summary = $('summary', details);
      if (!summary) return;

      summary.style.cursor = 'pointer';

      details.addEventListener('toggle', () => {
        details.style.borderColor = details.open ? '#C4963A' : '';
      });
    });
  }

  function initPortfolioModal() {
    const figures = $$('#portfolio figure');
    if (!figures.length) return;

    const modal = document.createElement('div');
    modal.hidden = true;
    modal.innerHTML = `
      <div data-modal-overlay style="
        position:fixed;
        inset:0;
        background:rgba(26,26,26,.85);
        z-index:2000;
        opacity:0;
        transition:opacity 250ms ease;
      "></div>

      <div data-modal-window role="dialog" aria-modal="true" style="
        position:fixed;
        left:50%;
        top:50%;
        transform:translate(-50%, -50%) scale(.96);
        width:min(720px, 92vw);
        max-height:85vh;
        overflow:auto;
        background:#fff;
        border-radius:12px;
        z-index:2001;
        opacity:0;
        transition:opacity 250ms ease, transform 250ms ease;
      ">
        <button type="button" data-modal-close aria-label="Закрыть" style="
          position:absolute;
          top:12px;
          right:12px;
          width:40px;
          height:40px;
          border:0;
          border-radius:50%;
          background:rgba(26,26,26,.7);
          color:#fff;
          cursor:pointer;
          font-size:24px;
          z-index:2;
        ">×</button>

        <img data-modal-img alt="" style="
          width:100%;
          aspect-ratio:16/9;
          object-fit:cover;
          display:block;
        ">

        <div style="padding:32px;">
          <p style="color:#C4963A;text-transform:uppercase;font-weight:600;font-size:12px;">Кейс RemLuxx</p>
          <h3 data-modal-title style="margin:8px 0 16px;">Фото наших работ</h3>
          <p>Детали проекта: площадь, сроки, бюджет и задача будут добавлены после наполнения кейсов.</p>
          <p>
            <a href="#lead" data-modal-cta style="
              display:inline-block;
              margin-top:16px;
              padding:16px 28px;
              background:#C4963A;
              color:#fff;
              text-decoration:none;
              border-radius:4px;
              font-weight:600;
            ">Хочу так же</a>
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const overlay = $('[data-modal-overlay]', modal);
    const windowEl = $('[data-modal-window]', modal);
    const closeBtn = $('[data-modal-close]', modal);
    const img = $('[data-modal-img]', modal);
    const title = $('[data-modal-title]', modal);
    const cta = $('[data-modal-cta]', modal);

    const open = (figure) => {
      const image = $('img', figure);
      const caption = $('figcaption', figure);

      if (!image) return;

      img.src = image.src;
      img.alt = image.alt || '';
      title.textContent = caption?.textContent || 'Кейс RemLuxx';

      modal.hidden = false;
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        windowEl.style.opacity = '1';
        windowEl.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    };

    const close = () => {
      overlay.style.opacity = '0';
      windowEl.style.opacity = '0';
      windowEl.style.transform = 'translate(-50%, -50%) scale(.96)';

      setTimeout(() => {
        modal.hidden = true;
        document.body.style.overflow = '';
      }, 250);
    };

    figures.forEach((figure) => {
      figure.style.cursor = 'pointer';
      figure.addEventListener('click', () => open(figure));
    });

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    cta.addEventListener('click', close);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.hidden) close();
    });
  }

  function initForms() {
    $$('form').forEach((form) => {
      const phoneInputs = $$('input[type="tel"]', form);
      const requiredInputs = $$('[data-required]', form);

      phoneInputs.forEach((input) => {
        input.addEventListener('input', () => {
          input.value = formatPhone(input.value);
          validateField(input);
        });

        input.addEventListener('blur', () => validateField(input));
      });

      requiredInputs.forEach((input) => {
        if (input.type !== 'tel') {
          input.addEventListener('input', () => validateField(input));
        }

        input.addEventListener('blur', () => validateField(input));
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const isValid = validateForm(form);

        if (!isValid) {
          showFormMessage(form, 'Проверьте заполнение полей', true);
          return;
        }

        if (form.hasAttribute('data-lead-download-form')) {
          showFormMessage(form, 'Скачивание началось.');
          showToast('Скачивание началось');
        } else {
          showFormMessage(form, 'Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
          showToast('Заявка отправлена');
        }

        form.reset();
        clearFieldStates(form);
      });
    });
  }

  function validateForm(form) {
    const fields = $$('[data-required]', form);
    let isValid = true;

    fields.forEach((field) => {
      const fieldValid = validateField(field);
      if (!fieldValid) isValid = false;
    });

    return isValid;
  }

  function validateField(input) {
    const name = input.getAttribute('name');
    const form = input.closest('form');
    const errorEl = form ? $(`[data-error-for="${name}"]`, form) : null;
    let error = '';

    if (!input.value.trim()) {
      error = 'Заполните поле';
    } else if (input.type === 'tel') {
      const digits = input.value.replace(/\D/g, '');
      if (digits.length < 11) {
        error = 'Введите корректный телефон';
      }
    }

    input.classList.toggle('is-invalid', Boolean(error));

    if (errorEl) {
      errorEl.textContent = error;
    }

    return !error;
  }

  function clearFieldStates(form) {
    $$('[data-required]', form).forEach((input) => {
      input.classList.remove('is-invalid');
    });

    $$('[data-error-for]', form).forEach((error) => {
      error.textContent = '';
    });
  }

  function showToast(text) {
    let toast = $('[data-toast]');

    if (!toast) {
      toast = document.createElement('div');
      toast.dataset.toast = '';
      document.body.appendChild(toast);

      Object.assign(toast.style, {
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: '2200',
        maxWidth: '320px',
        padding: '14px 16px',
        borderRadius: '8px',
        background: '#1A1A1A',
        color: '#FFFFFF',
        boxShadow: '0 16px 48px rgba(26,26,26,.18)',
        opacity: '0',
        transform: 'translateY(12px)',
        transition: 'opacity 250ms ease, transform 250ms ease',
        pointerEvents: 'none'
      });
    }

    toast.textContent = text;

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 2400);
  }

  function formatPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    const normalized = digits.startsWith('8') ? `7${digits.slice(1)}` : digits;

    if (!normalized) return '';

    const p = normalized.padEnd(11, '_');

    return `+${p[0]} ${p.slice(1, 4)} ${p.slice(4, 7)}-${p.slice(7, 9)}-${p.slice(9, 11)}`.replace(/[_-]+$/g, '');
  }

  function showFormMessage(form, text, isError = false) {
    let message = $('[data-form-message]', form);

    if (!message) {
      message = document.createElement('p');
      message.dataset.formMessage = '';
      form.appendChild(message);
    }

    message.textContent = text;
    message.style.color = isError ? '#C05A3A' : '#C4963A';
    message.style.marginTop = '12px';
  }

  function initMobileBottomBar() {
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

  function initServicesToggle() {
    const toggle = $('[data-services-toggle]');
    const cards = $$('[data-service-card]');

    if (!toggle || !cards.length) return;

    const buttons = $$('[data-services-mode]', toggle);

    const setMode = (mode) => {
      toggle.dataset.mode = mode;

      buttons.forEach((button) => {
        const isActive = button.dataset.servicesMode === mode;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      cards.forEach((card) => {
        const worksText = $('[data-mode-works]', card);
        const fullText = $('[data-mode-full]', card);

        if (!worksText || !fullText) return;

        if (mode === 'full') {
          worksText.hidden = true;
          fullText.hidden = false;
        } else {
          worksText.hidden = false;
          fullText.hidden = true;
        }
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        setMode(button.dataset.servicesMode);
      });
    });

    setMode('works');
  }

})();
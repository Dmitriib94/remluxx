import { $, $$ } from '../core/dom.js';

const OPEN_CLASS = 'is-open';
const CLOSING_CLASS = 'is-closing';
const MOBILE_BREAKPOINT = 767;
const OPEN_DURATION = 300;
const CLOSE_DURATION = 200;
const MOBILE_DURATION = 350;

export function initPortfolioModal() {
  const portfolio = $('#portfolio');
  if (!portfolio) return;

  if (portfolio.dataset.portfolioModalInitialized === 'true') return;
  portfolio.dataset.portfolioModalInitialized = 'true';

  const cards = $$('#portfolio .portfolio-card');
  if (!cards.length) return;

  const modal = createModal();
  document.body.appendChild(modal);

  const overlay = $('[data-portfolio-modal-overlay]', modal);
  const dialog = $('[data-portfolio-modal-dialog]', modal);
  const closeBtn = $('[data-portfolio-modal-close]', modal);

  const media = $('[data-portfolio-modal-media]', modal);
  const tag = $('[data-portfolio-modal-tag]', modal);
  const title = $('[data-portfolio-modal-title]', modal);
  const description = $('[data-portfolio-modal-text]', modal);

  const areaValue = $('[data-portfolio-modal-area-value]', modal);
  const termValue = $('[data-portfolio-modal-term-value]', modal);
  const budgetValue = $('[data-portfolio-modal-budget-value]', modal);

  let activeCard = null;
  let closeTimer = null;

  const openModal = (card) => {
    activeCard = card;

    fillModal(card, {
      media,
      tag,
      title,
      description,
      areaValue,
      termValue,
      budgetValue
    });

    clearTimeout(closeTimer);

    modal.hidden = false;
    document.body.classList.add('is-locked');

    requestAnimationFrame(() => {
      modal.classList.remove(CLOSING_CLASS);
      modal.classList.add(OPEN_CLASS);
    });

    closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove(OPEN_CLASS);
    modal.classList.add(CLOSING_CLASS);

    clearTimeout(closeTimer);

    const duration = window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_DURATION : CLOSE_DURATION;

    closeTimer = setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove(CLOSING_CLASS);
      document.body.classList.remove('is-locked');

      if (activeCard) {
        activeCard.focus?.();
      }

      activeCard = null;
    }, duration);
  };

  cards.forEach((card) => {
    card.setAttribute('tabindex', '0');

    card.addEventListener('click', (event) => {
      const isDragHandle = event.target.closest('[data-before-after]');
      if (!isDragHandle && event.target.closest('a')) return;

      openModal(card);
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  dialog?.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

function fillModal(card, refs) {
  const {
    media,
    tag,
    title,
    description,
    areaValue,
    termValue,
    budgetValue
  } = refs;

  const cardTag = $('.portfolio-card__tag', card)?.textContent?.trim() || 'Кейс RemLuxx';
  const cardTitle = $('.portfolio-card__title', card)?.textContent?.trim() || 'Фото наших работ';
  const cardMeta = $('.portfolio-card__meta', card)?.textContent?.trim() || '';
  const cardDescription = card.dataset.description
    || 'Подробное описание кейса будет добавлено после наполнения раздела.';
  const area = card.dataset.area || '—';
  const term = card.dataset.term || '—';
  const budget = card.dataset.budget || '—';

  tag.textContent = cardTag;
  title.textContent = cardTitle;
  description.textContent = cardDescription;
  areaValue.textContent = area;
  termValue.textContent = term;
  budgetValue.textContent = budget;

  media.innerHTML = '';

  const videoPoster = $('.portfolio-card__video-poster img', card);
  const beforeImg = $('.portfolio-card__image--before img', card);
  const afterImg = $('.portfolio-card__image--after img', card);

  if (card.classList.contains('portfolio-card--video') && videoPoster) {
    const img = document.createElement('img');
    img.src = videoPoster.currentSrc || videoPoster.src;
    img.alt = videoPoster.alt || cardTitle;
    img.loading = 'eager';
    img.decoding = 'async';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    media.appendChild(img);
    return;
  }

  if (beforeImg && afterImg) {
    const beforeWrap = document.createElement('div');
    beforeWrap.className = 'portfolio-card__image--before';

    const beforeClone = document.createElement('img');
    beforeClone.src = beforeImg.currentSrc || beforeImg.src;
    beforeClone.alt = beforeImg.alt || `${cardTitle} до`;
    beforeClone.loading = 'eager';
    beforeClone.decoding = 'async';
    beforeWrap.appendChild(beforeClone);

    const afterWrap = document.createElement('div');
    afterWrap.className = 'portfolio-card__image--after';
    afterWrap.style.clipPath = 'inset(0 0 0 50%)';

    const afterClone = document.createElement('img');
    afterClone.src = afterImg.currentSrc || afterImg.src;
    afterClone.alt = afterImg.alt || `${cardTitle} после`;
    afterClone.loading = 'eager';
    afterClone.decoding = 'async';
    afterWrap.appendChild(afterClone);

    const overlay = document.createElement('div');
    overlay.className = 'portfolio-card__overlay';

    const beforeLabel = document.createElement('span');
    beforeLabel.className = 'portfolio-card__label portfolio-card__label--before';
    beforeLabel.textContent = 'До';

    const afterLabel = document.createElement('span');
    afterLabel.className = 'portfolio-card__label portfolio-card__label--after';
    afterLabel.textContent = 'После';

    const divider = document.createElement('div');
    divider.className = 'portfolio-card__divider';
    divider.innerHTML = `
      <span class="portfolio-card__divider-line"></span>
      <span class="portfolio-card__handle" aria-hidden="true">
        <svg class="icon icon--stroke" viewBox="0 0 24 24">
          <path d="M8 7L3 12L8 17"></path>
          <path d="M16 7L21 12L16 17"></path>
        </svg>
      </span>
    `;

    media.append(beforeWrap, afterWrap, overlay, beforeLabel, afterLabel, divider);
  } else if (beforeImg) {
    const img = document.createElement('img');
    img.src = beforeImg.currentSrc || beforeImg.src;
    img.alt = beforeImg.alt || cardTitle;
    img.loading = 'eager';
    img.decoding = 'async';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    media.appendChild(img);
  }

  if (cardMeta && !card.dataset.description) {
    description.textContent = `Детали проекта: ${cardMeta}.`;
  }
}

function createModal() {
  const modal = document.createElement('div');

  modal.hidden = true;
  modal.className = 'portfolio-modal';
  modal.dataset.portfolioModal = '';

  modal.innerHTML = `
    <div class="portfolio-modal__overlay" data-portfolio-modal-overlay></div>

    <div
      class="portfolio-modal__dialog"
      data-portfolio-modal-dialog
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-modal-title"
    >
      <button
        class="portfolio-modal__close"
        type="button"
        aria-label="Закрыть"
        data-portfolio-modal-close
      >
        <svg class="icon icon--stroke" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6L18 18"></path>
          <path d="M18 6L6 18"></path>
        </svg>
      </button>

      <div class="portfolio-modal__media" data-portfolio-modal-media></div>

      <div class="portfolio-modal__body">
        <div class="portfolio-modal__tag" data-portfolio-modal-tag>Кейс RemLuxx</div>

        <h3 class="portfolio-modal__title" id="portfolio-modal-title" data-portfolio-modal-title>
          Фото наших работ
        </h3>

        <div class="portfolio-modal__metrics">
          <div class="portfolio-modal__metric">
            <span class="portfolio-modal__metric-icon" aria-hidden="true">
              <svg class="icon icon--stroke" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                <path d="M9 4V7"></path>
                <path d="M15 4V7"></path>
                <path d="M9 17V20"></path>
                <path d="M15 17V20"></path>
                <path d="M4 9H7"></path>
                <path d="M17 9H20"></path>
                <path d="M4 15H7"></path>
                <path d="M17 15H20"></path>
              </svg>
            </span>
            <div>
              <div class="portfolio-modal__metric-value" data-portfolio-modal-area-value>—</div>
              <div class="portfolio-modal__metric-label">Площадь</div>
            </div>
          </div>

          <div class="portfolio-modal__metric">
            <span class="portfolio-modal__metric-icon" aria-hidden="true">
              <svg class="icon icon--stroke" viewBox="0 0 24 24">
                <circle cx="12" cy="13" r="8"></circle>
                <path d="M12 9V13L15 15"></path>
                <path d="M9 3H15"></path>
                <path d="M12 3V5"></path>
              </svg>
            </span>
            <div>
              <div class="portfolio-modal__metric-value" data-portfolio-modal-term-value>—</div>
              <div class="portfolio-modal__metric-label">Срок</div>
            </div>
          </div>

          <div class="portfolio-modal__metric">
            <span class="portfolio-modal__metric-icon" aria-hidden="true">
              <svg class="icon icon--stroke" viewBox="0 0 24 24">
                <path d="M12 3V21"></path>
                <path d="M16 7.5C16 6.12 14.21 5 12 5C9.79 5 8 6.12 8 7.5C8 8.88 9.79 10 12 10C14.21 10 16 11.12 16 12.5C16 13.88 14.21 15 12 15C9.79 15 8 13.88 8 12.5"></path>
                <path d="M8.5 18C9.28 18.62 10.56 19 12 19C14.21 19 16 17.88 16 16.5"></path>
              </svg>
            </span>
            <div>
              <div class="portfolio-modal__metric-value" data-portfolio-modal-budget-value>—</div>
              <div class="portfolio-modal__metric-label">Бюджет</div>
            </div>
          </div>
        </div>

        <p class="portfolio-modal__text" data-portfolio-modal-text>
          Подробное описание кейса будет добавлено после наполнения раздела.
        </p>

        <a href="#lead" class="btn btn--primary btn--full portfolio-modal__cta">
          Хочу так же
        </a>
      </div>
    </div>
  `;

  return modal;
}
// js/components/portfolio-modal.js
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

  const cards = $$('.portfolio-card', portfolio);
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
  // ❌ Убраны areaValue, termValue, budgetValue

  let activeCard = null;
  let closeTimer = null;

  const openModal = (card) => {
    activeCard = card;
    fillModal(card, { media, tag, title, description });

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
  const { media, tag, title, description } = refs;
  
  const cardTag = $('.portfolio-card__tag', card)?.textContent?.trim() || 'Кейс RemLuxx';
  // Убираем "· X м²", если оно есть в заголовке, оставляем только ЖК/адрес
  let cardTitle = $('.portfolio-card__title', card)?.textContent?.trim() || 'Фото наших работ';
  cardTitle = cardTitle.replace(/·\s*\d+\s*м²/gi, '').trim();
  
  const cardDescription = card.dataset.description
    || 'Подробное описание кейса будет добавлено после наполнения раздела.';

  tag.textContent = cardTag;
  title.textContent = cardTitle;
  description.textContent = cardDescription;

  media.innerHTML = '';
  const beforeImg = $('.portfolio-card__image--before img', card);
  const afterImg = $('.portfolio-card__image--after img', card);
  const videoPoster = $('.portfolio-card__video-poster img', card);

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
    // Режим "До/После" с разделителем
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
      </span>`;

    media.append(beforeWrap, afterWrap, overlay, beforeLabel, afterLabel, divider);
  } else {
    // Если только одно фото (обычно "После")
    const sourceImg = afterImg || beforeImg;
    if (sourceImg) {
      const img = document.createElement('img');
      img.src = sourceImg.currentSrc || sourceImg.src;
      img.alt = sourceImg.alt || cardTitle;
      img.loading = 'eager';
      img.decoding = 'async';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      media.appendChild(img);
    }
  }
}

function createModal() {
  const modal = document.createElement('div');
  modal.hidden = true;
  modal.className = 'portfolio-modal';
  modal.dataset.portfolioModal = '';
  modal.innerHTML = `
    <div class="portfolio-modal__overlay" data-portfolio-modal-overlay></div>
    <div class="portfolio-modal__dialog" data-portfolio-modal-dialog role="dialog" aria-modal="true" aria-labelledby="portfolio-modal-title">
      <button class="portfolio-modal__close" type="button" aria-label="Закрыть" data-portfolio-modal-close>
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

        <p class="portfolio-modal__text" data-portfolio-modal-text>
          Подробное описание кейса будет добавлено после наполнения раздела.
        </p>

        <a href="https://t.me/+79015976868" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--full portfolio-modal__cta">
          Обсудить проект в Telegram
        </a>
      </div>
    </div>
  `;
  return modal;
}
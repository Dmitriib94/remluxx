// js/components/portfolio-modal.js
import { $, $$ } from '../core/dom.js';

const OPEN_CLASS = 'is-open';
const CLOSING_CLASS = 'is-closing';
const MOBILE_BREAKPOINT = 767;
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
    // Передаём modal в fillModal, чтобы управлять классом
    fillModal(card, { media, tag, title, description, modal });

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
    // Удаляем класс простого модального окна при закрытии
    modal.classList.remove('portfolio-modal--simple');

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
  // Добавили refs.modal
  const { media, tag, title, description, modal } = refs;

  // Проверяем, относится ли карточка к четвёртому слайдеру ("До и После")
  const isSimple = card.classList.contains('portfolio-card--simple');

  const cardTag = $('.portfolio-card__tag', card)?.textContent?.trim() || 'Кейс RemLuxx';
  let cardTitle = $('.portfolio-card__title', card)?.textContent?.trim() || 'Фото наших работ';
  cardTitle = cardTitle.replace(/·\s*\d+\s*м²/gi, '').trim();

  const cardDescription = card.dataset.description
    || 'Подробное описание кейса будет добавлено после наполнения раздела.';

  if (isSimple) {
    // Скрываем тег, заголовок и описание
    tag.style.display = 'none';
    title.style.display = 'none';
    description.style.display = 'none';
    // Добавляем класс для изменения пропорций фото (CSS будет .portfolio-modal--simple .portfolio-modal__media)
    modal.classList.add('portfolio-modal--simple');
  } else {
    // Показываем и заполняем данные для обычных карточек
    tag.style.display = '';
    title.style.display = '';
    description.style.display = '';
    tag.textContent = cardTag;
    title.textContent = cardTitle;
    description.textContent = cardDescription;
  }

  media.innerHTML = '';

  const beforeImg = $('.portfolio-card__image--before img', card);
  const afterImg = $('.portfolio-card__image--after img', card);
  const videoPoster = $('.portfolio-card__video-poster img', card);

  // Видео-кейс
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

  // Режим "До/После" с переключением
  if (beforeImg && afterImg) {
    // Контейнер для изображений
    const slider = document.createElement('div');
    slider.className = 'portfolio-modal__slider';

    const beforePic = document.createElement('img');
    beforePic.className = 'portfolio-modal__img portfolio-modal__img--before';
    beforePic.src = beforeImg.currentSrc || beforeImg.src;
    beforePic.alt = beforeImg.alt || `${cardTitle} до`;
    beforePic.loading = 'eager';
    beforePic.decoding = 'async';

    const afterPic = document.createElement('img');
    afterPic.className = 'portfolio-modal__img portfolio-modal__img--after';
    afterPic.src = afterImg.currentSrc || afterImg.src;
    afterPic.alt = afterImg.alt || `${cardTitle} после`;
    afterPic.loading = 'eager';
    afterPic.decoding = 'async';

    // По умолчанию показываем "После"
    beforePic.style.display = 'none';
    afterPic.style.display = 'block';

    slider.append(beforePic, afterPic);

    // Кнопки-табы
    const tabs = document.createElement('div');
    tabs.className = 'portfolio-modal__tabs';

    const beforeTab = document.createElement('button');
    beforeTab.className = 'portfolio-modal__tab';
    beforeTab.textContent = 'До ремонта';
    beforeTab.type = 'button';

    const afterTab = document.createElement('button');
    afterTab.className = 'portfolio-modal__tab is-active';
    afterTab.textContent = 'После ремонта';
    afterTab.type = 'button';

    tabs.append(beforeTab, afterTab);

    // Обработчики переключения
    const setActive = (active) => {
      const isBefore = active === 'before';
      beforePic.style.display = isBefore ? 'block' : 'none';
      afterPic.style.display = isBefore ? 'none' : 'block';
      beforeTab.classList.toggle('is-active', isBefore);
      afterTab.classList.toggle('is-active', !isBefore);
    };

    beforeTab.addEventListener('click', () => setActive('before'));
    afterTab.addEventListener('click', () => setActive('after'));

    media.append(slider, tabs);
  } 
  
  else {
    // Только одно фото (обычно "После" или "До")
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
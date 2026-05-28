// js/components/portfolio-modal.js

import { $, $$ } from '../core/dom.js';

const MODAL_ANIMATION_DURATION = 250;

export function initPortfolioModal() {
  const portfolio = $('#portfolio');
  if (!portfolio) return;

  if (portfolio.dataset.portfolioModalInitialized === 'true') return;
  portfolio.dataset.portfolioModalInitialized = 'true';

  const cards = $$('#portfolio .portfolio-card').filter((card) => $('img', card));
  if (!cards.length) return;

  const modal = createModal();

  document.body.appendChild(modal);

  const overlay = $('[data-modal-overlay]', modal);
  const windowEl = $('[data-modal-window]', modal);
  const closeBtn = $('[data-modal-close]', modal);
  const img = $('[data-modal-img]', modal);
  const title = $('[data-modal-title]', modal);
  const cta = $('[data-modal-cta]', modal);

  let closeTimer = null;

  const openModal = (card) => {
    const cardImg = $('img', card);
    const cardTitle = $('.portfolio-card__title', card);
    const cardMeta = $('.portfolio-card__meta', card);

    if (!cardImg) return;

    img.src = cardImg.currentSrc || cardImg.src;
    img.alt = cardImg.alt || '';
    title.textContent = cardTitle?.textContent?.trim() || 'Кейс RemLuxx';

    const description = $('[data-modal-description]', modal);
    description.textContent = cardMeta?.textContent?.trim()
      ? `Детали проекта: ${cardMeta.textContent.trim()}.`
      : 'Детали проекта: площадь, сроки, бюджет и задача будут добавлены после наполнения кейсов.';

    clearTimeout(closeTimer);

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      windowEl.style.opacity = '1';
      windowEl.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    closeBtn.focus();
  };

  const closeModal = () => {
    overlay.style.opacity = '0';
    windowEl.style.opacity = '0';
    windowEl.style.transform = 'translate(-50%, -50%) scale(.96)';

    closeTimer = setTimeout(() => {
      modal.hidden = true;
      document.body.style.overflow = '';
    }, MODAL_ANIMATION_DURATION);
  };

  cards.forEach((card) => {
    card.style.cursor = 'pointer';

    card.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link) return;

      openModal(card);
    });
  });

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  cta.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
}

function createModal() {
  const modal = document.createElement('div');

  modal.hidden = true;
  modal.dataset.portfolioModal = '';

  modal.innerHTML = `
    <div data-modal-overlay style="
      position: fixed;
      inset: 0;
      background: rgba(26,26,26,.85);
      z-index: 2000;
      opacity: 0;
      transition: opacity 250ms ease;
    "></div>

    <div data-modal-window role="dialog" aria-modal="true" aria-labelledby="portfolio-modal-title" style="
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(.96);
      width: min(720px, 92vw);
      max-height: 85vh;
      overflow: auto;
      background: #fff;
      border-radius: 12px;
      z-index: 2001;
      opacity: 0;
      transition: opacity 250ms ease, transform 250ms ease;
    ">
      <button type="button" data-modal-close aria-label="Закрыть" style="
        position: absolute;
        top: 12px;
        right: 12px;
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 50%;
        background: rgba(26,26,26,.7);
        color: #fff;
        cursor: pointer;
        font-size: 24px;
        z-index: 2;
      ">×</button>

      <img data-modal-img alt="" style="
        width: 100%;
        aspect-ratio: 16 / 9;
        object-fit: cover;
        display: block;
      ">

      <div style="padding: 32px;">
        <p style="
          color: #C4963A;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 12px;
          margin: 0;
        ">Кейс RemLuxx</p>

        <h3 id="portfolio-modal-title" data-modal-title style="margin: 8px 0 16px;">
          Фото наших работ
        </h3>

        <p data-modal-description>
          Детали проекта: площадь, сроки, бюджет и задача будут добавлены после наполнения кейсов.
        </p>

        <p>
          <a href="#lead" data-modal-cta style="
            display: inline-block;
            margin-top: 16px;
            padding: 16px 28px;
            background: #C4963A;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
          ">Хочу так же</a>
        </p>
      </div>
    </div>
  `;

  return modal;
}
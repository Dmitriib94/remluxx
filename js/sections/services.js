// js/sections/services.js

import { $, $$ } from '../core/dom.js';

const MODE_WORKS = 'works';
const MODE_FULL  = 'full';


export function initServicesToggle() {
  const toggle = $('[data-services-toggle]');
  const cards  = $$('[data-service-card]');

  if (!toggle || !cards.length) return;

  const buttons = $$('[data-services-mode]', toggle);
  if (!buttons.length) return;

  /**
   * Применяет режим: подсвечивает активную кнопку и переключает
   * видимость соответствующих текстов внутри каждой карточки.
   * @param {'works' | 'full'} mode
   */
  const setMode = (mode) => {
    toggle.dataset.mode = mode;

    // 1. Кнопки переключателя — визуальное и aria-состояние.
    buttons.forEach((button) => {
      const isActive = button.dataset.servicesMode === mode;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    // 2. Тексты внутри карточек — показываем только один вариант.
    cards.forEach((card) => {
      const worksText = $('[data-mode-works]', card);
      const fullText  = $('[data-mode-full]',  card);

      // Если в карточке нет обоих вариантов — пропускаем,
      // чтобы случайно не сломать раскладку.
      if (!worksText || !fullText) return;

      const showFull = mode === MODE_FULL;
      worksText.hidden = showFull;
      fullText.hidden  = !showFull;
    });
  };

  // Клик по любой кнопке переключателя.
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      setMode(button.dataset.servicesMode);
    });
  });

  // Стартовый режим: либо тот, что уже зашит в HTML (is-active),
  // либо «works» по умолчанию. Не вызываем setMode при загрузке,
  // чтобы не перетирать SSR/HTML-состояние без причины — оригинал
  // тоже этого не делал.
}
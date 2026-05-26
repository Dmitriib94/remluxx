import { $, $$ } from '../utils.js';

export function initServicesToggle() {
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
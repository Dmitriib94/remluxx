import { $$, $ } from '../utils.js';

export function initFAQ() {
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
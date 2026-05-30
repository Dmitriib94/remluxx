// js/core/toast.js

import { $ } from './dom.js';

const TOAST_HIDE_DELAY = 2400;

let toastTimer = null;

/**
 * Показывает небольшое всплывающее уведомление в правом нижнем углу.
 *
 * @param {string} text - Текст уведомления.
 */
export function showToast(text) {
  let toast = $('[data-toast]');

  if (!toast) {
    toast = document.createElement('div');
    toast.dataset.toast = '';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

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

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
  }, TOAST_HIDE_DELAY);
}
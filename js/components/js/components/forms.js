import { $, $$ } from '../utils.js';

export function initForms() {
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
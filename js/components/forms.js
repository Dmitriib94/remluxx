// js/components/forms.js
// Инициализация всех форм на странице: live-форматирование телефона,
// валидация при вводе/потере фокуса, обработка submit с отправкой toast.

import { $$ } from '../core/dom.js';
import { showToast } from '../core/toast.js';
import { formatPhone } from '../utils/phone.js';
import {
  validateField,
  validateForm,
  clearFieldStates,
  showFormMessage
} from './form-validation.js';

const MESSAGES = {
  invalid:     'Проверьте заполнение полей',
  download:    'Скачивание началось.',
  submitted:   'Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.',
  toastDownload: 'Скачивание началось',
  toastSubmit:   'Заявка отправлена'
};

/**
 * Навешивает поведение на все `<form>` на странице.
 * Безопасно для повторного вызова — нет глобальных побочных эффектов.
 */
export function initForms() {
  $$('form').forEach(bindForm);
}

/**
 * Подвязка обработчиков к одной форме.
 * @param {HTMLFormElement} form
 */
function bindForm(form) {
  const phoneInputs    = $$('input[type="tel"]', form);
  const requiredInputs = $$('[data-required]',    form);

  // Телефоны: live-форматирование + валидация.
  phoneInputs.forEach((input) => {
    input.addEventListener('input', () => {
      input.value = formatPhone(input.value);
      validateField(input);
    });
    input.addEventListener('blur', () => validateField(input));
  });

  // Остальные required-поля: валидация на ввод и blur.
  // (input[type="tel"] уже подписан выше — здесь его пропускаем, чтобы не дублировать.)
  requiredInputs.forEach((input) => {
    if (input.type !== 'tel') {
      input.addEventListener('input', () => validateField(input));
    }
    input.addEventListener('blur', () => validateField(input));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSubmit(form);
  });
}

/**
 * Обработка отправки формы. Различает форму скачивания PDF
 * (`data-lead-download-form`) и обычную заявку.
 *
 * @param {HTMLFormElement} form
 */
function handleSubmit(form) {
  if (!validateForm(form)) {
    showFormMessage(form, MESSAGES.invalid, true);
    return;
  }

  const isDownloadForm = form.hasAttribute('data-lead-download-form');

  if (isDownloadForm) {
    showFormMessage(form, MESSAGES.download);
    showToast(MESSAGES.toastDownload);
  } else {
    showFormMessage(form, MESSAGES.submitted);
    showToast(MESSAGES.toastSubmit);
  }

  form.reset();
  clearFieldStates(form);
}
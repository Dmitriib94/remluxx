// js/components/form-validation.js
// Валидация полей формы: проверка обязательности и формата телефона,
// отображение ошибок рядом с полем и подсветка невалидных инпутов.

import { $, $$ } from '../core/dom.js';

const PHONE_MIN_DIGITS = 11;

const MESSAGES = {
  required:    'Заполните поле',
  phoneFormat: 'Введите корректный телефон'
};

/**
 * Валидирует одно поле. Подсвечивает его и пишет текст ошибки
 * в соответствующий `[data-error-for="..."]` контейнер, если он есть.
 *
 * @param {HTMLInputElement} input
 * @returns {boolean} true — поле валидно.
 */
export function validateField(input) {
  const name = input.getAttribute('name');
  const form = input.closest('form');
  const errorEl = form && name ? $(`[data-error-for="${name}"]`, form) : null;

  let error = '';

  if (!input.value.trim()) {
    error = MESSAGES.required;
  } else if (input.type === 'tel') {
    const digits = input.value.replace(/\D/g, '');
    if (digits.length < PHONE_MIN_DIGITS) {
      error = MESSAGES.phoneFormat;
    }
  }

  input.classList.toggle('is-invalid', Boolean(error));

  if (errorEl) {
    errorEl.textContent = error;
  }

  return !error;
}

/**
 * Прогоняет все поля с `[data-required]` через `validateField`.
 * Важно: не использует `.every()`, чтобы пройти по ВСЕМ полям
 * и подсветить их разом, а не остановиться на первом ошибочном.
 *
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
export function validateForm(form) {
  const fields = $$('[data-required]', form);
  let isValid = true;

  fields.forEach((field) => {
    if (!validateField(field)) isValid = false;
  });

  return isValid;
}

/**
 * Сбрасывает визуальные состояния валидации после успешной отправки формы:
 * убирает класс `.is-invalid` и очищает тексты ошибок.
 *
 * @param {HTMLFormElement} form
 */
export function clearFieldStates(form) {
  $$('[data-required]', form).forEach((input) => {
    input.classList.remove('is-invalid');
  });

  $$('[data-error-for]', form).forEach((errorEl) => {
    errorEl.textContent = '';
  });
}

/**
 * Показывает текстовое сообщение под формой (успех/ошибка).
 * Создаёт элемент `<p data-form-message>` при первом вызове.
 *
 * @param {HTMLFormElement} form
 * @param {string} text
 * @param {boolean} [isError=false]
 */
export function showFormMessage(form, text, isError = false) {
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
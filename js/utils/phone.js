// js/utils/phone.js

const MAX_DIGITS = 11;

/**
 * Приводит произвольную строку к формату «+7 901 597-68-68».
 * - Оставляет только цифры (макс. 11).
 * - Ведущая «8» нормализуется в «7».
 * - Незаполненные позиции (плейсхолдеры `_`) и висящие дефисы в конце обрезаются,
 *   чтобы поле не показывало «+7 901 597-68-_» при частичном вводе.
 *
 * @param {string} value
 * @returns {string}
 */
export function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, MAX_DIGITS);
  const normalized = digits.startsWith('8') ? `7${digits.slice(1)}` : digits;

  if (!normalized) return '';

  const p = normalized.padEnd(MAX_DIGITS, '_');

  return `+${p[0]} ${p.slice(1, 4)} ${p.slice(4, 7)}-${p.slice(7, 9)}-${p.slice(9, 11)}`
    .replace(/[_-]+$/g, '');
}
// js/core/dom.js
// Общие DOM-утилиты и определение пользовательских предпочтений.

/**
 * Короткий аналог querySelector.
 * @param {string} selector
 * @param {ParentNode} [ctx=document]
 * @returns {Element|null}
 */
export const $ = (selector, ctx = document) => ctx.querySelector(selector);

/**
 * Короткий аналог querySelectorAll, возвращает массив.
 * @param {string} selector
 * @param {ParentNode} [ctx=document]
 * @returns {Element[]}
 */
export const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

/**
 * Флаг: пользователь просит уменьшить анимации.
 * Вычисляется один раз при загрузке модуля.
 */
export const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Удобный хелпер: вызвать callback после DOMContentLoaded
 * (или сразу, если DOM уже готов).
 * @param {() => void} callback
 */
export const onReady = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
};
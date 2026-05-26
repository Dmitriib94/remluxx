export const $ = (selector, ctx = document) => ctx.querySelector(selector);
export const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
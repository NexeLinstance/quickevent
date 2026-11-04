// src/core/sanitize.js
import DOMPurify from 'dompurify';

export function cleanHtml(html) {
  if (typeof html !== 'string') return '';
  return DOMPurify.sanitize(html);
}
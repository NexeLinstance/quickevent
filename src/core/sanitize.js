// src/core/sanitize.js
import DOMPurify from 'dompurify';

export function cleanHtml(html) {
  if (typeof html !== 'string') return '';

  // Use DOMPurify's default configuration.
  // It removes dangerous elements (script, onerror, etc.) but allows safe HTML (form, meta, iframe, etc.).
  return DOMPurify.sanitize(html);
}
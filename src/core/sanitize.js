// src/core/sanitize.js

export function cleanHtml(html) {
  if (typeof html !== 'string') return '';

  // Check for Native Sanitizer API
  if (typeof Element !== 'undefined' && Element.prototype.hasOwnProperty('setHTML')) {
    const temp = document.createElement('div');
    temp.setHTML(html);
    return temp.innerHTML;
  }

  // Fail Secure for older browsers
  console.warn('[QE Security] Your browser does not support the HTML Sanitizer API. HTML content was blocked to prevent XSS.');
  return ''; // Return empty string, blocking the HTML
}
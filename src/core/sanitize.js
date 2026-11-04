// src/core/sanitize.js

export function cleanHtml(html) {
  if (typeof html !== 'string') return '';
  
  // Warning for developers: setHtml is dangerous with user input.
  // Only use it with trusted backend data.
  console.warn(
    '[QE Security] setHtml/appendHtml/prependHtml are dangerous with untrusted input. ' +
    'Only use data from your secure backend (e.g., Vapi). ' +
    'For user-generated content, use setText instead.'
  );
  
  return html;
}
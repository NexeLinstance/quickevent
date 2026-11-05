// src/core/sanitize.js
let purifier = null;

export async function cleanHtml(html) {
  if (typeof html !== 'string') return '';
  
  if (!purifier) {
    // Load DOMPurify from the local file copied to dist
    const mod = await import('../lib/purify.min.js');
    purifier = mod.default || window.DOMPurify;
  }
  
  return purifier.sanitize(html);
}
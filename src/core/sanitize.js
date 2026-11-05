// src/core/sanitize.js
let purifier = null;

export async function cleanHtml(html) {
  if (typeof html !== 'string') return '';

  if (!purifier) {
    console.log('[QE] Loading DOMPurify from ./lib/purify.min.js...');
    try {
      const mod = await import('./lib/purify.min.js');
      console.log('[QE] DOMPurify module loaded:', mod);
      
      purifier = mod.default || window.DOMPurify;
      
      if (!purifier) {
        console.error('[QE] DOMPurify loaded, but no default export or window.DOMPurify found.');
        return html; // Fallback
      }
      
      console.log('[QE] DOMPurify instance ready.');
    } catch (err) {
      console.error('[QE] Failed to load DOMPurify:', err);
      return html; // Fallback
    }
  }

  return purifier.sanitize(html);
}
// src/core/sanitize.js

let purifier = null;

// Start loading DOMPurify immediately when the module is imported.
const purifyPromise = (async () => {
  try {
    const mod = await import('./lib/purify.min.js');
    purifier = mod.default || window.DOMPurify;
    console.log('[QE] DOMPurify loaded and ready.');
    return purifier;
  } catch (err) {
    console.error('[QE] Failed to load DOMPurify:', err);
    return null;
  }
})();

export async function cleanHtml(html) {
  if (typeof html !== 'string') return '';

  if (!purifier) {
    // Wait for the background loading to finish
    await purifyPromise;
  }

  if (!purifier) {
    console.warn('[QE] DOMPurify is not available. HTML inserted without sanitization.');
    return html;
  }

  return purifier.sanitize(html);
}
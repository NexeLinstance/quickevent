// src/core/sanitize.js
let purifier = null;

const purifyPromise = (async () => {
  try {
    const mod = await import('./lib/purify.min.js');
    purifier = mod.default || window.DOMPurify;
    
    purifier.setConfig({
      FORBID_TAGS: ['base', 'style',  'iframe', 'object', 'embed'],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });

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
    await purifyPromise;
  }

  if (!purifier) {
    console.warn('[QE Security] DOMPurify is not available. HTML insertion blocked for safety.');
    return ''; 
  }

  return purifier.sanitize(html);
}
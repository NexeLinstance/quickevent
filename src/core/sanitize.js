// src/core/sanitize.js
let purifier = null;

const PURIFY_CONFIG = {
  FORBID_TAGS: ['base', 'style', 'iframe', 'object', 'embed'],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

const purifyPromise = (async () => {
  try {
    const mod = await import(new URL('./lib/purify.min.js', import.meta.url).href);
    purifier = mod.default || window.DOMPurify;
    console.log('[QE] DOMPurify loaded and ready.');
    return purifier;
  } catch (err) {
    console.error('[QE] Failed to load DOMPurify:', err);
    return null;
  }
})();

export async function cleanHtml(html) {
  if (html == null) return '';
  const str = String(html);

  if (!purifier) {
    await purifyPromise;
  }

  if (!purifier) {
    console.warn('[QE] Security: DOMPurify is not available. HTML insertion blocked for safety.');
    return '';
  }

  return purifier.sanitize(str, PURIFY_CONFIG);
}
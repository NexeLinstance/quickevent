// src/core/attrGuard.js

const NAME_RE = /^[a-zA-Z_][\w:.-]*$/;
const URL_ATTRS = new Set(['href', 'src', 'action', 'formaction', 'xlink:href', 'poster', 'data', 'srcset']);
const BLOCKED_NAMES = new Set(['srcdoc']);

export function checkAttrName(name) {
  if (typeof name !== 'string' || !NAME_RE.test(name)) {
    throw new Error(`invalid attribute name: ${name}`);
  }
  const n = name.toLowerCase();
  
  // Block event handlers (onclick, onerror, etc.)
  if (n.startsWith('on')) {
    throw new Error(`attribute "${name}" is not allowed`);
  }
  
  // Block srcdoc (can inject HTML in iframes)
  if (BLOCKED_NAMES.has(n)) {
    throw new Error(`attribute "${name}" is not allowed`);
  }
  
  return n;
}

export function checkAttrValue(lname, value) {
  const v = value == null ? '' : String(value);
  
  // Check for dangerous URLs
  if (URL_ATTRS.has(lname)) {
    const s = v.replace(/[\u0000-\u0020]/g, '').toLowerCase();
    if (/^(javascript|vbscript|data):/.test(s)) {
      // Allow data:image/* only for src attribute
      if (lname === 'src' && /^data:image\//.test(s)) {
        return v;
      }
      throw new Error(`unsafe URL in "${lname}"`);
    }
  }
  
  return v;
}
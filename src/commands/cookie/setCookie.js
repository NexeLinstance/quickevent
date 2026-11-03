// src/commands/cookie/setCookie.js

const SAMESITE_MAP = { lax: 'Lax', strict: 'Strict', none: 'None' };

function sanitizeToken(val, label) {
  const s = String(val);
  if (!/^[^;,\s\r\n\0]+$/.test(s)) {
    throw new Error(`setCookie: invalid ${label} value "${s}"`);
  }
  return s;
}

export default {
  name: 'setCookie',
  kind: 'effect',
  blocking: false,
  capabilities: ['browser.cookie'],
  schema: ['string', 'string', 'object?'],
  run(ctx, [key, value, options = {}]) {
    const opts = {
      max_age: 0,
      expires: 0,
      path: '/',
      domain: '',
      secure: false,
      samesite: 'lax',
      partitioned: false,
      ...options
    };

    let cookieStr = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

    // Max-Age
    const maxAge = Number(opts.max_age);
    if (Number.isFinite(maxAge) && maxAge > 0) {
      cookieStr += `; Max-Age=${Math.floor(maxAge)}`;
    } 
    // Expires
    else if (opts.expires) {
      let d;
      if (typeof opts.expires === 'number' && Number.isFinite(opts.expires) && opts.expires > 0) {
        d = new Date(Date.now() + opts.expires * 1000);
      } else if (typeof opts.expires === 'string') {
        d = new Date(opts.expires);
      }
      if (d && !isNaN(d)) {
        cookieStr += `; Expires=${d.toUTCString()}`;
      } else {
        throw new Error('setCookie: invalid expires');
      }
    }

    // Path & Domain (Sanitized)
    if (opts.path) cookieStr += `; Path=${sanitizeToken(opts.path, 'path')}`;
    if (opts.domain) cookieStr += `; Domain=${sanitizeToken(opts.domain, 'domain')}`;

    // SameSite
    const ss = SAMESITE_MAP[String(opts.samesite || 'lax').toLowerCase()];
    if (!ss) throw new Error('setCookie: invalid samesite');
    
    // Secure (Forced on HTTPS and for SameSite=None)
    const secure = opts.secure || window.location.protocol === 'https:' || ss === 'None' || opts.partitioned;
    if (secure) cookieStr += '; Secure';
    
    cookieStr += `; SameSite=${ss}`;
    if (opts.partitioned) cookieStr += '; Partitioned';

    document.cookie = cookieStr;
  },
};
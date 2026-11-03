// src/commands/cookie/removeCookie.js

function sanitizeToken(val, label) {
  const s = String(val);
  if (!/^[^;,\s\r\n\0]+$/.test(s)) {
    throw new Error(`removeCookie: invalid ${label} value "${s}"`);
  }
  return s;
}

export default {
  name: 'removeCookie',
  kind: 'effect',
  blocking: false,
  capabilities: ['browser.cookie'],
  schema: ['string?', 'object?'],
  run(ctx, [key, options = {}]) {
    const path = sanitizeToken(options.path || '/', 'path');
    const domain = options.domain ? sanitizeToken(options.domain, 'domain') : '';

    const makeExpired = (cookieName) => {
      let s = `${cookieName}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=${path}`;
      if (domain) s += `; Domain=${domain}`;
      if (window.location.protocol === 'https:') s += '; Secure';
      s += '; SameSite=Lax';
      document.cookie = s;
    };

    if (key) {
      makeExpired(encodeURIComponent(key));
    } else {
      const cookies = document.cookie.split(';');
      for (const c of cookies) {
        const eq = c.indexOf('=');
        const name = (eq > -1 ? c.slice(0, eq) : c).trim();
        if (name) makeExpired(name);
      }
    }
  },
};
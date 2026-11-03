// src/commands/cookie/setCookie.js

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

    if (opts.max_age > 0) {
      cookieStr += `; Max-Age=${opts.max_age}`;
    } else if (opts.expires > 0) {
      if (typeof opts.expires === 'number') {
        const d = new Date();
        d.setTime(d.getTime() + (opts.expires * 1000));
        cookieStr += `; Expires=${d.toUTCString()}`;
      } else if (typeof opts.expires === 'string') {
        cookieStr += `; Expires=${opts.expires}`;
      }
    }

    if (opts.path) cookieStr += `; Path=${opts.path}`;
    if (opts.domain) cookieStr += `; Domain=${opts.domain}`;
    if (opts.secure) cookieStr += '; Secure';
    if (opts.samesite) cookieStr += `; SameSite=${opts.samesite}`;
    if (opts.partitioned) cookieStr += '; Partitioned';

    document.cookie = cookieStr;
  },
};
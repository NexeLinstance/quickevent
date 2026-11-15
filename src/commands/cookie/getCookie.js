// src/commands/cookie/getCookie.js
import { renderTemplate } from '../../expr/template.js';

function getCookieValue(key) {
  const encodedKey = encodeURIComponent(key);
  const cookies = document.cookie.split(';');
  for (const c of cookies) {
    const eq = c.indexOf('=');
    if (eq === -1) continue;
    const name = c.slice(0, eq).trim();
    if (name === encodedKey) {
      return c.slice(eq + 1);
    }
  }
  return null;
}

export default {
  name: 'getCookie',
  kind: 'source',
  capabilities: ['browser.cookie'],
  async resolve(ctx, args) {
    let key, alias, expr;

    if (Array.isArray(args[0])) {
      key = args[0][0];
      alias = args[0][1] || null;
      expr = args[1] || null;
    } else {
      key = args[0];
      alias = args[1] || null;
      expr = args[2] || null;
    }

    if (!key) return undefined;

    const raw = getCookieValue(key);
    const value = raw != null ? decodeURIComponent(raw) : '';

    if (alias) ctx.vars[alias] = value;

    if (expr && typeof expr === 'string' && expr.includes('{')) {
      const result = renderTemplate(expr, ctx.vars);
      if (result.store) ctx.vars[result.store.key] = result.store.value;
      return result.value;
    }

    return value;
  },
};
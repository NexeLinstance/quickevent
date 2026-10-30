// src/commands/cookie/getCookie.js
import { renderTemplate } from '../../expr/template.js';

export default {
  name: 'getCookie',
  kind: 'source',
  capabilities: ['browser.cookie'],
  async resolve(ctx, args) {
    const [key, aliasOrExpr, maybeExpr] = args;

    let alias = null;
    let expr = null;

    if (typeof aliasOrExpr === 'string') {
      if (aliasOrExpr.includes('{')) expr = aliasOrExpr;
      else alias = aliasOrExpr;
    }
    if (typeof maybeExpr === 'string' && maybeExpr.includes('{')) {
      expr = maybeExpr;
    }

    // Read the cookie
    const encodedKey = encodeURIComponent(key);
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${encodedKey}=([^;]*)`)
    );

    if (!match) return undefined;

    const value = decodeURIComponent(match[1]);

    if (alias) ctx.vars[alias] = value;

    if (expr) {
      const result = renderTemplate(expr, ctx.vars);
      if (result.store) ctx.vars[result.store.key] = result.store.value;
      return result.value;
    }

    return value;
  },
};
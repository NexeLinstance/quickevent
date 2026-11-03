// src/commands/cookie/getCookie.js
import { renderTemplate } from '../../expr/template.js';

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

    const encodedKey = encodeURIComponent(key);
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${encodedKey}=([^;]*)`)
    );

    const value = match ? decodeURIComponent(match[1]) : '';

    if (alias) ctx.vars[alias] = value;

    if (expr && typeof expr === 'string' && expr.includes('{')) {
      const result = renderTemplate(expr, ctx.vars);
      if (result.store) ctx.vars[result.store.key] = result.store.value;
      return result.value;
    }

    return value;
  },
};
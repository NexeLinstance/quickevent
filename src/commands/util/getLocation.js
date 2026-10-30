// src/commands/util/getLocation.js
import { renderTemplate } from '../../expr/template.js';

export default {
  name: 'getLocation',
  kind: 'source',
  capabilities: ['browser.location'],
  async resolve(ctx, args) {
    // Supported forms:
    //   ["getLocation", "href"]
    //   ["getLocation", "href", "alias"]
    //   ["getLocation", "href", "alias", "expr"]
    const [key = 'href', aliasOrExpr, maybeExpr] = args;

    let alias = null;
    let expr = null;

    if (typeof aliasOrExpr === 'string') {
      if (aliasOrExpr.includes('{')) expr = aliasOrExpr;
      else alias = aliasOrExpr;
    }
    if (typeof maybeExpr === 'string' && maybeExpr.includes('{')) {
      expr = maybeExpr;
    }

    const value = location[key];
    if (value === undefined) return undefined;

    if (alias) ctx.vars[alias] = value;

    if (expr) {
      const result = renderTemplate(expr, ctx.vars);
      if (result.store) ctx.vars[result.store.key] = result.store.value;
      return result.value;
    }

    return value;
  },
};
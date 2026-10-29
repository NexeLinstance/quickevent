// src/commands/attr/getAttr.js
import { renderTemplate } from '../../expr/template.js';

// Normalize the "key + optional alias" pair from the document:
//   ["getAttr", sel, "key"]
//   ["getAttr", sel, "key", "alias"]
//   ["getAttr", sel, ["key", "alias"]]
//   ["getAttr", sel, ["key", "alias"], "expr"]
//   ["getAttr", sel, "key", "expr"]
function splitKeyAndAlias(spec) {
  if (Array.isArray(spec)) {
    return { key: spec[0], alias: spec[1] ?? null };
  }
  if (typeof spec === 'string') {
    return { key: spec, alias: null };
  }
  return { key: null, alias: null };
}

export default {
  name: 'getAttr',
  kind: 'source',
  capabilities: ['dom.read'],
  // We accept flexible forms, so no schema.
  async resolve(ctx, args) {
    const [selector, spec, maybeExpr] = args;

    const { key, alias: specAlias } = splitKeyAndAlias(spec);
    if (!key) return undefined;

    // Decide which piece is the alias and which is the expression.
    let alias = specAlias;
    let expr = null;

    if (typeof maybeExpr === 'string' && maybeExpr.includes('{')) {
      expr = maybeExpr;
    } else if (typeof maybeExpr === 'string') {
      // maybeExpr is actually an alias (2-string form)
      if (alias == null) alias = maybeExpr;
      else expr = maybeExpr;
    }

    const els = ctx.dom.query(selector);
    if (!els.length) return undefined;

    const values = els
      .map(el => el.getAttribute(key))
      .filter(v => v != null);

    if (!values.length) return undefined;

    const value = values.length === 1 ? values[0] : values;

    if (alias) ctx.vars[alias] = value;

    if (expr) {
      const result = renderTemplate(expr, ctx.vars);
      if (result.store) ctx.vars[result.store.key] = result.store.value;
      return result.value;
    }

    return value;
  },
};
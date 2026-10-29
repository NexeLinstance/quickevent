// src/commands/value/getValue.js
import { renderTemplate } from '../../expr/template.js';

export default {
  name: 'getValue',
  kind: 'source',
  capabilities: ['dom.read'],
  schema: ['selector', 'string?', 'string?'],
  resolve(ctx, [selector, alias, expr]) {
    const els = ctx.dom.query(selector);
    if (!els.length) return undefined;

    const values = els
      .map(el => el.value)
      .filter(v => v != null);

    if (!values.length) return undefined;

    const value = values.length === 1 ? values[0] : values;

    if (alias) ctx.vars[alias] = value;

    if (expr && typeof expr === 'string' && expr.includes('{')) {
      const result = renderTemplate(expr, ctx.vars);
      if (result.store) ctx.vars[result.store.key] = result.store.value;
      return result.value;
    }

    return value;
  },
};
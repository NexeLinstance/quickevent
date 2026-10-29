// src/commands/text/getText.js

export default {
  name: 'getText',
  kind: 'source',
  capabilities: ['dom.read'],
  schema: ['selector', 'string?', 'string?'],
  async resolve(ctx, [selector, alias, expr]) {
    const els = ctx.dom.query(selector);
    if (!els.length) return undefined;

    // Collect text from all matched elements
    const values = els
      .map(el => el.textContent)
      .filter(v => v != null);

    if (!values.length) return undefined;

    const value = values.length === 1 ? values[0] : values;

    // Store as alias
    if (alias) ctx.vars[alias] = value;

    // Apply expression if provided
    if (expr && typeof expr === 'string' && expr.includes('{')) {
      const { renderTemplate } = await import('../../expr/template.js');
      const result = renderTemplate(expr, ctx.vars);
      if (result.store) ctx.vars[result.store.key] = result.store.value;
      return result.value;
    }

    return value;
  },
};
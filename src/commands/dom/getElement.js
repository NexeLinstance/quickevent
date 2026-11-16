// src/commands/dom/getElement.js

export default {
  name: 'getElement',
  kind: 'source',
  capabilities: ['dom.read'],
  schema: ['selector', 'string'],
  resolve(ctx, [selector, alias]) {
    const els = ctx.dom.query(selector);
    if (!els.length) return undefined;

    const value = els.length === 1 ? els[0] : els;

    if (alias) ctx.vars[alias] = value;

    return value;
  },
};
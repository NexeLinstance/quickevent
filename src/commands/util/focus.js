// src/commands/util/focus.js

export default {
  name: 'focus',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.focus'],
  schema: ['selector'],
  run(ctx, [selector]) {
    const el = ctx.dom.query(selector)[0];
    if (el && typeof el.focus === 'function') el.focus();
  },
};
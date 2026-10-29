// src/commands/value/setValue.js

export default {
  name: 'setValue',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'any', 'number?'],
  run(ctx, [selector, value, delay = 0]) {
    return ctx.dom.each(
      selector,
      el => { el.value = value == null ? '' : value; },
      delay
    );
  },
};
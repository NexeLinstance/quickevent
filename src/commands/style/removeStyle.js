// src/commands/style/removeStyle.js

export default {
  name: 'removeStyle',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'number?'],
  run(ctx, [selector, prop, delay = 0]) {
    return ctx.dom.each(
      selector,
      el => { el.style.removeProperty(prop); },
      delay
    );
  },
};
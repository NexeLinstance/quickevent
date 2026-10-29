// src/commands/attr/removeAttr.js

export default {
  name: 'removeAttr',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'number?'],
  run(ctx, [selector, name, delay = 0]) {
    return ctx.dom.each(
      selector,
      el => { el.removeAttribute(name); },
      delay
    );
  },
};
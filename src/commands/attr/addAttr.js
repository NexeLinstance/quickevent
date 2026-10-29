// src/commands/attr/addAttr.js

export default {
  name: 'addAttr',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'any', 'number?'],
  run(ctx, [selector, name, value, delay = 0]) {
    return ctx.dom.each(
      selector,
      el => { el.setAttribute(name, value == null ? '' : String(value)); },
      delay
    );
  },
};
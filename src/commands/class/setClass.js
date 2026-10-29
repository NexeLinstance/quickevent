// src/commands/class/setClass.js

export default {
  name: 'setClass',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'number?'],
  run(ctx, [selector, className, delay = 0]) {
    return ctx.dom.each(
      selector,
      el => { el.className = className ?? ''; },
      delay
    );
  },
};
// src/commands/class/toggleClass.js

export default {
  name: 'toggleClass',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'number?'],
  run(ctx, [selector, className, delay = 0]) {
    if (!className) return;
    return ctx.dom.each(
      selector,
      el => { el.classList.toggle(className); },
      delay
    );
  },
};
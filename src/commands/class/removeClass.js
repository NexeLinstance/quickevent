// src/commands/class/removeClass.js

export default {
  name: 'removeClass',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'number?'],
  run(ctx, [selector, className, delay = 0]) {
    if (!className) return;
    const classes = String(className).split(/\s+/).filter(Boolean);
    if (!classes.length) return;

    return ctx.dom.each(
      selector,
      el => {
        for (const cls of classes) el.classList.remove(cls);
      },
      delay
    );
  },
};
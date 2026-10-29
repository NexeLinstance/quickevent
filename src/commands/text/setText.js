// src/commands/text/setText.js

export default {
  name: 'setText',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'any', 'number?'],
  run(ctx, [selector, text, delay = 0]) {
    return ctx.dom.each(
      selector,
      el => { el.textContent = text == null ? '' : String(text); },
      delay
    );
  },
};
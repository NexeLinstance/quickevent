// src/commands/text/appendText.js

export default {
  name: 'appendText',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'any', 'number?'],
  run(ctx, [selector, text, delay = 0]) {
    return ctx.dom.each(
      selector,
      el => { el.insertAdjacentText('beforeend', text == null ? '' : String(text)); },
      delay
    );
  },
};
// src/commands/text/prependText.js

export default {
  name: 'prependText',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'any', 'number?'],
  run(ctx, [selector, text, delay = 0]) {
    return ctx.dom.each(
      selector,
      el => { el.insertAdjacentText('afterbegin', text == null ? '' : String(text)); },
      delay
    );
  },
};
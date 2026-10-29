// src/commands/html/prependHtml.js

export default {
  name: 'prependHtml',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write', 'dom.unsafeHtml'],
  schema: ['selector', 'any', 'number?'],
  run(ctx, [selector, html, delay = 0]) {
    return ctx.dom.each(
      selector,
      el => { el.insertAdjacentHTML('afterbegin', html == null ? '' : String(html)); },
      delay
    );
  },
};
// src/commands/html/appendHtml.js

export default {
  name: 'appendHtml',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write', 'dom.unsafeHtml'],
  schema: ['selector', 'any', 'number?'],
  run(ctx, [selector, html, delay = 0]) {
    return ctx.dom.each(
      selector,
      el => { el.insertAdjacentHTML('beforeend', html == null ? '' : String(html)); },
      delay
    );
  },
};
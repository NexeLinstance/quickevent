// src/commands/html/setHtml.js

export default {
  name: 'setHtml',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write', 'dom.unsafeHtml'],
  schema: ['selector', 'any', 'number?'],
  run(ctx, [selector, html, delay = 0]) {
    return ctx.dom.each(
      selector,
      el => { el.innerHTML = html == null ? '' : String(html); },
      delay
    );
  },
};
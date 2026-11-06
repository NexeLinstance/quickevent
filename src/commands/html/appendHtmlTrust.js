// src/commands/html/appendHtmlTrust.js

export default {
  name: 'appendHtmlTrust',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write', 'dom.unsafeHtml'],
  schema: ['selector', 'any', 'number?'],
  async run(ctx, [selector, html, delay = 0]) {
    const rawHtml = html == null ? '' : String(html);
    return ctx.dom.each(
      selector,
      el => { el.insertAdjacentHTML('beforeend', rawHtml); },
      delay
    );
  },
};
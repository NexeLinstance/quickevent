// src/commands/html/prependHtml.js
import { cleanHtml } from '../../core/sanitize.js';

export default {
  name: 'prependHtml',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write', 'dom.unsafeHtml'],
  schema: ['selector', 'any', 'number?'],
  async run(ctx, [selector, html, delay = 0]) { 
    const safeHtml = await cleanHtml(html);
    return ctx.dom.each(
      selector,
      el => { el.insertAdjacentHTML('afterbegin', safeHtml); },
      delay
    );
  },
};
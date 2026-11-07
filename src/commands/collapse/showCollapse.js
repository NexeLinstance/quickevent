// src/commands/collapse/showCollapse.js
import { animateCollapse, ensureWrapper } from './helper.js';

export default {
  name: 'showCollapse',
  kind: 'effect',
  capabilities: ['dom.write', 'dom.animate'],
  schema: ['selector', 'number?', 'number?'],
  run(ctx, [selector, delay = 0, duration = 300]) {
    const els = ctx.dom.query(selector);
    els.forEach(el => {
      const details = el.tagName === 'DETAILS' ? el : el.closest('details');
      if (details) {
        ensureWrapper(details);
        setTimeout(() => animateCollapse(details, 'open', duration), delay);
      }
    });
  },
};
// src/commands/collapse/collapse.js
import { animateCollapse, ensureWrapper } from './helper.js';

export default {
  name: 'collapse',
  kind: 'effect',
  capabilities: ['dom.write', 'dom.animate'],
  schema: ['number?', 'number?'],
  run(ctx, [delay = 0, duration = 300]) {
    const target = ctx.element;
    const details = target.tagName === 'DETAILS' ? target : target.closest('details');
    if (!details) return;

    ensureWrapper(details);

    setTimeout(() => {
      animateCollapse(details, 'toggle', duration);
    }, delay);
  },
};
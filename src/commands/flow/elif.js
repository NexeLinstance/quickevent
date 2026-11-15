// src/commands/flow/elif.js
import { buildCondition } from './if.js';

export default {
  name: 'elif',
  kind: 'flow',
  schema: ['any', 'array'],
  async run(ctx, [conditions, body], { runBody }) {
    const frame = ctx.ifStack[ctx.ifStack.length - 1];
    if (!frame || !frame.active) {
      throw { code: 'E020' };
    }
    if (frame.ran) return;

    const ok = buildCondition(conditions, ctx);
    if (ok) {
      frame.ran = true;
      await runBody(body);
    }
  },
};
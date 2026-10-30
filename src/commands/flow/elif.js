// src/commands/flow/elif.js
import { buildCondition } from './if.js';

export default {
  name: 'elif',
  kind: 'flow',
  schema: ['any', 'array'],
  async run(ctx, [conditions, body], { runBody }) {
    if (!ctx.branch || !ctx.branch.active) {
      throw { code: 'E020' };
    }
    if (ctx.branch.ran) return;

    const ok = buildCondition(conditions, ctx);
    if (ok) {
      ctx.branch.ran = true;
      await runBody(body);
    }
  },
};
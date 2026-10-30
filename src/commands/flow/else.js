// src/commands/flow/else.js

export default {
  name: 'else',
  kind: 'flow',
  schema: ['array'],
  async run(ctx, [body], { runBody }) {
    if (!ctx.branch || !ctx.branch.active) {
      throw { code: 'E021' };
    }
    if (ctx.branch.ran) {
      // Mark chain as done
      ctx.branch.active = false;
      return;
    }

    await runBody(body);
    ctx.branch.active = false;
  },
};
// src/commands/ajax/ajaxSuccess.js
export default {
  name: 'ajaxSuccess',
  kind: 'flow',
  blocking: true,
  schema: ['array'],
  async run(ctx, [body], { runBody }) {
    if (ctx.pendingAjax) {
      await ctx.pendingAjax;
      ctx.pendingAjax = null;
    }
    if (ctx.ok) {
      await runBody(body);
    }
  },
};
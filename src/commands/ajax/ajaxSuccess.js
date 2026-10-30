// src/commands/ajax/ajaxSuccess.js

export default {
  name: 'ajaxSuccess',
  kind: 'flow',
  schema: ['array'],
  async run(ctx, [body], { runBody }) {
    if (ctx.ok) {
      await runBody(body);
    }
  },
};
// src/commands/flow/else.js

export default {
  name: 'else',
  kind: 'flow',
  schema: ['array'],
  async run(ctx, [body], { runBody }) {
    const frame = ctx.ifStack[ctx.ifStack.length - 1];
    if (!frame || !frame.active) {
      throw { code: 'E021' };
    }

    if (!frame.ran) {
      await runBody(body);
    }
    frame.active = false;
  },
};
// src/commands/util/wait.js

export default {
  name: 'wait',
  kind: 'flow',
  schema: ['number'],
  async run(ctx, [ms]) {
    await new Promise(r => setTimeout(r, ms));
  },
};
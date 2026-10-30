// src/commands/util/log.js

export default {
  name: 'log',
  kind: 'effect',
  blocking: false,
  schema: ['any'],
  run(ctx, [value]) {
    console.log('[QE log]', value);
  },
};
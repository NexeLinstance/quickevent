// src/commands/util/scrollTo.js

export default {
  name: 'scrollTo',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.scroll'],
  schema: ['any'],
  run(ctx, [target]) {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
      return;
    }
    const el = ctx.dom.query(target)[0];
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },
};
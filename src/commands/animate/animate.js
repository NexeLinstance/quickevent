// src/commands/animate/animate.js

export default {
  name: 'animate',
  kind: 'effect',
  blocking: false,  // async by default; use then to wait
  capabilities: ['dom.animate'],
  schema: ['selector', 'object', 'number?', 'number?', 'string?'],
  async run(ctx, [selector, css, delay = 0, duration = 300, ease = 'ease']) {
    const els = ctx.dom.query(selector);
    if (!els.length) return;

    const promises = els.map(el => {
      const anim = el.animate(
        [{}, css],
        {
          delay: Number(delay) || 0,
          duration: Number(duration) || 300,
          easing: ease || 'ease',
          fill: 'forwards',
        }
      );
      return anim.finished.catch(() => {});
    });

    await Promise.all(promises);
  },
};
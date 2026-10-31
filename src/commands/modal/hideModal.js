// src/commands/modal/hideModal.js

const ANIMATIONS = {
  fade: { out: [{ opacity: 1 }, { opacity: 0 }] },
  zoom: { out: [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.8)' }] },
  slideDown: { out: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-60px)' }] },
  slideUp: { out: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(60px)' }] },
  none: { out: null }
};

export default {
  name: 'hideModal',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.modal'],
  schema: ['selector', 'number?', 'number?', 'string?'],
  run(ctx, [selector, delay = 0, duration = 300, type = 'fade']) {
    const els = ctx.dom.query(selector);
    els.forEach((el) => {
      if (!(el instanceof HTMLDialogElement) || !el.open) return;

      const preset = ANIMATIONS[type] || ANIMATIONS.none;
      if (!preset.out || duration === 0) {
        el.close();
        return;
      }

      const anim = el.animate(preset.out, {
        duration,
        delay,
        easing: 'ease',
        fill: 'forwards'
      });

      anim.finished.then(() => {
        el.close();
        el.getAnimations().forEach(a => a.cancel());
      });
    });
  },
};
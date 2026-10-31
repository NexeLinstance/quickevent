// src/commands/dialog/hideDialog.js

const dismissControllers = new WeakMap();

export default {
  name: 'hideDialog',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.dialog'],
  schema: ['selector', 'number?', 'number?'],
  run(ctx, [selector, delay = 0, duration = 300]) {
    const els = ctx.dom.query(selector);
    els.forEach((el) => {
      if (!el.open) return;

      const ctrl = dismissControllers.get(el);
      if (ctrl) { ctrl.abort(); dismissControllers.delete(el); }

      const doHide = () => {
        el.getAnimations().forEach(a => a.cancel());

        el.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration,
          delay,
          fill: 'forwards',
          easing: 'ease',
        }).finished.then(() => {
          if (el.open) el.close();
          el.getAnimations().forEach((a) => a.cancel());
        });
      };

      if (delay > 0) setTimeout(doHide, delay);
      else doHide();
    });
  },
};
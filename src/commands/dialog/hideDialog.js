// src/commands/dialog/hideDialog.js

export default {
  name: 'hideDialog',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.dialog'],
  schema: ['selector', 'number?', 'number?'],
  run(ctx, [selector, delay = 0, duration = 300]) {
    const dialog = ctx.dom.query(selector)[0];
    if (!dialog) return;

    const doHide = () => {
      if (duration > 0) {
        const anim = dialog.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration,
          fill: 'forwards',
          easing: 'ease',
        });
        anim.finished.then(() => {
          if (dialog.open) dialog.close();
          dialog.getAnimations().forEach((a) => a.cancel());
        });
      } else {
        if (dialog.open) dialog.close();
      }

      if (dialog._qeClickHandler) {
        document.removeEventListener('click', dialog._qeClickHandler);
        delete dialog._qeClickHandler;
      }
    };

    return new Promise((resolve) => {
      if (delay > 0) setTimeout(() => { doHide(); resolve(); }, delay);
      else { doHide(); resolve(); }
    });
  },
};
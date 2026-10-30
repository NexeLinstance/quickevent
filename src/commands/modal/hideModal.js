// src/commands/modal/hideModal.js

export default {
  name: 'hideModal',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.modal'],
  schema: ['selector', 'number?', 'number?'],
  run(ctx, [selector, delay = 0, duration = 300]) {
    const modal = ctx.dom.query(selector)[0];
    if (!modal || !(modal instanceof HTMLDialogElement) || !modal.open) return;

    const doHide = () => {
      if (duration > 0) {
        // Fade out content
        const anim = modal.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration,
          fill: 'forwards',
        });

        // Fade out backdrop (assumes the default or previously set style)
        modal.animate(
          [
            { backgroundColor: 'rgba(0,0,0,0.5)' }, // fallback baseline
            { backgroundColor: 'transparent' }
          ],
          {
            pseudoElement: '::backdrop',
            duration,
            fill: 'forwards'
          }
        );

        anim.finished.then(() => {
          if (modal.open) modal.close();
          modal.getAnimations().forEach((a) => a.cancel());
        });
      } else {
        if (modal.open) modal.close();
      }
    };

    return new Promise((resolve) => {
      if (delay > 0) setTimeout(() => { doHide(); resolve(); }, delay);
      else { doHide(); resolve(); }
    });
  },
};
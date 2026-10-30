// src/commands/modal/showModal.js

const MODAL_RESET_STYLES = {
  position: 'fixed',
  margin: '0',
  padding: '0',
  border: 'none',
  background: 'transparent',
  overflow: 'visible',
  maxWidth: 'none',
  maxHeight: 'none',
  inset: '0',
};

function applyResetStyles(modal) {
  const anim = modal.animate([{}, MODAL_RESET_STYLES], {
    duration: 0,
    fill: 'forwards',
  });
  anim.finished.catch(() => {});
}

export default {
  name: 'showModal',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.modal'],
  schema: ['selector', 'object?', 'boolean?', 'number?', 'number?'],
  run(ctx, [selector, backdropStyle = {}, autoHide = true, delay = 0, duration = 300]) {
    const modal = ctx.dom.query(selector)[0];
    if (!modal || !(modal instanceof HTMLDialogElement)) {
      throw new Error(`showModal: "${selector}" is not a <dialog>`);
    }
    if (modal.open) return;

    // Reset the dialog's own styles
    applyResetStyles(modal);

    const bg = backdropStyle.backgroundColor ?? 'rgba(0,0,0,0.5)';
    const filter = backdropStyle.filter ?? 'none';

    const doShow = () => {
      modal.showModal();

      // Style ::backdrop using Web Animations API
      modal.animate(
        [
          { backgroundColor: 'transparent', backdropFilter: 'none' },
          { backgroundColor: bg, backdropFilter: filter }
        ],
        {
          pseudoElement: '::backdrop',
          duration: 0, // Apply instantly
          fill: 'forwards'
        }
      );

      // Fade-in the modal content
      if (duration > 0) {
        modal.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration,
          fill: 'forwards',
          easing: 'ease',
        });
      }

      // Auto-hide
      if (autoHide) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) hideModal(modal, duration);
        });
        modal.oncancel = () => hideModal(modal, duration);
      } else {
        modal.oncancel = (e) => e.preventDefault();
      }
    };

    return new Promise((resolve) => {
      if (delay > 0) setTimeout(() => { doShow(); resolve(); }, delay);
      else { doShow(); resolve(); }
    });

    function hideModal(dlg, dur) {
      if (dur > 0) {
        // Fade out content
        const anim = dlg.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: dur,
          fill: 'forwards',
        });
        
        // Fade out backdrop
        dlg.animate(
          [
            { backgroundColor: bg, backdropFilter: filter },
            { backgroundColor: 'transparent', backdropFilter: 'none' }
          ],
          {
            pseudoElement: '::backdrop',
            duration: dur,
            fill: 'forwards'
          }
        );

        anim.finished.then(() => {
          if (dlg.open) dlg.close();
          dlg.getAnimations().forEach((a) => a.cancel());
        });
      } else {
        if (dlg.open) dlg.close();
      }
    }
  },
};
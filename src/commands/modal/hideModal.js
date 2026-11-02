import {
  getModalState,
  setModalState,
  cleanupModalListeners
} from './showModal.js';

export default {
  name: 'hideModal',
  kind: 'effect',
  capabilities: ['dom.dialog'],
  schema: ['string', 'number?', 'number?', 'string?'],
  run(ctx, [
    target,
    delay = 0,
    duration = 300,
    type = 'fade'
  ]) {
    const dialog = ctx.dom.query(target)[0];
    if (!dialog || !(dialog instanceof HTMLDialogElement) || !dialog.open) return;

    if (getModalState(dialog) === 'closing') return;

    const animDuration = type === 'none' ? 0 : Number(duration) || 300;
    const animDelay = Number(delay) || 0;

    cleanupModalListeners(dialog);

    const finalize = () => {
      setModalState(dialog, 'idle');
      dialog.getAnimations().forEach(a => {
        if (a.id === 'modal-fade' || a.id === 'modal-backdrop' || a.id === 'modal-reset') {
          a.cancel();
        }
      });
      if (dialog.open) {
        dialog.close();
      }
    };

    if (animDuration === 0) {
      finalize();
      return;
    }

    setModalState(dialog, 'closing');

    const currentOpacity = parseFloat(window.getComputedStyle(dialog).opacity) || 1;

    dialog.getAnimations().forEach(anim => {
      if (anim.id === 'modal-fade' || anim.id === 'modal-backdrop') {
        anim.cancel();
      }
    });

    const dialogAnim = dialog.animate(
      [
        { opacity: currentOpacity },
        { opacity: 0 }
      ],
      {
        id: 'modal-fade',
        duration: animDuration,
        delay: animDelay,
        fill: 'forwards',
        easing: 'ease-in'
      }
    );

    const backdropAnim = dialog.animate(
      [
        { opacity: currentOpacity },
        { opacity: 0 }
      ],
      {
        id: 'modal-backdrop',
        pseudoElement: '::backdrop',
        duration: animDuration,
        delay: animDelay,
        fill: 'forwards',
        easing: 'ease-in'
      }
    );

    Promise.all([dialogAnim.finished, backdropAnim.finished])
      .then(finalize)
      .catch(() => {});
  }
};

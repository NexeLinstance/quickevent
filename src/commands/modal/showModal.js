import hideModalEffect from './hideModal.js';

const modalStates = new WeakMap();
const modalListeners = new WeakMap();

export function getModalState(dialog) {
  return modalStates.get(dialog) || 'idle';
}

export function setModalState(dialog, state) {
  if (state) modalStates.set(dialog, state);
  else modalStates.delete(dialog);
}

export function applyModalBaseReset(dialog) {
  dialog.animate(
    [
      {
        padding: '0px',
        borderWidth: '0px',
        background: 'transparent',
        maxWidth: 'none',
        maxHeight: 'none',
        width: 'fit-content',
        height: 'fit-content'
      }
    ],
    {
      id: 'modal-reset',
      duration: 0,
      fill: 'forwards'
    }
  );
}

export function cleanupModalListeners(dialog) {
  const listeners = modalListeners.get(dialog);
  if (listeners) {
    dialog.removeEventListener('click', listeners.onClick);
    dialog.removeEventListener('cancel', listeners.onCancel);
    modalListeners.delete(dialog);
  }
}

export default {
  name: 'showModal',
  kind: 'effect',
  capabilities: ['dom.dialog'],
  schema: ['string', 'object?', 'boolean?', 'number?', 'number?', 'string?'],
  run(ctx, [
    target,
    backdropStyle = {},
    autoHide = true,
    delay = 0,
    duration = 300,
    type = 'fade'
  ]) {
    const dialog = ctx.dom.query(target)[0];
    if (!dialog || !(dialog instanceof HTMLDialogElement)) {
      throw new Error(`showModal: "${target}" not found`);
    }

    const currentState = getModalState(dialog);
    if (dialog.open && currentState === 'open') return;

    const animDuration = type === 'none' ? 0 : Number(duration) || 300;
    const animDelay = Number(delay) || 0;

    const bg = backdropStyle.backgroundColor || 'rgba(0, 0, 0, 0.5)';
    const filter = backdropStyle.backdropFilter || backdropStyle.filter || 'none';

    let startOpacity = 0;
    if (currentState === 'closing') {
      const computed = window.getComputedStyle(dialog);
      startOpacity = parseFloat(computed.opacity) || 0;
    }

    dialog.getAnimations().forEach(anim => {
      if (anim.id === 'modal-fade' || anim.id === 'modal-backdrop') {
        anim.cancel();
      }
    });

    if (!dialog.open) {
      dialog.showModal();
    }

    applyModalBaseReset(dialog);
    setModalState(dialog, 'opening');

    if (animDuration === 0) {
      setModalState(dialog, 'open');
    } else {
      dialog.animate(
        [
          { opacity: startOpacity },
          { opacity: 1 }
        ],
        {
          id: 'modal-fade',
          duration: animDuration,
          delay: animDelay,
          fill: 'forwards',
          easing: 'ease-out'
        }
      );

      const backdropAnim = dialog.animate(
        [
          { opacity: startOpacity, backgroundColor: bg, backdropFilter: filter },
          { opacity: 1, backgroundColor: bg, backdropFilter: filter }
        ],
        {
          id: 'modal-backdrop',
          pseudoElement: '::backdrop',
          duration: animDuration,
          delay: animDelay,
          fill: 'forwards',
          easing: 'ease-out'
        }
      );

      backdropAnim.finished.then(() => {
        if (getModalState(dialog) === 'opening') {
          setModalState(dialog, 'open');
        }
      }).catch(() => {});
    }

    cleanupModalListeners(dialog);

    const onClick = (e) => {
      if (e.target === dialog && autoHide) {
        hideModalEffect.run(ctx, [target, 0, duration, type]);
      }
    };

    const onCancel = (e) => {
      e.preventDefault();
      if (autoHide) {
        hideModalEffect.run(ctx, [target, 0, duration, type]);
      }
    };

    dialog.addEventListener('click', onClick);
    dialog.addEventListener('cancel', onCancel);
    modalListeners.set(dialog, { onClick, onCancel });
  }
};

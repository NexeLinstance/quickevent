// modalHelper.js

export const MODAL_PRESETS = {
  fade: {
    dialog: [{ opacity: 0 }, { opacity: 1 }],
    backdrop: [{ opacity: 0 }, { opacity: 1 }]
  },
  zoom: {
    dialog: [
      { opacity: 0, transform: 'scale(0.85)' },
      { opacity: 1, transform: 'scale(1)' }
    ],
    backdrop: [{ opacity: 0 }, { opacity: 1 }]
  },
  slideDown: {
    dialog: [
      { opacity: 0, transform: 'translateY(-30px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    backdrop: [{ opacity: 0 }, { opacity: 1 }]
  },
  slideUp: {
    dialog: [
      { opacity: 0, transform: 'translateY(30px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    backdrop: [{ opacity: 0 }, { opacity: 1 }]
  },
  none: {
    dialog: [{ opacity: 1 }, { opacity: 1 }],
    backdrop: [{ opacity: 1 }, { opacity: 1 }]
  }
};

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
  dialog.animate([
    {
      margin: 'auto',
      borderWidth: '0px',
      padding: '0px',
      inset: '0px'
    }
  ], {
    id: 'modal-reset',
    duration: 0,
    fill: 'forwards'
  });
}

export function cancelActiveAnimations(dialog) {
  const active = dialog.__activeAnimations || [];
  active.forEach(anim => {
    try { anim.cancel(); } catch (_) {}
  });
  dialog.__activeAnimations = [];
}


export function animateModal(dialog, keyframesObj, options, onFinish) {
  cancelActiveAnimations(dialog);

  const opts = {
    fill: 'forwards',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    ...options
  };

  const dialogAnim = dialog.animate(keyframesObj.dialog, opts);
  const backdropAnim = dialog.animate(keyframesObj.backdrop, {
    ...opts,
    pseudoElement: '::backdrop'
  });

  dialog.__activeAnimations = [dialogAnim, backdropAnim];

  Promise.all([dialogAnim.finished, backdropAnim.finished])
    .then(() => {
      dialog.__activeAnimations = [];
      if (onFinish) onFinish();
    })
    .catch(() => {
      
    });

  return { dialogAnim, backdropAnim };
}


export function setupModalDismiss(dialog, hideCallback) {
  cleanupModalDismiss(dialog);

  const onPointerDown = (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInside = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
    if (!isInside) {
      e.preventDefault();
      hideCallback();
    }
  };

  const onCancel = (e) => {
    e.preventDefault();
    hideCallback();
  };

  dialog.addEventListener('pointerdown', onPointerDown);
  dialog.addEventListener('cancel', onCancel);

  modalListeners.set(dialog, { onPointerDown, onCancel });
}

export function cleanupModalDismiss(dialog) {
  const listeners = modalListeners.get(dialog);
  if (listeners) {
    dialog.removeEventListener('pointerdown', listeners.onPointerDown);
    dialog.removeEventListener('cancel', listeners.onCancel);
    modalListeners.delete(dialog);
  }
}

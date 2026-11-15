// src/commands/modal/hideModal.js
import { closeModal } from './modalHelper.js';

function unbindAutoHide(el) {
  if (el.__qeClickHandler) {
    el.removeEventListener('click', el.__qeClickHandler);
    delete el.__qeClickHandler;
  }
  if (el.__qeCancelHandler) {
    el.removeEventListener('cancel', el.__qeCancelHandler);
    delete el.__qeCancelHandler;
  }
}

export default {
  name: 'hideModal',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.modal'],
  schema: ['selector', 'number?', 'number?', 'string?'],
  run(ctx, [selector, delay = 0, duration = 300, type = 'fade']) {
    const els = ctx.dom.query(selector);
    els.forEach((el) => {
      // Debounce: ignore if an animation is currently running.
      if (el._qeAnimating) return;

      unbindAutoHide(el);
      closeModal(el, delay, duration, type);
    });
  },
};
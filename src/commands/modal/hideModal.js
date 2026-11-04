// src/commands/modal/hideModal.js
import { closeModal } from './modalHelper.js';

export default {
  name: 'hideModal',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.modal'],
  schema: ['selector', 'number?', 'number?', 'string?'],
  run(ctx, [selector, delay = 0, duration = 300, type = 'fade']) {
    const els = ctx.dom.query(selector);
    els.forEach((el) => {
      closeModal(el, delay, duration, type);
    });
  },
};
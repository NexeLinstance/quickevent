// src/commands/modal/showModal.js
import { ANIMATIONS, applyReset, getState, setState, animateBackdrop, closeModal } from './modalHelper.js';

export default {
  name: 'showModal',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.modal'],
  schema: ['selector', 'object?', 'boolean?', 'number?', 'number?', 'string?'],
  run(ctx, [selector, backdropStyle = {}, autoHide = true, delay = 0, duration = 300, type = 'fade']) {
    const els = ctx.dom.query(selector);
    if (!els.length) throw new Error(`showModal: "${selector}" not found`);

    els.forEach((el) => {
      if (!(el instanceof HTMLDialogElement)) return;

      const state = getState(el);
      if (state === 'opening' || (el.open && state === 'open')) return;

      const bg = backdropStyle.backgroundColor ?? 'rgba(0,0,0,0.5)';
      const filter = backdropStyle.filter ?? 'none';
      el._qeBackdropStyle = { bg, filter };

      const preset = ANIMATIONS[type] || ANIMATIONS.none;

      if (state === 'closing') {
        setState(el, 'opening');
        if (el._qeFadeAnim) el._qeFadeAnim.cancel();
        if (el._qeBackdropAnim) el._qeBackdropAnim.cancel();

        if (preset.in) {
          el._qeFadeAnim = el.animate([{}, preset.in[1]], { duration, delay, fill: 'forwards', easing: 'ease' });
        }
        el._qeBackdropAnim = el.animate([{ opacity: 0 }, { opacity: 1 }], { pseudoElement: '::backdrop', duration, delay, fill: 'forwards', easing: 'ease' });

        Promise.all([
          el._qeFadeAnim ? el._qeFadeAnim.finished : Promise.resolve(),
          el._qeBackdropAnim.finished
        ]).then(() => {
          if (getState(el) === 'opening') setState(el, 'open');
        }).catch(() => {});
        return;
      }

      applyReset(el);
      el.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 0, fill: 'forwards' });
      if (!el.open) el.showModal();
      setState(el, 'opening');

      el._qeBackdropAnim = el.animate(
        [{ backgroundColor: bg, backdropFilter: filter, opacity: 0 }, { backgroundColor: bg, backdropFilter: filter, opacity: 1 }],
        { pseudoElement: '::backdrop', duration, delay, fill: 'forwards', easing: 'ease' }
      );

      if (preset.in) {
        el._qeFadeAnim = el.animate(preset.in, { duration, delay, fill: 'forwards', easing: 'ease' });
      }

      Promise.all([
        el._qeFadeAnim ? el._qeFadeAnim.finished : Promise.resolve(),
        el._qeBackdropAnim.finished
      ]).then(() => {
        if (getState(el) === 'opening') setState(el, 'open');
      }).catch(() => {});

      if (autoHide) {
        el.addEventListener('click', function handler(e) {
          if (e.target === el) {
            closeModal(el, 0, duration, type);
          }
        });
        el.addEventListener('cancel', function cancelHandler(e) {
          e.preventDefault();
          closeModal(el, 0, duration, type);
        });
      } else {
        el.addEventListener('cancel', (e) => e.preventDefault());
      }
    });
  },
};
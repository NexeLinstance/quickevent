// src/commands/modal/modalHelper.js

const ANIMATIONS = {
  fade: {
    in: [{ opacity: 0 }, { opacity: 1 }],
    out: [{ opacity: 0 }]
  },
  zoom: {
    in: [{ opacity: 0, transform: 'scale(0.8)' }, { opacity: 1, transform: 'scale(1)' }],
    out: [{ opacity: 0, transform: 'scale(0.8)' }]
  },
  slideDown: {
    in: [{ opacity: 0, transform: 'translateY(-60px)' }, { opacity: 1, transform: 'translateY(0)' }],
    out: [{ opacity: 0, transform: 'translateY(-60px)' }]
  },
  slideUp: {
    in: [{ opacity: 0, transform: 'translateY(60px)' }, { opacity: 1, transform: 'translateY(0)' }],
    out: [{ opacity: 0, transform: 'translateY(60px)' }]
  },
  none: {
    in: null,
    out: null
  }
};

const RESET_STYLES = {
  backgroundColor: 'transparent',
  border: 'none',
  boxShadow: 'none',
};

function applyReset(el) {
  el.animate([{}, RESET_STYLES], { duration: 0, fill: 'forwards' });
}

function getState(el) {
  return el.dataset.modalState || 'idle';
}

function setState(el, state) {
  el.dataset.modalState = state;
}

function animateBackdrop(el, toOpacity, duration, delay, bg, filter) {
  el.animate(
    [
      { backgroundColor: bg, backdropFilter: filter, opacity: toOpacity === 1 ? 0 : 1 },
      { backgroundColor: bg, backdropFilter: filter, opacity: toOpacity }
    ],
    { pseudoElement: '::backdrop', duration, delay, fill: 'forwards', easing: 'ease' }
  );
}

function closeModal(el, delay = 0, duration = 300, type = 'fade') {
  if (!(el instanceof HTMLDialogElement) || !el.open) return;
  const state = getState(el);
  if (state === 'closing') return;

  const preset = ANIMATIONS[type] || ANIMATIONS.none;
  const { bg = 'rgba(0,0,0,0.5)', filter = 'none' } = el._qeBackdropStyle || {};

  setState(el, 'closing');
  if (el._qeFadeAnim) el._qeFadeAnim.cancel();
  if (el._qeBackdropAnim) el._qeBackdropAnim.cancel();

  if (!preset.out || duration === 0) {
    if (el.open) el.close();
    setState(el, 'idle');
    el.getAnimations().forEach(a => a.cancel());
    return;
  }

  el._qeBackdropAnim = el.animate(
    [{ backgroundColor: bg, backdropFilter: filter, opacity: 1 }, { backgroundColor: bg, backdropFilter: filter, opacity: 0 }],
    { pseudoElement: '::backdrop', duration, delay, fill: 'forwards', easing: 'ease' }
  );

  el._qeFadeAnim = el.animate([{}, preset.out[0]], { duration, delay, fill: 'forwards', easing: 'ease' });

  Promise.all([
    el._qeFadeAnim.finished,
    el._qeBackdropAnim.finished
  ]).then(() => {
    if (getState(el) === 'closing') {
      if (el.open) el.close();
      setState(el, 'idle');
      el.getAnimations().forEach(a => a.cancel());
    }
  }).catch(() => {});
}

export { ANIMATIONS, applyReset, getState, setState, animateBackdrop, closeModal };
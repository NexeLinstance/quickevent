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
    in: [{ opacity: 0, transform: 'translateY(-40px)' }, { opacity: 1, transform: 'translateY(0)' }],
    out: [{ opacity: 0, transform: 'translateY(-40px)' }]
  },
  slideUp: {
    in: [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'translateY(0)' }],
    out: [{ opacity: 0, transform: 'translateY(40px)' }]
  },
    slideLeft: {
    in: [{ opacity: 0, transform: 'translateX(40px)' }, { opacity: 1, transform: 'translateY(0)' }],
    out: [{ opacity: 0, transform: 'translateX(40px)' }]
  },
      slideRight: {
    in: [{ opacity: 0, transform: 'translateX(-40px)' }, { opacity: 1, transform: 'translateY(0)' }],
    out: [{ opacity: 0, transform: 'translateX(-40px)' }]
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

function getCurrentOpacity(el) {
  return parseFloat(getComputedStyle(el).opacity) || 0;
}

function getCurrentBackdropOpacity(el) {
  if (!el._qeBackdropAnim) return 1;
  const progress = el._qeBackdropAnim.effect.getComputedTiming().progress;
  if (progress == null) return 1;
  return 1 - progress;
}

function closeModal(el, delay = 0, duration = 300, type = 'fade') {
  if (!(el instanceof HTMLDialogElement) || !el.open) return;

  // Debounce: ignore if already closing or animating.
  if (el._qeAnimating && getState(el) === 'closing') return;
  if (getState(el) === 'closing') return;

  const preset = ANIMATIONS[type] || ANIMATIONS.none;
  const { bg = 'rgba(0,0,0,0.5)', filter = 'none' } = el._qeBackdropStyle || {};

  setState(el, 'closing');
  el._qeAnimating = true;

  // Pause the fade animation so getComputedStyle returns the current value.
  let startOpacity = 1;
  if (el._qeFadeAnim) {
    el._qeFadeAnim.pause();
    startOpacity = getCurrentOpacity(el);
    el._qeFadeAnim.cancel();
    el._qeFadeAnim = null;
  } else {
    startOpacity = getCurrentOpacity(el) || 0;
  }

  if (el._qeBackdropAnim) {
    el._qeBackdropAnim.cancel();
    el._qeBackdropAnim = null;
  }

  if (!preset.out || duration === 0) {
    if (el.open) el.close();
    setState(el, 'idle');
    el.getAnimations().forEach(a => a.cancel());
    el._qeAnimating = false;
    return;
  }

  el._qeBackdropAnim = el.animate(
    [
      { backgroundColor: bg, backdropFilter: filter, opacity: 1 },
      { backgroundColor: bg, backdropFilter: filter, opacity: 0 }
    ],
    { pseudoElement: '::backdrop', duration, delay, fill: 'forwards', easing: 'ease' }
  );

  const outFrame = { opacity: preset.out[0].opacity };
  if (preset.out[0].transform !== undefined) {
    outFrame.transform = preset.out[0].transform;
  }

  el._qeFadeAnim = el.animate(
    [{ opacity: startOpacity }, outFrame],
    { duration, delay, fill: 'forwards', easing: 'ease' }
  );

  Promise.all([
    el._qeFadeAnim.finished,
    el._qeBackdropAnim.finished
  ]).then(() => {
    if (getState(el) === 'closing') {
      if (el.open) el.close();
      setState(el, 'idle');
      el.getAnimations().forEach(a => a.cancel());
    }
    el._qeAnimating = false;
  }).catch(() => {
    el._qeAnimating = false;
  });
}

export { ANIMATIONS, applyReset, getState, setState, animateBackdrop, closeModal };
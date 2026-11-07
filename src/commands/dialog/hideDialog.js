// src/commands/dialog/hideDialog.js

function setDialogState(dialog, state) {
  dialog.dataset.dialogState = state;
}

function getDialogState(dialog) {
  return dialog.dataset.dialogState || 'idle';
}

function runFadeAnimation(dialog, targetOpacity, duration, onEnd) {
  const currentOpacity = parseFloat(window.getComputedStyle(dialog).opacity) || 0;

  if (dialog.__currentAnimation) {
    dialog.__currentAnimation.cancel();
    dialog.__currentAnimation = null;
  }

  const anim = dialog.animate([{ opacity: currentOpacity }, { opacity: targetOpacity }], {
    duration: duration,
    easing: 'ease-out',
    fill: 'forwards'
  });

  dialog.__currentAnimation = anim;

  anim.onfinish = () => {
    // Persist final state using WAAPI instead of inline style
    dialog.animate([{ opacity: targetOpacity }, { opacity: targetOpacity }], { duration: 0, fill: 'forwards' });
    anim.cancel();
    dialog.__currentAnimation = null;
    setDialogState(dialog, 'idle');
    if (onEnd) onEnd();
  };
}

function fadeOut(dialog, duration, onFinish) {
  setDialogState(dialog, 'hiding');

  runFadeAnimation(dialog, 0, duration, () => {
    // Clear all animations instead of dialog.style.opacity = ''
    dialog.getAnimations().forEach(a => a.cancel());
    if (dialog.open) dialog.close();
    if (onFinish) onFinish();
  });
}

function unbindAutoHide(dialog) {
  if (dialog.__autoHideListener) {
    window.removeEventListener('pointerdown', dialog.__autoHideListener, true);
    delete dialog.__autoHideListener;
  }
}

export default {
  name: 'hideDialog',
  kind: 'effect',
  capabilities: ['dom.dialog'],
  schema: ['selector', 'number?', 'number?'],
  run(ctx, [selector, _delay, duration = 150]) {
    const dialog = ctx.dom.query(selector)[0];
    if (!dialog || !dialog.open) return;

    const currentState = getDialogState(dialog);
    if (currentState === 'hiding') return;

    unbindAutoHide(dialog);
    fadeOut(dialog, duration, () => {});
  },
};
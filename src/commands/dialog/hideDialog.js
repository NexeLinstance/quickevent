// src/commands/dialog/hideDialog.js

function setDialogState(dialog, state) {
  dialog.dataset.dialogState = state;
}

function getDialogState(dialog) {
  return dialog.dataset.dialogState || 'idle';
}

// Same animation logic as in showDialog
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
    dialog.style.opacity = String(targetOpacity);
    anim.cancel();
    dialog.__currentAnimation = null;
    setDialogState(dialog, 'idle');
    if (onEnd) onEnd();
  };
}

// Same fadeOut logic as in showDialog
function fadeOut(dialog, duration, onFinish) {
  setDialogState(dialog, 'hiding');

  runFadeAnimation(dialog, 0, duration, () => {
    dialog.style.opacity = '';
    if (dialog.open) dialog.close();
    if (onFinish) onFinish();
  });
}

// Same unbind logic as in showDialog
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
    
    // If it's already hiding or idle (and not open), do nothing
    if (currentState === 'hiding') return;

    // 1. Remove the click-outside listener immediately so it doesn't interfere
    unbindAutoHide(dialog);

    // 2. Run the fade-out animation (same function from showDialog)
    fadeOut(dialog, duration, () => {
      // Optional: any cleanup after fully hidden
    });
  },
};
// src/commands/dialog/showDialog.js

function setDialogState(dialog, state) {
  dialog.dataset.dialogState = state;
}

function getDialogState(dialog) {
  return dialog.dataset.dialogState || 'idle';
}

function resetDialogStyles(dialog) {
  dialog.animate([{}, {
    backgroundColor: 'transparent',
    border: 'none',
    margin: '0px',
    padding: '0px',
    outline: 'none',
    boxShadow: 'none'
  }], { duration: 0, fill: 'forwards' });
}

function positionDialog(dialog, dialogConfig, anchorConfig) {
  const [, posStr, offsetX, offsetY] = dialogConfig;
  const [anchorSelector, anchorPosStr] = anchorConfig;

  let anchorRect;
  let isBodyOrViewport = false;

  if (anchorSelector === 'viewport') {
    anchorRect = { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    isBodyOrViewport = true;
  } else if (anchorSelector === 'body') {
    anchorRect = { top: 0, left: 0, width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight };
    isBodyOrViewport = true;
  } else {
    const anchorEl = typeof anchorSelector === 'string' ? document.querySelector(anchorSelector) : anchorSelector;
    anchorRect = anchorEl ? anchorEl.getBoundingClientRect() : { top: 0, left: 0, width: 0, height: 0 };
    isBodyOrViewport = false;
  }

  const [dPosX, dPosY] = posStr.split('-');
  const [aPosX, aPosY] = anchorPosStr.split('-');
  
  const map = { start: 0, center: 0.5, end: 1, top: 0, bottom: 1 };
  
  const x = anchorRect.left + (anchorRect.width * map[aPosX]) - (dialog.offsetWidth * map[dPosX]);
  const y = anchorRect.top + (anchorRect.height * map[aPosY]) - (dialog.offsetHeight * map[dPosY]);

  const offX = typeof offsetX === 'number' ? offsetX : parseFloat(offsetX || 0);
  const offY = typeof offsetY === 'number' ? offsetY : parseFloat(offsetY || 0);

  let finalX = x;
  let finalY = y;

  // WAAPI for position instead of inline styles
  if (isBodyOrViewport) {
    dialog.animate([{}, { position: anchorSelector === 'body' ? 'absolute' : 'fixed' }], { duration: 0, fill: 'forwards' });
  } else {
    finalX = x + window.scrollX;
    finalY = y + window.scrollY;
    dialog.animate([{}, { position: 'absolute' }], { duration: 0, fill: 'forwards' });
  }

  // WAAPI for left, top, bottom instead of inline styles
  dialog.animate([{}, {
    left: '0px',
    top: '0px',
    bottom: 'auto'
  }], { duration: 0, fill: 'forwards' });

  dialog.animate([{ 
    transform: `translate(calc(${finalX}px + ${offX}px), calc(${finalY}px + ${offY}px))` 
  }], {
    duration: 0,
    fill: 'forwards'
  });
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

function fadeIn(dialog, dialogConfig, anchorConfig, duration) {
  resetDialogStyles(dialog);
  
  if (!dialog.open) {
    // WAAPI for initial opacity 0 instead of inline style
    dialog.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 0, fill: 'forwards' });
    dialog.show(); 
  }

  if (dialogConfig && anchorConfig) {
    positionDialog(dialog, dialogConfig, anchorConfig);
  }

  setDialogState(dialog, 'showing');
  runFadeAnimation(dialog, 1, duration);
}

function fadeOut(dialog, duration, onFinish) {
  setDialogState(dialog, 'hiding');

  runFadeAnimation(dialog, 0, duration, () => {
    // Clear all animations (equivalent to dialog.style.opacity = '')
    dialog.getAnimations().forEach(a => a.cancel());
    dialog.close();
    if (onFinish) onFinish();
  });
}

function isClickOutside(dialog, event) {
  if (dialog.contains(event.target)) return false;
  return true;
}

function bindAutoHide(dialog, duration) {
  if (dialog.__autoHideListener) return;

  const handler = (event) => {
    if (getDialogState(dialog) === 'hiding') return;
    if (isClickOutside(dialog, event)) {
      unbindAutoHide(dialog);
      fadeOut(dialog, duration);
    }
  };

  dialog.__autoHideListener = handler;
  queueMicrotask(() => {
    if (dialog.__autoHideListener === handler) {
      window.addEventListener('pointerdown', handler, true);
    }
  });
}

function unbindAutoHide(dialog) {
  if (dialog.__autoHideListener) {
    window.removeEventListener('pointerdown', dialog.__autoHideListener, true);
    delete dialog.__autoHideListener;
  }
}
// NEW: Function to close other dialogs in the same chain
function closeChainedDialogs(dialog, duration) {
  const chainValue = dialog.getAttribute('chain');
  if (!chainValue) return;

  document.querySelectorAll(`dialog[chain="${chainValue}"]`).forEach(otherDialog => {
    if (otherDialog !== dialog && otherDialog.open) {
      unbindAutoHide(otherDialog);
      fadeOut(otherDialog, duration);
    }
  });
}

function showDialog(dialog, dialogConfig, anchorConfig, autoHide, duration, fade) {
  const currentState = getDialogState(dialog);
  if (currentState === 'showing' || (dialog.open && currentState === 'idle')) return;
// Close other dialogs in the same chain before opening this one
  closeChainedDialogs(dialog, duration);
  if (fade) {
    fadeIn(dialog, dialogConfig, anchorConfig, duration);
  } else {
    if (dialog.__currentAnimation) {
      dialog.__currentAnimation.cancel();
      dialog.__currentAnimation = null;
    }
    // Clear animations instead of dialog.style.opacity = ''
    dialog.getAnimations().forEach(a => a.cancel());
    setDialogState(dialog, 'idle');
    if (dialogConfig && anchorConfig) {
      positionDialog(dialog, dialogConfig, anchorConfig);
    }
    if (!dialog.open) dialog.show();
  }

  if (autoHide) bindAutoHide(dialog, duration);
}

export default {
  name: 'showDialog',
  kind: 'effect',
  capabilities: ['dom.dialog'],
  schema: ['array', 'array', 'number', 'number'],
  run(ctx, [dialogConfig, anchorConfig, _delay, duration]) {
    const dialog = ctx.dom.query(dialogConfig[0])[0];
    const autoHide = dialogConfig[4];

    if (dialog.open) {
      fadeOut(dialog, 150, () => {
        showDialog(dialog, dialogConfig, anchorConfig, autoHide, duration, true);
      });
    } else {
      showDialog(dialog, dialogConfig, anchorConfig, autoHide, duration, true);
    }
  }
};
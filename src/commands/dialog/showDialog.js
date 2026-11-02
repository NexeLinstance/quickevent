// src/commands/dialog/showDialog.js

function setDialogState(dialog, state) {
  dialog.dataset.dialogState = state;
}

function getDialogState(dialog) {
  return dialog.dataset.dialogState || 'idle';
}

function resetDialogStyles(dialog) {
  dialog.style.backgroundColor = 'transparent';
  dialog.style.border = 'none';
  dialog.style.margin = '0';
  dialog.style.padding = '0';
  dialog.style.outline = 'none';
  dialog.style.boxShadow = 'none';
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

  if (isBodyOrViewport) {
    if (anchorSelector === 'body') {
      dialog.style.position = 'absolute';
    } else {
      dialog.style.position = 'fixed';
    }
  } else {
    finalX = x + window.scrollX;
    finalY = y + window.scrollY;
    dialog.style.position = 'absolute';
  }

  dialog.style.left = '0';
  dialog.style.top = '0';
  dialog.style.bottom = 'auto';

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
    dialog.style.opacity = String(targetOpacity);
    anim.cancel();
    dialog.__currentAnimation = null;
    setDialogState(dialog, 'idle');
    if (onEnd) onEnd();
  };
}

function fadeIn(dialog, dialogConfig, anchorConfig, duration) {
  resetDialogStyles(dialog);
  
  if (!dialog.open) {
    dialog.style.opacity = '0';
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
    dialog.style.opacity = '';
    dialog.close();
    if (onFinish) onFinish();
  });
}

// 3. Fix click outside logic to work correctly with absolute/fixed positioning
function isClickOutside(dialog, event) {
  // اگر کلیک روی خود دیالوگ یا فرزندانش باشد، یعنی داخل است
  if (dialog.contains(event.target)) return false;
  return true;
}

function bindAutoHide(dialog, duration) {
  if (dialog.__autoHideListener) return;

  const handler = (event) => {
    if (getDialogState(dialog) === 'hiding') return;
    
    // از تابع اصلاح شده استفاده می‌کند
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

function showDialog(dialog, dialogConfig, anchorConfig, autoHide, duration, fade) {
  const currentState = getDialogState(dialog);
  if (currentState === 'showing' || (dialog.open && currentState === 'idle')) return;

  if (fade) {
    fadeIn(dialog, dialogConfig, anchorConfig, duration);
  } else {
    if (dialog.__currentAnimation) {
      dialog.__currentAnimation.cancel();
      dialog.__currentAnimation = null;
    }
    dialog.style.opacity = '';
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
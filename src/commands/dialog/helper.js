// src/commands/dialog/helper.js

export function openDialog(dialog, duration, delay = 0, isInitial = false) {
  const state = dialog.getAttribute('data-dialog-state');
  if (state === 'open' || state === 'opening') return;
  
  dialog.setAttribute('data-dialog-state', 'opening');
  
  // Cancel ONLY the previous fade animation. Do NOT cancel position animations!
  if (dialog._fadeAnim) dialog._fadeAnim.cancel();

  // If it's the initial open, start from opacity 0.
  // If we are reversing a close, start from wherever the opacity currently is ({}).
  const startFrame = isInitial ? { opacity: 0 } : {};

  dialog._fadeAnim = dialog.animate([
    startFrame,
    { opacity: 1 }
  ], {
    duration,
    delay,
    fill: 'forwards',
    easing: 'ease',
  });

  dialog._fadeAnim.finished.then(() => {
    if (dialog.getAttribute('data-dialog-state') === 'opening') {
      dialog.setAttribute('data-dialog-state', 'open');
    }
  }).catch(() => {});
}

export function closeDialog(dialog, duration, delay = 0) {
  const state = dialog.getAttribute('data-dialog-state');
  if (state === 'close' || state === 'closing') return;
  
  dialog.setAttribute('data-dialog-state', 'closing');
  
  if (dialog._fadeAnim) dialog._fadeAnim.cancel();

  dialog._fadeAnim = dialog.animate([
    {}, // Start from current opacity
    { opacity: 0 }
  ], {
    duration,
    delay,
    fill: 'forwards',
    easing: 'ease',
  });

  dialog._fadeAnim.finished.then(() => {
    if (dialog.getAttribute('data-dialog-state') === 'closing') {
      if (dialog.open) dialog.close();
      dialog.setAttribute('data-dialog-state', 'close');
      
      // It is now completely safe to cancel all animations because the dialog is hidden
      dialog.getAnimations().forEach(a => a.cancel());
    }
  }).catch(() => {});
}
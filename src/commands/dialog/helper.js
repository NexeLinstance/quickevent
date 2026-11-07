// src/commands/dialog/helper.js

export function openDialog(dialog, duration, delay = 0, isInitial = false) {
  const state = dialog.getAttribute('data-dialog-state');
  if (state === 'open' || state === 'opening') return;
  
  dialog.setAttribute('data-dialog-state', 'opening');
  
  if (dialog._fadeAnim) dialog._fadeAnim.cancel();

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
    {},
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
      dialog.getAnimations().forEach(a => a.cancel());
    }
  }).catch(() => {});
}
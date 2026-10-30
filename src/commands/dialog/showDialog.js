// src/commands/dialog/showDialog.js

const DIALOG_RESET_STYLES = {
  position: 'fixed',
  margin: '0',
  padding: '0',
  border: 'none',
  background: 'transparent',
  overflow: 'visible',
  maxWidth: 'none',
  maxHeight: 'none',
  inset: 'auto',
};

function applyResetStyles(dialog) {
  // Apply reset styles instantly (duration: 0) using animate
  const anim = dialog.animate([{}, DIALOG_RESET_STYLES], {
    duration: 0,
    fill: 'forwards',
  });
  anim.finished.catch(() => {});
}

function parsePosition(pos) {
  if (!pos) return { x: 'center', y: 'center' };
  const parts = pos.split('-');
  if (parts.length === 2) return { x: parts[0], y: parts[1] };
  return { x: 'center', y: 'center' };
}

export default {
  name: 'showDialog',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.dialog'],
  schema: ['array', 'array', 'number?', 'number?'],
  run(ctx, [dialogSpec, anchorSpec, delay = 0, duration = 300]) {
    const [dialogSel, position, offsetX, offsetY, autoHide] = dialogSpec;
    const [anchorSel, anchorPos] = anchorSpec;

    const dialog = ctx.dom.query(dialogSel)[0];
    const anchor =
      anchorSel === 'viewport' || anchorSel === 'body'
        ? null
        : ctx.dom.query(anchorSel)[0];

    if (!dialog) {
      throw new Error(`showDialog: dialog "${dialogSel}" not found`);
    }
    if (!anchor && anchorSel !== 'viewport' && anchorSel !== 'body') {
      throw new Error(`showDialog: anchor "${anchorSel}" not found`);
    }

    // Reset the dialog's own styles
    applyResetStyles(dialog);

    const doShow = () => {
      if (!dialog.open) dialog.show();

      // Position relative to anchor
      const ax = offsetX ?? 0;
      const ay = offsetY ?? 0;

      let anchorRect;
      if (anchorSel === 'viewport') {
        anchorRect = {
          left: 0, top: 0,
          width: window.innerWidth, height: window.innerHeight,
        };
      } else if (anchorSel === 'body') {
        anchorRect = {
          left: 0, top: 0,
          width: document.body.scrollWidth, height: document.body.scrollHeight,
        };
      } else {
        anchorRect = anchor.getBoundingClientRect();
      }

      const pos = parsePosition(anchorPos);
      const dialogRect = dialog.getBoundingClientRect();

      let top = 0, left = 0;
      if (pos.x === 'start') left = anchorRect.left + ax;
      else if (pos.x === 'center') left = anchorRect.left + anchorRect.width / 2 - dialogRect.width / 2 + ax;
      else if (pos.x === 'end') left = anchorRect.right - dialogRect.width + ax;

      if (pos.y === 'top') top = anchorRect.top + ay;
      else if (pos.y === 'center') top = anchorRect.top + anchorRect.height / 2 - dialogRect.height / 2 + ay;
      else if (pos.y === 'bottom') top = anchorRect.bottom - dialogRect.height + ay;

      dialog.style.left = `${left}px`;
      dialog.style.top = `${top}px`;

      // Fade-in animation for content
      if (duration > 0) {
        dialog.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration,
          fill: 'forwards',
          easing: 'ease',
        });
      }

      // Auto-hide logic
      if (autoHide) {
        setTimeout(() => {
          const handler = (e) => {
            if (!dialog.contains(e.target)) {
              hide(dialog);
              document.removeEventListener('click', handler);
            }
          };
          document.addEventListener('click', handler);
          dialog._qeClickHandler = handler;
        }, 10);

        dialog.oncancel = () => hide(dialog);
      }
    };

    return new Promise((resolve) => {
      if (delay > 0) setTimeout(() => { doShow(); resolve(); }, delay);
      else { doShow(); resolve(); }
    });

    function hide(dlg) {
      if (dlg.open) dlg.close();
      if (dlg._qeClickHandler) {
        document.removeEventListener('click', dlg._qeClickHandler);
        delete dlg._qeClickHandler;
      }
    }
  },
};
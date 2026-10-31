// src/commands/dialog/showDialog.js

const dismissControllers = new WeakMap();

const RESET_STYLES = {
  margin: '0', border: '0', padding: '0', background: 'transparent',
  overflow: 'visible', maxWidth: 'none', maxHeight: 'none',
  boxShadow: 'none', zIndex: '9999',
};

function resolveEl(target, ctx) {
  if (target instanceof Element) return target;
  if (target === 'this') return ctx.element;
  if (typeof target === 'string') return ctx.dom.query(target)[0] || null;
  return null;
}

function parseCssUnitToPx(value, element) {
  if (value == null || value === '') return 0;
  if (typeof value === 'number') return value;
  const raw = String(value).trim();
  const m = raw.match(/^(-?[\d.]+)\s*(px|rem|em|vw|vh|%)?$/);
  if (!m) return parseFloat(raw) || 0;
  const num = parseFloat(m[1]), unit = m[2] || 'px';
  switch (unit) {
    case 'px': return num;
    case 'rem': return num * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
    case 'em': return num * (parseFloat(getComputedStyle(element || document.body).fontSize) || 16);
    case 'vw': return (num * window.innerWidth) / 100;
    case 'vh': return (num * window.innerHeight) / 100;
    default: return num;
  }
}

function resolvePoints(side, rect, isRTL, isAnchor = true) {
  const [xSide, ySide] = String(side || 'center-center').split('-');
  const isLeft = (xSide === 'start' && !isRTL) || (xSide === 'end' && isRTL);
  const isRight = (xSide === 'end' && !isRTL) || (xSide === 'start' && isRTL);
  let x = 0;
  if (xSide === 'center') x = isAnchor ? rect.left + rect.width / 2 : rect.width / 2;
  else if (isLeft) x = isAnchor ? rect.left : 0;
  else if (isRight) x = isAnchor ? rect.right : rect.width;

  let y = 0;
  if (ySide === 'center') y = isAnchor ? rect.top + rect.height / 2 : rect.height / 2;
  else if (ySide === 'top') y = isAnchor ? rect.top : 0;
  else if (ySide === 'bottom') y = isAnchor ? rect.bottom : rect.height;

  return { x, y };
}

export default {
  name: 'showDialog',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.dialog'],
  schema: ['array', 'array', 'number?', 'number?'],
  run(ctx, [dialogConfig, anchorConfig, delay = 0, duration = 300]) {
    const [dialogTarget, dialogSide, rawX = 0, rawY = 0, autoDismiss = true] = dialogConfig;
    const [anchorTarget, anchorSide] = anchorConfig;

    const dialog = resolveEl(dialogTarget, ctx);
    const anchor = resolveEl(anchorTarget, ctx);

    if (!dialog) throw new Error(`showDialog: "${dialogTarget}" not found`);
    if (!anchor && anchorTarget !== 'viewport' && anchorTarget !== 'body') {
      throw new Error(`showDialog: anchor "${anchorTarget}" not found`);
    }

    // 1. Cancel previous animations to avoid conflicts
    dialog.getAnimations().forEach(a => a.cancel());

    // 2. Hide instantly before showing to prevent flash of default styles
    dialog.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 0, fill: 'forwards' });

    // 3. Show dialog (removes display: none)
    if (!dialog.open) dialog.show();

    // 4. Calculate position
    const aR = anchorTarget === 'viewport'
      ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
      : anchorTarget === 'body'
      ? { left: 0, top: 0, width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }
      : anchor.getBoundingClientRect();

    const dR = dialog.getBoundingClientRect();
    const isRTL = getComputedStyle(document.documentElement).direction === 'rtl';

    const ap = resolvePoints(anchorSide, aR, isRTL, true);
    const doff = resolvePoints(dialogSide, dR, isRTL, false);

    const px = parseCssUnitToPx(rawX, dialog);
    const py = parseCssUnitToPx(rawY, dialog);
    const dx = isRTL ? -px : px;

    let posType = 'fixed';
    let scrollX = 0, scrollY = 0;

    // For viewport, stick to the screen (fixed). For body or others, scroll with the page (absolute).
    if (anchorTarget !== 'viewport') {
      posType = 'absolute';
      scrollX = window.scrollX;
      scrollY = window.scrollY;
    }

    const left = ap.x - doff.x + dx + scrollX;
    const top = ap.y - doff.y + py + scrollY;

    // 5. Apply all reset and position styles immediately via animate (no inline styles)
    const pos = {
      ...RESET_STYLES,
      position: posType,
      left: `${left}px`,
      top: `${top}px`,
      opacity: 0, // Start transparent for the fade-in
    };
    dialog.animate([pos, pos], { duration: 0, fill: 'forwards' });

    // Force a browser reflow so it registers opacity: 0 before starting the animation
    void dialog.offsetWidth;

    // 6. Fade in smoothly
    dialog.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: duration,
      delay: delay,
      fill: 'forwards',
      easing: 'ease',
    });

    // 7. Auto dismiss logic
    const prev = dismissControllers.get(dialog);
    if (prev) prev.abort();

    if (autoDismiss) {
      const ctrl = new AbortController();
      dismissControllers.set(dialog, ctrl);

      document.addEventListener('pointerdown', (e) => {
        if (!dialog.contains(e.target) && (!anchor || !anchor.contains(e.target))) {
          hideDialog(dialog, 0, duration);
        }
      }, { signal: ctrl.signal });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideDialog(dialog, 0, duration);
      }, { signal: ctrl.signal });
    }

    function hideDialog(el, del, dur) {
      if (!el.open) return;
      const ctrl = dismissControllers.get(el);
      if (ctrl) { ctrl.abort(); dismissControllers.delete(el); }

      el.getAnimations().forEach(a => a.cancel());

      el.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: dur,
        delay: del,
        fill: 'forwards',
        easing: 'ease',
      }).finished.then(() => {
        if (el.open) el.close();
        el.getAnimations().forEach(a => a.cancel());
      });
    }
  },
};
// src/commands/modal/showModal.js

const ANIMATIONS = {
  fade: {
    in:  [{ opacity: 0 }, { opacity: 1 }],
    out: [{ opacity: 1 }, { opacity: 0 }]
  },
  zoom: {
    in:  [{ opacity: 0, transform: 'scale(0.8)' }, { opacity: 1, transform: 'scale(1)' }],
    out: [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.8)' }]
  },
  slideDown: {
    in:  [{ opacity: 0, transform: 'translateY(-60px)' }, { opacity: 1, transform: 'translateY(0)' }],
    out: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-60px)' }]
  },
  slideUp: {
    in:  [{ opacity: 0, transform: 'translateY(60px)' }, { opacity: 1, transform: 'translateY(0)' }],
    out: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(60px)' }]
  },
  none: {
    in:  null,
    out: null
  }
};

// ONLY remove the visual box (background, border, shadow). 
// DO NOT touch position, margin, or inset, so the browser's default centering works perfectly.
const RESET_STYLES = {
  backgroundColor: 'transparent',
  border: 'none',
  boxShadow: 'none',
};

function applyReset(el) {
  // Enforce styles instantly
  el.animate([{}, RESET_STYLES], { duration: 0, fill: 'forwards' });
}

function setBackdrop(el, bg, filter) {
  // Apply custom backdrop color/filter with duration 0
  el.animate(
    [
      { backgroundColor: 'transparent', backdropFilter: 'none' },
      { backgroundColor: bg, backdropFilter: filter }
    ],
    { pseudoElement: '::backdrop', duration: 0, fill: 'forwards' }
  );
}

export default {
  name: 'showModal',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.modal'],
  schema: ['selector', 'object?', 'boolean?', 'number?', 'number?', 'string?'],
  run(ctx, [selector, backdropStyle = {}, autoHide = true, delay = 0, duration = 300, type = 'fade']) {
    const els = ctx.dom.query(selector);
    if (!els.length) throw new Error(`showModal: "${selector}" not found`);

    els.forEach((el) => {
      if (!(el instanceof HTMLDialogElement)) return;
      if (el.open) return;

      // 1. Reset visual styles (background, border, shadow) BEFORE showing
      applyReset(el);

      // 2. Hide with opacity 0 BEFORE showModal to prevent the white flash
      el.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 0, fill: 'forwards' });

      // 3. Show modal (browser handles centering via Top Layer & margin: auto)
      el.showModal();

      // 4. Apply backdrop style (now that ::backdrop exists)
      const bg = backdropStyle.backgroundColor ?? 'rgba(0,0,0,0.5)';
      const filter = backdropStyle.filter ?? 'none';
      setBackdrop(el, bg, filter);

      // 5. Animate the content (fade-in, zoom, etc.)
      const preset = ANIMATIONS[type] || ANIMATIONS.none;
      if (preset.in && duration > 0) {
        el.animate(preset.in, {
          duration,
          delay,
          easing: 'ease',
          fill: 'forwards'
        });
      }

      // 6. Auto-hide logic
      if (autoHide) {
        el.addEventListener('click', function handler(e) {
          if (e.target === el) {
            hideModal(el, 0, duration, type);
          }
        });
        el.addEventListener('cancel', function cancelHandler(e) {
          e.preventDefault();
          hideModal(el, 0, duration, type);
        });
      } else {
        el.addEventListener('cancel', (e) => e.preventDefault());
      }
    });

    function hideModal(el, del, dur, t) {
      const preset = ANIMATIONS[t] || ANIMATIONS.none;
      if (!preset.out || dur === 0) {
        if (el.open) el.close();
        return;
      }
      const anim = el.animate(preset.out, {
        duration: dur,
        delay: del,
        easing: 'ease',
        fill: 'forwards'
      });
      anim.finished.then(() => {
        if (el.open) el.close();
        el.getAnimations().forEach(a => a.cancel());
      });
    }
  },
};
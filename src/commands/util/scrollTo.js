// src/commands/util/scrollTo.js

export default {
  name: 'scrollTo',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.scroll'],
  schema: ['any', 'selector?'], // target, parent (optional)
  run(ctx, [target, parentSelector]) {
    // 1. Resolve the parent (the scrolling container)
    let scrollParent = window;
    if (parentSelector) {
      const el = ctx.dom.query(parentSelector)[0];
      if (el) scrollParent = el;
    }

    const isWindow = scrollParent === window;

    // Helper function to perform the scroll
    const performScroll = (top, left = 0) => {
      if (isWindow) {
        window.scrollTo({ top, left, behavior: 'smooth' });
      } else {
        scrollParent.scrollTo({ top, left, behavior: 'smooth' });
      }
    };

    // 2. Handle numeric target (scroll by pixels)
    if (typeof target === 'number') {
      performScroll(target);
      return;
    }

    // 3. Handle element target (scroll to element)
    const el = ctx.dom.query(target)[0];
    if (!el) return;

    if (isWindow) {
      // For window, scrollIntoView is safe and handles the viewport correctly
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // For a specific container, calculate the offset of the element relative to the container
      const parentRect = scrollParent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      
      // Calculate the current scroll position + the distance from the container's top to the element's top
      const scrollTop = scrollParent.scrollTop + (elRect.top - parentRect.top);
      const scrollLeft = scrollParent.scrollLeft + (elRect.left - parentRect.left);

      performScroll(scrollTop, scrollLeft);
    }
  },
};
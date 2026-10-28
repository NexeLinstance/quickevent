const QuickEvent = (function () {
  const handlers = new Map();

  function on(name, fn) {
    if (!handlers.has(name)) handlers.set(name, new Set());
    handlers.get(name).add(fn);
    return () => off(name, fn);
  }

  function off(name, fn) {
    const set = handlers.get(name);
    if (set) set.delete(fn);
  }

  function emit(name, payload) {
    const set = handlers.get(name);
    if (!set) return false;
    set.forEach((fn) => fn(payload));
    return true;
  }

  function clear(name) {
    if (name) handlers.delete(name);
    else handlers.clear();
  }

  return { on, off, emit, clear, version: "1.0.0" };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = QuickEvent;
} else {
  window.QuickEvent = QuickEvent;
}

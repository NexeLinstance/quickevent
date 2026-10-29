// dev/tests/setup.js
import '../../src/setup.js';

// Optional: show console messages also in the page for quick visual check
const logEl = document.getElementById('__log__');
if (logEl) {
  const orig = console.log;
  console.log = (...args) => {
    orig.apply(console, args);
    const line = document.createElement('div');
    line.textContent = args.map(a =>
      typeof a === 'object' ? JSON.stringify(a) : String(a)
    ).join(' ');
    logEl.appendChild(line);
  };
}
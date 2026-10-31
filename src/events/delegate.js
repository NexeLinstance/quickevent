// src/events/delegate.js
import { createContext } from '../core/context.js';
import { runEvent } from '../core/interpreter.js';
import { createError } from '../core/errors.js';
import { tickStates, getTickValue } from '../commands/tick/timer.js';

const BUBBLE_EVENTS = [
  'click',
  'dblclick',
  'keyup',
  'keydown',
  'change',
  'submit',
  'focusin',
];

const CAPTURE_EVENTS = [
  'mouseenter',
  'mouseleave',
];

/**
 * Attach global listeners for all event attributes.
 * @param {object} options
 * @param {Registry} options.registry
 * @param {Reporter} options.reporter
 * @param {string}   options.rootSelector  optional; if provided, only listen inside it
 */
export function attachEvents({ registry, reporter, rootSelector = null }) {
  const root = rootSelector ? document.querySelector(rootSelector) : document;
  if (!root) {
    console.warn(`[QE] rootSelector "${rootSelector}" not found.`);
    return;
  }

  // Bubble events — listen on root, delegate with closest
  for (const type of BUBBLE_EVENTS) {
    root.addEventListener(type, e => handleEvent(e, type, { registry, reporter }));
  }

  // Non-bubbling events — listen per element, but still delegated via closest
  for (const type of CAPTURE_EVENTS) {
    root.addEventListener(type, e => handleEvent(e, type, { registry, reporter }), true);
  }

  // loadDom — run after DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => runLoadDom({ registry, reporter }));
  } else {
    // DOM already parsed; run in next tick to allow attributes to be set
    queueMicrotask(() => runLoadDom({ registry, reporter }));
  }

  // tick — runs on custom "tick" events dispatched by timer commands
  document.addEventListener('tick', e => handleEvent(e, 'tick', { registry, reporter }), true);
}

// ─────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────

function handleEvent(e, type, { registry, reporter }) {
  const el = e.target instanceof Element ? e.target : e.target?.parentElement;
  if (!el) return;

  const target = el.closest(`[${type}]`);
  if (!target) return;

  // Do not preventDefault for focusin/change — we want native behavior
  // (only click, dblclick, submit should be prevented)
  if (type === 'click' || type === 'dblclick' || type === 'submit') {
    e.preventDefault();
  }

  const raw = target.getAttribute(type);
  if (!raw) return;

  let effects;
  try {
    effects = JSON.parse(raw);
  } catch (err) {
    reporter.report(
      createError('E002', {
        attribute: type,
        cause: err,
        command: null,
        element: target,
      }),
      { element: target, attribute: type }
    );
    return;
  }

  const ctx = createContext({
    element: target,
    event: e,
    attribute: type,
    registry,
    reporter,
  });

  // Inject tick values for the "tick" event
  if (type === 'tick') {
    const state = tickStates.get(target);
    if (state) {
      ctx.vars.tick = getTickValue(state);
    }
  }

  runEvent(effects, ctx).catch(err => {
    reporter.report(err, { element: target, attribute: type });
  });
}

function runLoadDom({ registry, reporter }) {
  const elements = document.querySelectorAll('[loadDom]');
  for (const el of elements) {
    const raw = el.getAttribute('loadDom');
    if (!raw) continue;

    let effects;
    try {
      effects = JSON.parse(raw);
    } catch (err) {
      reporter.report(
        createError('E002', {
          attribute: 'loadDom',
          cause: err,
          element: el,
        }),
        { element: el, attribute: 'loadDom' }
      );
      continue;
    }

    const ctx = createContext({
      element: el,
      attribute: 'loadDom',
      registry,
      reporter,
    });

    runEvent(effects, ctx).catch(err => {
      reporter.report(err, { element: el, attribute: 'loadDom' });
    });
  }
}
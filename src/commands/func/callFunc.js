// src/commands/func/callFunc.js
import { policy } from '../../core/security.js';

const FORBIDDEN_NAMES = new Set(['__proto__', 'constructor', 'prototype']);
const VALID_NAME = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const callDepth = new WeakMap(); // Key: ctx.vars

export default {
  name: 'callFunc',
  kind: 'flow',
  schema: ['string', 'selector', 'array?'],
  async run(ctx, [funcName, selector, callArgs = []], { runBody }) {
    const targetEl = ctx.dom.query(selector)[0];
    if (!targetEl) throw new Error(`callFunc: target element "${selector}" not found`);

    const raw = targetEl.getAttribute(funcName);
    if (!raw) throw new Error(`callFunc: function "${funcName}" not found on target`);

    let effects;
    try {
      effects = JSON.parse(raw);
    } catch {
      throw new Error(`callFunc: invalid JSON in "${funcName}" attribute`);
    }

    if (!Array.isArray(effects) || effects[0] !== 'createFunc') {
      throw new Error(`callFunc: attribute "${funcName}" is not a valid function definition`);
    }

    const [, argSpec, body] = effects;
    if (!Array.isArray(body)) throw new Error('callFunc: invalid function body');

    const args = [];
    if (Array.isArray(argSpec)) {
      for (const item of argSpec) {
        if (typeof item === 'string') {
          args.push({ name: item, default: undefined });
        } else if (item && typeof item === 'object') {
          for (const [k, v] of Object.entries(item)) {
            args.push({ name: k, default: v });
          }
        }
      }
    }

    // Validate arg names
    for (const arg of args) {
      if (!VALID_NAME.test(arg.name) || FORBIDDEN_NAMES.has(arg.name)) {
        throw new Error(`callFunc: invalid argument name "${arg.name}"`);
      }
    }

    // Check recursion depth using ctx.vars (shared across sub-contexts)
    const currentDepth = (callDepth.get(ctx.vars) || 0) + 1;
    if (currentDepth > policy.maxCallDepth) {
      throw new Error('callFunc: maximum call depth exceeded');
    }
    callDepth.set(ctx.vars, currentDepth);

    // Save scope
    const savedVars = new Map();

    try {
      for (let i = 0; i < args.length; i++) {
        const argDef = args[i];
        let val = callArgs[i];
        if (val === undefined) val = argDef.default;

        const name = argDef.name;
        savedVars.set(name, Object.prototype.hasOwnProperty.call(ctx.vars, name) ? ctx.vars[name] : undefined);
        ctx.vars[name] = val;
      }

      await runBody(body);
    } finally {
      // Restore scope
      for (const [name, oldVal] of savedVars.entries()) {
        if (oldVal === undefined) {
          delete ctx.vars[name];
        } else {
          ctx.vars[name] = oldVal;
        }
      }
      
      // Decrement depth
      callDepth.set(ctx.vars, currentDepth - 1);
    }
  },
};
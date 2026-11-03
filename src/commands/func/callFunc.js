// src/commands/func/callFunc.js

const FORBIDDEN_NAMES = new Set(['__proto__', 'constructor', 'prototype']);
const VALID_NAME = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

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

    // Security: Check for forbidden names and prevent deep recursion
    for (const arg of args) {
      if (!VALID_NAME.test(arg.name) || FORBIDDEN_NAMES.has(arg.name)) {
        throw new Error(`callFunc: invalid argument name "${arg.name}" (security violation)`);
      }
    }

    if (!ctx.vars._callDepth) ctx.vars._callDepth = 0;
    if (ctx.vars._callDepth > 32) {
      throw new Error('callFunc: maximum call stack depth exceeded');
    }
    ctx.vars._callDepth++;

    // Save current state of variables to restore later (Scope isolation)
    const savedVars = new Map();
    
    try {
      for (let i = 0; i < args.length; i++) {
        const argDef = args[i];
        let val = callArgs[i];
        if (val === undefined) val = argDef.default;

        const name = argDef.name;
        // Save the old value (or undefined if it didn't exist)
        savedVars.set(name, Object.prototype.hasOwnProperty.call(ctx.vars, name) ? ctx.vars[name] : undefined);
        
        ctx.vars[name] = val;
      }

      await runBody(body);

    } finally {
      // Restore the scope
      for (const [name, oldVal] of savedVars.entries()) {
        if (oldVal === undefined) {
          delete ctx.vars[name];
        } else {
          ctx.vars[name] = oldVal;
        }
      }
      ctx.vars._callDepth--;
    }
  },
};
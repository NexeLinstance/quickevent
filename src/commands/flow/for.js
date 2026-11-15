// src/commands/flow/for.js
import { resolveArg } from '../../core/resolver.js';
import { safeVarName } from '../../core/security.js';

export default {
  name: 'for',
  kind: 'flow',
  schema: ['any', 'any', 'array'],
  async run(ctx, [varSpec, sourceExpr, body], { runBody }) {
    // Resolve the source
    const source = await resolveArg(sourceExpr, ctx);

    if (!Array.isArray(source) && (source == null || typeof source !== 'object')) {
      throw new Error('for: source must be an array or object');
    }

    // Parse variable names (with security validation)
    let varNames;
    if (Array.isArray(varSpec)) {
      varNames = varSpec.map(s => safeVarName(String(s).trim())).filter(Boolean);
    } else {
      varNames = String(varSpec).split(',').map(s => safeVarName(s.trim())).filter(Boolean);
    }

    if (!varNames.length) {
      throw new Error('for: no variable names');
    }

    const isArray = Array.isArray(source);
    if (isArray && varNames.length !== 1) {
      throw new Error('for: array requires 1 variable');
    }
    if (!isArray && varNames.length !== 2) {
      throw new Error('for: object requires 2 variables (key, value)');
    }

    // Save previous values so we can restore them after the loop.
    const saved = new Map();
    const saveVar = (name) => saved.set(name, {
      had: Object.prototype.hasOwnProperty.call(ctx.vars, name),
      value: ctx.vars[name],
    });

    for (const name of varNames) saveVar(name);
    saveVar('index');

    ctx.loopStack.push({});

    try {
      if (isArray) {
        const name = varNames[0];
        for (let i = 0; i < source.length; i++) {
          ctx.vars[name] = source[i];
          ctx.vars.index = i;
          await runBody(body);
        }
      } else {
        const [k, v] = varNames;
        const entries = Object.entries(source);
        for (let i = 0; i < entries.length; i++) {
          ctx.vars[k] = entries[i][0];
          ctx.vars[v] = entries[i][1];
          ctx.vars.index = i;
          await runBody(body);
        }
      }
    } finally {
      ctx.loopStack.pop();

      // Restore previous values.
      for (const [name, prev] of saved.entries()) {
        if (prev.had) {
          ctx.vars[name] = prev.value;
        } else {
          delete ctx.vars[name];
        }
      }
    }
  },
};
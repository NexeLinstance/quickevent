// src/commands/flow/for.js
import { resolveArg } from '../../core/resolver.js';

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

    // Parse variable names
    let varNames;
    if (Array.isArray(varSpec)) {
      varNames = varSpec.map(s => String(s).trim()).filter(Boolean);
    } else {
      varNames = String(varSpec).split(',').map(s => s.trim()).filter(Boolean);
    }

    if (!varNames.length) {
      throw new Error('for: no variable names');
    }

    if (Array.isArray(source)) {
      if (varNames.length !== 1) {
        throw new Error('for: array requires 1 variable');
      }
      const name = varNames[0];
      for (let i = 0; i < source.length; i++) {
        ctx.vars[name] = source[i];
        ctx.vars.index = i;
        await runBody(body);
      }
    } else {
      if (varNames.length !== 2) {
        throw new Error('for: object requires 2 variables (key, value)');
      }
      const [k, v] = varNames;
      const entries = Object.entries(source);
      for (let i = 0; i < entries.length; i++) {
        ctx.vars[k] = entries[i][0];
        ctx.vars[v] = entries[i][1];
        ctx.vars.index = i;
        await runBody(body);
      }
    }

    // Cleanup
    for (const name of varNames) delete ctx.vars[name];
    delete ctx.vars.index;
  },
};
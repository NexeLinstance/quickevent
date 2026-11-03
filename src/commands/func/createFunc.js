// src/commands/func/createFunc.js

const funcRegistry = new WeakMap();

export default {
  name: 'createFunc',
  kind: 'flow',
  schema: ['array', 'array'],
  async run(ctx, [argSpec, body]) {
    const funcName = ctx.attribute;
    if (!funcName) return;

    if (!funcRegistry.has(ctx.element)) {
      funcRegistry.set(ctx.element, {});
    }
    
    // Parse args: ["arg1", {"arg2": "default"}]
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

    funcRegistry.get(ctx.element)[funcName] = {
      args,
      body
    };
  },
  getRegistry() { return funcRegistry; }
};
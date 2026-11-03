// src/commands/func/createFunc.js

const FORBIDDEN_NAMES = new Set(['__proto__', 'constructor', 'prototype']);
const VALID_NAME = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export default {
  name: 'createFunc',
  kind: 'flow',
  schema: ['array', 'array'],
  async run(ctx, [argSpec, body]) {
    const funcName = ctx.attribute;
    if (!funcName) throw new Error('createFunc must be used as an attribute name');

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

    // Validate arg names for security
    for (const arg of args) {
      if (!VALID_NAME.test(arg.name) || FORBIDDEN_NAMES.has(arg.name)) {
        throw new Error(`createFunc: invalid argument name "${arg.name}"`);
      }
    }

    ctx.element._qeFunctions = ctx.element._qeFunctions || {};
    ctx.element._qeFunctions[funcName] = {
      args,
      body
    };
  },
};
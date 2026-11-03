// src/commands/func/runFunc.js

export default {
  name: 'runFunc',
  kind: 'effect',
  capabilities: ['dom.write'],
  async run(ctx, [path, name, ...args]) {
    try {
      const module = await import(path);
      const fn = module[name];
      if (typeof fn !== 'function') {
        throw new Error(`"${name}" not found in ${path}`);
      }
      return await fn(...args);
    } catch (err) {
      throw new Error(`runFunc failed (${path}.${name}): ${err.message}`);
    }
  },
};
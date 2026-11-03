// src/commands/func/runFunc.js

export default {
  name: 'runFunc',
  kind: 'effect',
  capabilities: ['dom.write'],
  async run(ctx, [path, name, ...args]) {
    try {
      // Basic validation for URL
      const url = new URL(path, window.location.href);
      
      // Block javascript:, data:, and other dangerous protocols
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error('runFunc: blocked unsafe protocol');
      }

      // Note: CSP in the browser will enforce origin restrictions
      const module = await import(/* @vite-ignore */ url.href);
      
      if (!Object.prototype.hasOwnProperty.call(module, name)) {
        throw new Error(`"${name}" not found in ${path}`);
      }
      
      const fn = module[name];
      if (typeof fn !== 'function') {
        throw new Error(`"${name}" is not a function`);
      }
      
      return await fn(...args);
    } catch (err) {
      throw new Error(`runFunc failed (${path}.${name}): ${err.message}`);
    }
  },
};
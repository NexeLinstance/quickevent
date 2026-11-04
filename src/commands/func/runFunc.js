// src/commands/func/runFunc.js
import { policy } from '../../core/security.js';

export default {
  name: 'runFunc',
  kind: 'effect',
  capabilities: ['dom.write', 'code.execute'],
  async run(ctx, [path, name, ...args]) {
    let url;
    try {
      url = new URL(path, window.location.href);
    } catch {
      throw new Error('runFunc: invalid URL');
    }

    // Block dangerous protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('runFunc: blocked unsafe protocol');
    }

    // Same-origin by default. Cross-origin requires explicit opt-in.
    if (url.origin !== window.location.origin && !policy.allowedModuleOrigins.includes(url.origin)) {
      throw new Error('runFunc: cross-origin module not allowed');
    }

    try {
      const module = await import(/* @vite-ignore */ url.href);
      
      // Only own exports (not inherited)
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
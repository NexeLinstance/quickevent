// src/commands/util/redirect.js

export default {
  name: 'redirect',
  kind: 'effect',
  blocking: true,
  capabilities: ['nav.redirect'],
  schema: ['string'],
  run(ctx, [url]) {
    const target = String(url).trim();
    
    if (/^(javascript|data|vbscript):/i.test(target)) {
      throw new Error('redirect: blocked unsafe scheme');
    }

    try {
      const parsed = new URL(target, window.location.href);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error(`redirect: blocked protocol ${parsed.protocol}`);
      }
      window.location.assign(parsed.href);
    } catch (err) {
      throw new Error(`redirect: invalid URL or unsafe protocol`);
    }
  },
};
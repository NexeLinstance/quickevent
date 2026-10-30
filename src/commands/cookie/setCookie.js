// src/commands/cookie/setCookie.js

export default {
  name: 'setCookie',
  kind: 'effect',
  blocking: false,
  capabilities: ['browser.cookie'],
  schema: ['string', 'string', 'number?'],
  run(ctx, [key, value, maxAgeDays = 30]) {
    const expires = new Date(Date.now() + maxAgeDays * 864e5).toUTCString();
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  },
};
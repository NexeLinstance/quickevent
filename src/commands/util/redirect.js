// src/commands/util/redirect.js

export default {
  name: 'redirect',
  kind: 'effect',
  blocking: true,
  capabilities: ['nav.redirect'],
  schema: ['string'],
  run(ctx, [url]) {
    location.href = url;
  },
};
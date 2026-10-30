// src/commands/util/reload.js

export default {
  name: 'reload',
  kind: 'effect',
  blocking: true,
  capabilities: ['nav.reload'],
  schema: [],
  run() {
    location.reload();
  },
};
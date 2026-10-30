// src/commands/util/pasteClipboard.js

export default {
  name: 'pasteClipboard',
  kind: 'effect',
  blocking: true,
  capabilities: ['clipboard.read'],
  schema: ['selector'],
  async run(ctx, [selector]) {
    let text;
    try {
      text = await navigator.clipboard.readText();
    } catch (err) {
      throw new Error(`clipboard read failed: ${err.message}`);
    }
    ctx.dom.query(selector).forEach(el => { el.value = text; });
  },
};
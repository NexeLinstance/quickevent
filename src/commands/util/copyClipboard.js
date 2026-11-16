// src/commands/util/copyClipboard.js

export default {
  name: 'copyClipboard',
  kind: 'effect',
  blocking: true,
  capabilities: ['clipboard.write'],

  schema: ['selector', 'any?'],
  async run(ctx, [selector, value]) {
    let text = value;


    if (text == null || text === '') {
      const el = ctx.dom.query(selector)[0];
      if (!el) return;


      if ('value' in el && el.value != null) {
        text = el.value;
      } else {
        text = el.textContent ?? '';
      }
    }

    try {
      await navigator.clipboard.writeText(String(text));
    } catch (err) {
      throw new Error(`clipboard write failed: ${err.message}`);
    }
  },
};
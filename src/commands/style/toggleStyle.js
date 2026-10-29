// src/commands/style/toggleStyle.js

function parseOne(style) {
  if (typeof style !== 'string') return null;
  const idx = style.indexOf(':');
  if (idx < 1) return { key: style.trim(), value: null };
  return {
    key: style.slice(0, idx).trim(),
    value: style.slice(idx + 1).trim(),
  };
}

export default {
  name: 'toggleStyle',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'number?'],
  run(ctx, [selector, style, delay = 0]) {
    const parsed = parseOne(style);
    if (!parsed || !parsed.key) return;

    return ctx.dom.each(
      selector,
      el => {
        const current = el.style.getPropertyValue(parsed.key);
        if (current) {
          el.style.removeProperty(parsed.key);
        } else if (parsed.value != null) {
          el.style.setProperty(parsed.key, parsed.value);
        }
      },
      delay
    );
  },
};
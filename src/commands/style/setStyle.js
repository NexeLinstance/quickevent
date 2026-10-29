// src/commands/style/setStyle.js

function parseStyle(style) {
  const out = {};
  if (typeof style !== 'string') return out;
  for (const part of style.split(';')) {
    const idx = part.indexOf(':');
    if (idx < 1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key && value) out[key] = value;
  }
  return out;
}

export default {
  name: 'setStyle',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'number?'],
  run(ctx, [selector, style, delay = 0]) {
    const props = parseStyle(style);
    return ctx.dom.each(
      selector,
      el => {
        el.style.cssText = '';
        for (const [key, value] of Object.entries(props)) {
          el.style.setProperty(key, value);
        }
      },
      delay
    );
  },
};
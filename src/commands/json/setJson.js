// src/commands/json/setJson.js

export default {
  name: 'setJson',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'any'],
  run(ctx, [selector, name, data]) {
    const key = `data-json-${name}`;
    const jsonString = JSON.stringify(data);

    return ctx.dom.each(
      selector,
      el => { el.setAttribute(key, jsonString); },
      0
    );
  },
};
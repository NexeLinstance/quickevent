// src/commands/json/getJson.js

export default {
  name: 'getJson',
  kind: 'source',
  capabilities: ['dom.read'],
  schema: ['selector', 'string', 'string?'],
  resolve(ctx, [selector, name, alias]) {
    const key = `data-json-${name}`;
    const el = ctx.dom.query(selector)[0];
    
    if (!el) return undefined;

    const jsonString = el.getAttribute(key);
    if (!jsonString) return undefined;

    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      throw new Error(`getJson: Invalid JSON stored in ${key}`);
    }

    if (alias) ctx.vars[alias] = parsedData;
    return parsedData;
  },
};
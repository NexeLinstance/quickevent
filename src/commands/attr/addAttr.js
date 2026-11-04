// src/commands/attr/addAttr.js
import { checkAttrName, checkAttrValue } from '../../core/attrGuard.js';

export default {
  name: 'addAttr',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'any', 'number?'],
  run(ctx, [selector, name, value, delay = 0]) {
    const n = checkAttrName(name);
    const v = checkAttrValue(n, value);
    return ctx.dom.each(
      selector,
      el => { el.setAttribute(n, v); },
      delay
    );
  },
};
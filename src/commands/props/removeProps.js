import { checkAttrName } from '../../core/attrGuard.js';

function parseProps(spec) {
  if (typeof spec !== 'string') return [];
  return spec.split(/\s+/).filter(Boolean);
}

export default {
  name: 'removeProps',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'number?'],
  run(ctx, [selector, spec, delay = 0]) {
    const props = parseProps(spec).map(checkAttrName);
    if (!props.length) return;
    return ctx.dom.each(
      selector,
      el => { for (const name of props) el.removeAttribute(name); },
      delay
    );
  },
};
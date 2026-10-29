// src/commands/props/addProps.js

function parseProps(spec) {
  if (typeof spec !== 'string') return [];
  return spec.split(/\s+/).filter(Boolean);
}

export default {
  name: 'addProps',
  kind: 'effect',
  blocking: false,
  capabilities: ['dom.write'],
  schema: ['selector', 'string', 'number?'],
  run(ctx, [selector, spec, delay = 0]) {
    const props = parseProps(spec);
    if (!props.length) return;
    return ctx.dom.each(
      selector,
      el => { for (const name of props) el.setAttribute(name, ''); },
      delay
    );
  },
};
// src/commands/func/callFunc.js

export default {
  name: 'callFunc',
  kind: 'flow',
  schema: ['string', 'selector', 'array?'],
  async run(ctx, [funcName, selector, callArgs = []], { runBody }) {
    const targetEl = ctx.dom.query(selector)[0];
    if (!targetEl) throw new Error(`callFunc: target element "${selector}" not found`);

    const raw = targetEl.getAttribute(funcName);
    if (!raw) throw new Error(`callFunc: function "${funcName}" not found on target`);

    let effects;
    try {
      effects = JSON.parse(raw);
    } catch {
      throw new Error(`callFunc: invalid JSON in "${funcName}" attribute`);
    }

    // Parse the createFunc array: ["createFunc", ["arg1", {"arg2": "def"}], ["body_cmd"]]
    if (!Array.isArray(effects) || effects[0] !== 'createFunc') {
      throw new Error(`callFunc: attribute "${funcName}" is not a valid function definition`);
    }

    const [, argSpec, body] = effects;
    
    const args = [];
    if (Array.isArray(argSpec)) {
      for (const item of argSpec) {
        if (typeof item === 'string') {
          args.push({ name: item, default: undefined });
        } else if (item && typeof item === 'object') {
          for (const [k, v] of Object.entries(item)) {
            args.push({ name: k, default: v });
          }
        }
      }
    }

    for (let i = 0; i < args.length; i++) {
      const argDef = args[i];
      let val = callArgs[i];
      if (val === undefined) {
        val = argDef.default;
      }
      ctx.vars[argDef.name] = val;
    }

    await runBody(body);
  },
};
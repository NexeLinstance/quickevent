// src/core/interpreter.js
import { resolveAll, resolveSourceArgs } from './resolver.js';
import { validateSafe } from './schema.js';
import { normalizeError } from './errors.js';

export async function runEffects(effects, ctx) {
  const list = Array.isArray(effects[0]) ? effects : [effects];

  for (let i = 0; i < list.length; i++) {
    const effect = list[i];

    if (!Array.isArray(effect) || typeof effect[0] !== 'string') {
      ctx.report(
        normalizeError(
          new Error('Command must be an array starting with a string name.'),
          { command: { name: String(effect?.[0]), index: i } }
        ),
        { command: { name: String(effect?.[0]), index: i } }
      );
      continue;
    }

    const [name, ...rawArgs] = effect;
    const commandInfo = { name, index: i };

    let desc;
    try {
      desc = ctx.registry.require(name);
    } catch (err) {
      ctx.report(err, { command: commandInfo });
      continue;
    }

    if (desc.kind === 'flow') {
      try {
        await desc.run(ctx, rawArgs, { runBody: body => runEffects(body, ctx) });
      } catch (err) {
        ctx.report(err, { command: commandInfo });
      }
      continue;
    }

    let resolvedArgs;
    try {
      if (desc.kind === 'source') {
        // Source commands receive raw template strings in their args;
        // they render them after setting their own aliases.
        resolvedArgs = await resolveSourceArgs(rawArgs, ctx);
      } else {
        resolvedArgs = await resolveAll(rawArgs, ctx);
      }
    } catch (err) {
      ctx.report(err, { command: commandInfo });
      continue;
    }

    if (desc.schema) {
      const schemaErr = validateSafe(name, desc.schema, resolvedArgs);
      if (schemaErr) {
        ctx.report(schemaErr, { command: commandInfo });
        continue;
      }
    }

    try {
      const result =
        desc.kind === 'source'
          ? await desc.resolve(ctx, resolvedArgs)
          : desc.run(ctx, resolvedArgs);

      if (desc.kind === 'effect') {
        if (desc.blocking) {
          await result;
        } else if (result instanceof Promise) {
          ctx.scheduler.push(result);
        }
      }
    } catch (err) {
      ctx.report(err, { command: commandInfo });
    }
  }
}

export async function runEvent(effects, ctx) {
  await runEffects(effects, ctx);
  await ctx.scheduler.flush();
}
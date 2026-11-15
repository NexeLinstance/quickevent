// src/core/interpreter.js
import { resolveAll, resolveSourceArgs } from './resolver.js';
import { validateSafe } from './schema.js';
import { normalizeError } from './errors.js';

export async function runEffects(effects, ctx) {
  const list = Array.isArray(effects[0]) ? effects : [effects];

  let pending = [];
  let needAwaitPrev = false;
  let prevPromise = null;

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

    if (name === 'then') {
      needAwaitPrev = true;
      continue;
    }

    let desc;
    try {
      desc = ctx.registry.require(name);
    } catch (err) {
      ctx.report(err, { command: commandInfo });
      continue;
    }

    // ── wait: special case ─────────────────────────────────
    if (name === 'wait') {
      if (pending.length) {
        await Promise.all(pending);
        pending = [];
      }
      needAwaitPrev = false;

      let resolvedArgs;
      try {
        resolvedArgs = await resolveAll(rawArgs, ctx);
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
        await desc.run(ctx, resolvedArgs);
      } catch (err) {
        ctx.report(err, { command: commandInfo });
      }
      prevPromise = Promise.resolve();
      continue;
    }

    // ── flow ───────────────────────────────────────────────
    if (desc.kind === 'flow') {
      if (needAwaitPrev && prevPromise) {
        await prevPromise;
      }
      needAwaitPrev = false;

      const promise = (async () => {
        try {
          await desc.run(ctx, rawArgs, {
            runBody: body => runEffects(body, {
              ...ctx,
              ifStack: [...ctx.ifStack],
              loopStack: [...ctx.loopStack],
            }),
          });
        } catch (err) {
          ctx.report(err, { command: commandInfo });
        }
      })();

      prevPromise = promise;
      await promise;
      continue;
    }

    // ── source ─────────────────────────────────────────────
    if (desc.kind === 'source') {
      let resolvedArgs;
      try {
        resolvedArgs = await resolveSourceArgs(rawArgs, ctx);
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

      if (needAwaitPrev && prevPromise) {
        await prevPromise;
      }
      needAwaitPrev = false;

      const promise = (async () => {
        try {
          await desc.resolve(ctx, resolvedArgs);
        } catch (err) {
          ctx.report(err, { command: commandInfo });
        }
      })();

      prevPromise = promise;
      await promise;
      continue;
    }

    // ── effect ─────────────────────────────────────────────
    let resolvedArgs;
    try {
      resolvedArgs = await resolveAll(rawArgs, ctx);
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

    if (needAwaitPrev && prevPromise) {
      await prevPromise;
    }
    needAwaitPrev = false;

    const promise = (async () => {
      try {
        const result = desc.run(ctx, resolvedArgs);
        if (result instanceof Promise) {
          await result;
        }
      } catch (err) {
        ctx.report(err, { command: commandInfo });
      }
    })();

    pending.push(promise);
    prevPromise = promise;
  }

  if (pending.length) {
    await Promise.all(pending);
  }
}

export async function runEvent(effects, ctx) {
  await runEffects(effects, ctx);
}
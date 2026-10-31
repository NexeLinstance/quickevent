// src/core/interpreter.js
import { resolveAll, resolveSourceArgs } from './resolver.js';
import { validateSafe } from './schema.js';
import { normalizeError } from './errors.js';

export async function runEffects(effects, ctx) {
  const list = Array.isArray(effects[0]) ? effects : [effects];
  let waitForPrev = false;
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

    // ── then ───────────────────────────────────────────────
    if (name === 'then') {
      waitForPrev = true;
      continue;
    }

    let desc;
    try {
      desc = ctx.registry.require(name);
    } catch (err) {
      ctx.report(err, { command: commandInfo });
      prevPromise = Promise.resolve();
      waitForPrev = false;
      continue;
    }

    // ── flow ───────────────────────────────────────────────
    if (desc.kind === 'flow') {
      const exec = async () => {
        try {
          await desc.run(ctx, rawArgs, {
            runBody: body => runEffects(body, ctx),
          });
        } catch (err) {
          ctx.report(err, { command: commandInfo });
        }
      };

      let promise;
      if (waitForPrev && prevPromise) {
        promise = (async () => {
          await prevPromise;
          await exec();
        })();
      } else {
        promise = exec();
      }
      prevPromise = promise;
      waitForPrev = false;
      continue;
    }

    // ── source ─────────────────────────────────────────────
    // Sources must be awaited immediately, because they modify ctx.vars.
    if (desc.kind === 'source') {
      let resolvedArgs;
      try {
        resolvedArgs = await resolveSourceArgs(rawArgs, ctx);
      } catch (err) {
        ctx.report(err, { command: commandInfo });
        prevPromise = Promise.resolve();
        waitForPrev = false;
        continue;
      }

      if (desc.schema) {
        const schemaErr = validateSafe(name, desc.schema, resolvedArgs);
        if (schemaErr) {
          ctx.report(schemaErr, { command: commandInfo });
          prevPromise = Promise.resolve();
          waitForPrev = false;
          continue;
        }
      }

      if (waitForPrev && prevPromise) {
        await prevPromise;
      }

      try {
        await desc.resolve(ctx, resolvedArgs);
      } catch (err) {
        ctx.report(err, { command: commandInfo });
      }

      prevPromise = Promise.resolve();
      waitForPrev = false;
      continue;
    }

    // ── effect ─────────────────────────────────────────────
    let resolvedArgs;
    try {
      resolvedArgs = await resolveAll(rawArgs, ctx);
    } catch (err) {
      ctx.report(err, { command: commandInfo });
      prevPromise = Promise.resolve();
      waitForPrev = false;
      continue;
    }

    if (desc.schema) {
      const schemaErr = validateSafe(name, desc.schema, resolvedArgs);
      if (schemaErr) {
        ctx.report(schemaErr, { command: commandInfo });
        prevPromise = Promise.resolve();
        waitForPrev = false;
        continue;
      }
    }

    // DO NOT extract delay from args here. 
    // The command itself knows which arg is the delay (e.g. setText has delay as 3rd arg).
    // We just pass all args to the command.

    const execute = async () => {
      try {
        const result = desc.run(ctx, resolvedArgs);
        if (result instanceof Promise) {
          await result;
        }
      } catch (err) {
        ctx.report(err, { command: commandInfo });
      }
    };

    let promise;
    if (waitForPrev && prevPromise) {
      promise = (async () => {
        await prevPromise;
        await execute();
      })();
    } else {
      promise = execute();
    }

    prevPromise = promise;
    waitForPrev = false;
  }

  if (prevPromise) await prevPromise;
}

export async function runEvent(effects, ctx) {
  await runEffects(effects, ctx);
  await ctx.scheduler.flush();
}
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

      // If preceded by then, wait for prev.
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

    let delay = 0;
    let execArgs = resolvedArgs;
    if (desc.name !== 'animate' && desc.schema) {
      const lastType = desc.schema[desc.schema.length - 1];
      if (lastType === 'number?' || lastType === 'number') {
        const last = resolvedArgs[resolvedArgs.length - 1];
        if (typeof last === 'number') {
          delay = last;
          execArgs = resolvedArgs.slice(0, -1);
        }
      }
    }

    const execute = async () => {
      try {
        const result = desc.run(ctx, execArgs);
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
        if (delay > 0) await new Promise(r => setTimeout(r, delay));
        await execute();
      })();
    } else if (delay > 0) {
      promise = new Promise(resolve => {
        setTimeout(async () => {
          await execute();
          resolve();
        }, delay);
      });
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
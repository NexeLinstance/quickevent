// src/core/resolver.js
import { renderTemplate } from '../expr/template.js';
import { createError } from './errors.js';

// Resolve a single argument.
// - "this"          → ctx.element
// - ["getText", ...]→ run the source command, return its value
// - "hello {name}"  → render the template with ctx.vars
// - ["a", "b"]      → resolve each item (literal array)
// - { key: value }  → resolve each value (literal object)
// - anything else   → returned as-is
export async function resolveArg(arg, ctx) {
  // "this"
  if (arg === 'this') {
    return ctx.element ?? null;
  }

  // Array
  if (Array.isArray(arg)) {
    const [head] = arg;

    // Is it a source command? (e.g. ["getText", "#el"])
    if (typeof head === 'string' && ctx.registry.has(head)) {
      const desc = ctx.registry.get(head);

      if (desc.kind !== 'source') {
        throw createError('E011', { name: head });
      }

      // For source commands, do not eagerly render template strings
      // in their arguments. The source itself decides when to render.
      const sourceArgs = await resolveSourceArgs(arg.slice(1), ctx);

      const value = await desc.resolve(ctx, sourceArgs);

      if (value === undefined) {
        throw createError('E012', { name: head });
      }

      return value;
    }

    // Literal array — resolve each item.
    const out = [];
    for (const item of arg) {
      out.push(await resolveArg(item, ctx));
    }
    return out;
  }

  // Plain object
  if (arg != null && typeof arg === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(arg)) {
      out[key] = await resolveArg(value, ctx);
    }
    return out;
  }

  // Template string with { ... }
  if (typeof arg === 'string' && arg.includes('{')) {
    const result = renderTemplate(arg, ctx.vars);
    // Propagate store (assignment) into ctx.vars
    if (result.store) {
      ctx.vars[result.store.key] = result.store.value;
    }
    return result.value;
  }

  // Anything else
  return arg;
}

// Resolve an array of arguments.
export async function resolveAll(args, ctx) {
  const out = [];
  for (const arg of args) {
    out.push(await resolveArg(arg, ctx));
  }
  return out;
}

// Resolve arguments for a source command.
//
// Source commands are special because they may need to render their own
// template strings (e.g. the `expr` argument of getText/getAttr/getValue).
// The rule we follow:
//   - arg[0] (the selector) is ALWAYS rendered — it's a CSS selector,
//     and users may want to build it from variables: "{scoping} p".
//   - The LAST string argument that contains "{" is kept raw — it's
//     almost certainly the `expr` argument, which the source command
//     will render itself against its own aliases.
//   - Everything else is resolved normally (nested sources are resolved
//     fully; objects/arrays are resolved recursively but kept raw for
//     template strings).
export async function resolveSourceArgs(args, ctx) {
  const out = [];
  const lastIdx = args.length - 1;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const isLast = i === lastIdx;

    // 1. First argument (selector) — always render.
    if (i === 0 && typeof arg === 'string' && arg.includes('{')) {
      out.push(await resolveArg(arg, ctx));
      continue;
    }

    // 2. Last string template — keep raw (likely the `expr` argument).
    if (isLast && typeof arg === 'string' && arg.includes('{')) {
      out.push(arg);
      continue;
    }

    // 3. Nested source — resolve fully.
    if (Array.isArray(arg) && typeof arg[0] === 'string' && ctx.registry.has(arg[0])) {
      out.push(await resolveArg(arg, ctx));
      continue;
    }

    // 4. Everything else — resolve raw (template strings stay raw).
    out.push(await resolveArgRaw(arg, ctx));
  }
  return out;
}

// Like resolveArg but does NOT render template strings.
async function resolveArgRaw(arg, ctx) {
  if (arg === 'this') return ctx.element ?? null;

  if (Array.isArray(arg)) {
    // If it's a nested source, resolve it fully.
    if (typeof arg[0] === 'string' && ctx.registry.has(arg[0])) {
      return resolveArg(arg, ctx);
    }
    const out = [];
    for (const item of arg) {
      out.push(await resolveArgRaw(item, ctx));
    }
    return out;
  }

  if (arg != null && typeof arg === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(arg)) {
      out[key] = await resolveArgRaw(value, ctx);
    }
    return out;
  }

  // Leave template strings untouched.
  return arg;
}
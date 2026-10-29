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
// Template strings are left as-is (not rendered), because sources
// may need to render them after they have set their own aliases.
export async function resolveSourceArgs(args, ctx) {
  const out = [];
  for (const arg of args) {
    // Keep template strings raw for sources.
    if (typeof arg === 'string' && arg.includes('{')) {
      out.push(arg);
      continue;
    }

    // Nested sources are still resolved.
    if (Array.isArray(arg) && typeof arg[0] === 'string' && ctx.registry.has(arg[0])) {
      out.push(await resolveArg(arg, ctx));
      continue;
    }

    // Anything else (literals, arrays, objects) — resolve normally,
    // but be careful: nested strings inside them should also remain raw.
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
// src/commands/flow/if.js
import { createError } from '../../core/errors.js';
import { renderTemplate } from '../../expr/template.js';

// Normalize a condition into { expr, vars } or throw.
// Accepts:
//   "{ score > 100 }"
//   ["{ score > 50 }", "{ score < 90 }"]
//   ["{ score > 50 }", "or", "{ score < 90 }"]
//   ["{ score > 50 }", "{ score < 60 }", "or", "{ score > 90 }"]
export function buildCondition(conditions, ctx) {
  // Single condition
  if (typeof conditions === 'string') {
    return evaluateExpression(conditions, ctx);
  }

  if (!Array.isArray(conditions)) {
    throw new Error('if: condition must be a string or array');
  }

  // Array of conditions/operators
  const parts = [];
  for (const part of conditions) {
    if (part === 'and' || part === 'or') {
      parts.push({ type: 'op', value: part });
    } else if (typeof part === 'string') {
      parts.push({ type: 'cond', value: evaluateExpression(part, ctx) });
    } else if (Array.isArray(part)) {
      // Nested array (e.g. ["{a}"] from the parser's grammar)
      if (part.length === 1 && typeof part[0] === 'string') {
        parts.push({ type: 'cond', value: evaluateExpression(part[0], ctx) });
      } else {
        throw new Error('if: invalid nested condition');
      }
    } else {
      throw new Error('if: invalid condition part');
    }
  }

  // Apply "and" first, then "or" (standard precedence).
  let i = 1;
  while (i < parts.length) {
    if (parts[i].type === 'op' && parts[i].value === 'and') {
      const left = parts[i - 1].value;
      const right = parts[i + 1].value;
      parts.splice(i - 1, 3, { type: 'cond', value: left && right });
      i = 1;
    } else {
      i += 2;
    }
  }

  let result = parts.length ? parts[0].value : false;
  for (let j = 1; j < parts.length; j += 2) {
    if (parts[j].value === 'or') {
      result = result || parts[j + 1].value;
    }
  }

  return Boolean(result);
}

function evaluateExpression(expr, ctx) {
  if (typeof expr !== 'string') return Boolean(expr);
  const clean = expr.replace(/^\{|\}$/g, '').trim();
  if (!clean) return false;
  const result = renderTemplate(`{${clean}}`, ctx.vars);
  return Boolean(result.value);
}

export default {
  name: 'if',
  kind: 'flow',
  schema: ['any', 'array'],
  async run(ctx, [conditions, body], { runBody }) {
    // Reset chain state so each "if" starts fresh.
    ctx.branch = { ran: false, active: true };

    const ok = buildCondition(conditions, ctx);
    if (ok) {
      ctx.branch.ran = true;
      await runBody(body);
    }
  },
};
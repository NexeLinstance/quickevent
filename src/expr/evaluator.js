// src/expr/evaluator.js
import { BUILTINS } from './builtins.js';

export function evaluate(ast, vars, ctx = {}) {
  return evalNode(ast, vars, ctx);
}

function evalNode(node, vars, ctx) {
  switch (node.type) {
    case 'Literal':
      return { value: node.value, store: null };

    case 'Identifier': {
      // 1. If user defined it, use it.
      if (Object.prototype.hasOwnProperty.call(vars, node.name)) {
        return { value: vars[node.name], store: null };
      }

      // 2. Built-in: window (Returns the REAL browser window object)
      if (node.name === 'window') {
        return { value: typeof window !== 'undefined' ? window : null, store: null };
      }

      // 3. Built-in: event (Returns the current event if available)
      if (node.name === 'event') {
        return { value: typeof window !== 'undefined' ? window.event : null, store: null };
      }

      // 4. Built-in: scopingSelector
      if (node.name === 'scopingSelector') {
        let val = null;
        if (ctx._currentElement) {
          const el = ctx._currentElement.closest('[data-scoping]');
          if (el) {
            const scopeVal = el.getAttribute('data-scoping');
            val = `[data-scoping="${scopeVal}"]`;
          } else {
            // NEW: Log a warning for easier debugging
            console.warn(
              '[QE] scopingSelector is null. No parent element with [data-scoping] was found.'
            );
          }
        }
        return { value: val, store: null };
      }

      // 5. Unknown
      throw new Error(`Unknown identifier: "${node.name}"`);
    }

    case 'Array': {
      const items = node.items.map(item => evalNode(item, vars, ctx).value);
      return { value: items, store: null };
    }

    case 'Unary': {
      const v = evalNode(node.arg, vars, ctx).value;
      if (node.op === '!') return { value: !v, store: null };
      if (node.op === '-') return { value: -v, store: null };
      if (node.op === '+') return { value: +v, store: null };
      throw new Error(`Unknown unary operator: ${node.op}`);
    }

    case 'Binary':
      return evalBinary(node, vars, ctx);

    case 'Conditional': {
      const t = evalNode(node.test, vars, ctx).value;
      return t ? evalNode(node.then, vars, ctx) : evalNode(node.else, vars, ctx);
    }

    case 'Member': {
      const obj = evalNode(node.object, vars, ctx).value;
      const key =
        typeof node.property === 'string'
          ? node.property
          : evalNode(node.property, vars, ctx).value;

      if (obj == null) return { value: undefined, store: null };
      
      // Native JS access to window properties
      return { value: obj[key], store: null };
    }

    case 'Call': {
      const callee = node.callee;
      if (callee.type !== 'Identifier') {
        throw new Error('Only builtin functions can be called.');
      }
      
      if (!Object.prototype.hasOwnProperty.call(BUILTINS, callee.name)) {
        throw new Error(`Unknown function: "${callee.name}"`);
      }
      
      const fn = BUILTINS[callee.name];
      if (typeof fn !== 'function') {
        throw new Error(`Unknown function: "${callee.name}"`);
      }
      
      const args = node.args.map(a => evalNode(a, vars, ctx).value);
      return { value: fn(...args), store: null };
    }

    default:
      throw new Error(`Unknown AST node: ${node.type}`);
  }
}

function evalBinary(node, vars, ctx) {
  const op = node.op;

  if (op === '=' || op === '+=' || op === '-=' || op === '*=' || op === '/=' || op === '%=') {
    if (node.left.type !== 'Identifier') {
      throw new Error('Assignment target must be an identifier.');
    }
    const key = node.left.name;
    const current = Object.prototype.hasOwnProperty.call(vars, key)
      ? vars[key]
      : undefined;

    const rhs = evalNode(node.right, vars, ctx).value;
    let next;

    if (op === '=') {
      next = rhs;
    } else if (op === '+=' && typeof current === 'string') {
      next = current + rhs;
    } else {
      const a = Number(current), b = Number(rhs);
      if (op === '+=') next = a + b;
      else if (op === '-=') next = a - b;
      else if (op === '*=') next = a * b;
      else if (op === '/=') next = a / b;
      else if (op === '%=') next = a % b;
    }

    vars[key] = next;
    return { value: next, store: { key, value: next } };
  }

  if (op === '&&') {
    const l = evalNode(node.left, vars, ctx).value;
    if (!l) return { value: l, store: null };
    return { value: evalNode(node.right, vars, ctx).value, store: null };
  }
  if (op === '||') {
    const l = evalNode(node.left, vars, ctx).value;
    if (l) return { value: l, store: null };
    return { value: evalNode(node.right, vars, ctx).value, store: null };
  }

  const l = evalNode(node.left, vars, ctx).value;
  const r = evalNode(node.right, vars, ctx).value;

  switch (op) {
    case '+':  return { value: l + r, store: null };
    case '-':  return { value: l - r, store: null };
    case '*':  return { value: l * r, store: null };
    case '/':  return { value: l / r, store: null };
    case '%':  return { value: l % r, store: null };
    case '==': return { value: l == r, store: null };
    case '!=': return { value: l != r, store: null };
    case '===':return { value: l === r, store: null };
    case '!==':return { value: l !== r, store: null };
    case '<':  return { value: l < r, store: null };
    case '>':  return { value: l > r, store: null };
    case '<=': return { value: l <= r, store: null };
    case '>=': return { value: l >= r, store: null };
    case '**': return { value: l ** r, store: null };
    default:   throw new Error(`Unknown binary operator: ${op}`);
  }
}
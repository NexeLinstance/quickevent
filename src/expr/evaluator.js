// src/expr/evaluator.js
import { BUILTINS } from './builtins.js';

// Evaluates an AST against a variables object.
// Returns { value, store } where `store` is set when an assignment
// happened, so the caller can persist it (e.g. write to element attribute).

export function evaluate(ast, vars) {
  return evalNode(ast, vars);
}

function evalNode(node, vars) {
  switch (node.type) {
    case 'Literal':
      return { value: node.value, store: null };

    case 'Identifier': {
      if (!Object.prototype.hasOwnProperty.call(vars, node.name)) {
        throw new Error(`Unknown identifier: "${node.name}"`);
      }
      return { value: vars[node.name], store: null };
    }

    case 'Array': {
      const items = node.items.map(item => evalNode(item, vars).value);
      return { value: items, store: null };
    }

    case 'Unary': {
      const v = evalNode(node.arg, vars).value;
      if (node.op === '!') return { value: !v, store: null };
      if (node.op === '-') return { value: -v, store: null };
      if (node.op === '+') return { value: +v, store: null };
      throw new Error(`Unknown unary operator: ${node.op}`);
    }

    case 'Binary':
      return evalBinary(node, vars);

    case 'Conditional': {
      const t = evalNode(node.test, vars).value;
      return t ? evalNode(node.then, vars) : evalNode(node.else, vars);
    }

    case 'Member': {
  const obj = evalNode(node.object, vars).value;
  const key =
    typeof node.property === 'string'
      ? node.property
      : evalNode(node.property, vars).value;

  if (obj == null) return { value: undefined, store: null };
  if (!Object.prototype.hasOwnProperty.call(Object(obj), key)) {
    return { value: undefined, store: null };
  }
  return { value: obj[key], store: null };
}

    case 'Call': {
      const callee = node.callee;
      if (callee.type !== 'Identifier') {
        throw new Error('Only builtin functions can be called.');
      }
      const fn = BUILTINS[callee.name];
      if (typeof fn !== 'function') {
        throw new Error(`Unknown function: "${callee.name}"`);
      }
      const args = node.args.map(a => evalNode(a, vars).value);
      return { value: fn(...args), store: null };
    }

    default:
      throw new Error(`Unknown AST node: ${node.type}`);
  }
}

function evalBinary(node, vars) {
  const op = node.op;

  // Assignment operators
  if (op === '=' || op === '+=' || op === '-=' || op === '*=' || op === '/=' || op === '%=') {
    if (node.left.type !== 'Identifier') {
      throw new Error('Assignment target must be an identifier.');
    }
    const key = node.left.name;
    const current = Object.prototype.hasOwnProperty.call(vars, key)
      ? vars[key]
      : undefined;

    const rhs = evalNode(node.right, vars).value;
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

  // Short-circuit
  if (op === '&&') {
    const l = evalNode(node.left, vars).value;
    if (!l) return { value: l, store: null };
    return { value: evalNode(node.right, vars).value, store: null };
  }
  if (op === '||') {
    const l = evalNode(node.left, vars).value;
    if (l) return { value: l, store: null };
    return { value: evalNode(node.right, vars).value, store: null };
  }

  const l = evalNode(node.left, vars).value;
  const r = evalNode(node.right, vars).value;

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

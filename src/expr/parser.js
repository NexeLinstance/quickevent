// src/expr/parser.js
import { tokenize } from './tokenizer.js';

const PRECEDENCE = {
  '=': 1, '+=': 1, '-=': 1, '*=': 1, '/=': 1, '%=': 1,
  '?': 1.5,   // conditional — lower than '||', higher than '='
  '||': 2,
  '&&': 3,
  '==': 4, '!=': 4, '===': 4, '!==': 4,
  '<': 5, '>': 5, '<=': 5, '>=': 5,
  '+': 6, '-': 6,
  '*': 7, '/': 7, '%': 7,
  '**': 8,
};

export function parse(source) {
  const tokens = tokenize(source);
  let pos = 0;

  function peek() { return tokens[pos]; }
  function next() { return tokens[pos++]; }

  function expect(value) {
    const t = peek();
    if (t.value !== value) throw { code: 'E004', pos: t.pos };
    return next();
  }

  function parseExpr(minPrec = 0) {
  let left = parseUnary();

  while (true) {
    const t = peek();
    if (t.type !== 'op') break;

    const prec = PRECEDENCE[t.value];
    if (prec == null || prec < minPrec) break;

    const op = next().value;

    if (op === '?') {
      const thenExpr = parseExpr(0);
      expect(':');
      const elseExpr = parseExpr(0);
      left = { type: 'Conditional', test: left, then: thenExpr, else: elseExpr };
      continue;
    }

    const right = parseExpr(prec + 1);
    left = { type: 'Binary', op, left, right };
  }

  return left;
}

  function parseUnary() {
    const t = peek();
    if (t.type === 'op' && (t.value === '!' || t.value === '-' || t.value === '+')) {
      next();
      const arg = parseUnary();
      return { type: 'Unary', op: t.value, arg };
    }
    return parsePostfix();
  }

  function parsePostfix() {
    let node = parsePrimary();

    while (true) {
      const t = peek();

      if (t.type === 'punct' && t.value === '.') {
        next();
        const id = next();
        if (id.type !== 'ident') throw { code: 'E004', pos: id.pos };
        node = { type: 'Member', object: node, property: id.value };
        continue;
      }

      if (t.type === 'punct' && t.value === '(') {
        next();
        const args = [];
        if (!(peek().type === 'punct' && peek().value === ')')) {
          do { args.push(parseExpr(0)); }
          while (peek().type === 'punct' && peek().value === ',' && next());
        }
        expect(')');
        node = { type: 'Call', callee: node, args };
        continue;
      }

      if (t.type === 'punct' && t.value === '[') {
        next();
        const idx = parseExpr(0);
        expect(']');
        node = { type: 'Member', object: node, property: idx };
        continue;
      }

      break;
    }

    return node;
  }

  function parsePrimary() {
    const t = peek();

    if (t.type === 'number' || t.type === 'string') {
      next();
      return { type: 'Literal', value: t.value };
    }

    if (t.type === 'ident') {
      next();
      if (t.value === 'true')  return { type: 'Literal', value: true };
      if (t.value === 'false') return { type: 'Literal', value: false };
      if (t.value === 'null')  return { type: 'Literal', value: null };
      return { type: 'Identifier', name: t.value };
    }

    if (t.type === 'punct' && t.value === '(') {
      next();
      const e = parseExpr(0);
      expect(')');
      return e;
    }

    if (t.type === 'punct' && t.value === '[') {
      next();
      const items = [];
      if (!(peek().type === 'punct' && peek().value === ']')) {
        do { items.push(parseExpr(0)); }
        while (peek().type === 'punct' && peek().value === ',' && next());
      }
      expect(']');
      return { type: 'Array', items };
    }

    throw { code: 'E004', pos: t.pos };
  }

  const ast = parseExpr(0);
  if (peek().type !== 'eof') throw { code: 'E004', pos: peek().pos };
  return ast;
}
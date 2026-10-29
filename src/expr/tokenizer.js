// src/expr/tokenizer.js

const T_NUMBER = 'number';
const T_STRING = 'string';
const T_IDENT  = 'ident';
const T_OP     = 'op';
const T_PUNCT  = 'punct';
const T_EOF    = 'eof';

// Order matters: longer operators first.
const OPS = [
  '===', '!==',
  '**',
  '==', '!=', '<=', '>=', '&&', '||',
  '+=', '-=', '*=', '/=', '%=',
  '<', '>', '+', '-', '*', '/', '%', '!',
  '?', ':',
  '=',
  '(', ')', '[', ']', ',', '.',
];

export function tokenize(source) {
  const tokens = [];
  let i = 0;

  while (i < source.length) {
    const ch = source[i];

    if (/\s/.test(ch)) { i++; continue; }

    // Numbers
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(source[i + 1]))) {
      let j = i;
      while (j < source.length && /[0-9.]/.test(source[j])) j++;
      tokens.push({ type: T_NUMBER, value: Number(source.slice(i, j)), pos: i });
      i = j;
      continue;
    }

    // Single-quoted strings
    if (ch === "'") {
      let j = i + 1, value = '';
      while (j < source.length && source[j] !== "'") {
        if (source[j] === '\\' && j + 1 < source.length) {
          value += source[j + 1]; j += 2;
        } else { value += source[j]; j++; }
      }
      if (source[j] !== "'") throw { code: 'E005', pos: i };
      tokens.push({ type: T_STRING, value, pos: i });
      i = j + 1;
      continue;
    }

    // Double-quoted strings
    if (ch === '"') {
      let j = i + 1, value = '';
      while (j < source.length && source[j] !== '"') {
        if (source[j] === '\\' && j + 1 < source.length) {
          value += source[j + 1]; j += 2;
        } else { value += source[j]; j++; }
      }
      if (source[j] !== '"') throw { code: 'E005', pos: i };
      tokens.push({ type: T_STRING, value, pos: i });
      i = j + 1;
      continue;
    }

    // Identifiers
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < source.length && /[A-Za-z0-9_$]/.test(source[j])) j++;
      tokens.push({ type: T_IDENT, value: source.slice(i, j), pos: i });
      i = j;
      continue;
    }

    // Operators / punctuation
    let matched = false;
    for (const op of OPS) {
      if (source.startsWith(op, i)) {
        const type = /^[()[\],.]$/.test(op) ? T_PUNCT : T_OP;
        tokens.push({ type, value: op, pos: i });
        i += op.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    throw { code: 'E004', pos: i };
  }

  tokens.push({ type: T_EOF, value: null, pos: i });
  return tokens;
}
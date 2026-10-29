// src/expr/template.js
import { parse } from './parser.js';
import { evaluate } from './evaluator.js';

// Splits "hello {name}" into [{type:'text',value:'hello '},{type:'expr',value:'name'}].
export function parseTemplate(str) {
  if (typeof str !== 'string') return [{ type: 'text', value: str }];
  if (!str.includes('{')) return [{ type: 'text', value: str }];

  const parts = [];
  let current = '';
  let i = 0;

  while (i < str.length) {
    if (str[i] === '{') {
      if (current) { parts.push({ type: 'text', value: current }); current = ''; }
      const end = str.indexOf('}', i + 1);
      if (end === -1) { current += str.slice(i); break; }
      parts.push({ type: 'expr', value: str.slice(i + 1, end).trim() });
      i = end + 1;
      continue;
    }
    current += str[i];
    i++;
  }

  if (current) parts.push({ type: 'text', value: current });
  return parts;
}

// Evaluate a template against vars. Single-expr → raw value; mixed → string.
export function renderTemplate(template, vars) {
  const parts = parseTemplate(template);

  if (!parts.some(p => p.type === 'expr')) {
    return { value: template, store: null };
  }

  if (parts.length === 1 && parts[0].type === 'expr') {
    const ast = parse(parts[0].value);
    return evaluate(ast, vars);
  }

  let out = '';
  let lastStore = null;
  for (const p of parts) {
    if (p.type === 'text') { out += p.value; continue; }
    const ast = parse(p.value);
    const r = evaluate(ast, vars);
    if (r.store) { vars[r.store.key] = r.store.value; lastStore = r.store; }
    out += r.value == null ? '' : String(r.value);
  }
  return { value: out, store: lastStore };
}
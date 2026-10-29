// dev/main.js
import {
  // errors
  createError,
  nearMatch,
  QEError,
  // reporter
  Reporter,
  consoleSink,
  memorySink,
  // registry
  Registry,
  // context
  createContext,
  Scheduler,
  // schema
  validate,
  validateSafe,
  // resolver
  resolveArg,
  resolveAll,
  // interpreter
  runEvent,
  // expr
  parseExpr,
  evaluateExpr,
  renderTemplate,
} from '../src/index.js';

// ─── 1) nearMatch ───────────────────────────────────────────
console.log('nearMatch setTxt  →', nearMatch('setTxt', ['setText', 'setHtml', 'addClass']));
console.log('nearMatch addStyl →', nearMatch('addStyl', ['addStyle', 'addClass', 'setText']));
console.log('nearMatch xyz     →', nearMatch('xyz', ['setText', 'addClass']));

// ─── 2) Reporter ────────────────────────────────────────────
console.log('\n--- Reporter test ---');

const reporter = new Reporter({
  sinks: [consoleSink, memorySink],
  dedupWindow: 1000,
});

const fakeElement = { tagName: 'BUTTON', id: 'my-btn' };

reporter.report(
  createError('E001', { name: 'setTxt', suggestion: 'setText' }),
  { command: { name: 'setTxt', index: 0 }, element: fakeElement, attribute: 'click' }
);
reporter.report(
  createError('E010', {
    name: 'setText',
    index: 2,
    expected: 'number',
    got: 'string',
  }),
  { command: { name: 'setText', index: 0 }, element: fakeElement }
);

try {
  null.foo;
} catch (err) {
  reporter.report(err, {
    command: { name: 'setText', index: 0 },
    element: fakeElement,
  });
}

// ─── 3) Registry ────────────────────────────────────────────
console.log('\n--- Registry test ---');

const fakeSetText = {
  name: 'setText',
  kind: 'effect',
  schema: ['selector', 'any', 'number?'],
  run() {},
};

const fakeGetText = {
  name: 'getText',
  kind: 'source',
  schema: ['selector', 'string?', 'string?'],
  resolve() {},
};

const registry = new Registry([fakeSetText, fakeGetText]);

console.log('has setText →', registry.has('setText'));
console.log('has getAttr →', registry.has('getAttr'));
console.log('names        →', registry.names());
console.log('byKind source →', registry.byKind('source').map(d => d.name));
console.log('byKind effect →', registry.byKind('effect').map(d => d.name));

const d1 = registry.require('setText');
console.log('require setText →', d1.name, d1.kind);

try {
  registry.require('setTxt');
} catch (err) {
  if (err instanceof QEError) {
    console.log('require setTxt → error:', err.code, '|', err.message);
    console.log('              suggestion in hint:', err.hint);
  }
}

try {
  registry.register(fakeSetText);
} catch (err) {
  console.log('register duplicate →', err.message);
}

try {
  registry.register({ name: 'bad', kind: 'nope' });
} catch (err) {
  console.log('register bad kind →', err.message);
}

// ─── 4) Context ─────────────────────────────────────────────
console.log('\n--- Context test ---');

const ctx = createContext({
  element: fakeElement,
  event: { type: 'click' },
  attribute: 'click',
  registry,
  reporter,
});

console.log('ctx.element.tagName →', ctx.element.tagName);
console.log('ctx.vars is object  →', typeof ctx.vars === 'object');
console.log('ctx.branch          →', ctx.branch);
console.log('ctx.ok              →', ctx.ok);
console.log('ctx.tick            →', ctx.tick);

ctx.branch.ran = true;
ctx.resetBranch();
console.log('after resetBranch   →', ctx.branch);

const sched = new Scheduler();
sched.push(Promise.resolve('a'));
sched.push(Promise.resolve('b'));
sched.flush().then(() => console.log('scheduler flushed'));
console.log('pending count       →', sched.pending.length);

ctx.report(
  createError('E001', { name: 'doesNotExist', suggestion: 'setText' })
);

// ─── 5) Schema ──────────────────────────────────────────────
console.log('\n--- Schema test ---');

console.log('valid setText      →', validateSafe(
  'setText', ['selector', 'any', 'number?'],
  ['#my-div', 'hello', 100]
));

console.log('valid setText no delay →', validateSafe(
  'setText', ['selector', 'any', 'number?'],
  ['#my-div', 'hello']
));

const se1 = validateSafe('setText', ['selector', 'any', 'number?'], ['#my-div']);
console.log('missing text       →', se1?.message);

const se2 = validateSafe(
  'setText', ['selector', 'any', 'number?'],
  ['#my-div', 'hello', '10px']
);
console.log('wrong delay        →', se2?.message);

const se3 = validateSafe(
  'setText', ['selector', 'any', 'number?'],
  ['#my-div', 'hello', 100, 'extra']
);
console.log('too many args      →', se3?.message);

const se4 = validateSafe(
  'setText', ['selector', 'any', 'number?'],
  ['', 'hello', 100]
);
console.log('empty selector     →', se4?.message);

try {
  validate('setText', ['selector', 'any', 'number?'], ['#my-div']);
} catch (err) {
  console.log('validate throws    →', err.code, '|', err.message);
}

// ─── 6) Expr ────────────────────────────────────────────────
console.log('\n--- Expr test ---');

function ev(src, vars = {}) {
  return evaluateExpr(parseExpr(src), vars).value;
}

console.log('2+3*4             →', ev('2+3*4'));
console.log('(2+3)*4           →', ev('(2+3)*4'));
console.log('10 % 3            →', ev('10 % 3'));
console.log('2 ** 3            →', ev('2 ** 3'));
console.log('5 > 3             →', ev('5 > 3'));
console.log('5 > 3 && 2 < 1    →', ev('5 > 3 && 2 < 1'));
console.log('!true             →', ev('!true'));
console.log('x + 1 (x=10)      →', ev('x + 1', { x: 10 }));
console.log('s (s="hi")        →', ev('s', { s: 'hi' }));

const vars1 = { counter: 5 };
const r1 = evaluateExpr(parseExpr('counter += 1'), vars1);
console.log('counter += 1      →', r1.value, '| store:', r1.store, '| vars.counter:', vars1.counter);

console.log('sum([1,2,3])      →', ev('sum([1,2,3])'));
console.log('upperCase("abc")  →', ev('upperCase("abc")'));
console.log('replace("a-b", "-", "_") →', ev("replace('a-b', '-', '_')"));
console.log('obj.name (obj={name:"Ali"}) →', ev('obj.name', { obj: { name: 'Ali' } }));
console.log('x>5?"big":"small" (x=10) →', ev('x>5?"big":"small"', { x: 10 }));

console.log('render "hi {name}" →', renderTemplate('hi {name}', { name: 'Ali' }).value);
console.log('render "{x+1}" (raw) →', renderTemplate('{x+1}', { x: 4 }).value);
console.log('render "count is {counter += 1}" →',
  (() => {
    const v = { counter: 5 };
    const r = renderTemplate('count is {counter += 1}', v);
    return r.value + ' | counter=' + v.counter;
  })()
);

try { ev('window'); } catch (e) { console.log('unsafe window →', e.message); }
try { ev('alert("x")'); } catch (e) { console.log('unsafe alert →', e.message); }

// ─── 7) Resolver ────────────────────────────────────────────
console.log('\n--- Resolver test ---');

const resolverCtx = {
  element: { tagName: 'BUTTON', id: 'btn', textContent: 'Hello' },
  vars: { name: 'Ali', counter: 5 },
  registry: new Registry([
    {
      name: 'getText',
      kind: 'source',
      async resolve(ctx, [selector]) {
        if (selector === '#src') return 'Hello from source';
        return undefined;
      },
    },
    {
      name: 'getNumber',
      kind: 'source',
      async resolve() { return 42; },
    },
  ]),
};

console.log('resolve "this"     →', await resolveArg('this', resolverCtx));
console.log('resolve plain str  →', await resolveArg('hello', resolverCtx));
console.log('resolve template    →', await resolveArg('hi {name}', resolverCtx));
console.log('resolve expr        →', await resolveArg('{counter + 1}', resolverCtx));

const rr = await resolveArg('{counter += 10}', resolverCtx);
console.log('resolve assignment  →', rr, '| ctx.vars.counter:', resolverCtx.vars.counter);

console.log('resolve getText     →', await resolveArg(['getText', '#src'], resolverCtx));
console.log('resolve getNumber   →', await resolveArg(['getNumber'], resolverCtx));
console.log('resolve array       →', await resolveAll(['x', '{counter}', 'this'], resolverCtx));
console.log('resolve object      →', await resolveArg({ a: '{name}', b: 'fixed' }, resolverCtx));

try {
  await resolveArg(['getText', '#missing'], resolverCtx);
} catch (err) {
  console.log('resolve missing     →', err.code, '|', err.message);
}

resolverCtx.registry.register({
  name: 'setText',
  kind: 'effect',
  run() {},
});
try {
  await resolveArg(['setText', '#x', 'hi'], resolverCtx);
} catch (err) {
  console.log('resolve effect arg  →', err.code, '|', err.message);
}

// ─── 8) Interpreter ─────────────────────────────────────────
console.log('\n--- Interpreter test ---');

const testRegistry = new Registry([
  {
    name: 'setText',
    kind: 'effect',
    schema: ['selector', 'any', 'number?'],
    run(ctx, [selector, text]) {
      ctx.vars.__lastSetText = { selector, text };
    },
  },
  {
    name: 'log',
    kind: 'effect',
    schema: ['any'],
    run(ctx, [value]) {
      console.log('  log:', value);
    },
  },
  {
    name: 'getText',
    kind: 'source',
    schema: ['selector'],
    async resolve(ctx, [selector]) {
      return `text-of-${selector}`;
    },
  },
  {
    name: 'fail',
    kind: 'effect',
    schema: [],
    run() { throw new Error('intentional failure'); },
  },
  {
    name: 'wait',
    kind: 'flow',
    schema: ['number'],
    async run(ctx, [ms]) {
      await new Promise(r => setTimeout(r, ms));
    },
  },
  {
    name: 'if',
    kind: 'flow',
    async run(ctx, [conditions, body], { runBody }) {
      if (ctx.vars[conditions]) await runBody(body);
    },
  },
]);

const reporter2 = new Reporter({ sinks: [consoleSink], dedupWindow: 500 });

function makeCtx() {
  return createContext({
    element: { tagName: 'BUTTON' },
    registry: testRegistry,
    reporter: reporter2,
  });
}

console.log('\n1) simple effects');
{
  const c = makeCtx();
  await runEvent([
    ['setText', '#a', 'hello'],
    ['log', 'after setText'],
  ], c);
  console.log('  lastSetText:', c.vars.__lastSetText);
}

console.log('\n2) nested source as argument');
{
  const c = makeCtx();
  await runEvent([
    ['setText', '#a', ['getText', '#src']],
  ], c);
  console.log('  lastSetText:', c.vars.__lastSetText);
}

console.log('\n3) template with vars');
{
  const c = makeCtx();
  c.vars.name = 'Ali';
  await runEvent([
    ['log', 'hello {name}'],
  ], c);
}

console.log('\n4) schema error (missing arg)');
{
  const c = makeCtx();
  await runEvent([
    ['setText', '#a'],
  ], c);
}

console.log('\n5) unknown command');
{
  const c = makeCtx();
  await runEvent([
    ['setTxt', '#a', 'hello'],
  ], c);
}

console.log('\n6) command throws');
{
  const c = makeCtx();
  await runEvent([
    ['fail'],
    ['log', 'this still runs'],
  ], c);
}

console.log('\n7) flow command (if)');
{
  const c = makeCtx();
  c.vars.flag = true;
  await runEvent([
    ['if', 'flag', [
      ['log', 'inside if'],
    ]],
  ], c);
}

console.log('\n8) wait blocks');
{
  const c = makeCtx();
  const t0 = performance.now();
  await runEvent([
    ['wait', 100],
    ['log', 'after wait'],
  ], c);
  console.log('  elapsed ms:', Math.round(performance.now() - t0));
}


// ─── 9) Events (integration) ────────────────────────────────
console.log('\n--- Events test ---');

import { attachEvents } from '../src/index.js';

// A minimal registry with just the commands we use in the HTML above.
// Later, this will come from manifest.js.
const eventRegistry = new Registry([
  {
    name: 'setText',
    kind: 'effect',
    schema: ['selector', 'any'],
    run(ctx, [selector, text]) {
      const els = document.querySelectorAll(selector);
      els.forEach(el => { el.textContent = text; });
    },
  },
  {
    name: 'getText',
    kind: 'source',
    schema: ['selector'],
    async resolve(ctx, [selector]) {
      const el = document.querySelector(selector);
      return el ? el.textContent : undefined;
    },
  },
  {
    name: 'wait',
    kind: 'flow',
    schema: ['number'],
    async run(ctx, [ms]) {
      await new Promise(r => setTimeout(r, ms));
    },
  },
]);

const eventReporter = new Reporter({ sinks: [consoleSink], dedupWindow: 1000 });

attachEvents({ registry: eventRegistry, reporter: eventReporter });

console.log('Events attached. Click the buttons in the page.');
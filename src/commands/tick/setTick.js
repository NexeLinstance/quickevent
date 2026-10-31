// src/commands/tick/setTick.js
import { tickStates, parseTime } from './timer.js';

export default {
  name: 'setTick',
  kind: 'effect',
  schema: ['selector', 'any', 'string?'],
  run(ctx, [selector, time, mode = '++']) {
    if (mode !== '++' && mode !== '--') throw new Error(`setTick: mode must be "++" or "--"`);
    const totalMs = typeof time === 'number' ? time * 1000 : parseTime(time);

    ctx.dom.query(selector).forEach(el => {
      if (tickStates.has(el)) {
        const state = tickStates.get(el);
        if (state.interval) clearInterval(state.interval);
      }
      tickStates.set(el, {
        duration: totalMs,
        direction: mode,
        currentMs: mode === '++' ? 0 : totalMs,
        startedAt: null,
        paused: true,
        interval: null
      });
    });
  },
};
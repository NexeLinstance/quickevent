// src/commands/tick/playTick.js
import { tickStates, parseTime } from './timer.js';

export default {
  name: 'playTick',
  kind: 'effect',
  schema: ['selector', 'any?', 'string?'],
  run(ctx, [selector, time, mode = '++']) {
    ctx.dom.query(selector).forEach(el => {
      let state = tickStates.get(el);

      if (time !== undefined) {
        if (mode !== '++' && mode !== '--') throw new Error(`playTick: mode must be "++" or "--"`);
        const totalMs = typeof time === 'number' ? time * 1000 : parseTime(time);
        
        if (state && state.interval) clearInterval(state.interval);
        state = {
          duration: totalMs,
          direction: mode,
          currentMs: mode === '++' ? 0 : totalMs,
          startedAt: null, paused: true, interval: null
        };
        tickStates.set(el, state);
      }

      if (!state) throw new Error(`playTick: no timer set on "${selector}"`);
      if (!state.paused) return;

      state.paused = false;
      state.startedAt = performance.now() - (
        state.direction === '++' ? state.currentMs : state.duration - state.currentMs
      );

      const tick = () => {
        const elapsed = performance.now() - state.startedAt;
        const ms = state.direction === '++'
          ? Math.min(elapsed, state.duration)
          : Math.max(state.duration - elapsed, 0);

        el.dispatchEvent(new CustomEvent('tick', { bubbles: true }));

        if ((state.direction === '++' && ms >= state.duration) || (state.direction === '--' && ms <= 0)) {
          state.currentMs = ms;
          if (state.interval) { clearInterval(state.interval); state.interval = null; }
          state.paused = true;
          state.startedAt = null;
        }
      };

      tick();
      state.interval = setInterval(tick, 1000);
    });
  },
};
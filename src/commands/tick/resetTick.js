// src/commands/tick/resetTick.js
import { tickStates } from './timer.js';

export default {
  name: 'resetTick',
  kind: 'effect',
  schema: ['selector', 'boolean?'],
  run(ctx, [selector, playAfterReset = false]) {
    ctx.dom.query(selector).forEach(el => {
      const state = tickStates.get(el);
      if (!state) throw new Error(`resetTick: no timer set on "${selector}"`);

      if (state.interval) { clearInterval(state.interval); state.interval = null; }

      state.currentMs = state.direction === '++' ? 0 : state.duration;
      state.startedAt = null;
      state.paused = true;

      el.dispatchEvent(new CustomEvent('tick', { bubbles: true }));

      if (playAfterReset) {
        state.paused = false;
        state.startedAt = performance.now() - (state.direction === '++' ? state.currentMs : state.duration - state.currentMs);
        
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
      }
    });
  },
};
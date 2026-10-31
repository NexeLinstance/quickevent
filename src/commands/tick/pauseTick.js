// src/commands/tick/pauseTick.js
import { tickStates } from './timer.js';

export default {
  name: 'pauseTick',
  kind: 'effect',
  schema: ['selector'],
  run(ctx, [selector]) {
    ctx.dom.query(selector).forEach(el => {
      const state = tickStates.get(el);
      if (!state) throw new Error(`pauseTick: no timer set on "${selector}"`);
      if (state.paused) return;

      const elapsed = performance.now() - state.startedAt;
      state.currentMs = state.direction === '++'
        ? Math.min(elapsed, state.duration)
        : Math.max(state.duration - elapsed, 0);
      
      state.paused = true;
      state.startedAt = null;
      if (state.interval) { clearInterval(state.interval); state.interval = null; }
    });
  },
};
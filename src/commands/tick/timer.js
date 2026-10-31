// src/commands/tick/timer.js

export const tickStates = new WeakMap();

export const UNIT_KEYS = ['y', 'M', 'w', 'd', 'h', 'm', 's'];

export const UNIT_FACTORS = {
  s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000, M: 30 * 24 * 60 * 60 * 1000, y: 365 * 24 * 60 * 60 * 1000
};

export function parseTime(str) {
  const parts = String(str).split(':').map(Number);
  if (parts.some(isNaN)) throw new Error(`Invalid time format "${str}"`);
  if (parts.length > 7) throw new Error(`Too many parts in "${str}" (max 7)`);

  const result = { s: 0, m: 0, h: 0, d: 0, w: 0, M: 0, y: 0 };
  const offset = UNIT_KEYS.length - parts.length;

  for (let i = 0; i < parts.length; i++) {
    result[UNIT_KEYS[offset + i]] = parts[i];
  }

  let totalMs = 0;
  for (const key of UNIT_KEYS) {
    totalMs += result[key] * UNIT_FACTORS[key];
  }
  return totalMs;
}

export function formatMs(totalMs) {
  let rest = Math.max(0, Math.floor(totalMs));
  const y = Math.floor(rest / UNIT_FACTORS.y); rest -= y * UNIT_FACTORS.y;
  const M = Math.floor(rest / UNIT_FACTORS.M); rest -= M * UNIT_FACTORS.M;
  const w = Math.floor(rest / UNIT_FACTORS.w); rest -= w * UNIT_FACTORS.w;
  const d = Math.floor(rest / UNIT_FACTORS.d); rest -= d * UNIT_FACTORS.d;
  const h = Math.floor(rest / UNIT_FACTORS.h); rest -= h * UNIT_FACTORS.h;
  const m = Math.floor(rest / UNIT_FACTORS.m); rest -= m * UNIT_FACTORS.m;
  const s = Math.floor(rest / 1000); rest -= s * 1000;

  return { y, M, w, d, h, m, s, ms: rest };
}

// Get the current time object to be exposed as `tick` in templates
export function getTickValue(state) {
  const ms = state.paused || state.startedAt === null
    ? state.currentMs
    : (state.direction === '++'
      ? Math.min(performance.now() - state.startedAt, state.duration)
      : Math.max(state.duration - (performance.now() - state.startedAt), 0));

  const f = formatMs(ms);
  return {
    h: f.h,
    m: f.m,
    s: f.s,
    total: Math.floor(ms / 1000),
    toString() {
      return `${String(f.h).padStart(2, '0')}:${String(f.m).padStart(2, '0')}:${String(f.s).padStart(2, '0')}`;
    }
  };
}
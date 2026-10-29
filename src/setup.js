// src/setup.js
import { Registry } from './core/registry.js';
import { Reporter, consoleSink } from './core/reporter.js';
import { attachEvents } from './events/delegate.js';
import manifest from './commands/manifest.js';

export function init(options = {}) {
  const registry = new Registry(manifest);
  const reporter = new Reporter({
    sinks: options.sinks ?? [consoleSink],
    dedupWindow: options.dedupWindow ?? 3000,
  });

  attachEvents({ registry, reporter });

  return { registry, reporter };
}

// Auto-init if used via <script> directly.
if (typeof window !== 'undefined') {
  window.QE = init();
}
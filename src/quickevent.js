// src/quickevent.js
import pkg from '../package.json';
import './core/sanitize.js'; // <--- Start loading DOMPurify immediately
import './setup.js';

console.log(
  `%c[QuickEvent] v${pkg.version} loaded.`, 
  'color: #0f0; font-weight: bold;'
);
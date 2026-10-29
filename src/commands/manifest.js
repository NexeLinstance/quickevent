// src/commands/manifest.js
import text from './text/index.js';
import html from './html/index.js';
import value from './value/index.js';
import classFx from './class/index.js';
import style from './style/index.js';
import attr from './attr/index.js';
import props from './props/index.js';

const commands = [
  ...text,
  ...html,
  ...value,
  ...classFx,
  ...style,
  ...attr,
  ...props,
];

export default commands;
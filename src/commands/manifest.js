// src/commands/manifest.js
import text from './text/index.js';
import html from './html/index.js';
import value from './value/index.js';
import classFx from './class/index.js';
import style from './style/index.js';
import attr from './attr/index.js';
import props from './props/index.js';
import util from './util/index.js';
import animate from './animate/index.js';
import flow from './flow/index.js';
import ajax from './ajax/index.js';
import cookie from './cookie/index.js';
import dialog from './dialog/index.js';
import modal from './modal/index.js';

const commands = [
  ...text,
  ...html,
  ...value,
  ...classFx,
  ...style,
  ...attr,
  ...props,
  ...util,
  ...animate,
  ...flow,
  ...ajax,
  ...cookie,
  ...dialog,
  ...modal,
];

export default commands;
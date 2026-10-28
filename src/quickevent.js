(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.QuickEvent = factory());
})(this, function() {
  'use strict';
  var listeners = {};
  return {
    version: '1.0.0',
    on: function(event, callback) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
    },
    off: function(event, callback) {
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter(function(cb) { return cb !== callback; });
    },
    emit: function(event, data) {
      if (!listeners[event]) return;
      listeners[event].forEach(function(cb) { cb(data); });
    },
    clear: function(event) {
      if (event) delete listeners[event];
      else listeners = {};
    }
  };
});


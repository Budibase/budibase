'use strict';

var shimmer = require('shimmer');
var wrap    = shimmer.wrap;
var unwrap  = shimmer.unwrap;

// Default to complaining loudly when things don't go according to plan.
// dunderscores are boring
var SYMBOL = 'wrap@before';

// Sets a property on an object, preserving its enumerability.
// This function assumes that the property is already writable.
function defineProperty(obj, name, value) {
  var enumerable = !!obj[name] && obj.propertyIsEnumerable(name);
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: enumerable,
    writable: true,
    value: value
  });
}

function _process(self, listeners) {
  var l = listeners.length;
  for (var p = 0; p < l; p++) {
    var listener = listeners[p];
    // set up the listener so that onEmit can do whatever it needs
    var before = self[SYMBOL];
    if (typeof before === 'function') {
      before(listener);
    }
    else if (Array.isArray(before)) {
      var length = before.length;
      for (var i = 0; i < length; i++) before[i](listener);
    }
  }
}

function _listeners(self, event) {
  var listeners;
  listeners = self._events && self._events[event];
  if (!Array.isArray(listeners)) {
    if (listeners) {
      listeners = [listeners];
    }
    else {
      listeners = [];
    }
  }

  return listeners;
}

function _findAndProcess(self, event, before) {
  var after = _listeners(self, event);
  var unprocessed = after.filter(function(fn) { return before.indexOf(fn) === -1; });
  if (unprocessed.length > 0) _process(self, unprocessed);
}

function _wrap(unwrapped, visit) {
  if (!unwrapped) return;

  var wrapped = unwrapped;
  if (typeof unwrapped === 'function') {
    wrapped = visit(unwrapped);
  }
  else if (Array.isArray(unwrapped)) {
    wrapped = [];
    for (var i = 0; i < unwrapped.length; i++) {
      wrapped[i] = visit(unwrapped[i]);
    }
  }
  return wrapped;
}

module.exports = function wrapEmitter(emitter, onAddListener, onEmit) {
  if (!emitter || !emitter.on || !emitter.addListener ||
      !emitter.removeListener || !emitter.emit) {
    throw new Error("can only wrap real EEs");
  }

  if (!onAddListener) throw new Error("must have function to run on listener addition");
  if (!onEmit) throw new Error("must have function to wrap listeners when emitting");

  /* Attach a context to a listener, and make sure that this hook stays
   * attached to the emitter forevermore.
   */
  function adding(on) {
    return function added(event, listener) {
      var existing = _listeners(this, event).slice();

      try {
        var returned = on.call(this, event, listener);
        _findAndProcess(this, event, existing);
        return returned;
      }
      finally {
        // old-style streaming overwrites .on and .addListener, so rewrap
        if (!this.on.__wrapped) wrap(this, 'on', adding);
        if (!this.addListener.__wrapped) wrap(this, 'addListener', adding);
      }
    };
  }

  function emitting(emit) {
    return function emitted(event) {
      if (!this._events || !this._events[event]) return emit.apply(this, arguments);

      var unwrapped = this._events[event];

      /* Ensure that if removeListener gets called, it's working with the
       * unwrapped listeners.
       */
      function remover(removeListener) {
        return function removed() {
          this._events[event] = unwrapped;
          try {
            return removeListener.apply(this, arguments);
          }
          finally {
            unwrapped = this._events[event];
            this._events[event] = _wrap(unwrapped, onEmit);
          }
        };
      }
      wrap(this, 'removeListener', remover);

      try {
        /* At emit time, ensure that whatever else is going on, removeListener will
         * still work while at the same time running whatever hooks are necessary to
         * make sure the listener is run in the correct context.
         */
        this._events[event] = _wrap(unwrapped, onEmit);
        return emit.apply(this, arguments);
      }
      finally {
        /* Ensure that regardless of what happens when preparing and running the
         * listeners, the status quo ante is restored before continuing.
         */
        unwrap(this, 'removeListener');
        this._events[event] = unwrapped;
      }
    };
  }

  // support multiple onAddListeners
  if (!emitter[SYMBOL]) {
    defineProperty(emitter, SYMBOL, onAddListener);
  }
  else if (typeof emitter[SYMBOL] === 'function') {
    defineProperty(emitter, SYMBOL, [emitter[SYMBOL], onAddListener]);
  }
  else if (Array.isArray(emitter[SYMBOL])) {
    emitter[SYMBOL].push(onAddListener);
  }

  // only wrap the core functions once
  if (!emitter.__wrapped) {
    wrap(emitter, 'addListener', adding);
    wrap(emitter, 'on',          adding);
    wrap(emitter, 'emit',        emitting);

    defineProperty(emitter, '__unwrap', function () {
      unwrap(emitter, 'addListener');
      unwrap(emitter, 'on');
      unwrap(emitter, 'emit');
      delete emitter[SYMBOL];
      delete emitter.__wrapped;
    });
    defineProperty(emitter, '__wrapped', true);
  }
};

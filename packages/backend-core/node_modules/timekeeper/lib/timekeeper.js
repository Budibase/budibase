/**
 * Time keeper - EEasy testing of time-dependent code.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License.
 */

!(function(name, root, definition) {
  definition = definition();
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = definition;
    }
    exports[name] = definition;
  } else {
    root[name] = definition;
  }
})('timekeeper', this, function() {

  /**
   * Native Date constructor reference.
   *
   * @type {Object}
   */
  var NativeDate = Date;

  /**
   * `TimeKeeper`.
   *
   * @type {Object}
   */
  var timekeeper = {};

  /**
   * Frozen date time container.
   *
   * @type {Object}
   */
  var freeze = null;

  /**
   * Fake date time container.
   *
   * @type {Number}
   */
  var travel = null;

  /**
   * Travel start container.
   *
   * @type {Number}
   */
  var started = null;

  /**
   * Return the elapsed time.
   *
   * @returns {Number}
   */
  function time() {
    return travel + (NativeDate.now() - started);
  }

  /**
   * `FakeDate` constructor.
   */
  function FakeDate(Y, M, D, h, m, s, ms) {
      var length = arguments.length;

      if (this instanceof NativeDate) {

          if (!length && freeze) return new NativeDate(freeze.getTime());
          if (!length && travel) return new NativeDate(time());

          var date = length == 1 && String(Y) === Y ? // isString(Y)
              // We explicitly pass it through parse:
              new NativeDate(NativeDate.parse(Y)) :
              // We have to manually make calls depending on argument
              // length here
              length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
              length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
              length >= 5 ? new NativeDate(Y, M, D, h, m) :
              length >= 4 ? new NativeDate(Y, M, D, h) :
              length >= 3 ? new NativeDate(Y, M, D) :
              length >= 2 ? new NativeDate(Y, M) :
              length >= 1 ? new NativeDate(Y) :
                            new NativeDate();
          // Prevent mixups with unfixed Date object
          date.constructor = NativeDate;
          return date;
      }
      return NativeDate.apply(this, arguments);
  }

  // Copy any custom methods a 3rd party library may have added
  (function() {
    for (var key in NativeDate) {
        FakeDate[key] = NativeDate[key];
    }
  }());

  // Copy "native" methods explicitly; they may be non-enumerable
  FakeDate.UTC = NativeDate.UTC;
  FakeDate.parse = NativeDate.parse;

  // Setup inheritance
  FakeDate.prototype = NativeDate.prototype;
  FakeDate.prototype.constructor = NativeDate;


  /**
   * Replace the original now method.
   *
   * Check if the time is
   *
   *  - frozen and if so return the frozen time
   *  - faked and if so return the elapsed time
   *
   * @returns {Number}
   * @api public
   */
  FakeDate.now = function() {
    if (freeze) return freeze.getTime();
    if (travel) return time();
    return NativeDate.now();
  };

  /**
   * Set current Date Time and freeze it.
   *
   * @param {Object|String|Number} Date.
   * @api public
   */
  timekeeper.freeze = function(date) {
    useFakeDate();

    if (typeof date !== 'object') {
      date = new NativeDate(date);
    }

    freeze = date;
  };

  /**
   * Set current DateTime.
   *
   * @param {Object|String|Number} Date.
   * @api public
   */
  timekeeper.travel = function(date) {
    useFakeDate();

    if (typeof date !== 'object') {
      date = new NativeDate(date);
    }

    if (freeze) {
      timekeeper.freeze(date)
    }

    travel = date.getTime();
    started = NativeDate.now();
  };

  /**
   * Reset the `timekeeper` behavior.
   *
   * @api public
   */
  timekeeper.reset = function() {
    useNativeDate();
    freeze = null;
    started = null;
    travel = null;
  };

    /**
     * Set current DateTime and reset.
     *
     * @param {Object|String|Number} date.
     * @param {Function} callback.
     * @api public
     */
  timekeeper.withFreeze = function (date, callback) {
    // Freeze time
    timekeeper.freeze(date);
    // Call callback
    var result;
    try {
      result = callback();
    } catch (err) {
      // Reset
      timekeeper.reset();
      throw err;
    }
    // If callback is async function
    if (result !== null && typeof result === 'object' && typeof result.then === 'function') {
      result.then(
        function() { timekeeper.reset(); },
        function() { timekeeper.reset(); }
      );
      return result;
    } else {
      // Reset
      timekeeper.reset();
      return result;
    }
  };

  /**
   * Reflection: Are we currently modifying the native Date object?
   *
   * @api public
   */
  timekeeper.isKeepingTime = function() {
    return Date === FakeDate;
  };

  /**
   * Replace the `Date` with `FakeDate`.
   */
  function useFakeDate() {
    Date = FakeDate
  }

  /**
   * Restore the `Date` to `NativeDate`.
   */
  function useNativeDate() {
    Date = NativeDate
  }


  /**
   * Expose `timekeeper`
   */
  return timekeeper;
});

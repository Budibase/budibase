'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.setState =
  exports.setMatchers =
  exports.getState =
  exports.getMatchers =
  exports.INTERNAL_MATCHER_FLAG =
    void 0;

var _asymmetricMatchers = require('./asymmetricMatchers');

var global = (function () {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  } else if (typeof global !== 'undefined') {
    return global;
  } else if (typeof self !== 'undefined') {
    return self;
  } else if (typeof window !== 'undefined') {
    return window;
  } else {
    return Function('return this')();
  }
})();

var Symbol = global['jest-symbol-do-not-touch'] || global.Symbol;
// Global matchers object holds the list of available matchers and
// the state, that can hold matcher specific values that change over time.
const JEST_MATCHERS_OBJECT = Symbol.for('$$jest-matchers-object'); // Notes a built-in/internal Jest matcher.
// Jest may override the stack trace of Errors thrown by internal matchers.

const INTERNAL_MATCHER_FLAG = Symbol.for('$$jest-internal-matcher');
exports.INTERNAL_MATCHER_FLAG = INTERNAL_MATCHER_FLAG;

if (!global.hasOwnProperty(JEST_MATCHERS_OBJECT)) {
  const defaultState = {
    assertionCalls: 0,
    expectedAssertionsNumber: null,
    isExpectingAssertions: false,
    suppressedErrors: [] // errors that are not thrown immediately.
  };
  Object.defineProperty(global, JEST_MATCHERS_OBJECT, {
    value: {
      matchers: Object.create(null),
      state: defaultState
    }
  });
}

const getState = () => global[JEST_MATCHERS_OBJECT].state;

exports.getState = getState;

const setState = state => {
  Object.assign(global[JEST_MATCHERS_OBJECT].state, state);
};

exports.setState = setState;

const getMatchers = () => global[JEST_MATCHERS_OBJECT].matchers;

exports.getMatchers = getMatchers;

const setMatchers = (matchers, isInternal, expect) => {
  Object.keys(matchers).forEach(key => {
    const matcher = matchers[key];
    Object.defineProperty(matcher, INTERNAL_MATCHER_FLAG, {
      value: isInternal
    });

    if (!isInternal) {
      // expect is defined
      class CustomMatcher extends _asymmetricMatchers.AsymmetricMatcher {
        constructor(inverse = false, ...sample) {
          super(sample, inverse);
        }

        asymmetricMatch(other) {
          const {pass} = matcher.call(
            this.getMatcherContext(),
            other,
            ...this.sample
          );
          return this.inverse ? !pass : pass;
        }

        toString() {
          return `${this.inverse ? 'not.' : ''}${key}`;
        }

        getExpectedType() {
          return 'any';
        }

        toAsymmetricMatcher() {
          return `${this.toString()}<${this.sample.map(String).join(', ')}>`;
        }
      }

      Object.defineProperty(expect, key, {
        configurable: true,
        enumerable: true,
        value: (...sample) => new CustomMatcher(false, ...sample),
        writable: true
      });
      Object.defineProperty(expect.not, key, {
        configurable: true,
        enumerable: true,
        value: (...sample) => new CustomMatcher(true, ...sample),
        writable: true
      });
    }
  });
  Object.assign(global[JEST_MATCHERS_OBJECT].matchers, matchers);
};

exports.setMatchers = setMatchers;

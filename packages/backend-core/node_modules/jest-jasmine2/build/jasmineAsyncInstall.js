'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = jasmineAsyncInstall;

var _co = _interopRequireDefault(require('co'));

var _isGeneratorFn = _interopRequireDefault(require('is-generator-fn'));

var _throat = _interopRequireDefault(require('throat'));

var _isError = _interopRequireDefault(require('./isError'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

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

var Promise = global[Symbol.for('jest-native-promise')] || global.Promise;

function isPromise(obj) {
  return obj && typeof obj.then === 'function';
}

const doneFnNoop = () => {};

doneFnNoop.fail = () => {};

function promisifyLifeCycleFunction(originalFn, env) {
  return function (fn, timeout) {
    if (!fn) {
      // @ts-expect-error: missing fn arg is handled by originalFn
      return originalFn.call(env);
    }

    if (typeof fn !== 'function') {
      // Pass non-functions to Jest, which throws a nice error.
      return originalFn.call(env, fn, timeout);
    }

    const hasDoneCallback = fn.length > 0;

    if (hasDoneCallback) {
      // Give the function a name so it can be detected in call stacks, but
      // otherwise Jasmine will handle it.
      const asyncJestLifecycleWithCallback = function (...args) {
        // @ts-expect-error: Support possible extra args at runtime
        return fn.apply(this, args);
      };

      return originalFn.call(env, asyncJestLifecycleWithCallback, timeout);
    }

    const extraError = new Error(); // Without this line v8 stores references to all closures
    // in the stack in the Error object. This line stringifies the stack
    // property to allow garbage-collecting objects on the stack
    // https://crbug.com/v8/7142

    extraError.stack = extraError.stack; // We make *all* functions async and run `done` right away if they
    // didn't return a promise.

    const asyncJestLifecycle = function (done) {
      const wrappedFn = (0, _isGeneratorFn.default)(fn)
        ? _co.default.wrap(fn)
        : fn;
      const returnValue = wrappedFn.call({}, doneFnNoop);

      if (isPromise(returnValue)) {
        returnValue.then(done.bind(null, null), error => {
          const {isError: checkIsError, message} = (0, _isError.default)(error);

          if (message) {
            extraError.message = message;
          }

          done.fail(checkIsError ? error : extraError);
        });
      } else {
        done();
      }
    };

    return originalFn.call(env, asyncJestLifecycle, timeout);
  };
} // Similar to promisifyLifeCycleFunction but throws an error
// when the return value is neither a Promise nor `undefined`

function promisifyIt(originalFn, env, jasmine) {
  return function (specName, fn, timeout) {
    if (!fn) {
      // @ts-expect-error: missing fn arg is handled by originalFn
      const spec = originalFn.call(env, specName);
      spec.pend('not implemented');
      return spec;
    }

    if (typeof fn !== 'function') {
      // Pass non-functions to Jest, which throws a nice error.
      return originalFn.call(env, specName, fn, timeout);
    }

    const hasDoneCallback = fn.length > 0;

    if (hasDoneCallback) {
      // Give the function a name so it can be detected in call stacks, but
      // otherwise Jasmine will handle it.
      const asyncJestTestWithCallback = function (...args) {
        // @ts-expect-error: Support possible extra args at runtime
        return fn.apply(this, args);
      };

      return originalFn.call(env, specName, asyncJestTestWithCallback, timeout);
    }

    const extraError = new Error(); // Without this line v8 stores references to all closures
    // in the stack in the Error object. This line stringifies the stack
    // property to allow garbage-collecting objects on the stack
    // https://crbug.com/v8/7142

    extraError.stack = extraError.stack;

    const asyncJestTest = function (done) {
      const wrappedFn = (0, _isGeneratorFn.default)(fn)
        ? _co.default.wrap(fn)
        : fn;
      const returnValue = wrappedFn.call({}, doneFnNoop);

      if (isPromise(returnValue)) {
        returnValue.then(done.bind(null, null), error => {
          const {isError: checkIsError, message} = (0, _isError.default)(error);

          if (message) {
            extraError.message = message;
          }

          if (jasmine.Spec.isPendingSpecException(error)) {
            env.pending(message);
            done();
          } else {
            done.fail(checkIsError ? error : extraError);
          }
        });
      } else if (returnValue === undefined) {
        done();
      } else {
        done.fail(
          new Error(
            'Jest: `it` and `test` must return either a Promise or undefined.'
          )
        );
      }
    };

    return originalFn.call(env, specName, asyncJestTest, timeout);
  };
}

function makeConcurrent(originalFn, env, mutex) {
  const concurrentFn = function (specName, fn, timeout) {
    let promise = Promise.resolve();
    const spec = originalFn.call(env, specName, () => promise, timeout);

    if (env != null && !env.specFilter(spec)) {
      return spec;
    }

    try {
      promise = mutex(() => {
        const promise = fn();

        if (isPromise(promise)) {
          return promise;
        }

        throw new Error(
          `Jest: concurrent test "${spec.getFullName()}" must return a Promise.`
        );
      });
    } catch (error) {
      promise = Promise.reject(error);
    } // Avoid triggering the uncaught promise rejection handler in case the test errors before
    // being awaited on.

    promise.catch(() => {});
    return spec;
  }; // each is binded after the function is made concurrent, so for now it is made noop

  concurrentFn.each = () => () => {};

  return concurrentFn;
}

function jasmineAsyncInstall(globalConfig, global) {
  const jasmine = global.jasmine;
  const mutex = (0, _throat.default)(globalConfig.maxConcurrency);
  const env = jasmine.getEnv();
  env.it = promisifyIt(env.it, env, jasmine);
  env.fit = promisifyIt(env.fit, env, jasmine);

  global.it.concurrent = (env => {
    const concurrent = makeConcurrent(env.it, env, mutex);
    concurrent.only = makeConcurrent(env.fit, env, mutex);
    concurrent.skip = makeConcurrent(env.xit, env, mutex);
    return concurrent;
  })(env);

  global.fit.concurrent = makeConcurrent(env.fit, env, mutex);
  env.afterAll = promisifyLifeCycleFunction(env.afterAll, env);
  env.afterEach = promisifyLifeCycleFunction(env.afterEach, env);
  env.beforeAll = promisifyLifeCycleFunction(env.beforeAll, env);
  env.beforeEach = promisifyLifeCycleFunction(env.beforeEach, env);
}

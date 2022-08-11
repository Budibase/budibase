'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = jasmine2;

var path = _interopRequireWildcard(require('path'));

var _sourceMap = require('@jest/source-map');

var _each = _interopRequireDefault(require('./each'));

var _errorOnPrivate = require('./errorOnPrivate');

var _jasmineAsyncInstall = _interopRequireDefault(
  require('./jasmineAsyncInstall')
);

var _reporter = _interopRequireDefault(require('./reporter'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const JASMINE = require.resolve('./jasmine/jasmineLight');

const jestEachBuildDir = path.dirname(require.resolve('jest-each'));

async function jasmine2(globalConfig, config, environment, runtime, testPath) {
  const reporter = new _reporter.default(globalConfig, config, testPath);
  const jasmineFactory = runtime.requireInternalModule(JASMINE);
  const jasmine = jasmineFactory.create({
    process,
    testPath,
    testTimeout: globalConfig.testTimeout
  });
  const env = jasmine.getEnv();

  const jasmineInterface = jasmineFactory._interface(jasmine, env);

  Object.assign(environment.global, jasmineInterface);
  env.addReporter(jasmineInterface.jsApiReporter); // TODO: Remove config option if V8 exposes some way of getting location of caller
  // in a future version

  if (config.testLocationInResults === true) {
    function wrapIt(original) {
      const wrapped = (testName, fn, timeout) => {
        var _stack$getFileName;

        const sourcemaps = runtime.getSourceMaps();
        let stack = (0, _sourceMap.getCallsite)(1, sourcemaps);
        const it = original(testName, fn, timeout);

        if (
          (_stack$getFileName = stack.getFileName()) !== null &&
          _stack$getFileName !== void 0 &&
          _stack$getFileName.startsWith(jestEachBuildDir)
        ) {
          stack = (0, _sourceMap.getCallsite)(4, sourcemaps);
        } // @ts-expect-error

        it.result.__callsite = stack;
        return it;
      };

      return wrapped;
    }

    environment.global.it = wrapIt(environment.global.it);
    environment.global.xit = wrapIt(environment.global.xit);
    environment.global.fit = wrapIt(environment.global.fit);
  }

  (0, _jasmineAsyncInstall.default)(globalConfig, environment.global);
  (0, _each.default)(environment);
  environment.global.test = environment.global.it;
  environment.global.it.only = environment.global.fit;
  environment.global.it.todo = env.todo;
  environment.global.it.skip = environment.global.xit;
  environment.global.xtest = environment.global.xit;
  environment.global.describe.skip = environment.global.xdescribe;
  environment.global.describe.only = environment.global.fdescribe;

  if (config.timers === 'fake' || config.timers === 'modern') {
    environment.fakeTimersModern.useFakeTimers();
  } else if (config.timers === 'legacy') {
    environment.fakeTimers.useFakeTimers();
  }

  env.beforeEach(() => {
    if (config.resetModules) {
      runtime.resetModules();
    }

    if (config.clearMocks) {
      runtime.clearAllMocks();
    }

    if (config.resetMocks) {
      runtime.resetAllMocks();

      if (config.timers === 'legacy') {
        environment.fakeTimers.useFakeTimers();
      }
    }

    if (config.restoreMocks) {
      runtime.restoreAllMocks();
    }
  });
  env.addReporter(reporter);
  runtime
    .requireInternalModule(path.resolve(__dirname, './jestExpect.js'))
    .default({
      expand: globalConfig.expand
    });

  if (globalConfig.errorOnDeprecated) {
    (0, _errorOnPrivate.installErrorOnPrivate)(environment.global);
  } else {
    Object.defineProperty(jasmine, 'DEFAULT_TIMEOUT_INTERVAL', {
      configurable: true,
      enumerable: true,

      get() {
        return this._DEFAULT_TIMEOUT_INTERVAL;
      },

      set(value) {
        this._DEFAULT_TIMEOUT_INTERVAL = value;
      }
    });
  }

  const snapshotState = await runtime
    .requireInternalModule(path.resolve(__dirname, './setup_jest_globals.js'))
    .default({
      config,
      globalConfig,
      localRequire: runtime.requireModule.bind(runtime),
      testPath
    });

  for (const path of config.setupFilesAfterEnv) {
    const esm = runtime.unstable_shouldLoadAsEsm(path);

    if (esm) {
      await runtime.unstable_importModule(path);
    } else {
      runtime.requireModule(path);
    }
  }

  if (globalConfig.testNamePattern) {
    const testNameRegex = new RegExp(globalConfig.testNamePattern, 'i');

    env.specFilter = spec => testNameRegex.test(spec.getFullName());
  }

  const esm = runtime.unstable_shouldLoadAsEsm(testPath);

  if (esm) {
    await runtime.unstable_importModule(testPath);
  } else {
    runtime.requireModule(testPath);
  }

  await env.execute();
  const results = await reporter.getResults();
  return addSnapshotData(results, snapshotState);
}

const addSnapshotData = (results, snapshotState) => {
  results.testResults.forEach(({fullName, status}) => {
    if (status === 'pending' || status === 'failed') {
      // if test is skipped or failed, we don't want to mark
      // its snapshots as obsolete.
      snapshotState.markSnapshotsAsCheckedForTest(fullName);
    }
  });
  const uncheckedCount = snapshotState.getUncheckedCount();
  const uncheckedKeys = snapshotState.getUncheckedKeys();

  if (uncheckedCount) {
    snapshotState.removeUncheckedKeys();
  }

  const status = snapshotState.save();
  results.snapshot.fileDeleted = status.deleted;
  results.snapshot.added = snapshotState.added;
  results.snapshot.matched = snapshotState.matched;
  results.snapshot.unmatched = snapshotState.unmatched;
  results.snapshot.updated = snapshotState.updated;
  results.snapshot.unchecked = !status.deleted ? uncheckedCount : 0; // Copy the array to prevent memory leaks

  results.snapshot.uncheckedKeys = Array.from(uncheckedKeys);
  return results;
};

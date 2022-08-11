'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.runAndTransformResultsToJestFormat = exports.initialize = void 0;

var _throat = _interopRequireDefault(require('throat'));

var _testResult = require('@jest/test-result');

var _expect = require('expect');

var _jestEach = require('jest-each');

var _jestMessageUtil = require('jest-message-util');

var _jestSnapshot = require('jest-snapshot');

var _ = _interopRequireDefault(require('..'));

var _run = _interopRequireDefault(require('../run'));

var _state = require('../state');

var _testCaseReportHandler = _interopRequireDefault(
  require('../testCaseReportHandler')
);

var _utils = require('../utils');

var _jestExpect = _interopRequireDefault(require('./jestExpect'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const initialize = async ({
  config,
  environment,
  globalConfig,
  localRequire,
  parentProcess,
  sendMessageToJest,
  setGlobalsForRuntime,
  testPath
}) => {
  if (globalConfig.testTimeout) {
    (0, _state.getState)().testTimeout = globalConfig.testTimeout;
  }

  const mutex = (0, _throat.default)(globalConfig.maxConcurrency); // @ts-expect-error

  const globalsObject = {
    ..._.default,
    fdescribe: _.default.describe.only,
    fit: _.default.it.only,
    xdescribe: _.default.describe.skip,
    xit: _.default.it.skip,
    xtest: _.default.it.skip
  };

  globalsObject.test.concurrent = (test => {
    const concurrent = (testName, testFn, timeout) => {
      // For concurrent tests we first run the function that returns promise, and then register a
      // normal test that will be waiting on the returned promise (when we start the test, the promise
      // will already be in the process of execution).
      // Unfortunately at this stage there's no way to know if there are any `.only` tests in the suite
      // that will result in this test to be skipped, so we'll be executing the promise function anyway,
      // even if it ends up being skipped.
      const promise = mutex(() => testFn()); // Avoid triggering the uncaught promise rejection handler in case the test errors before
      // being awaited on.

      promise.catch(() => {});
      globalsObject.test(testName, () => promise, timeout);
    };

    const only = (testName, testFn, timeout) => {
      const promise = mutex(() => testFn()); // eslint-disable-next-line jest/no-focused-tests

      test.only(testName, () => promise, timeout);
    };

    concurrent.only = only;
    concurrent.skip = test.skip;
    concurrent.each = (0, _jestEach.bind)(test, false);
    concurrent.skip.each = (0, _jestEach.bind)(test.skip, false);
    only.each = (0, _jestEach.bind)(test.only, false);
    return concurrent;
  })(globalsObject.test);

  (0, _state.addEventHandler)(eventHandler);

  if (environment.handleTestEvent) {
    (0, _state.addEventHandler)(environment.handleTestEvent.bind(environment));
  }

  const runtimeGlobals = {
    ...globalsObject,
    expect: (0, _jestExpect.default)(globalConfig)
  };
  setGlobalsForRuntime(runtimeGlobals);

  if (config.injectGlobals) {
    Object.assign(environment.global, runtimeGlobals);
  }

  await (0, _state.dispatch)({
    name: 'setup',
    parentProcess,
    runtimeGlobals,
    testNamePattern: globalConfig.testNamePattern
  });

  if (config.testLocationInResults) {
    await (0, _state.dispatch)({
      name: 'include_test_location_in_result'
    });
  } // Jest tests snapshotSerializers in order preceding built-in serializers.
  // Therefore, add in reverse because the last added is the first tested.

  config.snapshotSerializers
    .concat()
    .reverse()
    .forEach(path => (0, _jestSnapshot.addSerializer)(localRequire(path)));
  const {expand, updateSnapshot} = globalConfig;
  const snapshotResolver = await (0, _jestSnapshot.buildSnapshotResolver)(
    config,
    localRequire
  );
  const snapshotPath = snapshotResolver.resolveSnapshotPath(testPath);
  const snapshotState = new _jestSnapshot.SnapshotState(snapshotPath, {
    expand,
    prettierPath: config.prettierPath,
    snapshotFormat: config.snapshotFormat,
    updateSnapshot
  }); // @ts-expect-error: snapshotState is a jest extension of `expect`

  (0, _expect.setState)({
    snapshotState,
    testPath
  });
  (0, _state.addEventHandler)(handleSnapshotStateAfterRetry(snapshotState));

  if (sendMessageToJest) {
    (0, _state.addEventHandler)(
      (0, _testCaseReportHandler.default)(testPath, sendMessageToJest)
    );
  } // Return it back to the outer scope (test runner outside the VM).

  return {
    globals: globalsObject,
    snapshotState
  };
};

exports.initialize = initialize;

const runAndTransformResultsToJestFormat = async ({
  config,
  globalConfig,
  testPath
}) => {
  const runResult = await (0, _run.default)();
  let numFailingTests = 0;
  let numPassingTests = 0;
  let numPendingTests = 0;
  let numTodoTests = 0;
  const assertionResults = runResult.testResults.map(testResult => {
    let status;

    if (testResult.status === 'skip') {
      status = 'pending';
      numPendingTests += 1;
    } else if (testResult.status === 'todo') {
      status = 'todo';
      numTodoTests += 1;
    } else if (testResult.errors.length) {
      status = 'failed';
      numFailingTests += 1;
    } else {
      status = 'passed';
      numPassingTests += 1;
    }

    const ancestorTitles = testResult.testPath.filter(
      name => name !== _state.ROOT_DESCRIBE_BLOCK_NAME
    );
    const title = ancestorTitles.pop();
    return {
      ancestorTitles,
      duration: testResult.duration,
      failureDetails: testResult.errorsDetailed,
      failureMessages: testResult.errors,
      fullName: title
        ? ancestorTitles.concat(title).join(' ')
        : ancestorTitles.join(' '),
      invocations: testResult.invocations,
      location: testResult.location,
      numPassingAsserts: 0,
      status,
      title: testResult.testPath[testResult.testPath.length - 1]
    };
  });
  let failureMessage = (0, _jestMessageUtil.formatResultsErrors)(
    assertionResults,
    config,
    globalConfig,
    testPath
  );
  let testExecError;

  if (runResult.unhandledErrors.length) {
    testExecError = {
      message: '',
      stack: runResult.unhandledErrors.join('\n')
    };
    failureMessage =
      (failureMessage || '') +
      '\n\n' +
      runResult.unhandledErrors
        .map(err =>
          (0, _jestMessageUtil.formatExecError)(err, config, globalConfig)
        )
        .join('\n');
  }

  await (0, _state.dispatch)({
    name: 'teardown'
  });
  return {
    ...(0, _testResult.createEmptyTestResult)(),
    console: undefined,
    displayName: config.displayName,
    failureMessage,
    numFailingTests,
    numPassingTests,
    numPendingTests,
    numTodoTests,
    testExecError,
    testFilePath: testPath,
    testResults: assertionResults
  };
};

exports.runAndTransformResultsToJestFormat = runAndTransformResultsToJestFormat;

const handleSnapshotStateAfterRetry = snapshotState => event => {
  switch (event.name) {
    case 'test_retry': {
      // Clear any snapshot data that occurred in previous test run
      snapshotState.clear();
    }
  }
};

const eventHandler = async event => {
  switch (event.name) {
    case 'test_start': {
      (0, _expect.setState)({
        currentTestName: (0, _utils.getTestID)(event.test)
      });
      break;
    }

    case 'test_done': {
      _addSuppressedErrors(event.test);

      _addExpectedAssertionErrors(event.test);

      break;
    }
  }
};

const _addExpectedAssertionErrors = test => {
  const failures = (0, _expect.extractExpectedAssertionsErrors)();
  const errors = failures.map(failure => failure.error);
  test.errors = test.errors.concat(errors);
}; // Get suppressed errors from ``jest-matchers`` that weren't throw during
// test execution and add them to the test result, potentially failing
// a passing test.

const _addSuppressedErrors = test => {
  const {suppressedErrors} = (0, _expect.getState)();
  (0, _expect.setState)({
    suppressedErrors: []
  });

  if (suppressedErrors.length) {
    test.errors = test.errors.concat(suppressedErrors);
  }
};

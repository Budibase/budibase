'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _stripAnsi() {
  const data = _interopRequireDefault(require('strip-ansi'));

  _stripAnsi = function () {
    return data;
  };

  return data;
}

function _jestMessageUtil() {
  const data = require('jest-message-util');

  _jestMessageUtil = function () {
    return data;
  };

  return data;
}

var _BaseReporter = _interopRequireDefault(require('./BaseReporter'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _classPrivateMethodInitSpec(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);
  privateSet.add(obj);
}

function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError(
      'Cannot initialize the same private elements twice on an object'
    );
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError('attempted to get private field on non-instance');
  }
  return fn;
}

const titleSeparator = ' \u203A ';

var _getMessageDetails = /*#__PURE__*/ new WeakSet();

var _createAnnotation = /*#__PURE__*/ new WeakSet();

class GitHubActionsReporter extends _BaseReporter.default {
  constructor(...args) {
    super(...args);

    _classPrivateMethodInitSpec(this, _createAnnotation);

    _classPrivateMethodInitSpec(this, _getMessageDetails);
  }

  onTestFileResult({context}, {testResults}) {
    testResults.forEach(result => {
      var _result$retryReasons;

      const title = [...result.ancestorTitles, result.title].join(
        titleSeparator
      );
      (_result$retryReasons = result.retryReasons) === null ||
      _result$retryReasons === void 0
        ? void 0
        : _result$retryReasons.forEach((retryReason, index) => {
            _classPrivateMethodGet(
              this,
              _createAnnotation,
              _createAnnotation2
            ).call(this, {
              ..._classPrivateMethodGet(
                this,
                _getMessageDetails,
                _getMessageDetails2
              ).call(this, retryReason, context.config),
              title: `RETRY ${index + 1}: ${title}`,
              type: 'warning'
            });
          });
      result.failureMessages.forEach(failureMessage => {
        _classPrivateMethodGet(
          this,
          _createAnnotation,
          _createAnnotation2
        ).call(this, {
          ..._classPrivateMethodGet(
            this,
            _getMessageDetails,
            _getMessageDetails2
          ).call(this, failureMessage, context.config),
          title,
          type: 'error'
        });
      });
    });
  }
}

exports.default = GitHubActionsReporter;

function _getMessageDetails2(failureMessage, config) {
  const {message, stack} = (0, _jestMessageUtil().separateMessageFromStack)(
    failureMessage
  );
  const stackLines = (0, _jestMessageUtil().getStackTraceLines)(stack);
  const topFrame = (0, _jestMessageUtil().getTopFrame)(stackLines);
  const normalizedStackLines = stackLines.map(line =>
    (0, _jestMessageUtil().formatPath)(line, config)
  );
  const messageText = [message, ...normalizedStackLines].join('\n');
  return {
    file: topFrame === null || topFrame === void 0 ? void 0 : topFrame.file,
    line: topFrame === null || topFrame === void 0 ? void 0 : topFrame.line,
    message: messageText
  };
}

function _createAnnotation2({file, line, message, title, type}) {
  message = (0, _stripAnsi().default)(
    // copied from: https://github.com/actions/toolkit/blob/main/packages/core/src/command.ts
    message.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')
  );
  this.log(`\n::${type} file=${file},line=${line},title=${title}::${message}`);
}

_defineProperty(GitHubActionsReporter, 'filename', __filename);

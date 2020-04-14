"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = exports.apiWrapperSync = exports.apiWrapper = void 0;var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _fp = require("lodash/fp");
var _shortid = require("shortid");
var _errors = require("./errors");

var apiWrapper = /*#__PURE__*/function () {var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(
  app,
  eventNamespace,
  isAuthorized,
  eventContext,
  func) {var startDate,elapsed,_len,params,_key,result,_args = arguments;return _regenerator["default"].wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:


            pushCallStack(app, eventNamespace);if (

            isAuthorized(app)) {_context.next = 4;break;}
            handleNotAuthorized(app, eventContext, eventNamespace);return _context.abrupt("return");case 4:



            startDate = Date.now();
            elapsed = function elapsed() {return Date.now() - startDate;};_context.prev = 6;_context.next = 9;return (


              app.publish(eventNamespace.onBegin, eventContext));case 9:for (_len = _args.length, params = new Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {params[_key - 5] = _args[_key];}_context.next = 12;return (

              func.apply(void 0, params));case 12:result = _context.sent;_context.next = 15;return (

              publishComplete(app, eventContext, eventNamespace, elapsed, result));case 15:return _context.abrupt("return",
            result);case 18:_context.prev = 18;_context.t0 = _context["catch"](6);_context.next = 22;return (

              publishError(app, eventContext, eventNamespace, elapsed, _context.t0));case 22:throw _context.t0;case 23:case "end":return _context.stop();}}}, _callee, null, [[6, 18]]);}));return function apiWrapper(_x, _x2, _x3, _x4, _x5) {return _ref.apply(this, arguments);};}();exports.apiWrapper = apiWrapper;




var apiWrapperSync = function apiWrapperSync(
app,
eventNamespace,
isAuthorized,
eventContext,
func)

{
  pushCallStack(app, eventNamespace);

  if (!isAuthorized(app)) {
    handleNotAuthorized(app, eventContext, eventNamespace);
    return;
  }

  var startDate = Date.now();
  var elapsed = function elapsed() {return Date.now() - startDate;};

  try {
    app.publish(eventNamespace.onBegin, eventContext);for (var _len2 = arguments.length, params = new Array(_len2 > 5 ? _len2 - 5 : 0), _key2 = 5; _key2 < _len2; _key2++) {params[_key2 - 5] = arguments[_key2];}

    var result = func.apply(void 0, params);

    publishComplete(app, eventContext, eventNamespace, elapsed, result);
    return result;
  } catch (error) {
    publishError(app, eventContext, eventNamespace, elapsed, error);
    throw error;
  }
};exports.apiWrapperSync = apiWrapperSync;

var handleNotAuthorized = function handleNotAuthorized(app, eventContext, eventNamespace) {
  var err = new _errors.UnauthorisedError("Unauthorized: ".concat(eventNamespace));
  publishError(app, eventContext, eventNamespace, function () {return 0;}, err);
  throw err;
};

var pushCallStack = function pushCallStack(app, eventNamespace, seedCallId) {
  var callId = (0, _shortid.generate)();

  var createCallStack = function createCallStack() {return {
      seedCallId: !(0, _fp.isUndefined)(seedCallId) ? seedCallId : callId,
      threadCallId: callId,
      stack: [] };};


  if ((0, _fp.isUndefined)(app.calls)) {
    app.calls = createCallStack();
  }

  app.calls.stack.push({
    namespace: eventNamespace,
    callId: callId });

};

var popCallStack = function popCallStack(app) {
  app.calls.stack.pop();
  if (app.calls.stack.length === 0) {
    delete app.calls;
  }
};

var publishError = /*#__PURE__*/function () {var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(
  app,
  eventContext,
  eventNamespace,
  elapsed,
  err) {var ctx;return _regenerator["default"].wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:

            ctx = (0, _fp.cloneDeep)(eventContext);
            ctx.error = err;
            ctx.elapsed = elapsed();_context2.next = 5;return (
              app.publish(eventNamespace.onError, ctx));case 5:
            popCallStack(app);case 6:case "end":return _context2.stop();}}}, _callee2);}));return function publishError(_x6, _x7, _x8, _x9, _x10) {return _ref2.apply(this, arguments);};}();


var publishComplete = /*#__PURE__*/function () {var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(
  app,
  eventContext,
  eventNamespace,
  elapsed,
  result) {var endcontext;return _regenerator["default"].wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:

            endcontext = (0, _fp.cloneDeep)(eventContext);
            endcontext.result = result;
            endcontext.elapsed = elapsed();_context3.next = 5;return (
              app.publish(eventNamespace.onComplete, endcontext));case 5:
            popCallStack(app);return _context3.abrupt("return",
            result);case 7:case "end":return _context3.stop();}}}, _callee3);}));return function publishComplete(_x11, _x12, _x13, _x14, _x15) {return _ref3.apply(this, arguments);};}();var _default =


apiWrapper;exports["default"] = _default;
//# sourceMappingURL=apiWrapper.js.map
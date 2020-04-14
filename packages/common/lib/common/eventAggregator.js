"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = exports.createEventAggregator = void 0;var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _fp = require("lodash/fp");function _createForOfIteratorHelper(o) {if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var it,normalCompletion = true,didErr = false,err;return { s: function s() {it = o[Symbol.iterator]();}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it["return"] != null) it["return"]();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(n);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}

var publish = function publish(handlers) {return /*#__PURE__*/function () {var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(eventName) {var context,_iterator,_step,handler,_args = arguments;return _regenerator["default"].wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:context = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};if (
              (0, _fp.has)(eventName)(handlers)) {_context.next = 3;break;}return _context.abrupt("return");case 3:_iterator = _createForOfIteratorHelper(

              handlers[eventName]);_context.prev = 4;_iterator.s();case 6:if ((_step = _iterator.n()).done) {_context.next = 12;break;}handler = _step.value;_context.next = 10;return (
                handler(eventName, context));case 10:_context.next = 6;break;case 12:_context.next = 17;break;case 14:_context.prev = 14;_context.t0 = _context["catch"](4);_iterator.e(_context.t0);case 17:_context.prev = 17;_iterator.f();return _context.finish(17);case 20:case "end":return _context.stop();}}}, _callee, null, [[4, 14, 17, 20]]);}));return function (_x) {return _ref.apply(this, arguments);};}();};



var subscribe = function subscribe(handlers) {return function (eventName, handler) {
    if (!(0, _fp.has)(eventName)(handlers)) {
      handlers[eventName] = [];
    }
    handlers[eventName].push(handler);
  };};

var createEventAggregator = function createEventAggregator() {
  var handlers = {};
  var eventAggregator = {
    publish: publish(handlers),
    subscribe: subscribe(handlers) };

  return eventAggregator;
};exports.createEventAggregator = createEventAggregator;var _default =

createEventAggregator;exports["default"] = _default;
//# sourceMappingURL=eventAggregator.js.map
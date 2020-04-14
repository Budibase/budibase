"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, "events", { enumerable: true, get: function get() {return _events.events;} });exports["default"] = exports.retry = exports.pause = exports.pushAll = exports.isArrayOfString = exports.toNumberOrNull = exports.toBoolOrNull = exports.toDateOrNull = exports.isSafeInteger = exports.awEx = exports.getHashCode = exports.contains = exports.StartsWith = exports.memberMatches = exports.defaultCase = exports.isOneOf = exports.isValue = exports.switchCase = exports.handleErrorWithUndefined = exports.handleErrorWith = exports.executesWithoutException = exports.causesException = exports.tryAwaitOrIgnore = exports.tryOrIgnore = exports.defineError = exports.tryAwaitOr = exports.tryOr = exports.isNonEmptyString = exports.isNonEmptyArray = exports.isAsync = exports.isNotEmpty = exports.all = exports.none = exports.mapIfSomethingOrBlank = exports.mapIfSomethingOrDefault = exports.somethingOrDefault = exports.somethingOrGetDefault = exports.isNothingOrEmpty = exports.isNothing = exports.isSomething = exports.insensitiveEquals = exports.anyTrue = exports.allTrue = exports.isNotNaN = exports.isNonNull = exports.isDefined = exports.not = exports.getOrDefault = exports.ifExists = exports.getIndexKeyFromFileKey = exports.dirIndex = exports.appDefinitionFile = exports.templateDefinitions = exports.fieldDefinitions = exports.configFolder = exports.getFileFromKey = exports.getDirFomKey = exports.splitKey = exports.joinKey = exports.safeKey = exports.keySep = exports.$ = exports.$$ = void 0;var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _lodash = require("lodash");










var _fp = require("lodash/fp");

















var _events = require("./events.js");function _createForOfIteratorHelper(o) {if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var it,normalCompletion = true,didErr = false,err;return { s: function s() {it = o[Symbol.iterator]();}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it["return"] != null) it["return"]();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(n);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}

// this is the combinator function
var $$ = function $$() {for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {funcs[_key] = arguments[_key];}return function (arg) {return (0, _lodash.flow)(funcs)(arg);};};

// this is the pipe function
exports.$$ = $$;var $ = function $(arg, funcs) {return $$.apply(void 0, (0, _toConsumableArray2["default"])(funcs))(arg);};exports.$ = $;

var keySep = "/";exports.keySep = keySep;
var trimKeySep = function trimKeySep(str) {return (0, _lodash.trim)(str, keySep);};
var splitByKeySep = function splitByKeySep(str) {return (0, _fp.split)(keySep)(str);};
var safeKey = function safeKey(key) {return (
    (0, _lodash.replace)("".concat(keySep).concat(trimKeySep(key)), "".concat(keySep).concat(keySep), keySep));};exports.safeKey = safeKey;
var joinKey = function joinKey() {for (var _len2 = arguments.length, strs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {strs[_key2] = arguments[_key2];}
  var paramsOrArray = strs.length === 1 & (0, _fp.isArray)(strs[0]) ? strs[0] : strs;
  return $(paramsOrArray, [
  (0, _fp.filter)(function (s) {return !(0, _fp.isUndefined)(s) && !(0, _fp.isNull)(s) && s.toString().length > 0;}),
  (0, _fp.join)(keySep),
  safeKey]);

};exports.joinKey = joinKey;
var splitKey = $$(trimKeySep, splitByKeySep);exports.splitKey = splitKey;
var getDirFomKey = $$(splitKey, _lodash.dropRight, function (p) {return joinKey.apply(void 0, (0, _toConsumableArray2["default"])(p));});exports.getDirFomKey = getDirFomKey;
var getFileFromKey = $$(splitKey, _lodash.takeRight, _lodash.head);exports.getFileFromKey = getFileFromKey;

var configFolder = "".concat(keySep, ".config");exports.configFolder = configFolder;
var fieldDefinitions = joinKey(configFolder, "fields.json");exports.fieldDefinitions = fieldDefinitions;
var templateDefinitions = joinKey(configFolder, "templates.json");exports.templateDefinitions = templateDefinitions;
var appDefinitionFile = joinKey(configFolder, "appDefinition.json");exports.appDefinitionFile = appDefinitionFile;
var dirIndex = function dirIndex(folderPath) {return (
    joinKey.apply(void 0, [configFolder, "dir"].concat((0, _toConsumableArray2["default"])(splitKey(folderPath)), ["dir.idx"])));};exports.dirIndex = dirIndex;
var getIndexKeyFromFileKey = $$(getDirFomKey, dirIndex);exports.getIndexKeyFromFileKey = getIndexKeyFromFileKey;

var ifExists = function ifExists(val, exists, notExists) {return (
    (0, _fp.isUndefined)(val) ?
    (0, _fp.isUndefined)(notExists) ?
    function () {}() :
    notExists() :
    exists());};exports.ifExists = ifExists;

var getOrDefault = function getOrDefault(val, defaultVal) {return (
    ifExists(
    val,
    function () {return val;},
    function () {return defaultVal;}));};exports.getOrDefault = getOrDefault;


var not = function not(func) {return function (val) {return !func(val);};};exports.not = not;
var isDefined = not(_fp.isUndefined);exports.isDefined = isDefined;
var isNonNull = not(_fp.isNull);exports.isNonNull = isNonNull;
var isNotNaN = not(_fp.isNaN);exports.isNotNaN = isNotNaN;

var allTrue = function allTrue() {for (var _len3 = arguments.length, funcArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {funcArgs[_key3] = arguments[_key3];}return function (val) {return (
      (0, _fp.reduce)(
      function (result, conditionFunc) {return (
          ((0, _fp.isNull)(result) || result == true) && conditionFunc(val));},
      null)(
      funcArgs));};};exports.allTrue = allTrue;

var anyTrue = function anyTrue() {for (var _len4 = arguments.length, funcArgs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {funcArgs[_key4] = arguments[_key4];}return function (val) {return (
      (0, _fp.reduce)(
      function (result, conditionFunc) {return result == true || conditionFunc(val);},
      null)(
      funcArgs));};};exports.anyTrue = anyTrue;

var insensitiveEquals = function insensitiveEquals(str1, str2) {return (
    str1.trim().toLowerCase() === str2.trim().toLowerCase());};exports.insensitiveEquals = insensitiveEquals;

var isSomething = allTrue(isDefined, isNonNull, isNotNaN);exports.isSomething = isSomething;
var isNothing = not(isSomething);exports.isNothing = isNothing;
var isNothingOrEmpty = function isNothingOrEmpty(v) {return isNothing(v) || (0, _fp.isEmpty)(v);};exports.isNothingOrEmpty = isNothingOrEmpty;
var somethingOrGetDefault = function somethingOrGetDefault(getDefaultFunc) {return function (val) {return (
      isSomething(val) ? val : getDefaultFunc());};};exports.somethingOrGetDefault = somethingOrGetDefault;
var somethingOrDefault = function somethingOrDefault(val, defaultVal) {return (
    somethingOrGetDefault((0, _fp.constant)(defaultVal))(val));};exports.somethingOrDefault = somethingOrDefault;

var mapIfSomethingOrDefault = function mapIfSomethingOrDefault(mapFunc, defaultVal) {return function (val) {return (
      isSomething(val) ? mapFunc(val) : defaultVal);};};exports.mapIfSomethingOrDefault = mapIfSomethingOrDefault;

var mapIfSomethingOrBlank = function mapIfSomethingOrBlank(mapFunc) {return (
    mapIfSomethingOrDefault(mapFunc, ""));};exports.mapIfSomethingOrBlank = mapIfSomethingOrBlank;

var none = function none(predicate) {return function (collection) {return !(0, _fp.some)(predicate)(collection);};};exports.none = none;

var all = function all(predicate) {return function (collection) {return (
      none(function (v) {return !predicate(v);})(collection));};};exports.all = all;

var isNotEmpty = function isNotEmpty(ob) {return !(0, _fp.isEmpty)(ob);};exports.isNotEmpty = isNotEmpty;
var isAsync = function isAsync(fn) {return fn.constructor.name === "AsyncFunction";};exports.isAsync = isAsync;
var isNonEmptyArray = allTrue(_fp.isArray, isNotEmpty);exports.isNonEmptyArray = isNonEmptyArray;
var isNonEmptyString = allTrue(_fp.isString, isNotEmpty);exports.isNonEmptyString = isNonEmptyString;
var tryOr = function tryOr(failFunc) {return function (func) {
    try {for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {args[_key5 - 1] = arguments[_key5];}
      return func.apply.apply(func, [null].concat(args));
    } catch (_) {
      return failFunc();
    }
  };};exports.tryOr = tryOr;

var tryAwaitOr = function tryAwaitOr(failFunc) {return /*#__PURE__*/function () {var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(func) {var _len6,args,_key6,_args = arguments;return _regenerator["default"].wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.prev = 0;for (_len6 = _args.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {args[_key6 - 1] = _args[_key6];}_context.next = 4;return (

                func.apply.apply(func, [null].concat(args)));case 4:return _context.abrupt("return", _context.sent);case 7:_context.prev = 7;_context.t0 = _context["catch"](0);_context.next = 11;return (

                failFunc());case 11:return _context.abrupt("return", _context.sent);case 12:case "end":return _context.stop();}}}, _callee, null, [[0, 7]]);}));return function (_x) {return _ref.apply(this, arguments);};}();};exports.tryAwaitOr = tryAwaitOr;



var defineError = function defineError(func, errorPrefix) {
  try {
    return func();
  } catch (err) {
    err.message = "".concat(errorPrefix, " : ").concat(err.message);
    throw err;
  }
};exports.defineError = defineError;

var tryOrIgnore = tryOr(function () {});exports.tryOrIgnore = tryOrIgnore;
var tryAwaitOrIgnore = tryAwaitOr( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {return _regenerator["default"].wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:case "end":return _context2.stop();}}}, _callee2);})));exports.tryAwaitOrIgnore = tryAwaitOrIgnore;
var causesException = function causesException(func) {
  try {
    func();
    return false;
  } catch (e) {
    return true;
  }
};exports.causesException = causesException;

var executesWithoutException = function executesWithoutException(func) {return !causesException(func);};exports.executesWithoutException = executesWithoutException;

var handleErrorWith = function handleErrorWith(returnValInError) {return (
    tryOr((0, _fp.constant)(returnValInError)));};exports.handleErrorWith = handleErrorWith;

var handleErrorWithUndefined = handleErrorWith(undefined);exports.handleErrorWithUndefined = handleErrorWithUndefined;

var switchCase = function switchCase() {for (var _len7 = arguments.length, cases = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {cases[_key7] = arguments[_key7];}return function (value) {
    var nextCase = function nextCase() {return (0, _lodash.head)(cases)[0](value);};
    var nextResult = function nextResult() {return (0, _lodash.head)(cases)[1](value);};

    if ((0, _fp.isEmpty)(cases)) return; // undefined
    if (nextCase() === true) return nextResult();
    return switchCase.apply(void 0, (0, _toConsumableArray2["default"])((0, _lodash.tail)(cases)))(value);
  };};exports.switchCase = switchCase;

var isValue = function isValue(val1) {return function (val2) {return val1 === val2;};};exports.isValue = isValue;
var isOneOf = function isOneOf() {for (var _len8 = arguments.length, vals = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {vals[_key8] = arguments[_key8];}return function (val) {return (0, _fp.includes)(val)(vals);};};exports.isOneOf = isOneOf;
var defaultCase = (0, _fp.constant)(true);exports.defaultCase = defaultCase;
var memberMatches = function memberMatches(member, match) {return function (obj) {return match(obj[member]);};};exports.memberMatches = memberMatches;

var StartsWith = function StartsWith(searchFor) {return function (searchIn) {return (
      (0, _lodash.startsWith)(searchIn, searchFor));};};exports.StartsWith = StartsWith;

var contains = function contains(val) {return function (array) {return (0, _lodash.findIndex)(array, function (v) {return v === val;}) > -1;};};exports.contains = contains;

var getHashCode = function getHashCode(s) {
  var hash = 0;
  var i;
  var _char;
  var l;
  if (s.length == 0) return hash;
  for (i = 0, l = s.length; i < l; i++) {
    _char = s.charCodeAt(i);
    hash = (hash << 5) - hash + _char;
    hash |= 0; // Convert to 32bit integer
  }

  // converting to string, but dont want a "-" prefixed
  if (hash < 0) {
    return "n".concat((hash * -1).toString());
  }
  return hash.toString();
};

// thanks to https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
exports.getHashCode = getHashCode;var awEx = /*#__PURE__*/function () {var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(promise) {var result;return _regenerator["default"].wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.prev = 0;_context3.next = 3;return (

              promise);case 3:result = _context3.sent;return _context3.abrupt("return",
            [undefined, result]);case 7:_context3.prev = 7;_context3.t0 = _context3["catch"](0);return _context3.abrupt("return",

            [_context3.t0, undefined]);case 10:case "end":return _context3.stop();}}}, _callee3, null, [[0, 7]]);}));return function awEx(_x2) {return _ref3.apply(this, arguments);};}();exports.awEx = awEx;



var isSafeInteger = function isSafeInteger(n) {return (
    (0, _fp.isInteger)(n) &&
    n <= Number.MAX_SAFE_INTEGER &&
    n >= 0 - Number.MAX_SAFE_INTEGER);};exports.isSafeInteger = isSafeInteger;

var toDateOrNull = function toDateOrNull(s) {return (
    (0, _fp.isNull)(s) ? null : (0, _fp.isDate)(s) ? s : new Date(s));};exports.toDateOrNull = toDateOrNull;
var toBoolOrNull = function toBoolOrNull(s) {return (0, _fp.isNull)(s) ? null : s === "true" || s === true;};exports.toBoolOrNull = toBoolOrNull;
var toNumberOrNull = function toNumberOrNull(s) {return (0, _fp.isNull)(s) ? null : (0, _fp.toNumber)(s);};exports.toNumberOrNull = toNumberOrNull;

var isArrayOfString = function isArrayOfString(opts) {return (0, _fp.isArray)(opts) && all(_fp.isString)(opts);};exports.isArrayOfString = isArrayOfString;

var pushAll = function pushAll(target, items) {var _iterator = _createForOfIteratorHelper(
  items),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var i = _step.value;target.push(i);}} catch (err) {_iterator.e(err);} finally {_iterator.f();}
};exports.pushAll = pushAll;

var pause = /*#__PURE__*/function () {var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(duration) {return _regenerator["default"].wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:return _context4.abrupt("return",
            new Promise(function (res) {return setTimeout(res, duration);}));case 1:case "end":return _context4.stop();}}}, _callee4);}));return function pause(_x3) {return _ref4.apply(this, arguments);};}();exports.pause = pause;

var retry = /*#__PURE__*/function () {var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(fn, retries, delay) {var _len9,args,_key9,_args6 = arguments;return _regenerator["default"].wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:for (_len9 = _args6.length, args = new Array(_len9 > 3 ? _len9 - 3 : 0), _key9 = 3; _key9 < _len9; _key9++) {args[_key9 - 3] = _args6[_key9];}_context6.prev = 1;_context6.next = 4;return (

              fn.apply(void 0, args));case 4:return _context6.abrupt("return", _context6.sent);case 7:_context6.prev = 7;_context6.t0 = _context6["catch"](1);if (!(

            retries > 1)) {_context6.next = 13;break;}_context6.next = 12;return (
              pause(delay).then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(
              function _callee5() {return _regenerator["default"].wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.next = 2;return retry.apply(void 0, [fn, retries - 1, delay].concat(args));case 2:return _context5.abrupt("return", _context5.sent);case 3:case "end":return _context5.stop();}}}, _callee5);}))));case 12:return _context6.abrupt("return", _context6.sent);case 13:throw _context6.t0;case 14:case "end":return _context6.stop();}}}, _callee6, null, [[1, 7]]);}));return function retry(_x4, _x5, _x6) {return _ref5.apply(this, arguments);};}();exports.retry = retry;var _default =








{
  ifExists: ifExists,
  getOrDefault: getOrDefault,
  isDefined: isDefined,
  isNonNull: isNonNull,
  isNotNaN: isNotNaN,
  allTrue: allTrue,
  isSomething: isSomething,
  mapIfSomethingOrDefault: mapIfSomethingOrDefault,
  mapIfSomethingOrBlank: mapIfSomethingOrBlank,
  configFolder: configFolder,
  fieldDefinitions: fieldDefinitions,
  isNothing: isNothing,
  not: not,
  switchCase: switchCase,
  defaultCase: defaultCase,
  StartsWith: StartsWith,
  contains: contains,
  templateDefinitions: templateDefinitions,
  handleErrorWith: handleErrorWith,
  handleErrorWithUndefined: handleErrorWithUndefined,
  tryOr: tryOr,
  tryOrIgnore: tryOrIgnore,
  tryAwaitOr: tryAwaitOr,
  tryAwaitOrIgnore: tryAwaitOrIgnore,
  dirIndex: dirIndex,
  keySep: keySep,
  $: $,
  $$: $$,
  getDirFomKey: getDirFomKey,
  getFileFromKey: getFileFromKey,
  splitKey: splitKey,
  somethingOrDefault: somethingOrDefault,
  getIndexKeyFromFileKey: getIndexKeyFromFileKey,
  joinKey: joinKey,
  somethingOrGetDefault: somethingOrGetDefault,
  appDefinitionFile: appDefinitionFile,
  isValue: isValue,
  all: all,
  isOneOf: isOneOf,
  memberMatches: memberMatches,
  defineError: defineError,
  anyTrue: anyTrue,
  isNonEmptyArray: isNonEmptyArray,
  causesException: causesException,
  executesWithoutException: executesWithoutException,
  none: none,
  getHashCode: getHashCode,
  awEx: awEx,
  events: _events.events,
  eventsList: _events.eventsList,
  isNothingOrEmpty: isNothingOrEmpty,
  isSafeInteger: isSafeInteger,
  toNumber: _fp.toNumber,
  toDate: toDateOrNull,
  toBool: toBoolOrNull,
  isArrayOfString: isArrayOfString,
  insensitiveEquals: insensitiveEquals,
  pause: pause,
  retry: retry,
  pushAll: pushAll };exports["default"] = _default;
//# sourceMappingURL=index.js.map
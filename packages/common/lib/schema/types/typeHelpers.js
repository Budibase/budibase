"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.getDefaultExport = exports.parsedSuccess = exports.parsedFailed = exports.makerule = exports.validateTypeConstraints = exports.typeFunctions = exports.getNewValue = exports.getSafeValueParser = exports.getSafeFieldParser = void 0;var _lodash = require("lodash");
var _fp = require("lodash/fp");
var _index = require("../../common/index.js");function _createForOfIteratorHelper(o) {if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var it,normalCompletion = true,didErr = false,err;return { s: function s() {it = o[Symbol.iterator]();}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it["return"] != null) it["return"]();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(n);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}

var getSafeFieldParser = function getSafeFieldParser(tryParse, defaultValueFunctions) {return function (
  field,
  record)
  {
    if ((0, _fp.has)(field.name)(record)) {
      return getSafeValueParser(
      tryParse,
      defaultValueFunctions)(
      record[field.name]);
    }
    return defaultValueFunctions[field.getUndefinedValue]();
  };};exports.getSafeFieldParser = getSafeFieldParser;

var getSafeValueParser = function getSafeValueParser(
tryParse,
defaultValueFunctions) {return (
    function (value) {
      var parsed = tryParse(value);
      if (parsed.success) {
        return parsed.value;
      }
      return defaultValueFunctions["default"]();
    });};exports.getSafeValueParser = getSafeValueParser;

var getNewValue = function getNewValue(tryParse, defaultValueFunctions) {return function (field) {
    var getInitialValue =
    (0, _fp.isUndefined)(field) || (0, _fp.isUndefined)(field.getInitialValue) ?
    "default" :
    field.getInitialValue;

    return (0, _fp.has)(getInitialValue)(defaultValueFunctions) ?
    defaultValueFunctions[getInitialValue]() :
    getSafeValueParser(tryParse, defaultValueFunctions)(getInitialValue);
  };};exports.getNewValue = getNewValue;

var typeFunctions = function typeFunctions(specificFunctions) {return (
    (0, _lodash.merge)(
    {
      value: _fp.constant,
      "null": (0, _fp.constant)(null) },

    specificFunctions));};exports.typeFunctions = typeFunctions;


var validateTypeConstraints = function validateTypeConstraints(validationRules) {return function (field, record) {
    var fieldValue = record[field.name];
    var validateRule = function validateRule(r) {return (
        !r.isValid(fieldValue, field.typeOptions) ?
        r.getMessage(fieldValue, field.typeOptions) :
        "");};

    var errors = [];var _iterator = _createForOfIteratorHelper(
    validationRules),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var r = _step.value;
        var err = validateRule(r);
        if ((0, _index.isNotEmpty)(err)) errors.push(err);
      }} catch (err) {_iterator.e(err);} finally {_iterator.f();}

    return errors;
  };};exports.validateTypeConstraints = validateTypeConstraints;

var _getDefaultOptions = (0, _fp.mapValues)(function (v) {return v.defaultValue;});

var makerule = function makerule(isValid, getMessage) {return { isValid: isValid, getMessage: getMessage };};exports.makerule = makerule;
var parsedFailed = function parsedFailed(val) {return { success: false, value: val };};exports.parsedFailed = parsedFailed;
var parsedSuccess = function parsedSuccess(val) {return { success: true, value: val };};exports.parsedSuccess = parsedSuccess;
var getDefaultExport = function getDefaultExport(
name,
tryParse,
functions,
options,
validationRules,
sampleValue,
_stringify) {return (
    {
      getNew: getNewValue(tryParse, functions),
      safeParseField: getSafeFieldParser(tryParse, functions),
      safeParseValue: getSafeValueParser(tryParse, functions),
      tryParse: tryParse,
      name: name,
      getDefaultOptions: function getDefaultOptions() {return _getDefaultOptions((0, _fp.cloneDeep)(options));},
      optionDefinitions: options,
      validateTypeConstraints: validateTypeConstraints(validationRules),
      sampleValue: sampleValue,
      stringify: function stringify(val) {return val === null || val === undefined ? "" : _stringify(val);},
      getDefaultValue: functions["default"] });};exports.getDefaultExport = getDefaultExport;
//# sourceMappingURL=typeHelpers.js.map
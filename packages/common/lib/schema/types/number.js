"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _fp = require("lodash/fp");
var _typeHelpers = require("./typeHelpers");






var _index = require("../../common/index.js");






var numberFunctions = (0, _typeHelpers.typeFunctions)({
  "default": (0, _fp.constant)(null) });


var parseStringtoNumberOrNull = function parseStringtoNumberOrNull(s) {
  var num = Number(s);
  return isNaN(num) ? (0, _typeHelpers.parsedFailed)(s) : (0, _typeHelpers.parsedSuccess)(num);
};

var numberTryParse = (0, _index.switchCase)(
[_fp.isNumber, _typeHelpers.parsedSuccess],
[_fp.isString, parseStringtoNumberOrNull],
[_fp.isNull, _typeHelpers.parsedSuccess],
[_index.defaultCase, _typeHelpers.parsedFailed]);


var options = {
  maxValue: {
    defaultValue: Number.MAX_SAFE_INTEGER,
    isValid: _index.isSafeInteger,
    requirementDescription: "must be a valid integer",
    parse: _index.toNumberOrNull },

  minValue: {
    defaultValue: 0 - Number.MAX_SAFE_INTEGER,
    isValid: _index.isSafeInteger,
    requirementDescription: "must be a valid integer",
    parse: _index.toNumberOrNull },

  decimalPlaces: {
    defaultValue: 0,
    isValid: function isValid(n) {return (0, _index.isSafeInteger)(n) && n >= 0;},
    requirementDescription: "must be a positive integer",
    parse: _index.toNumberOrNull } };



var getDecimalPlaces = function getDecimalPlaces(val) {
  var splitDecimal = val.toString().split(".");
  if (splitDecimal.length === 1) return 0;
  return splitDecimal[1].length;
};

var typeConstraints = [
(0, _typeHelpers.makerule)(
function (val, opts) {return (
    val === null || opts.minValue === null || val >= opts.minValue);},
function (val, opts) {return "value (".concat(
  val.toString(), ") must be greater than or equal to ").concat(
  opts.minValue);}),


(0, _typeHelpers.makerule)(
function (val, opts) {return (
    val === null || opts.maxValue === null || val <= opts.maxValue);},
function (val, opts) {return "value (".concat(
  val.toString(), ") must be less than or equal to ").concat(
  opts.minValue, " options");}),


(0, _typeHelpers.makerule)(
function (val, opts) {return (
    val === null || opts.decimalPlaces >= getDecimalPlaces(val));},
function (val, opts) {return "value (".concat(
  val.toString(), ") must have ").concat(
  opts.decimalPlaces, " decimal places or less");})];var _default =




(0, _typeHelpers.getDefaultExport)(
"number",
numberTryParse,
numberFunctions,
options,
typeConstraints,
1,
function (num) {return num.toString();});exports["default"] = _default;
//# sourceMappingURL=number.js.map
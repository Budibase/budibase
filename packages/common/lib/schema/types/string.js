"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _fp = require("lodash/fp");
var _typeHelpers = require("./typeHelpers");





var _index = require("../../common/index.js");








var stringFunctions = (0, _typeHelpers.typeFunctions)({
  "default": (0, _fp.constant)(null) });


var stringTryParse = (0, _index.switchCase)(
[_fp.isString, _typeHelpers.parsedSuccess],
[_fp.isNull, _typeHelpers.parsedSuccess],
[_index.defaultCase, function (v) {return (0, _typeHelpers.parsedSuccess)(v.toString());}]);


var options = {
  maxLength: {
    defaultValue: null,
    isValid: function isValid(n) {return n === null || (0, _index.isSafeInteger)(n) && n > 0;},
    requirementDescription:
    "max length must be null (no limit) or a greater than zero integer",
    parse: _index.toNumberOrNull },

  values: {
    defaultValue: null,
    isValid: function isValid(v) {return (
        v === null || (0, _index.isArrayOfString)(v) && v.length > 0 && v.length < 10000);},
    requirementDescription:
    "'values' must be null (no values) or an array of at least one string",
    parse: function parse(s) {return s;} },

  allowDeclaredValuesOnly: {
    defaultValue: false,
    isValid: _fp.isBoolean,
    requirementDescription: "allowDeclaredValuesOnly must be true or false",
    parse: _index.toBoolOrNull } };



var typeConstraints = [
(0, _typeHelpers.makerule)(
function (val, opts) {return (
    val === null || opts.maxLength === null || val.length <= opts.maxLength);},
function (val, opts) {return "value exceeds maximum length of ".concat(opts.maxLength);}),

(0, _typeHelpers.makerule)(
function (val, opts) {return (
    val === null ||
    opts.allowDeclaredValuesOnly === false ||
    (0, _fp.includes)(val)(opts.values));},
function (val) {return "\"".concat(val, "\" does not exist in the list of allowed values");})];var _default =



(0, _typeHelpers.getDefaultExport)(
"string",
stringTryParse,
stringFunctions,
options,
typeConstraints,
"abcde",
function (str) {return str;});exports["default"] = _default;
//# sourceMappingURL=string.js.map
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _fp = require("lodash/fp");
var _typeHelpers = require("./typeHelpers");






var _index = require("../../common/index.js");







var arrayFunctions = function arrayFunctions() {return (
    (0, _typeHelpers.typeFunctions)({
      "default": (0, _fp.constant)([]) }));};


var mapToParsedArrary = function mapToParsedArrary(type) {return (
    (0, _index.$$)(
    (0, _fp.map)(function (i) {return type.safeParseValue(i);}),
    _typeHelpers.parsedSuccess));};


var arrayTryParse = function arrayTryParse(type) {return (
    (0, _index.switchCase)([_fp.isArray, mapToParsedArrary(type)], [_index.defaultCase, _typeHelpers.parsedFailed]));};

var typeName = function typeName(type) {return "array<".concat(type, ">");};

var options = {
  maxLength: {
    defaultValue: 10000,
    isValid: _index.isSafeInteger,
    requirementDescription: "must be a positive integer",
    parse: _index.toNumberOrNull },

  minLength: {
    defaultValue: 0,
    isValid: function isValid(n) {return (0, _index.isSafeInteger)(n) && n >= 0;},
    requirementDescription: "must be a positive integer",
    parse: _index.toNumberOrNull } };



var typeConstraints = [
(0, _typeHelpers.makerule)(
function (val, opts) {return val === null || val.length >= opts.minLength;},
function (val, opts) {return "must choose ".concat(opts.minLength, " or more options");}),

(0, _typeHelpers.makerule)(
function (val, opts) {return val === null || val.length <= opts.maxLength;},
function (val, opts) {return "cannot choose more than ".concat(opts.maxLength, " options");})];var _default =



function _default(type) {return (
    (0, _typeHelpers.getDefaultExport)(
    typeName(type.name),
    arrayTryParse(type),
    arrayFunctions(type),
    options,
    typeConstraints,
    [type.sampleValue],
    JSON.stringify));};exports["default"] = _default;
//# sourceMappingURL=array.js.map
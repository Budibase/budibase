"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _fp = require("lodash/fp");
var _typeHelpers = require("./typeHelpers");






var _common = require("../../common");

var dateFunctions = (0, _typeHelpers.typeFunctions)({
  "default": (0, _fp.constant)(null),
  now: function now() {return new Date();} });


var isValidDate = function isValidDate(d) {return d instanceof Date && !isNaN(d);};

var parseStringToDate = function parseStringToDate(s) {return (
    (0, _common.switchCase)(
    [isValidDate, _typeHelpers.parsedSuccess],
    [_common.defaultCase, _typeHelpers.parsedFailed])(
    new Date(s)));};

var isNullOrEmpty = function isNullOrEmpty(d) {return (0, _fp.isNull)(d) || (d || "").toString() === "";};

var isDateOrEmpty = function isDateOrEmpty(d) {return (0, _fp.isDate)(d) || isNullOrEmpty(d);};

var dateTryParse = (0, _common.switchCase)(
[isDateOrEmpty, _typeHelpers.parsedSuccess],
[_fp.isString, parseStringToDate],
[_common.defaultCase, _typeHelpers.parsedFailed]);


var options = {
  maxValue: {
    defaultValue: null,
    //defaultValue: new Date(32503680000000),
    isValid: isDateOrEmpty,
    requirementDescription: "must be a valid date",
    parse: _common.toDateOrNull },

  minValue: {
    defaultValue: null,
    //defaultValue: new Date(-8520336000000),
    isValid: isDateOrEmpty,
    requirementDescription: "must be a valid date",
    parse: _common.toDateOrNull } };



var typeConstraints = [
(0, _typeHelpers.makerule)(
function (val, opts) {return (
    val === null || isNullOrEmpty(opts.minValue) || val >= opts.minValue);},
function (val, opts) {return "value (".concat(
  val.toString(), ") must be greater than or equal to ").concat(
  opts.minValue);}),


(0, _typeHelpers.makerule)(
function (val, opts) {return (
    val === null || isNullOrEmpty(opts.maxValue) || val <= opts.maxValue);},
function (val, opts) {return "value (".concat(
  val.toString(), ") must be less than or equal to ").concat(
  opts.minValue, " options");})];var _default =




(0, _typeHelpers.getDefaultExport)(
"datetime",
dateTryParse,
dateFunctions,
options,
typeConstraints,
new Date(1984, 4, 1),
function (date) {return JSON.stringify(date).replace(new RegExp('"', "g"), "");});exports["default"] = _default;
//# sourceMappingURL=datetime.js.map
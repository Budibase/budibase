"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _fp = require("lodash/fp");
var _typeHelpers = require("./typeHelpers");






var _index = require("../../common/index.js");






var boolFunctions = (0, _typeHelpers.typeFunctions)({
  "default": (0, _fp.constant)(null) });


var boolTryParse = (0, _index.switchCase)(
[_fp.isBoolean, _typeHelpers.parsedSuccess],
[_fp.isNull, _typeHelpers.parsedSuccess],
[(0, _index.isOneOf)("true", "1", "yes", "on"), function () {return (0, _typeHelpers.parsedSuccess)(true);}],
[(0, _index.isOneOf)("false", "0", "no", "off"), function () {return (0, _typeHelpers.parsedSuccess)(false);}],
[_index.defaultCase, _typeHelpers.parsedFailed]);


var options = {
  allowNulls: {
    defaultValue: true,
    isValid: _fp.isBoolean,
    requirementDescription: "must be a true or false",
    parse: _index.toBoolOrNull } };



var typeConstraints = [
(0, _typeHelpers.makerule)(
function (val, opts) {return opts.allowNulls === true || val !== null;},
function () {return "field cannot be null";})];var _default =



(0, _typeHelpers.getDefaultExport)(
"bool",
boolTryParse,
boolFunctions,
options,
typeConstraints,
true,
JSON.stringify);exports["default"] = _default;
//# sourceMappingURL=bool.js.map
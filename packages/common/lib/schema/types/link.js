"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _fp = require("lodash/fp");
var _typeHelpers = require("./typeHelpers");
var _index = require("../../common/index.js");





var linkNothing = function linkNothing() {return "";};

var linkFunctions = (0, _typeHelpers.typeFunctions)({
  "default": linkNothing });


var linkTryParse = function linkTryParse(v) {return (
    (0, _index.switchCase)(
    [_fp.isString, function (s) {return (0, _typeHelpers.parsedSuccess)(s);}],
    [_fp.isNull, function () {return (0, _typeHelpers.parsedSuccess)(linkNothing());}],
    [_fp.isUndefined, function () {return (0, _typeHelpers.parsedSuccess)(linkNothing());}],
    [_index.defaultCase, function (s) {return (0, _typeHelpers.parsedSuccess)(s.toString());}])(
    v));};

var options = {
  modelId: {
    defaultValue: "",
    isValid: _index.isNonEmptyString,
    requirementDescription: "must choose a model",
    parse: function parse(s) {return s;} } };



var typeConstraints = [];var _default =

(0, _typeHelpers.getDefaultExport)(
"link",
linkTryParse,
linkFunctions,
options,
typeConstraints,
"abcd1234",
JSON.stringify);exports["default"] = _default;
//# sourceMappingURL=link.js.map
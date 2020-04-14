"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _lodash = require("lodash");
var _typeHelpers = require("./typeHelpers");





var _index = require("../../common/index.js");

var objectFunctions = function objectFunctions(definition, allTypes) {return (
    (0, _typeHelpers.typeFunctions)({
      "default": (0, _lodash.constant)(null),
      initialise: function initialise() {return (
          (0, _index.$)((0, _lodash.keys)(definition), [
          (0, _lodash.map)(function () {
            var defClone = (0, _lodash.clone)(definition);
            for (var k in defClone) {
              defClone[k] = allTypes[k].getNew();
            }
            return defClone;
          })]));} }));};



var parseObject = function parseObject(definition, allTypes) {return function (record) {
    var defClone = (0, _lodash.clone)(definition);
    for (var k in defClone) {
      var type = allTypes[defClone[k]];
      defClone[k] = (0, _lodash.has)(record, k) ?
      type.safeParseValue(record[k]) :
      type.getNew();
    }
    return (0, _typeHelpers.parsedSuccess)(defClone);
  };};

var objectTryParse = function objectTryParse(definition, allTypes) {return (
    (0, _index.switchCase)(
    [_lodash.isNull, _typeHelpers.parsedSuccess],
    [_lodash.isObject, parseObject(definition, allTypes)],
    [_index.defaultCase, _typeHelpers.parsedFailed]));};var _default =


function _default(
typeName,
definition,
allTypes,
defaultOptions,
typeConstraints,
sampleValue) {return (

    (0, _typeHelpers.getDefaultExport)(
    typeName,
    objectTryParse(definition, allTypes),
    objectFunctions(definition, allTypes),
    defaultOptions,
    typeConstraints,
    sampleValue,
    JSON.stringify));};exports["default"] = _default;
//# sourceMappingURL=object.js.map
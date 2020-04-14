"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.detectType = exports.validateTypeConstraints = exports.getDefaultOptions = exports.validateFieldParse = exports.safeParseField = exports.getNewFieldValue = exports.getSampleFieldValue = exports.getType = exports.all = void 0;var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _lodash = require("lodash");
var _fp = require("lodash/fp");










var _common = require("../../common");
var _typeHelpers = require("./typeHelpers");
var _string = _interopRequireDefault(require("./string"));
var _bool = _interopRequireDefault(require("./bool"));
var _number = _interopRequireDefault(require("./number"));
var _datetime = _interopRequireDefault(require("./datetime"));
var _array = _interopRequireDefault(require("./array"));
var _link = _interopRequireDefault(require("./link"));
var _file = _interopRequireDefault(require("./file"));
var _errors = require("../../common/errors");

var allTypes = function allTypes() {
  var basicTypes = {
    string: _string["default"],
    number: _number["default"],
    datetime: _datetime["default"],
    bool: _bool["default"],
    link: _link["default"],
    file: _file["default"] };


  var arrays = (0, _common.$)(basicTypes, [
  _fp.keys,
  (0, _fp.map)(function (k) {
    var kvType = {};
    var concreteArray = (0, _array["default"])(basicTypes[k]);
    kvType[concreteArray.name] = concreteArray;
    return kvType;
  }),
  function (types) {return _lodash.assign.apply(void 0, [{}].concat((0, _toConsumableArray2["default"])(types)));}]);


  return (0, _lodash.merge)({}, basicTypes, arrays);
};

var all = allTypes();exports.all = all;

var getType = function getType(typeName) {
  if (!(0, _fp.has)(typeName)(all))
  throw new _errors.BadRequestError("Do not recognise type ".concat(typeName));
  return all[typeName];
};exports.getType = getType;

var getSampleFieldValue = function getSampleFieldValue(field) {return getType(field.type).sampleValue;};exports.getSampleFieldValue = getSampleFieldValue;

var getNewFieldValue = function getNewFieldValue(field) {return getType(field.type).getNew(field);};exports.getNewFieldValue = getNewFieldValue;

var safeParseField = function safeParseField(field, record) {return (
    getType(field.type).safeParseField(field, record));};exports.safeParseField = safeParseField;

var validateFieldParse = function validateFieldParse(field, record) {return (
    (0, _fp.has)(field.name)(record) ?
    getType(field.type).tryParse(record[field.name]) :
    (0, _typeHelpers.parsedSuccess)(undefined));}; // fields may be undefined by default
exports.validateFieldParse = validateFieldParse;
var getDefaultOptions = function getDefaultOptions(type) {return getType(type).getDefaultOptions();};exports.getDefaultOptions = getDefaultOptions;

var validateTypeConstraints = function validateTypeConstraints(field, record) {return (
    getType(field.type).validateTypeConstraints(field, record));};exports.validateTypeConstraints = validateTypeConstraints;

var detectType = function detectType(value) {
  if ((0, _fp.isString)(value)) return _string["default"];
  if ((0, _fp.isBoolean)(value)) return _bool["default"];
  if ((0, _fp.isNumber)(value)) return _number["default"];
  if ((0, _fp.isDate)(value)) return _datetime["default"];
  if ((0, _fp.isArray)(value)) return (0, _array["default"])(detectType(value[0]));
  if ((0, _fp.isObject)(value) && (0, _fp.has)("key")(value) && (0, _fp.has)("value")(value)) return _link["default"];
  if ((0, _fp.isObject)(value) && (0, _fp.has)("relativePath")(value) && (0, _fp.has)("size")(value))
  return _file["default"];

  throw new _errors.BadRequestError("cannot determine type: ".concat(JSON.stringify(value)));
};exports.detectType = detectType;
//# sourceMappingURL=index.js.map
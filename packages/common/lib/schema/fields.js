"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.addField = exports.validateAllFields = exports.validateField = exports.getNewField = exports.allowedTypes = exports.fieldErrors = void 0;var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _fp = require("lodash/fp");
var _common = require("../common");






var _index = require("./types/index.js");
var _validationCommon = require("../common/validationCommon");
var _errors = require("../common/errors");
var _shortid = require("shortid");

var fieldErrors = {
  AddFieldValidationFailed: "Add field validation: " };exports.fieldErrors = fieldErrors;


var allowedTypes = function allowedTypes() {return (0, _fp.keys)(_index.all);};exports.allowedTypes = allowedTypes;

var getNewField = function getNewField(type) {return {
    id: (0, _shortid.generate)(),
    name: "", // how field is referenced internally
    type: type,
    typeOptions: (0, _index.getDefaultOptions)(type),
    label: "", // how field is displayed
    getInitialValue: "default", // function that gets value when initially created
    getUndefinedValue: "default" // function that gets value when field undefined on record
  };};exports.getNewField = getNewField;

var fieldRules = function fieldRules(allFields) {return [
  (0, _validationCommon.makerule)("name", "field name is not set", function (f) {return (0, _common.isNonEmptyString)(f.name);}),
  (0, _validationCommon.makerule)("type", "field type is not set", function (f) {return (0, _common.isNonEmptyString)(f.type);}),
  (0, _validationCommon.makerule)("label", "field label is not set", function (f) {return (0, _common.isNonEmptyString)(f.label);}),
  (0, _validationCommon.makerule)("getInitialValue", "getInitialValue function is not set", function (f) {return (
      (0, _common.isNonEmptyString)(f.getInitialValue));}),

  (0, _validationCommon.makerule)("getUndefinedValue", "getUndefinedValue function is not set", function (f) {return (
      (0, _common.isNonEmptyString)(f.getUndefinedValue));}),

  (0, _validationCommon.makerule)(
  "name",
  "field name is duplicated",
  function (f) {return (0, _common.isNothingOrEmpty)(f.name) || (0, _fp.countBy)("name")(allFields)[f.name] === 1;}),

  (0, _validationCommon.makerule)(
  "type",
  "type is unknown",
  function (f) {return (0, _common.isNothingOrEmpty)(f.type) || (0, _fp.some)(function (t) {return f.type === t;})(allowedTypes());})];};



var typeOptionsRules = function typeOptionsRules(field) {
  var type = _index.all[field.type];
  if ((0, _common.isNothing)(type)) return [];

  var def = function def(optName) {return type.optionDefinitions[optName];};

  return (0, _common.$)(field.typeOptions, [
  _fp.keys,
  (0, _fp.filter)(function (o) {return (0, _common.isSomething)(def(o)) && (0, _common.isSomething)(def(o).isValid);}),
  (0, _fp.map)(function (o) {return (
      (0, _validationCommon.makerule)("typeOptions.".concat(o), "".concat(def(o).requirementDescription), function (field) {return (
          def(o).isValid(field.typeOptions[o]));}));})]);



};

var validateField = function validateField(allFields) {return function (field) {
    var everySingleField = (0, _fp.includes)(field)(allFields) ?
    allFields : [].concat((0, _toConsumableArray2["default"])(
    allFields), [field]);
    return (0, _validationCommon.applyRuleSet)([].concat((0, _toConsumableArray2["default"])(
    fieldRules(everySingleField)), (0, _toConsumableArray2["default"])(
    typeOptionsRules(field))))(
    field);
  };};exports.validateField = validateField;

var validateAllFields = function validateAllFields(recordNode) {return (
    (0, _common.$)(recordNode.fields, [(0, _fp.map)(validateField(recordNode.fields)), _fp.flatten]));};exports.validateAllFields = validateAllFields;

var addField = function addField(recordTemplate, field) {
  if ((0, _common.isNothingOrEmpty)(field.label)) {
    field.label = field.name;
  }
  var validationMessages = validateField([].concat((0, _toConsumableArray2["default"])(recordTemplate.fields), [field]))(
  field);

  if (validationMessages.length > 0) {
    var errors = (0, _fp.map)(function (m) {return m.error;})(validationMessages);
    throw new _errors.BadRequestError("".concat(
    fieldErrors.AddFieldValidationFailed, " ").concat(errors.join(", ")));

  }
  recordTemplate.fields.push(field);
};exports.addField = addField;
//# sourceMappingURL=fields.js.map
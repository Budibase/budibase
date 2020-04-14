"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.validateRecord = void 0;var _fp = require("lodash/fp");
var _compileCode = require("../common/compileCode");
var _index = require("../schema/types/index.js");



var _index2 = require("../common/index.js");function _createForOfIteratorHelper(o) {if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var it,normalCompletion = true,didErr = false,err;return { s: function s() {it = o[Symbol.iterator]();}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it["return"] != null) it["return"]();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(n);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}

var fieldParseError = function fieldParseError(fieldName, value) {return {
    fields: [fieldName],
    message: "Could not parse field ".concat(fieldName, ":").concat(value) };};


var validateAllFieldParse = function validateAllFieldParse(record, model) {return (
    (0, _index2.$)(model.fields, [
    (0, _fp.map)(function (f) {return { name: f.name, parseResult: (0, _index.validateFieldParse)(f, record) };}),
    (0, _fp.reduce)(function (errors, f) {
      if (f.parseResult.success) return errors;
      errors.push(fieldParseError(f.name, f.parseResult.value));
      return errors;
    }, [])]));};


var validateAllTypeConstraints = function validateAllTypeConstraints(record, model) {
  var errors = [];var _iterator = _createForOfIteratorHelper(
  model.fields),_step;try {var _loop = function _loop() {var field = _step.value;
      (0, _index2.$)((0, _index.validateTypeConstraints)(field, record), [
      (0, _fp.filter)(_index2.isNonEmptyString),
      (0, _fp.map)(function (m) {return { message: m, fields: [field.name] };}),
      (0, _fp.each)(function (e) {return errors.push(e);})]);};for (_iterator.s(); !(_step = _iterator.n()).done;) {_loop();

    }} catch (err) {_iterator.e(err);} finally {_iterator.f();}
  return errors;
};

var runRecordValidationRules = function runRecordValidationRules(record, model) {
  var runValidationRule = function runValidationRule(rule) {
    var isValid = (0, _compileCode.compileCode)(rule.expressionWhenValid);
    var expressionContext = { record: record };
    return isValid(expressionContext) ?
    { valid: true } :
    {
      valid: false,
      fields: rule.invalidFields,
      message: rule.messageWhenInvalid };

  };

  return (0, _index2.$)(model.validationRules, [
  (0, _fp.map)(runValidationRule),
  _fp.flatten,
  (0, _fp.filter)(function (r) {return r.valid === false;}),
  (0, _fp.map)(function (r) {return { fields: r.fields, message: r.message };})]);

};

var validateRecord = function validateRecord(schema, record) {
  var model = schema.findModel(record._modelId);
  var fieldParseFails = validateAllFieldParse(record, model);

  // non parsing would cause further issues - exit here
  if (!(0, _fp.isEmpty)(fieldParseFails)) {
    return { isValid: false, errors: fieldParseFails };
  }

  var recordValidationRuleFails = runRecordValidationRules(record, model);
  var typeContraintFails = validateAllTypeConstraints(record, model);

  if (
  (0, _fp.isEmpty)(fieldParseFails) &&
  (0, _fp.isEmpty)(recordValidationRuleFails) &&
  (0, _fp.isEmpty)(typeContraintFails))
  {
    return { isValid: true, errors: [] };
  }

  return {
    isValid: false,
    errors: (0, _fp.union)(
    fieldParseFails,
    typeContraintFails,
    recordValidationRuleFails) };


};exports.validateRecord = validateRecord;
//# sourceMappingURL=validateRecord.js.map
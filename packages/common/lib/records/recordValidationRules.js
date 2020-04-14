"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.commonRecordValidationRules = exports.getNewRecordValidationRule = void 0;var getNewRecordValidationRule = function getNewRecordValidationRule(
invalidField,
messageWhenInvalid,
expressionWhenValid) {return (
    {
      invalidField: invalidField,
      messageWhenInvalid: messageWhenInvalid,
      expressionWhenValid: expressionWhenValid });};exports.getNewRecordValidationRule = getNewRecordValidationRule;


var commonRecordValidationRules = {
  fieldNotEmpty: function fieldNotEmpty(fieldName) {return (
      getNewRecordValidationRule(
      fieldName, "".concat(
      fieldName, " is empty"), "record['".concat(
      fieldName, "'] && record['").concat(fieldName, "'].length > 0")));},


  fieldBetween: function fieldBetween(fieldName, min, max) {return (
      getNewRecordValidationRule(
      fieldName, "".concat(
      fieldName, " must be between ").concat(min.toString(), " and ").concat(max.toString()), "record['".concat(
      fieldName, "'] >= ").concat(min, " &&  record['").concat(fieldName, "'] <= ").concat(max, " ")));},


  fieldGreaterThan: function fieldGreaterThan(fieldName, min, max) {return (
      getNewRecordValidationRule(
      fieldName, "".concat(
      fieldName, " must be greater than ").concat(min.toString(), " and ").concat(max.toString()), "record['".concat(
      fieldName, "'] >= ").concat(min, "  ")));} };exports.commonRecordValidationRules = commonRecordValidationRules;
//# sourceMappingURL=recordValidationRules.js.map
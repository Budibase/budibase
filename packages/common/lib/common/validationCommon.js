"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.applyRule = exports.applyRuleSet = exports.validationError = exports.makerule = exports.stringNotEmpty = void 0;var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _fp = require("lodash/fp");
var _index = require("./index");function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {(0, _defineProperty2["default"])(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}

var stringNotEmpty = function stringNotEmpty(s) {return (0, _index.isSomething)(s) && s.trim().length > 0;};exports.stringNotEmpty = stringNotEmpty;

var makerule = function makerule(field, error, isValid) {return { field: field, error: error, isValid: isValid };};exports.makerule = makerule;

var validationError = function validationError(rule, item) {return _objectSpread({}, rule, { item: item });};exports.validationError = validationError;

var applyRuleSet = function applyRuleSet(ruleSet) {return function (itemToValidate) {return (
      (0, _index.$)(ruleSet, [(0, _fp.map)(applyRule(itemToValidate)), (0, _fp.filter)(_index.isSomething)]));};};exports.applyRuleSet = applyRuleSet;

var applyRule = function applyRule(itemTovalidate) {return function (rule) {return (
      rule.isValid(itemTovalidate) ? null : validationError(rule, itemTovalidate));};};exports.applyRule = applyRule;
//# sourceMappingURL=validationCommon.js.map
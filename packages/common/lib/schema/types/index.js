"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.listTypes = listTypes;exports.newField = newField;exports.fieldsToSchema = fieldsToSchema;exports.schemaToFields = schemaToFields;var _boolean2 = _interopRequireDefault(require("./boolean"));
var _datetime = _interopRequireDefault(require("./datetime"));
var _link = _interopRequireDefault(require("./link"));
var _number = _interopRequireDefault(require("./number"));
var _select = _interopRequireDefault(require("./select"));
var _text = _interopRequireDefault(require("./text"));

var allTypes = {
  "boolean": _boolean2["default"],
  datetime: _datetime["default"],
  link: _link["default"],
  number: _number["default"],
  select: _select["default"],
  text: _text["default"] };


function listTypes() {
  return Object.keys(allTypes);
}

function newField(name, type) {
  var field = allTypes[type]["default"]();
  field.name = name;
  field.required = false;
  return field;
}

function fieldsToSchema(fields) {
  var required = fields.filter(function (f) {return f.required;}).map(function (f) {return f.name;});

  return {
    type: "object",
    required: required,
    properties: fields.reduce(function (sch, field) {
      sch[field.name] = allTypes[field.type].toSchema(field);
      return sch;
    }, {}) };

}

function schemaToFields(modelSchema) {
  return Object.keys(modelSchema.properties).map(function (key) {
    var schema = modelSchema.properties[key];
    for (var type in allTypes) {
      if (allTypes[type].isType(schema)) {
        var field = allTypes[type].fromSchema(schema);
        field.required = modelSchema.required.includes(key);
        field.name = key;
        return field;
      }
    }
  });
}
//# sourceMappingURL=index.js.map
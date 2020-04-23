"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _default2 = {
  isType: function isType(schema) {return schema.type === "number";},
  fromSchema: function fromSchema(schema) {return schema;},
  toSchema: function toSchema(field) {return {
      type: "number",
      maximum: field.maximum,
      minimum: field.minimum,
      "default": undefined };},

  "default": function _default() {return {
      type: "number",
      maximum: null,
      minimum: null };} };exports["default"] = _default2;
//# sourceMappingURL=number.js.map
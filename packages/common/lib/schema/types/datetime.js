"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _default2 = {
  isType: function isType(schema) {return (
      schema.anyOf &&
      schema.anyOf.filter(function (s) {return s.type === "string" && s.format === "date-time";}).
      length > 0);},

  fromSchema: function fromSchema(schema) {return {
      type: "datetime",
      "default": schema["default"] };},

  toSchema: function toSchema() {return {
      anyOf: [{ type: "string", format: "date-time" }, { "const": "" }],
      "default": "" };},

  "default": function _default() {return {
      type: "datetime",
      "default": "" };} };exports["default"] = _default2;
//# sourceMappingURL=datetime.js.map
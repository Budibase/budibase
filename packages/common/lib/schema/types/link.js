"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _default2 = {
  isType: function isType(schema) {return schema.type === "object" && schema.properties.modelId;},

  fromSchema: function fromSchema(schema) {return {
      type: "link",
      modelId: schema.properties.modelId["const"],
      viewId: schema.properties.viewId["const"],
      "default": schema["default"] };},


  toSchema: function toSchema(field) {return {
      type: "object",
      properties: {
        _id: { type: "string" },
        viewId: field.viewId ? { "const": field.viewId } : undefined,
        modelId: field.modelId ? { "const": field.modelId } : undefined },

      required: ["_id"],
      "default": { _id: "" } };},


  "default": function _default() {return {
      type: "link",
      modelId: null,
      viewId: null };} };exports["default"] = _default2;
//# sourceMappingURL=link.js.map
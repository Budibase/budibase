export default {
  isType: schema => schema.type === "object" && schema.properties.modelId,

  fromSchema: schema => ({
    type: "link",
    modelId: schema.properties.modelId.const,
    viewId: schema.properties.viewId.const,
    default: schema.default,
  }),

  toSchema: field => ({
    type: "object",
    properties: {
      _id: { type: "string" },
      viewId: field.viewId ? { const: field.viewId } : undefined,
      modelId: field.modelId ? { const: field.modelId } : undefined,
    },
    required: ["_id"],
    default: { _id: "" },
  }),

  default: () => ({
    type: "link",
    modelId: null,
    viewId: null,
  }),
}

export default {
  isType: schema => schema.type === "string" && schema.enum,

  fromSchema: schema => ({
    type: "select",
    enum: schema.enum,
    default: schema.default,
  }),

  toSchema: field => ({
    type: "string",
    enum: field.enum,
    default: field.default,
  }),

  default: () => ({
    type: "select",
    enum: [],
    default: "",
  }),
}

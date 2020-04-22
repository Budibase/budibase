export default {
  isType: schema => schema.type === "boolean",
  fromSchema: schema => schema,
  toSchema: field => ({
    type: "boolean",
    default: field.default,
  }),
  default: () => ({
    type: "boolean",
    default: false,
  }),
}

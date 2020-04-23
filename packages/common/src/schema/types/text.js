export default {
  isType: schema => schema.type === "string" && !schema.format,

  fromSchema: schema => ({
    type: "text",
    maxLength: schema.maxLength,
    minLength: schema.minLength,
    default: schema.default,
  }),

  toSchema: field => ({
    type: "string",
    maxLength: field.maxLength,
    minLength: field.minLength,
    default: "",
  }),

  default: () => ({
    type: "text",
    maxLength: null,
    minLength: 0,
    default: "",
  }),
}

export default {
  isType: schema =>
    schema.anyOf &&
    schema.anyOf.filter(s => s.type === "string" && s.format === "date-time")
      .length > 0,

  fromSchema: schema => ({
    type: "datetime",
    default: schema.default,
  }),
  toSchema: () => ({
    anyOf: [{ type: "string", format: "date-time" }, { const: "" }],
    default: "",
  }),
  default: () => ({
    type: "datetime",
    default: "",
  }),
}

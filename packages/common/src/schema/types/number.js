export default {
  isType: schema => schema.type === "number",
  fromSchema: schema => schema,
  toSchema: field => ({
    type: "number",
    maximum: field.maximum,
    minimum: field.minimum,
    default: undefined,
  }),
  default: () => ({
    type: "number",
    maximum: null,
    minimum: null,
  }),
}

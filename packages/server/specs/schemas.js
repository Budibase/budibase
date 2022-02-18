exports.row = {
  description: "The row to be created/updated, based on the table schema.",
  type: "object",
  additionalProperties: {
    oneOf: [
      { type: "string" },
      { type: "object" },
      { type: "integer" },
      { type: "array" },
      { type: "boolean" },
    ],
  },
}

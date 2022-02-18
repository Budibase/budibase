const { FieldTypes } = require("../src/constants")

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

exports.table = {
  description: "The table to be created/updated.",
  type: "object",
  properties: {
    name: {
      description: "The name of the table",
      type: "string",
    },
    schema: {
      type: "object",
      additionalProperties: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: Object.values(FieldTypes),
          },
        },
      },
    },
  },
}

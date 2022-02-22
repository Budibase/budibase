const { object } = require("./utils")
const Resource = require("./utils/Resource")

const baseRow = {
  _id: "ro_ta_5b1649e42a5b41dea4ef7742a36a7a70_e6dc7e38cf1343b2b56760265201cda4",
  type: "row",
  tableId: "ta_5b1649e42a5b41dea4ef7742a36a7a70",
  name: "Mike",
  age: 30,
}

const inputRow = {
  ...baseRow,
  relationship: ["ro_ta_..."],
}

const row = {
  ...baseRow,
  relationship: [
    {
      primaryDisplay: "Joe",
      _id: "ro_ta_...",
    },
  ],
}

const rowSchema = {
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

module.exports = new Resource()
  .setExamples({
    inputRow: {
      value: inputRow,
    },
    row: {
      value: {
        row: row,
      },
    },
    rows: {
      value: {
        rows: [row],
        hasNextPage: true,
        bookmark: 10,
      },
    },
  })
  .setSchemas({
    row: rowSchema,
    rowOutput: object({
      row: rowSchema,
    }),
  })

import { object } from "./utils"
import Resource from "./utils/Resource"

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

const enrichedRow = {
  _id: "ro_ta_5b1649e42a5b41dea4ef7742a36a7a70_e6dc7e38cf1343b2b56760265201cda4",
  name: "eg",
  tableId: "ta_5b1649e42a5b41dea4ef7742a36a7a70",
  type: "row",
  relationship: [
    {
      _id: "ro_ta_users_us_8f3d717147d74d759d8cef5b6712062f",
      name: "Joe",
      tableId: "ta_users",
      internal: [
        {
          _id: "ro_ta_5b1649e42a5b41dea4ef7742a36a7a70_e6dc7e38cf1343b2b56760265201cda4",
          primaryDisplay: "eg",
        },
      ],
    },
  ],
}

const rowSchema = {
  description: "The row to be created/updated, based on the table schema.",
  type: "object",
  additionalProperties: {
    description:
      "Key value properties of any type, depending on the table schema.",
  },
}

const rowOutputSchema = {
  ...rowSchema,
  properties: {
    _id: {
      description: "The ID of the row.",
      type: "string",
    },
    tableId: {
      description: "The ID of the table this row comes from.",
      type: "string",
    },
  },
  required: ["tableId", "_id"],
}

const searchOutputSchema = {
  type: "object",
  required: ["data"],
  properties: {
    data: {
      description:
        "An array of rows, these will each contain an _id field which can be used to update or delete them.",
      type: "array",
      items: {
        type: "object",
      },
    },
    bookmark: {
      description: "If pagination in use, this should be provided.",
      oneOf: [{ type: "string" }, { type: "integer" }],
    },
    hasNextPage: {
      description:
        "If pagination in use, this will determine if there is another page to fetch.",
      type: "boolean",
    },
  },
}

export default new Resource()
  .setExamples({
    inputRow: {
      value: inputRow,
    },
    row: {
      value: {
        data: row,
      },
    },
    enrichedRow: {
      value: {
        data: enrichedRow,
      },
    },
    rows: {
      value: {
        data: [row],
        hasNextPage: true,
        bookmark: 10,
      },
    },
  })
  .setSchemas({
    row: rowSchema,
    searchOutput: searchOutputSchema,
    rowOutput: object({
      data: rowOutputSchema,
    }),
  })

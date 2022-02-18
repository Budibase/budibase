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

const table = {
  _id: "ta_5b1649e42a5b41dea4ef7742a36a7a70",
  name: "People",
  schema: {
    name: {
      type: "string",
      name: "name",
    },
    age: {
      type: "number",
      name: "age",
    },
    relationship: {
      type: "link",
      name: "relationship",
      tableId: "ta_...",
      fieldName: "relatedColumn",
      relationshipType: "many-to-many",
    },
  },
}

exports.table = {
  value: table,
}

exports.tables = {
  value: [table],
}

exports.inputRow = {
  value: inputRow,
}

exports.row = {
  value: row,
}

exports.search = {
  value: {
    rows: [row],
    hasNextPage: true,
    bookmark: 10,
  },
}

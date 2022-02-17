exports.table = {
  value: {
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
  },
}

exports.row = {
  value: {
    _id: "ro_ta_5b1649e42a5b41dea4ef7742a36a7a70_e6dc7e38cf1343b2b56760265201cda4",
    type: "row",
    tableId: "ta_5b1649e42a5b41dea4ef7742a36a7a70",
    name: "Mike",
    age: 30,
    relationship: [
      {
        primaryDisplay: "Joe",
        _id: "ro_ta_...",
      },
    ],
  },
}

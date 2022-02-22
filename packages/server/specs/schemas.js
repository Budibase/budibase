const {
  FieldTypes,
  RelationshipTypes,
  FormulaTypes,
} = require("../src/constants")

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

const baseColumnDef = {
  type: {
    type: "string",
    enum: Object.values(FieldTypes),
    description:
      "Defines the type of the column, most explain themselves, a link column is a relationship.",
  },
  constraints: {
    type: "object",
    description:
      "A constraint can be applied to the column which will be validated against when a row is saved.",
    properties: {
      type: {
        type: "string",
        enum: ["string", "number", "object", "boolean"],
      },
      presence: {
        type: "boolean",
        description: "Defines whether the column is required or not.",
      },
    },
  },
  name: {
    type: "string",
    description: "The name of the column.",
  },
  autocolumn: {
    type: "boolean",
    description: "Defines whether the column is automatically generated.",
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
    primaryDisplay: {
      type: "string",
      description:
        "The name of the column which should be used in relationship tags when relating to this table.",
    },
    schema: {
      oneOf: [
        // relationship
        {
          type: "object",
          properties: {
            ...baseColumnDef,
            type: {
              type: "string",
              enum: [FieldTypes.LINK],
              description: "A relationship column.",
            },
            fieldName: {
              type: "string",
              description:
                "The name of the column which a relationship column is related to in another table.",
            },
            tableId: {
              type: "string",
              description:
                "The ID of the table which a relationship column is related to.",
            },
            relationshipType: {
              type: "string",
              enum: Object.values(RelationshipTypes),
              description:
                "Defines the type of relationship that this column will be used for.",
            },
            through: {
              type: "string",
              description:
                "When using a SQL table that contains many to many relationships this defines the table the relationships are linked through.",
            },
            foreignKey: {
              type: "string",
              description:
                "When using a SQL table that contains a one to many relationship this defines the foreign key.",
            },
            throughFrom: {
              type: "string",
              description:
                "When using a SQL table that utilises a through table, this defines the primary key in the through table for this table.",
            },
            throughTo: {
              type: "string",
              description:
                "When using a SQL table that utilises a through table, this defines the primary key in the through table for the related table.",
            },
          },
        },
        {
          type: "object",
          properties: {
            ...baseColumnDef,
            type: {
              type: "string",
              enum: [FieldTypes.FORMULA],
              description: "A formula column.",
            },
            formula: {
              type: "string",
              description:
                "Defines a Handlebars or JavaScript formula to use, note that Javascript formulas are expected to be provided in the base64 format.",
            },
            formulaType: {
              type: "string",
              enum: Object.values(FormulaTypes),
              description:
                "Defines whether this is a static or dynamic formula.",
            },
          },
        },
        {
          type: "object",
          properties: baseColumnDef,
        },
      ],
    },
  },
}

exports.query = {
  type: "object",
  properties: {},
}

exports.user = {
  type: "object",
  properties: {},
}

exports.application = {
  type: "object",
  properties: {},
}

exports.applicationOutput = {
  type: "object",
  properties: {
    application: exports.application,
  },
}

exports.tableOutput = {
  type: "object",
  properties: {
    table: exports.table,
  },
}

exports.userOutput = {
  type: "object",
  properties: {
    user: exports.user,
  },
}

exports.rowOutput = {
  properties: {
    row: exports.row,
  },
}

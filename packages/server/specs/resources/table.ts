import { FieldType, FormulaType, RelationshipType } from "@budibase/types"
import { object } from "./utils"
import Resource from "./utils/Resource"

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

const baseColumnDef = {
  type: {
    type: "string",
    enum: Object.values(FieldType),
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

const tableSchema = {
  description: "The table to be created/updated.",
  type: "object",
  required: ["name", "schema"],
  properties: {
    name: {
      description: "The name of the table.",
      type: "string",
    },
    primaryDisplay: {
      type: "string",
      description:
        "The name of the column which should be used in relationship tags when relating to this table.",
    },
    schema: {
      type: "object",
      additionalProperties: {
        oneOf: [
          // relationship
          {
            type: "object",
            properties: {
              ...baseColumnDef,
              type: {
                type: "string",
                enum: [FieldType.LINK],
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
                enum: Object.values(RelationshipType),
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
                enum: [FieldType.FORMULA],
                description: "A formula column.",
              },
              formula: {
                type: "string",
                description:
                  "Defines a Handlebars or JavaScript formula to use, note that Javascript formulas are expected to be provided in the base64 format.",
              },
              formulaType: {
                type: "string",
                enum: [FormulaType.STATIC, FormulaType.DYNAMIC],
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
  },
}

const tableOutputSchema = {
  ...tableSchema,
  properties: {
    ...tableSchema.properties,
    _id: {
      description: "The ID of the table.",
      type: "string",
    },
  },
  required: [...tableSchema.required, "_id"],
}

export default new Resource()
  .setExamples({
    table: {
      value: {
        data: table,
      },
    },
    tables: {
      value: {
        data: [table],
      },
    },
  })
  .setSchemas({
    table: tableSchema,
    tableOutput: object({
      data: tableOutputSchema,
    }),
    tableSearch: object({
      data: {
        type: "array",
        items: tableOutputSchema,
      },
    }),
  })

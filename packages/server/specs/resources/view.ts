import { object } from "./utils"
import Resource from "./utils/Resource"
import { CalculationType, SortOrder, SortType } from "@budibase/types"
import { searchSchema } from "./misc"

const view = {
  name: "peopleView",
  tableId: "ta_896a325f7e8147d2a2cda93c5d236511",
  schema: {
    name: {
      visible: true,
      readonly: false,
      order: 1,
      width: 300,
    },
    age: {
      visible: true,
      readonly: true,
      order: 2,
      width: 200,
    },
    salary: {
      visible: false,
      readonly: false,
    },
  },
  primaryDisplay: "name",
}

const baseColumnDef = {
  visible: {
    type: "boolean",
    description:
      "Defines whether the column is visible or not - rows retrieved/updated through this view will not be able to access it.",
  },
  readonly: {
    type: "boolean",
    description:
      "When used in combination with 'visible: true' the column will be visible in row responses but cannot be updated.",
  },
  order: {
    type: "integer",
    description:
      "A number defining where the column shows up in tables, lowest being first.",
  },
  width: {
    type: "integer",
    description:
      "A width for the column, defined in pixels - this affects rendering in tables.",
  },
  column: {
    type: "array",
    description:
      "If this is a relationship column, we can set the columns we wish to include",
    items: {
      type: "object",
      properties: {
        readonly: {
          type: "boolean",
        },
      },
    },
  },
}

const viewSchema = {
  description: "The view to be created/updated.",
  type: "object",
  required: ["name", "schema"],
  properties: {
    name: {
      description: "The name of the view.",
      type: "string",
    },
    type: {
      description: "The type of view - standard (empty value) or calculation.",
      type: "string",
      enum: ["calculation"],
    },
    primaryDisplay: {
      type: "string",
      description:
        "A column used to display rows from this view - usually used when rendered in tables.",
    },
    query: searchSchema,
    sort: {
      type: "object",
      required: ["field"],
      properties: {
        field: {
          type: "string",
          description: "The field from the table/view schema to sort on.",
        },
        order: {
          type: "string",
          description: "The order in which to sort.",
          enum: Object.values(SortOrder),
        },
        type: {
          type: "string",
          description:
            "The type of sort to perform (by number, or by alphabetically).",
          enum: Object.values(SortType),
        },
      },
    },
    schema: {
      type: "object",
      additionalProperties: {
        oneOf: [
          {
            type: "object",
            properties: baseColumnDef,
          },
          {
            type: "object",
            properties: {
              calculationType: {
                type: "string",
                description:
                  "This column should be built from a calculation, specifying a type and field. It is important to note when a calculation is configured all non-calculation columns will be used for grouping.",
                enum: Object.values(CalculationType),
              },
              field: {
                type: "string",
                description:
                  "The field from the table to perform the calculation on.",
              },
              distinct: {
                type: "boolean",
                description:
                  "Can be used in tandem with the count calculation type, to count unique entries.",
              },
            },
          },
        ],
      },
    },
  },
}

const viewOutputSchema = {
  ...viewSchema,
  properties: {
    ...viewSchema.properties,
    id: {
      description: "The ID of the view.",
      type: "string",
    },
  },
  required: [...viewSchema.required, "id"],
}

export default new Resource()
  .setExamples({
    view: {
      value: {
        data: view,
      },
    },
    views: {
      value: {
        data: [view],
      },
    },
  })
  .setSchemas({
    view: viewSchema,
    viewOutput: object({
      data: viewOutputSchema,
    }),
    viewSearch: object({
      data: {
        type: "array",
        items: viewOutputSchema,
      },
    }),
  })

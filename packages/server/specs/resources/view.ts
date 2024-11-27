import { object } from "./utils"
import Resource from "./utils/Resource"
import {
  ArrayOperator,
  BasicOperator,
  CalculationType,
  RangeOperator,
  SortOrder,
  SortType,
} from "@budibase/types"
import { cloneDeep } from "lodash"

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
  query: {
    logicalOperator: "all",
    onEmptyFilter: "none",
    groups: [
      {
        logicalOperator: "any",
        filters: [
          { operator: "string", field: "name", value: "John" },
          { operator: "range", field: "age", value: { low: 18, high: 100 } },
        ],
      },
    ],
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

const logicalOperator = {
  description:
    "When using groups this defines whether all of the filters must match, or only one of them.",
  type: "string",
  enum: ["all", "any"],
}

const filterGroup = {
  description: "A grouping of filters to be applied.",
  type: "array",
  items: {
    type: "object",
    properties: {
      logicalOperator,
      filters: {
        description: "A list of filters to apply",
        type: "array",
        items: {
          type: "object",
          properties: {
            operator: {
              type: "string",
              description:
                "The type of search operation which is being performed.",
              enum: [
                ...Object.values(BasicOperator),
                ...Object.values(ArrayOperator),
                ...Object.values(RangeOperator),
              ],
            },
            field: {
              type: "string",
              description: "The field in the view to perform the search on.",
            },
            value: {
              description:
                "The value to search for - the type will depend on the operator in use.",
              oneOf: [
                { type: "string" },
                { type: "number" },
                { type: "boolean" },
                { type: "object" },
                { type: "array" },
              ],
            },
          },
        },
      },
    },
  },
}

// have to clone to avoid constantly recursive structure - we can't represent this easily
const layeredFilterGroup: any = cloneDeep(filterGroup)
layeredFilterGroup.items.properties.groups = filterGroup

const viewQuerySchema = {
  description: "Search parameters for view",
  type: "object",
  properties: {
    logicalOperator,
    onEmptyFilter: {
      description:
        "If no filters match, should the view return all rows, or no rows.",
      type: "string",
      enum: ["all", "none"],
    },
    groups: layeredFilterGroup,
  },
}

const viewSchema = {
  description: "The view to be created/updated.",
  type: "object",
  required: ["name", "schema", "tableId"],
  properties: {
    name: {
      description: "The name of the view.",
      type: "string",
    },
    tableId: {
      description: "The ID of the table this view is based on.",
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
    query: viewQuerySchema,
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

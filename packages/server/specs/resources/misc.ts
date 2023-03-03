import { object } from "./utils"
import Resource from "./utils/Resource"

export default new Resource().setSchemas({
  rowSearch: object(
    {
      query: {
        type: "object",
        properties: {
          allOr: {
            type: "boolean",
            description:
              "Specifies that a row should be returned if it satisfies any of the specified options, rather than requiring it to fulfill all the search parameters. This defaults to false, meaning AND logic will be used.",
          },
          string: {
            type: "object",
            example: {
              columnName1: "value",
              columnName2: "value",
            },
            description:
              "A map of field name to the string to search for, this will look for rows that have a value starting with the string value.",
            additionalProperties: {
              type: "string",
              description: "The value to search for in the column.",
            },
          },
          fuzzy: {
            type: "object",
            description: "A fuzzy search, only supported by internal tables.",
          },
          range: {
            type: "object",
            description:
              'Searches within a range, the format of this must be in the format of an object with a "low" and "high" property.',
            example: {
              columnName1: {
                low: 10,
                high: 20,
              },
            },
          },
          equal: {
            type: "object",
            description:
              "Searches for rows that have a column value that is exactly the value set.",
          },
          notEqual: {
            type: "object",
            description:
              "Searches for any row which does not contain the specified column value.",
          },
          empty: {
            type: "object",
            description:
              "Searches for rows which do not contain the specified column. The object should simply contain keys of the column names, these can map to any value.",
            example: {
              columnName1: "",
            },
          },
          notEmpty: {
            type: "object",
            description: "Searches for rows which have the specified column.",
          },
          oneOf: {
            type: "object",
            description:
              "Searches for rows which have a column value that is any of the specified values. The format of this must be columnName -> [value1, value2].",
          },
        },
      },
      paginate: {
        type: "boolean",
        description: "Enables pagination, by default this is disabled.",
      },
      bookmark: {
        oneOf: [
          {
            type: "string",
          },
          {
            type: "integer",
          },
        ],
        description:
          "If retrieving another page, the bookmark from the previous request must be supplied.",
      },
      limit: {
        type: "integer",
        description:
          "The maximum number of rows to return, useful when paginating, for internal tables this will be limited to 1000, for SQL tables it will be 5000.",
      },
      sort: {
        type: "object",
        description:
          "A set of parameters describing the sort behaviour of the search.",
        properties: {
          order: {
            type: "string",
            enum: ["ascending", "descending"],
            description: "The order of the sort, by default this is ascending.",
          },
          column: {
            type: "string",
            description:
              "The name of the column by which the rows will be sorted.",
          },
          type: {
            type: "string",
            enum: ["string", "number"],
            description:
              "Defines whether the column should be treated as a string or as numbers when sorting.",
          },
        },
      },
    },
    {
      required: ["query"],
    }
  ),
  nameSearch: object({
    name: {
      type: "string",
      description:
        "The name to be used when searching - this will be used in a case insensitive starts with match.",
    },
  }),
})

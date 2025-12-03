import { z } from "zod"
import { newTool } from ".."
import sdk from "../../../sdk"
import { RowSearchParams, SortOrder } from "@budibase/types"

export default [
  newTool({
    name: "list_rows",
    description: "List rows in a given table",
    parameters: z.object({
      tableId: z.string().describe("The ID of the table to list rows from"),
      limit: z.number().nullish().describe("Maximum number of rows to return"),
      startKey: z.string().nullish().describe("Start key for pagination"),
    }),
    handler: async ({ tableId }) => {
      const rows = await sdk.rows.fetch(tableId)
      const formatted = JSON.stringify(rows, null, 2)
      return `Here are the rows for table ${tableId}:\n\n${formatted}`
    },
  }),

  newTool({
    name: "get_row",
    description: "Get a specific row by ID",
    parameters: z.object({
      tableId: z.string().describe("The ID of the table"),
      rowId: z.string().describe("The ID of the row to retrieve"),
    }),
    handler: async ({ tableId, rowId }) => {
      const row = await sdk.rows.find(tableId, rowId)
      const formatted = JSON.stringify(row, null, 2)
      return `Here is the row data:\n\n${formatted}`
    },
  }),

  newTool({
    name: "create_row",
    description:
      "Create a new row. Only include fields that match the table schema. " +
      "Use plain text values for text fields - do not store JSON or structured data. " +
      "For long text content, truncate to first 500 characters if needed.",
    parameters: z.object({
      tableId: z.string().describe("The ID of the table to create the row in"),
      data: z
        .string()
        .describe(
          'Row data as a valid JSON string. Example: \'{"name": "John", "age": 30}\'. ' +
            'Ensure all special characters are properly escaped (use \\" for quotes, \\n for newlines). ' +
            "Ensure the schema for the table is known before writing a row."
        ),
    }),
    handler: async ({ tableId, data }) => {
      let parsedData: Record<string, unknown>
      try {
        parsedData = JSON.parse(data)
      } catch (e) {
        return `Error: Invalid JSON in data field. Please ensure proper escaping. Details: ${e}`
      }
      const row = await sdk.rows.save(tableId, parsedData, undefined)
      const formatted = JSON.stringify(row, null, 2)
      return `Successfully created new row:\n\n${formatted}`
    },
  }),

  newTool({
    name: "update_row",
    description:
      "Update an existing row. Use plain text values for text fields - do not store JSON or structured data.",
    parameters: z.object({
      tableId: z.string().describe("The ID of the table"),
      rowId: z.string().describe("The ID of the row to update"),
      data: z
        .string()
        .describe(
          'The updated data as a valid JSON string. Example: \'{"name": "Jane"}\'. ' +
            'Ensure all special characters are properly escaped (use \\" for quotes, \\n for newlines).'
        ),
    }),
    handler: async ({ tableId, rowId, data }) => {
      let parsedData: Record<string, unknown>
      try {
        parsedData = JSON.parse(data)
      } catch (e) {
        return `Error: Invalid JSON in data field. Please ensure proper escaping. Details: ${e}`
      }
      const rowData = { ...parsedData, _id: rowId }
      const row = await sdk.rows.save(tableId, rowData, undefined)
      const formatted = JSON.stringify(row, null, 2)
      return `Successfully updated row:\n\n${formatted}`
    },
  }),

  newTool({
    name: "search_rows",
    description: "Search for rows in a table based on criteria",
    parameters: z.object({
      tableId: z.string().describe("The ID of the table to search"),
      query: z
        .record(z.string(), z.any())
        .nullish()
        .describe(
          `Query filters object. Structure: { operator: { fieldName: value } }. ` +
            `Valid operators: "equal", "notEqual", "empty", "notEmpty", "fuzzy", "string", "contains", "notContains", "containsAny", "oneOf", "range". ` +
            `Examples: ` +
            `Find where status equals "active": {"equal": {"status": "active"}}. ` +
            `Find where name is not empty: {"notEmpty": {"name": true}}. ` +
            `Find where price is within the range of 10 to 100: {"range": {"price": {"low": 10, "high": 100}}}.`
        ),
      sort: z
        .object({
          column: z.string().describe("Column to sort by"),
          order: z.enum(["ascending", "descending"]).describe("Sort order"),
        })
        .nullish()
        .describe("Sort configuration"),
      limit: z.number().nullish().describe("Maximum number of results"),
    }),
    handler: async ({ tableId, query, sort, limit }) => {
      const searchParams: RowSearchParams = {
        tableId,
        query: query || {},
        limit: limit ?? undefined,
      }
      if (sort) {
        searchParams.sort = sort.column
        searchParams.sortOrder =
          sort.order === SortOrder.ASCENDING
            ? SortOrder.ASCENDING
            : SortOrder.DESCENDING
      }

      const rows = await sdk.rows.search(searchParams)
      const formatted = JSON.stringify(rows, null, 2)
      return `Search results:\n\n${formatted}`
    },
  }),
]

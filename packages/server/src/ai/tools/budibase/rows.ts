import { z } from "zod"
import { newTool } from ".."
import sdk from "../../../sdk"

export default [
  newTool({
    name: "list_rows",
    description: "List rows in a given table",
    parameters: z.object({
      tableId: z.string().describe("The ID of the table to list rows from"),
      limit: z.number().optional().describe("Maximum number of rows to return"),
      startKey: z.string().optional().describe("Start key for pagination"),
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
    description: "Create a new row",
    parameters: z.object({
      tableId: z.string().describe("The ID of the table to create the row in"),
      data: z
        .string()
        .describe(
          "JSON string with row data. Ensure the schema for the table is known before writing a row."
        ),
    }),
    handler: async ({ tableId, data }) => {
      let parsedData
      try {
        parsedData = JSON.parse(data)
      } catch (error) {
        return `Error: Invalid JSON in data parameter: ${error}`
      }
      const row = await sdk.rows.save(tableId, parsedData, undefined)
      const formatted = JSON.stringify(row, null, 2)
      return `Successfully created new row:\n\n${formatted}`
    },
  }),

  newTool({
    name: "update_row",
    description: "Update an existing row",
    parameters: z.object({
      tableId: z.string().describe("The ID of the table"),
      rowId: z.string().describe("The ID of the row to update"),
      data: z
        .object({})
        .optional()
        .describe("The updated data as key-value pairs"),
    }),
    handler: async ({ tableId, rowId, data }) => {
      const rowData = { ...data, _id: rowId }
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
        .object({})
        .optional()
        .describe("Search criteria as key-value pairs"),
      sort: z
        .object({
          column: z.string().describe("Column to sort by"),
          order: z.enum(["ascending", "descending"]).describe("Sort order"),
        })
        .optional()
        .describe("Sort configuration"),
      limit: z.number().optional().describe("Maximum number of results"),
    }),
    handler: async ({ tableId, query, sort, limit }) => {
      const searchParams: any = {
        tableId,
        query,
        limit,
      }
      if (sort) {
        searchParams.sort = sort.column
        searchParams.sortOrder =
          sort.order === "ascending" ? "ascending" : "descending"
      }

      const rows = await sdk.rows.search(searchParams)
      const formatted = JSON.stringify(rows, null, 2)
      return `Search results:\n\n${formatted}`
    },
  }),
]

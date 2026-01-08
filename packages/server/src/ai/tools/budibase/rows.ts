import { RowSearchParams, SortOrder, ToolType } from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import sdk from "../../../sdk"
import type { BudibaseToolDefinition } from "."

const ROW_TOOLS: BudibaseToolDefinition[] = [
  {
    name: "list_rows",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",
    description: "List rows in a given table",
    tool: tool({
      description: "List rows in a given table",
      inputSchema: z.object({
        tableId: z.string().describe("The ID of the table to list rows from"),
        limit: z
          .number()
          .nullish()
          .describe("Maximum number of rows to return"),
        startKey: z.string().nullish().describe("Start key for pagination"),
      }),
      execute: async input => {
        const { tableId } = input
        const rows = await sdk.rows.fetch(tableId)
        return { rows }
      },
    }),
  },

  {
    name: "get_row",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",
    description: "Get a specific row by ID",
    tool: tool({
      description: "Get a specific row by ID",
      inputSchema: z.object({
        tableId: z.string().describe("The ID of the table"),
        rowId: z.string().describe("The ID of the row to retrieve"),
      }),
      execute: async input => {
        const { tableId, rowId } = input as {
          tableId: string
          rowId: string
        }
        const row = await sdk.rows.find(tableId, rowId)
        return { row }
      },
    }),
  },

  {
    name: "create_row",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",
    description:
      "Create a new row. Only include fields that match the table schema. " +
      "CRITICAL: Use plain text values only. Do NOT include HTML tags, markdown formatting, " +
      "or content containing quotes, backslashes, or special characters - these break JSON parsing. " +
      "Summarize or strip complex content. Max 500 characters per field.",
    tool: tool({
      description:
        "Create a new row. Only include fields that match the table schema. " +
        "CRITICAL: Use plain text values only. Do NOT include HTML tags, markdown formatting, " +
        "or content containing quotes, backslashes, or special characters - these break JSON parsing. " +
        "Summarize or strip complex content. Max 500 characters per field.",
      inputSchema: z.object({
        tableId: z
          .string()
          .describe("The ID of the table to create the row in"),
        data: z
          .record(z.string(), z.any())
          .describe(
            'Row data as a JSON object. Example: {"name": "John", "age": 30}. ' +
              "Do NOT nest this inside a string; pass the object directly. " +
              "Values must be plain text - no HTML, markdown, or special characters."
          ),
      }),
      execute: async input => {
        const { tableId, data } = input
        const row = await sdk.rows.save(tableId, data, undefined)
        return { row }
      },
    }),
  },

  {
    name: "update_row",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",
    description:
      "Update an existing row. " +
      "CRITICAL: Use plain text values only. Do NOT include HTML tags, markdown formatting, " +
      "or content containing quotes, backslashes, or special characters - these break JSON parsing. " +
      "Summarize or strip complex content. Max 500 characters per field.",
    tool: tool({
      description:
        "Update an existing row. " +
        "CRITICAL: Use plain text values only. Do NOT include HTML tags, markdown formatting, " +
        "or content containing quotes, backslashes, or special characters - these break JSON parsing. " +
        "Summarize or strip complex content. Max 500 characters per field.",
      inputSchema: z.object({
        tableId: z.string().describe("The ID of the table"),
        rowId: z.string().describe("The ID of the row to update"),
        data: z
          .record(z.string(), z.any())
          .describe(
            'The updated data as a JSON object. Example: {"name": "Jane"}. ' +
              "Do NOT nest this inside a string; pass the object directly. " +
              "Values must be plain text - no HTML, markdown, or special characters."
          ),
      }),
      execute: async input => {
        const { tableId, rowId, data } = input
        const rowData = { ...data, _id: rowId }
        const row = await sdk.rows.save(tableId, rowData, undefined)
        return { row }
      },
    }),
  },

  {
    name: "search_rows",
    sourceType: ToolType.BUDIBASE,
    sourceLabel: "Budibase",
    description:
      "Search for rows in a table based on criteria. " +
      "IMPORTANT: You can ONLY filter on fields that exist in the table schema. " +
      "Use get_table or list_tables first to see available field names. " +
      "Searching on non-existent fields will fail.",
    tool: tool({
      description:
        "Search for rows in a table based on criteria. " +
        "IMPORTANT: You can ONLY filter on fields that exist in the table schema. " +
        "Use get_table or list_tables first to see available field names. " +
        "Searching on non-existent fields will fail.",
      inputSchema: z.object({
        tableId: z.string().describe("The ID of the table to search"),
        query: z
          .record(z.string(), z.any())
          .nullish()
          .describe(
            `Query filters object. Structure: { operator: { fieldName: value } }. ` +
              `CRITICAL: fieldName must match an existing column in the table schema exactly (case-sensitive). ` +
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
      execute: async input => {
        const { tableId, query, sort, limit } = input
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

        const result = await sdk.rows.search(searchParams)
        return { rows: result.rows }
      },
    }),
  },
]

export default ROW_TOOLS

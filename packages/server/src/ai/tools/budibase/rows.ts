import {
  RowSearchParams,
  SortOrder,
  TableSourceType,
  ToolType,
} from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import sdk from "../../../sdk"
import type { BudibaseToolDefinition } from "."

const PLAIN_TEXT_WARNING =
  "CRITICAL: Use plain text values only. Do NOT include HTML tags, markdown formatting, " +
  "or content containing quotes, backslashes, or special characters - these break JSON parsing. " +
  "Summarize or strip complex content. Max 500 characters per field."

const DATA_FIELD_DESCRIPTION =
  'Row data as a JSON object. Example: {"name": "John", "age": 30}. ' +
  "Do NOT nest this inside a string; pass the object directly. " +
  "Values must be plain text - no HTML, markdown, or special characters."

interface RowTool {
  description: string
  inputSchema: z.ZodObject<any>
  execute: (tableId: string, input: any) => Promise<any>
}

const ROW_TOOL: Record<string, RowTool> = {
  list_rows: {
    description: "List rows in a given table with optional pagination",
    inputSchema: z.object({
      limit: z.number().nullish().describe("Maximum number of rows to return"),
      bookmark: z
        .union([z.string(), z.number()])
        .nullish()
        .describe("Bookmark for pagination (returned from previous request)"),
    }),
    execute: async (tableId, { limit, bookmark }) => {
      const searchParams: RowSearchParams = {
        tableId,
        query: {},
        limit: limit ?? undefined,
        bookmark: bookmark ?? undefined,
      }
      const result = await sdk.rows.search(searchParams)
      return {
        rows: result.rows,
        hasNextPage: result.hasNextPage,
        bookmark: result.bookmark,
      }
    },
  },
  get_row: {
    description: "Get a specific row by ID",
    inputSchema: z.object({
      rowId: z.string().describe("The ID of the row to retrieve"),
    }),
    execute: async (tableId, { rowId }) => {
      const row = await sdk.rows.find(tableId, rowId)
      return { row }
    },
  },
  create_row: {
    description: `Create a new row. Only include fields that match the table schema. ${PLAIN_TEXT_WARNING}`,
    inputSchema: z.object({
      data: z.record(z.string(), z.any()).describe(DATA_FIELD_DESCRIPTION),
    }),
    execute: async (tableId, { data }) => {
      const { row } = await sdk.rows.save(tableId, data, undefined)
      return { row }
    },
  },
  update_row: {
    description: `Update an existing row. ${PLAIN_TEXT_WARNING}`,
    inputSchema: z.object({
      rowId: z.string().describe("The ID of the row to update"),
      rowRev: z.string().describe("The current _rev of the row (if known)"),
      data: z
        .record(z.string(), z.any())
        .describe(
          'The updated data as a JSON object. Example: {"name": "Jane"}. ' +
            "Do NOT nest this inside a string; pass the object directly. " +
            "Values must be plain text - no HTML, markdown, or special characters."
        ),
    }),
    execute: async (tableId, { rowId, rowRev, data }) => {
      const existingRow = await sdk.rows.find(tableId, rowId)
      const rowData = { ...existingRow, ...data, _id: rowId, _rev: rowRev }
      const { row } = await sdk.rows.save(tableId, rowData, undefined)
      return { row }
    },
  },
  search_rows: {
    description:
      "Search for rows in a table based on criteria. " +
      "IMPORTANT: You can ONLY filter on fields that exist in the table schema. " +
      "Use get_table or list_tables first to see available field names. " +
      "Searching on non-existent fields will fail.",
    inputSchema: z.object({
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
    execute: async (tableId, { query, sort, limit }) => {
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
  },
}

const formatActionLabel = (action: string) =>
  action
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

export const createRowTools = ({
  tableId,
  tableName,
  tableSourceType,
  sourceLabel,
  sourceIconType,
}: {
  tableId: string
  tableName: string
  tableSourceType: TableSourceType
  sourceLabel?: string
  sourceIconType?: string
}): BudibaseToolDefinition[] => {
  const isExternal = tableSourceType === TableSourceType.EXTERNAL
  const resolvedSourceType = isExternal
    ? ToolType.EXTERNAL_TABLE
    : ToolType.INTERNAL_TABLE
  const resolvedSourceLabel =
    sourceLabel || (isExternal ? "External" : "Budibase")

  return Object.entries(ROW_TOOL).map(([action, def]) => {
    const description = `${formatActionLabel(action)} in "${tableName}". ${def.description}`
    // OpenAI tool names must match [A-Za-z0-9_-] and be ≤64 chars
    const sanitizedTableId = tableId.replace(/[^A-Za-z0-9_-]/g, "_")
    const toolName = `${sanitizedTableId}_${action}`.substring(0, 64)
    return {
      name: toolName,
      readableName: `${tableName}.${action}`,
      sourceType: resolvedSourceType,
      sourceLabel: resolvedSourceLabel,
      sourceIconType,
      description,
      tool: tool({
        description,
        inputSchema: def.inputSchema,
        execute: async input => def.execute(tableId, input),
      }),
    }
  })
}

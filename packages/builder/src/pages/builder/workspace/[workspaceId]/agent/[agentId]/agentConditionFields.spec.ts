import {
  FieldType,
  TableSourceType,
  ToolAction,
  ToolType,
} from "@budibase/types"
import type { Table } from "@budibase/types"
import {
  getToolReviewFields,
  normalizeReviewParameters,
  withSelectedReviewFields,
} from "./agentConditionFields"
import type { AgentTool } from "./toolTypes"

const tool: AgentTool = {
  name: "create_contact",
  sourceType: ToolType.INTERNAL_TABLE,
  sourceId: "ta_1",
  action: ToolAction.CREATE_ROW,
  executionPolicy: { mode: "admin" },
  readableBinding: "create_contact",
  runtimeBinding: "create_contact",
}

const table: Table = {
  _id: "ta_1",
  name: "Contacts",
  type: "table",
  sourceId: "bb_internal",
  sourceType: TableSourceType.INTERNAL,
  schema: {
    name: { name: "Full name", type: FieldType.STRING },
    metadata: { name: "Metadata", type: FieldType.JSON },
    computed: {
      name: "Computed",
      type: FieldType.FORMULA,
      formula: "{{ name }}",
    },
  },
}

describe("review parameters", () => {
  it("trims names and removes duplicates without changing their order", () => {
    expect(
      normalizeReviewParameters([" second ", "first", "second", ""])
    ).toEqual(["second", "first"])
  })

  it("makes writable row fields selectable by name", () => {
    expect(
      getToolReviewFields({
        tool,
        tables: [table],
        queries: [],
        automations: [],
      })
    ).toEqual([
      { name: "name", label: "Full name" },
      { name: "metadata", label: "Metadata" },
    ])
  })

  it("keeps genuinely unknown selected names as options", () => {
    expect(
      withSelectedReviewFields({
        fields: [
          { name: "data", label: "Data" },
          { name: "rowId", label: "Row ID" },
        ],
        selected: [" data ", "rowId", "custom", "data"],
      })
    ).toEqual([
      { name: "data", label: "Data" },
      { name: "rowId", label: "Row ID" },
      { name: "custom", label: "custom" },
    ])
  })

  it("includes the row ID and writable fields for updates", () => {
    expect(
      getToolReviewFields({
        tool: { ...tool, action: ToolAction.UPDATE_ROW },
        tables: [table],
        queries: [],
        automations: [],
      })
    ).toEqual([
      { name: "rowId", label: "Row ID" },
      { name: "name", label: "Full name" },
      { name: "metadata", label: "Metadata" },
    ])
  })

  it.each([
    [ToolAction.GET_ROW, [{ name: "rowId", label: "Row ID" }]],
    [
      ToolAction.LIST_ROWS,
      [
        { name: "limit", label: "Limit" },
        { name: "bookmark", label: "Bookmark" },
      ],
    ],
    [
      ToolAction.SEARCH_ROWS,
      [
        { name: "query", label: "Query" },
        { name: "sort", label: "Sort" },
        { name: "limit", label: "Limit" },
      ],
    ],
  ])("makes %s arguments selectable", (action, expected) => {
    expect(
      getToolReviewFields({
        tool: { ...tool, action },
        tables: [table],
        queries: [],
        automations: [],
      })
    ).toEqual(expected)
  })
})

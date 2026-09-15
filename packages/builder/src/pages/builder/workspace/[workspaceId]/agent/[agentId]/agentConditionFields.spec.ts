import {
  FieldType,
  RelationshipType,
  TableSourceType,
  ToolAction,
  ToolType,
} from "@budibase/types"
import type { Table } from "@budibase/types"
import {
  getToolReviewFields,
  normalizeReviewParameterPaths,
  withSelectedReviewFields,
} from "./agentConditionFields"
import type { AgentTool } from "./toolTypes"

const table: Table = {
  _id: "ta_1",
  name: "Contacts",
  type: "table",
  sourceId: "bb_internal",
  sourceType: TableSourceType.INTERNAL,
  schema: {
    name: { name: "name", type: FieldType.STRING },
    company: {
      name: "company",
      type: FieldType.LINK,
      fieldName: "contacts",
      tableId: "ta_2",
      relationshipType: RelationshipType.ONE_TO_MANY,
    },
  },
}

const tool: AgentTool = {
  name: "create_contact",
  sourceType: ToolType.INTERNAL_TABLE,
  sourceId: "ta_1",
  action: ToolAction.CREATE_ROW,
  executionPolicy: { mode: "admin" },
  readableBinding: "create_contact",
  runtimeBinding: "create_contact",
}

describe("review parameter paths", () => {
  it("trims paths and removes duplicates without changing their order", () => {
    expect(
      normalizeReviewParameterPaths([" /second ", "/first", "/second", ""])
    ).toEqual(["/second", "/first"])
  })

  it("excludes linked fields from the fields shareable with reviewers", () => {
    expect(
      getToolReviewFields({
        tool,
        tables: [table],
        queries: [],
        automations: [],
      })
    ).toEqual([{ path: "/data/name", label: "name" }])
  })

  it("keeps selected paths that are no longer in the known field list", () => {
    expect(
      withSelectedReviewFields({
        fields: [{ path: "/data/name", label: "name" }],
        selected: [" /data/name ", "/inputs/release_notes", "/data/name"],
      })
    ).toEqual([
      { path: "/data/name", label: "name" },
      { path: "/inputs/release_notes", label: "/inputs/release_notes" },
    ])
  })

  it("includes row identity fields for update-row tools", () => {
    expect(
      getToolReviewFields({
        tool: { ...tool, action: ToolAction.UPDATE_ROW },
        tables: [table],
        queries: [],
        automations: [],
      })
    ).toEqual([
      { path: "/rowId", label: "Row ID" },
      { path: "/rowRev", label: "Row revision" },
      { path: "/data/name", label: "name" },
    ])
  })
})

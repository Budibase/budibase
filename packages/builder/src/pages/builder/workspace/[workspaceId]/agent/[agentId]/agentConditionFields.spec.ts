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
    name: { name: "Full name", type: FieldType.STRING },
    company: {
      name: "Company",
      type: FieldType.LINK,
      fieldName: "contacts",
      tableId: "ta_2",
      relationshipType: RelationshipType.ONE_TO_MANY,
    },
    files: {
      name: "Supporting files",
      type: FieldType.ATTACHMENTS,
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

  it("makes linked and complex writable fields selectable", () => {
    expect(
      getToolReviewFields({
        tool,
        tables: [table],
        queries: [],
        automations: [],
      })
    ).toEqual([
      { path: "/data/name", label: "Full name" },
      { path: "/data/company", label: "Company" },
      { path: "/data/files", label: "Supporting files" },
    ])
  })

  it("keeps genuinely unknown selected paths as options", () => {
    expect(
      withSelectedReviewFields({
        fields: [
          { path: "/data/name", label: "name" },
          { path: "/data/company", label: "company" },
        ],
        selected: [
          " /data/name ",
          "/data/company",
          "/inputs/release_notes",
          "/data/name",
        ],
      })
    ).toEqual([
      { path: "/data/name", label: "name" },
      { path: "/data/company", label: "company" },
      { path: "/inputs/release_notes", label: "/inputs/release_notes" },
    ])
  })

  it("includes row ID but not row revision for update-row tools", () => {
    expect(
      getToolReviewFields({
        tool: { ...tool, action: ToolAction.UPDATE_ROW },
        tables: [table],
        queries: [],
        automations: [],
      })
    ).toEqual([
      { path: "/rowId", label: "Row ID" },
      { path: "/data/name", label: "Full name" },
      { path: "/data/company", label: "Company" },
      { path: "/data/files", label: "Supporting files" },
    ])
  })
})

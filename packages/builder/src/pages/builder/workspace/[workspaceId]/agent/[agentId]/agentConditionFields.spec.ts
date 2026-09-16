import { ToolAction, ToolType } from "@budibase/types"
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

describe("review parameters", () => {
  it("trims names and removes duplicates without changing their order", () => {
    expect(
      normalizeReviewParameters([" second ", "first", "second", ""])
    ).toEqual(["second", "first"])
  })

  it("shares row data as a direct argument", () => {
    expect(
      getToolReviewFields({
        tool,
        queries: [],
      })
    ).toEqual([{ name: "data", label: "Data" }])
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

  it("includes all direct update-row arguments", () => {
    expect(
      getToolReviewFields({
        tool: { ...tool, action: ToolAction.UPDATE_ROW },
        queries: [],
      })
    ).toEqual([
      { name: "rowId", label: "Row ID" },
      { name: "rowRev", label: "Row revision" },
      { name: "data", label: "Data" },
    ])
  })
})

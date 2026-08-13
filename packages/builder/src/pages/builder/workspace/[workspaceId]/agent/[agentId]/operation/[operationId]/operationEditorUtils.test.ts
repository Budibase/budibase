import { describe, expect, it } from "vitest"
import {
  insertOperationToolBinding,
  removeOperationToolBinding,
} from "./operationEditorUtils"
import {
  filterOperationTools,
  groupToolsBySection,
} from "./operationToolFilters"
import { ToolType } from "@budibase/types"

describe("operationEditorUtils", () => {
  it("inserts a tool binding at the caret", () => {
    const next = insertOperationToolBinding({
      tool: {
        name: "find_rows",
        description: "",
        readableBinding: "budibase.find_rows",
        runtimeBinding: "find_rows",
      },
      instructions: "Hello world",
      getCaretPosition: () => ({ start: 5, end: 5 }),
    })

    expect(next).toBe("Hello{{ budibase.find_rows }} world")
  })

  it("removes a tool binding from instructions", () => {
    expect(
      removeOperationToolBinding({
        instructions: "Use {{ budibase.find_rows }} here",
        readableBinding: "budibase.find_rows",
      })
    ).toBe("Use  here")
  })
})

describe("operationToolFilters", () => {
  it("filters tools by search query and escalation flag", () => {
    const tools = filterOperationTools({
      toolSearch: "orders",
      escalationEnabled: false,
      tools: [
        {
          name: "find_rows",
          description: "",
          sourceLabel: "Orders",
          readableBinding: "budibase.find_rows",
          runtimeBinding: "find_rows",
        },
        {
          name: "escalate",
          description: "",
          sourceType: ToolType.ESCALATION,
          readableBinding: "escalation.escalate",
          runtimeBinding: "escalate",
        },
      ],
    })

    expect(tools).toHaveLength(1)
    expect(tools[0].name).toBe("find_rows")
  })

  it("groups tools by section label", () => {
    expect(
      groupToolsBySection([
        {
          name: "a",
          description: "",
          sourceLabel: "API tools",
          readableBinding: "api.a",
          runtimeBinding: "a",
        },
        {
          name: "b",
          description: "",
          sourceLabel: "API tools",
          readableBinding: "api.b",
          runtimeBinding: "b",
        },
      ])
    ).toEqual({
      "API tools": [
        expect.objectContaining({ name: "a" }),
        expect.objectContaining({ name: "b" }),
      ],
    })
  })
})

import { ToolExecutionPrincipal } from "@budibase/types"
import { normalizeOperationTools } from "./operations"

describe("normalizeOperationTools", () => {
  it("migrates legacy tool names to requester authority", () => {
    expect(normalizeOperationTools(["list_tables"])).toEqual([
      {
        toolName: "list_tables",
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      },
    ])
  })

  it("preserves explicit delegated authority", () => {
    const config = {
      toolName: "approve_holiday",
      executionPrincipal: ToolExecutionPrincipal.AGENT,
    }
    expect(normalizeOperationTools([config])).toEqual([config])
  })
})

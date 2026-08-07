import { ToolExecutionPrincipal } from "@budibase/types"
import { normalizePersistedOperationTools } from "./crud"

describe("normalizePersistedOperationTools", () => {
  it("migrates legacy tool names to requester authority", () => {
    expect(normalizePersistedOperationTools(["list_tables"])).toEqual([
      {
        toolName: "list_tables",
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      },
    ])
  })

  it("preserves explicit delegated authority", () => {
    const config = {
      toolName: "approve_holiday",
      executionPrincipal: ToolExecutionPrincipal.ADMIN,
    }
    expect(normalizePersistedOperationTools([config])).toEqual([config])
  })
})

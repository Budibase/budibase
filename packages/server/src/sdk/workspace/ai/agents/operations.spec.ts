import { ToolExecutionPrincipal } from "@budibase/types"
import { normalizePersistedOperationTools } from "./crud"

describe("normalizePersistedOperationTools", () => {
  it("migrates legacy tool names to admin authority", () => {
    expect(normalizePersistedOperationTools(["list_tables"])).toEqual([
      {
        toolName: "list_tables",
        executionPrincipal: ToolExecutionPrincipal.ADMIN,
      },
    ])
  })

  it("migrates legacy escalation tools to admin authority", () => {
    expect(normalizePersistedOperationTools(["escalate"])).toEqual([
      {
        toolName: "escalate",
        executionPrincipal: ToolExecutionPrincipal.ADMIN,
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

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

  it("migrates legacy escalation tools to requester authority", () => {
    expect(normalizePersistedOperationTools(["escalate"])).toEqual([
      {
        toolName: "escalate",
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      },
    ])
  })

  it("populates missing principals with requester authority", () => {
    expect(
      normalizePersistedOperationTools([{ toolName: "approve_holiday" }])
    ).toEqual([
      {
        toolName: "approve_holiday",
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      },
    ])
  })

  it("populates null principals with requester authority", () => {
    expect(
      normalizePersistedOperationTools([
        { toolName: "approve_holiday", executionPrincipal: null },
      ])
    ).toEqual([
      {
        toolName: "approve_holiday",
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      },
    ])
  })

  it("preserves explicit delegated authority", () => {
    const config = {
      toolName: "approve_holiday",
      executionPrincipal: ToolExecutionPrincipal.REQUESTER,
    }
    expect(normalizePersistedOperationTools([config])).toEqual([config])
  })
})

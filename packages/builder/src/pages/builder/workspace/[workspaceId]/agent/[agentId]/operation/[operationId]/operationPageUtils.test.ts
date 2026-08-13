import type { AgentOperation } from "@budibase/types"
import { describe, expect, it } from "vitest"
import {
  hasUnsavedOperationInstructions,
  mergeResyncedOperation,
  shouldResyncOperationFromStore,
} from "./operationPageUtils"

describe("operationPageUtils", () => {
  const storeOperation: AgentOperation = {
    id: "operation-1",
    name: "Renamed on config",
    live: true,
    promptInstructions: "Updated in store",
    allowKnowledgeSourceDownload: true,
  }

  it("detects unsaved instruction edits", () => {
    expect(
      hasUnsavedOperationInstructions({
        promptInstructions: "Draft",
        lastSavedInstructions: "Saved",
      })
    ).toBe(true)
  })

  it("resyncs when the agent revision changes", () => {
    expect(
      shouldResyncOperationFromStore({
        agentRev: "rev-2",
        syncedAgentRev: "rev-1",
        isSaving: false,
      })
    ).toBe(true)
  })

  it("does not resync while saving", () => {
    expect(
      shouldResyncOperationFromStore({
        agentRev: "rev-2",
        syncedAgentRev: "rev-1",
        isSaving: true,
      })
    ).toBe(false)
  })

  it("replaces local operation when instructions are saved", () => {
    expect(
      mergeResyncedOperation({
        storeOperation,
        localOperation: {
          ...storeOperation,
          name: "Stale local name",
          promptInstructions: "Updated in store",
        },
        preserveInstructionEdits: false,
      })
    ).toEqual(storeOperation)
  })

  it("preserves unsaved instructions while refreshing metadata", () => {
    expect(
      mergeResyncedOperation({
        storeOperation,
        localOperation: {
          ...storeOperation,
          name: "Stale local name",
          live: false,
          promptInstructions: "Unsaved draft",
          enabledTools: [{ toolName: "find_rows" }],
        },
        preserveInstructionEdits: true,
      })
    ).toEqual({
      ...storeOperation,
      promptInstructions: "Unsaved draft",
      enabledTools: [{ toolName: "find_rows" }],
    })
  })
})

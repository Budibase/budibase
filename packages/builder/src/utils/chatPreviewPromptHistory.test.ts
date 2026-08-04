import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  getPromptHistoryStorageKey,
  loadPromptHistory,
  MAX_PROMPT_HISTORY_LENGTH,
  savePromptHistory,
} from "./chatPreviewPromptHistory"

describe("chat preview prompt history", () => {
  const workspaceId = "workspace-1"
  const agentId = "agent-1"

  beforeEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it("isolates history by workspace and agent", () => {
    savePromptHistory({ workspaceId, agentId, history: ["first"] })
    savePromptHistory({
      workspaceId,
      agentId: "agent-2",
      history: ["second"],
    })

    expect(loadPromptHistory({ workspaceId, agentId })).toEqual(["first"])
    expect(loadPromptHistory({ workspaceId, agentId: "agent-2" })).toEqual([
      "second",
    ])
    expect(loadPromptHistory({ workspaceId: "workspace-2", agentId })).toEqual(
      []
    )
  })

  it("retains only the newest prompts", () => {
    const history = Array.from(
      { length: MAX_PROMPT_HISTORY_LENGTH + 5 },
      (_, index) => `prompt-${index}`
    )

    expect(savePromptHistory({ workspaceId, agentId, history })).toEqual(
      history.slice(-MAX_PROMPT_HISTORY_LENGTH)
    )
    expect(loadPromptHistory({ workspaceId, agentId })).toEqual(
      history.slice(-MAX_PROMPT_HISTORY_LENGTH)
    )
  })

  it("treats malformed storage as empty history", () => {
    const key = getPromptHistoryStorageKey({ workspaceId, agentId })
    sessionStorage.setItem(key, "not-json")
    expect(loadPromptHistory({ workspaceId, agentId })).toEqual([])

    sessionStorage.setItem(key, JSON.stringify(["valid", 123]))
    expect(loadPromptHistory({ workspaceId, agentId })).toEqual([])
  })

  it("continues with in-memory history when storage fails", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage unavailable")
    })

    expect(
      savePromptHistory({ workspaceId, agentId, history: ["first"] })
    ).toEqual(["first"])
  })
})

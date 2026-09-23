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
  const tenantId = "tenant-1"
  const userId = "user-1"
  const keyOptions = { tenantId, userId, workspaceId, agentId }

  beforeEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it("isolates history by workspace and agent", () => {
    savePromptHistory({ ...keyOptions, history: ["first"] })
    savePromptHistory({
      ...keyOptions,
      agentId: "agent-2",
      history: ["second"],
    })

    expect(loadPromptHistory(keyOptions)).toEqual(["first"])
    expect(loadPromptHistory({ ...keyOptions, agentId: "agent-2" })).toEqual([
      "second",
    ])
    expect(
      loadPromptHistory({ ...keyOptions, workspaceId: "workspace-2" })
    ).toEqual([])
  })

  it("retains only the newest prompts", () => {
    const history = Array.from(
      { length: MAX_PROMPT_HISTORY_LENGTH + 5 },
      (_, index) => `prompt-${index}`
    )

    expect(savePromptHistory({ ...keyOptions, history })).toEqual(
      history.slice(-MAX_PROMPT_HISTORY_LENGTH)
    )
    expect(loadPromptHistory(keyOptions)).toEqual(
      history.slice(-MAX_PROMPT_HISTORY_LENGTH)
    )
  })

  it("treats malformed storage as empty history", () => {
    const key = getPromptHistoryStorageKey(keyOptions)
    sessionStorage.setItem(key, "not-json")
    expect(loadPromptHistory(keyOptions)).toEqual([])

    sessionStorage.setItem(key, JSON.stringify(["valid", 123]))
    expect(loadPromptHistory(keyOptions)).toEqual([])
  })

  it("continues with in-memory history when storage fails", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage unavailable")
    })

    expect(savePromptHistory({ ...keyOptions, history: ["first"] })).toEqual([
      "first",
    ])
  })

  it("isolates history by tenant and user", () => {
    savePromptHistory({ ...keyOptions, history: ["first"] })

    expect(loadPromptHistory({ ...keyOptions, userId: "user-2" })).toEqual([])
    expect(loadPromptHistory({ ...keyOptions, tenantId: "tenant-2" })).toEqual(
      []
    )
  })
})

import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  clearChatPreviewSession,
  getChatPreviewSessionKey,
  loadChatPreviewSession,
  saveChatPreviewSession,
} from "./chatPreviewSession"

const key = {
  tenantId: "tenant-1",
  userId: "user-1",
  workspaceId: "workspace-1",
  agentId: "agent-1",
}

const message = (id: string) => ({
  id,
  role: "user" as const,
  parts: [{ type: "text" as const, text: id }],
})

describe("chat preview session", () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it("stores and loads a preview per tenant, user, workspace and agent", () => {
    const session = {
      previewRoleId: "role-1",
      messages: [message("message-1")],
    }

    saveChatPreviewSession({ ...key, session })

    expect(loadChatPreviewSession(key)).toEqual(session)
    expect(getChatPreviewSessionKey(key)).toBe(
      "budibase:chat-preview:tenant-1:user-1:workspace-1:agent-1"
    )
  })

  it("clears the stored preview", () => {
    saveChatPreviewSession({
      ...key,
      session: { previewRoleId: "role-1", messages: [] },
    })

    clearChatPreviewSession(key)

    expect(loadChatPreviewSession(key)).toBeUndefined()
  })

  it("ignores invalid or duplicate message ids", () => {
    sessionStorage.setItem(
      getChatPreviewSessionKey(key),
      JSON.stringify({
        previewRoleId: "role-1",
        messages: [
          { id: "duplicate", role: "user", parts: [] },
          { id: "duplicate", role: "assistant", parts: [] },
        ],
      })
    )

    expect(loadChatPreviewSession(key)).toBeUndefined()
  })

  it("drops oldest cached messages when storage quota is exceeded", () => {
    const originalSetItem = sessionStorage.setItem.bind(sessionStorage)
    vi.spyOn(Storage.prototype, "setItem").mockImplementation((name, value) => {
      if (String(value).includes("message-1")) {
        throw new DOMException(
          "The quota has been exceeded.",
          "QuotaExceededError"
        )
      }
      originalSetItem(name, value)
    })

    saveChatPreviewSession({
      ...key,
      session: {
        previewRoleId: "role-1",
        messages: [message("message-1"), message("message-2")],
      },
    })

    expect(loadChatPreviewSession(key)?.messages.map(item => item.id)).toEqual([
      "message-2",
    ])
  })

  it("clears a stale cache when even an empty session cannot be stored", () => {
    saveChatPreviewSession({
      ...key,
      session: {
        previewRoleId: "role-1",
        messages: [message("stale")],
      },
    })

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException(
        "The quota has been exceeded.",
        "QuotaExceededError"
      )
    })

    saveChatPreviewSession({
      ...key,
      session: {
        previewRoleId: "role-1",
        messages: [message("too-large")],
      },
    })

    expect(loadChatPreviewSession(key)).toBeUndefined()
  })
})

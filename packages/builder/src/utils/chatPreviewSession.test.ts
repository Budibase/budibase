import { beforeEach, describe, expect, it } from "vitest"
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

describe("chat preview session", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("stores and loads a preview per tenant, user, workspace and agent", () => {
    const session = {
      previewRoleId: "role-1",
      messages: [
        {
          id: "message-1",
          role: "user" as const,
          parts: [{ type: "text" as const, text: "Hello" }],
        },
      ],
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
})

import { describe, it, expect, beforeEach, vi } from "vitest"
import { get } from "svelte/store"
import type { ChatApp } from "@budibase/types"

vi.mock("@/api", () => {
  const fetchChatApp = vi.fn()
  const updateChatApp = vi.fn()
  const setChatAppAgent = vi.fn()

  return {
    API: {
      fetchChatApp,
      updateChatApp,
      setChatAppAgent,
    },
  }
})

import { API } from "@/api"
import { chatAppsStore } from "./chatApps"

const fetchChatApp = vi.mocked(API.fetchChatApp)
const updateChatApp = vi.mocked(API.updateChatApp)
const setChatAppAgent = vi.mocked(API.setChatAppAgent)

describe("chatAppsStore", () => {
  beforeEach(() => {
    chatAppsStore.reset()
    fetchChatApp.mockReset()
    updateChatApp.mockReset()
    setChatAppAgent.mockReset()
  })

  it("updates agentId when requested agent differs", async () => {
    const chatApp: ChatApp = {
      _id: "chatapp-1",
      _rev: "1",
      agentId: "agent-1",
    }
    const updated: ChatApp = {
      ...chatApp,
      _rev: "2",
      agentId: "agent-2",
    }
    fetchChatApp.mockResolvedValue(chatApp)
    setChatAppAgent.mockResolvedValue(updated)

    const result = await chatAppsStore.ensureChatApp("workspace-123", "agent-2")

    expect(fetchChatApp).toHaveBeenCalledWith("workspace-123")
    expect(setChatAppAgent).toHaveBeenCalledWith("chatapp-1", "agent-2")
    expect(get(chatAppsStore.store).chatAppId).toEqual("chatapp-1")
    expect(result).toEqual(updated)
  })

  it("returns null when chat app cannot be fetched", async () => {
    fetchChatApp.mockResolvedValue(null)

    const result = await chatAppsStore.ensureChatApp("workspace-123", "agent-2")

    expect(result).toBeNull()
  })
})

import { describe, it, expect, beforeEach, vi } from "vitest"
import { get } from "svelte/store"
import type { ChatApp } from "@budibase/types"

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  const initialState = {
    appId: "workspace-123",
    name: "",
    url: "",
    libraries: [],
    clientFeatures: {
      spectrumThemes: false,
      intelligentLoading: false,
      deviceAwareness: false,
      state: false,
      rowSelection: false,
      customThemes: false,
      devicePreview: false,
      messagePassing: false,
      continueIfAction: false,
      showNotificationAction: false,
      sidePanel: false,
    },
    typeSupportPresets: {},
    features: {
      componentValidation: false,
      disableUserMetadata: false,
    },
    clientLibPath: "",
    hasLock: true,
    appInstance: null,
    initialised: false,
    hasAppPackage: false,
    usedPlugins: [],
    automations: {},
    routes: {},
    scripts: [],
    translationOverrides: {},
  }
  return {
    appStore: writable(initialState),
  }
})

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
import { appStore } from "@/stores/builder"
import { chatAppsStore, currentChatApp } from "./chatApps"

const fetchChatApp = vi.mocked(API.fetchChatApp)
const updateChatApp = vi.mocked(API.updateChatApp)
const setChatAppAgent = vi.mocked(API.setChatAppAgent)

describe("chatAppsStore", () => {
  beforeEach(() => {
    chatAppsStore.reset()
    fetchChatApp.mockReset()
    updateChatApp.mockReset()
    setChatAppAgent.mockReset()
    appStore.set({ ...get(appStore), appId: "workspace-123" })
  })

  it("updates agentId when requested agent differs", async () => {
    const chatApp: ChatApp = {
      _id: "chatapp-1",
      _rev: "1",
      agents: [{ agentId: "agent-1", isEnabled: true, isDefault: false }],
    }
    const createdAgent = {
      agentId: "agent-2",
      isEnabled: true,
      isDefault: false,
    }
    const updated: ChatApp = {
      ...chatApp,
      agents: [...(chatApp.agents || []), createdAgent],
    }
    fetchChatApp.mockResolvedValue(chatApp)
    setChatAppAgent.mockResolvedValue(createdAgent)

    const result = await chatAppsStore.ensureChatApp("agent-2")

    expect(fetchChatApp).toHaveBeenCalledWith("workspace-123")
    expect(setChatAppAgent).toHaveBeenCalledWith("chatapp-1", "agent-2")
    expect(get(chatAppsStore.store).chatAppId).toEqual("chatapp-1")
    expect(get(currentChatApp)).toEqual(updated)
    expect(result).toEqual(updated)
  })

  it("tracks the chat app for the current id", async () => {
    const first: ChatApp = {
      _id: "chatapp-1",
      _rev: "1",
      agents: [],
    }
    const second: ChatApp = {
      _id: "chatapp-2",
      _rev: "2",
      agents: [],
    }
    fetchChatApp.mockResolvedValueOnce(first)
    fetchChatApp.mockResolvedValueOnce(second)

    await chatAppsStore.ensureChatApp()
    expect(get(currentChatApp)).toEqual(first)

    await chatAppsStore.ensureChatApp()
    expect(get(currentChatApp)).toEqual(second)
  })

  it("returns null when chat app cannot be fetched", async () => {
    fetchChatApp.mockResolvedValue(null)

    const result = await chatAppsStore.ensureChatApp("agent-2")

    expect(result).toBeNull()
  })

  it("updates chat app and keeps derived state in sync", async () => {
    const chatApp: ChatApp = {
      _id: "chatapp-1",
      _rev: "1",
      agents: [],
      live: false,
    }
    const updated: ChatApp = {
      ...chatApp,
      _rev: "2",
      live: true,
    }

    fetchChatApp.mockResolvedValue(chatApp)
    updateChatApp.mockResolvedValue(updated)

    await chatAppsStore.ensureChatApp()
    const result = await chatAppsStore.updateChatApp({ live: true })

    expect(updateChatApp).toHaveBeenCalledWith({
      ...chatApp,
      live: true,
    })
    expect(result).toEqual(updated)
    expect(get(currentChatApp)).toEqual(updated)
  })

  it("upserts a missing agent config as disabled", async () => {
    const chatApp: ChatApp = {
      _id: "chatapp-1",
      _rev: "1",
      agents: [{ agentId: "agent-1", isEnabled: true, isDefault: true }],
    }
    const starters = [{ prompt: "How can you help?" }]
    const expectedAgents = [
      ...(chatApp.agents || []),
      {
        agentId: "agent-2",
        isEnabled: false,
        isDefault: false,
        conversationStarters: starters,
      },
    ]
    const updated: ChatApp = {
      ...chatApp,
      _rev: "2",
      agents: expectedAgents,
    }

    fetchChatApp.mockResolvedValue(chatApp)
    updateChatApp.mockResolvedValue(updated)

    const result = await chatAppsStore.upsertAgentConfig({
      agentId: "agent-2",
      updates: { conversationStarters: starters },
    })

    expect(setChatAppAgent).not.toHaveBeenCalled()
    expect(updateChatApp).toHaveBeenCalledWith({
      ...chatApp,
      agents: expectedAgents,
    })
    expect(result).toEqual(updated)
    expect(get(currentChatApp)).toEqual(updated)
  })

  it("upserts an existing agent config without duplicating entries", async () => {
    const chatApp: ChatApp = {
      _id: "chatapp-1",
      _rev: "1",
      agents: [
        { agentId: "agent-1", isEnabled: true, isDefault: true },
        { agentId: "agent-2", isEnabled: false, isDefault: false },
      ],
    }
    const starters = [{ prompt: "Hello there" }]
    const expectedAgents = (chatApp.agents || []).map(agent =>
      agent.agentId === "agent-2"
        ? {
            ...agent,
            conversationStarters: starters,
          }
        : agent
    )
    const updated: ChatApp = {
      ...chatApp,
      _rev: "2",
      agents: expectedAgents,
    }

    fetchChatApp.mockResolvedValue(chatApp)
    updateChatApp.mockResolvedValue(updated)

    const result = await chatAppsStore.upsertAgentConfig({
      agentId: "agent-2",
      updates: { conversationStarters: starters },
    })

    expect(setChatAppAgent).not.toHaveBeenCalled()
    expect(updateChatApp).toHaveBeenCalledWith({
      ...chatApp,
      agents: expectedAgents,
    })
    expect(result).toEqual(updated)
    expect(get(currentChatApp)).toEqual(updated)
  })

  it("normalizes defaults when upsert could create multiple defaults", async () => {
    const chatApp: ChatApp = {
      _id: "chatapp-1",
      _rev: "1",
      agents: [
        { agentId: "agent-1", isEnabled: true, isDefault: true },
        { agentId: "agent-2", isEnabled: true, isDefault: false },
      ],
    }
    const expectedAgents = [
      { agentId: "agent-1", isEnabled: true, isDefault: true },
      { agentId: "agent-2", isEnabled: true, isDefault: false },
    ]
    const updated: ChatApp = {
      ...chatApp,
      _rev: "2",
      agents: expectedAgents,
    }

    fetchChatApp.mockResolvedValue(chatApp)
    updateChatApp.mockResolvedValue(updated)

    const result = await chatAppsStore.upsertAgentConfig({
      agentId: "agent-2",
      updates: { isDefault: true },
    })

    expect(updateChatApp).toHaveBeenCalledWith({
      ...chatApp,
      agents: expectedAgents,
    })
    expect(result).toEqual(updated)
    expect(get(currentChatApp)).toEqual(updated)
  })

  it("clears default on disabled agent during upsert", async () => {
    const chatApp: ChatApp = {
      _id: "chatapp-1",
      _rev: "1",
      agents: [{ agentId: "agent-1", isEnabled: true, isDefault: true }],
    }
    const expectedAgents = [
      { agentId: "agent-1", isEnabled: true, isDefault: true },
      { agentId: "agent-2", isEnabled: false, isDefault: false },
    ]
    const updated: ChatApp = {
      ...chatApp,
      _rev: "2",
      agents: expectedAgents,
    }

    fetchChatApp.mockResolvedValue(chatApp)
    updateChatApp.mockResolvedValue(updated)

    const result = await chatAppsStore.upsertAgentConfig({
      agentId: "agent-2",
      updates: { isDefault: true },
    })

    expect(updateChatApp).toHaveBeenCalledWith({
      ...chatApp,
      agents: expectedAgents,
    })
    expect(result).toEqual(updated)
    expect(get(currentChatApp)).toEqual(updated)
  })
})

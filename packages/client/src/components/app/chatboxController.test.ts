import { describe, expect, it, vi } from "vitest"
import { ChatboxController } from "./chatboxController"

const createController = () => {
  const chatAppId = "chat-app-1"
  const deleteChatConversation = vi.fn(async () => undefined)
  const fetchChatHistory = vi.fn(async () => [])
  const getAgentsResponse = {
    agents: [
      {
        _id: "agent-a",
        name: "Agent A",
        live: true,
      },
      {
        _id: "agent-b",
        name: "Agent B",
        live: true,
      },
    ],
  }
  const get = async <T>(_params: { url: string }) =>
    getAgentsResponse as unknown as T

  const controller = new ChatboxController({
    api: {
      fetchChatApp: async () => ({
        _id: chatAppId,
        agents: [
          {
            agentId: "agent-a",
            isEnabled: true,
            isDefault: true,
          },
          {
            agentId: "agent-b",
            isEnabled: true,
            isDefault: false,
          },
        ],
      }),
      fetchChatHistory,
      deleteChatConversation,
      get,
    },
    notifyError: vi.fn(),
    agentIconColors: ["#6366F1"],
  })

  controller.subscribe(() => undefined)

  return {
    controller,
    chatAppId,
    deleteChatConversation,
    fetchChatHistory,
  }
}

describe("ChatboxController.deleteConversation", () => {
  it("uses the deleted conversation agent scope", async () => {
    const { controller, chatAppId, deleteChatConversation, fetchChatHistory } =
      createController()

    await controller.init("workspace-1")
    await controller.selectAgent("agent-a")

    await controller.deleteConversation("conversation-b", "agent-b")

    expect(deleteChatConversation).toHaveBeenCalledWith(
      "conversation-b",
      chatAppId,
      "agent-b"
    )
    expect(fetchChatHistory).toHaveBeenLastCalledWith(chatAppId, "agent-b")
  })

  it("falls back to selected agent when conversation agent is missing", async () => {
    const { controller, chatAppId, deleteChatConversation, fetchChatHistory } =
      createController()

    await controller.init("workspace-1")
    await controller.selectAgent("agent-a")

    await controller.deleteConversation("conversation-a")

    expect(deleteChatConversation).toHaveBeenCalledWith(
      "conversation-a",
      chatAppId,
      "agent-a"
    )
    expect(fetchChatHistory).toHaveBeenLastCalledWith(chatAppId, "agent-a")
  })
})

const mockTryGet = jest.fn()
const mockPut = jest.fn()
const mockFilesInfo = jest.fn()
const mockPersistAttachment = jest.fn()
const mockCreateVectorStore = jest.fn()
const mockIngestFile = jest.fn()
const mockDeleteVectorStore = jest.fn()
const mockWebhookChat = jest.fn()
const mockReply = jest.fn()
const mockFormatReply = jest.fn()
const mockCanAccess = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: () => ({
        tryGet: (id: string) => mockTryGet(id),
        put: (doc: object) => mockPut(doc),
      }),
      getWorkspaceId: () => "workspace_1",
      getTenantId: () => "tenant_1",
    },
    locks: {
      doWithLock: async (_options: object, task: () => Promise<void>) => {
        await task()
        return { executed: true }
      },
    },
    blacklist: {
      isBlacklisted: jest.fn().mockResolvedValue(false),
    },
  }
})

jest.mock("@slack/web-api", () => ({
  WebClient: jest.fn(() => ({
    files: { info: (args: object) => mockFilesInfo(args) },
  })),
}))

jest.mock("../../../sdk", () => ({
  __esModule: true,
  default: {
    ai: {
      agents: { getOrThrow: jest.fn().mockResolvedValue({ _id: "agent_1" }) },
      deployments: {
        slack: {
          validateSlackIntegration: jest.fn(() => ({
            botToken: "xoxb-token",
            signingSecret: "secret",
          })),
        },
      },
      chatConversations: {
        persistConversationAttachment: (args: object) =>
          mockPersistAttachment(args),
      },
      knowledgeBase: {
        createGeminiFileStore: (name: string) => mockCreateVectorStore(name),
        deleteGeminiVectorStore: (id: string) => mockDeleteVectorStore(id),
        ingestGeminiFile: (args: object) => mockIngestFile(args),
      },
    },
  },
}))

jest.mock("../../../utilities/global", () => ({
  getGlobalUser: jest.fn(),
}))

jest.mock("../ai/chatApps", () => ({
  canAccessChatAppAgentForUser: (user: object, config: object) =>
    mockCanAccess(user, config),
}))

jest.mock("../ai/chatConversations", () => ({
  webhookChat: (args: object) => mockWebhookChat(args),
}))

jest.mock("../../../escalation/notifications/slack", () => ({
  replyToConversation: (args: object) => mockReply(args),
}))

jest.mock("../../../escalation/notifications/ms-teams", () => ({
  replyToConversation: (args: object) => mockReply(args),
}))

jest.mock("./slack", () => ({
  formatSlackAssistantReply: (args: object) => mockFormatReply(args),
}))

jest.mock("./ms-teams", () => ({
  formatTeamsQueuedAssistantReply: (args: object) => mockFormatReply(args),
}))

import {
  AgentChannelProvider,
  type ChatConversation,
  ConversationAttachmentStatus,
  ConversationAttachmentTurnStatus,
} from "@budibase/types"
import { blacklist, encryption } from "@budibase/backend-core"
import { processConversationAttachmentJob } from "./conversationAttachmentProcessor"

describe("conversation attachment processor", () => {
  let conversation: ChatConversation

  const useTeamsAttachment = () => {
    conversation.userId = "msteams:tenant-1:user-1"
    conversation.channel = {
      provider: AgentChannelProvider.MSTEAMS,
      conversationId: "conversation-1",
      conversationType: "personal",
      threadId: "teams:conversation-1",
    }
    conversation.attachments = [
      {
        ...conversation.attachments![0],
        provider: AgentChannelProvider.MSTEAMS,
        providerFileId: "drive-item-1:etag-1",
        encryptedDownloadUrl: encryption.encrypt(
          "https://files.example.com/report.txt"
        ),
        size: undefined,
      },
    ]
  }

  beforeEach(() => {
    jest.clearAllMocks()
    const now = new Date().toISOString()
    conversation = {
      _id: "chat_1",
      _rev: "1-a",
      chatAppId: "chatapp_1",
      agentId: "agent_1",
      userId: "slack:T1:U1",
      title: "Report",
      messages: [],
      channel: {
        provider: AgentChannelProvider.SLACK,
        channelId: "D1",
        threadId: "slack:D1:1",
        conversationType: "im",
      },
      attachments: [
        {
          id: "attachment_1",
          provider: AgentChannelProvider.SLACK,
          providerFileId: "F1",
          filename: "report.txt",
          mimetype: "text/plain",
          size: 7,
          status: ConversationAttachmentStatus.QUEUED,
          uploadedAt: now,
        },
      ],
      pendingAttachmentTurns: [
        {
          id: "turn_1",
          message: {
            id: "message_1",
            role: "user",
            parts: [{ type: "text", text: "What is in the report?" }],
          },
          attachmentIds: ["attachment_1"],
          status: ConversationAttachmentTurnStatus.QUEUED,
          requester: {
            userId: "slack:T1:U1",
            linked: false,
            displayName: "User",
          },
          createdAt: now,
          updatedAt: now,
        },
      ],
    }
    mockTryGet.mockImplementation(async (id: string) =>
      id === "chatapp_1"
        ? {
            _id: "chatapp_1",
            agents: [{ agentId: "agent_1", isEnabled: true, isDefault: true }],
          }
        : conversation
    )
    mockPut.mockImplementation(async (doc: ChatConversation) => {
      conversation = { ...doc, _rev: "2-b" }
      return { rev: "2-b" }
    })
    mockFilesInfo.mockResolvedValue({
      file: {
        id: "F1",
        name: "report.txt",
        mimetype: "text/plain",
        size: 7,
        url_private_download: "https://files.example.com/report.txt",
      },
    })
    jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("content", { status: 200 }))
    mockPersistAttachment.mockResolvedValue({ textLength: 7 })
    mockCreateVectorStore.mockResolvedValue("store_1")
    mockIngestFile.mockResolvedValue({ fileId: "rag_file_1" })
    mockCanAccess.mockResolvedValue(true)
    mockWebhookChat.mockResolvedValue({
      messages: [
        conversation.pendingAttachmentTurns![0].message,
        {
          id: "assistant_1",
          role: "assistant",
          parts: [{ type: "text", text: "The report says content." }],
        },
      ],
      assistantText: "The report says content.",
    })
    mockFormatReply.mockResolvedValue("The report says content.")
    mockReply.mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("ingests the file, runs the queued turn, and replies", async () => {
    await processConversationAttachmentJob({
      workspaceId: "workspace_1",
      conversationId: "chat_1",
      turnId: "turn_1",
    })

    expect(mockCreateVectorStore).toHaveBeenCalledWith("Conversation chat_1")
    expect(mockIngestFile).toHaveBeenCalledWith(
      expect.objectContaining({
        vectorStoreId: "store_1",
        filename: "report.txt",
        buffer: Buffer.from("content"),
      })
    )
    expect(conversation.attachments?.[0]).toEqual(
      expect.objectContaining({
        status: ConversationAttachmentStatus.READY,
        ragSourceId: "rag_file_1",
      })
    )
    expect(conversation.pendingAttachmentTurns?.[0].status).toEqual(
      ConversationAttachmentTurnStatus.COMPLETED
    )
    expect(mockReply).toHaveBeenCalledWith(
      expect.objectContaining({ text: "The report says content." })
    )
  })

  it("retries transient failures before recording a final failure", async () => {
    jest
      .mocked(globalThis.fetch)
      .mockResolvedValue(new Response("Unavailable", { status: 503 }))

    await expect(
      processConversationAttachmentJob(
        {
          workspaceId: "workspace_1",
          conversationId: "chat_1",
          turnId: "turn_1",
        },
        false
      )
    ).rejects.toThrow("Failed to download report.txt from Slack")
    expect(conversation.attachments?.[0].status).toEqual(
      ConversationAttachmentStatus.PROCESSING
    )

    await processConversationAttachmentJob(
      {
        workspaceId: "workspace_1",
        conversationId: "chat_1",
        turnId: "turn_1",
      },
      true
    )

    expect(conversation.attachments?.[0].status).toEqual(
      ConversationAttachmentStatus.FAILED
    )
    expect(conversation.pendingAttachmentTurns?.[0].status).toEqual(
      ConversationAttachmentTurnStatus.COMPLETED
    )
    expect(mockReply).toHaveBeenCalledWith(
      expect.objectContaining({ text: "I couldn't process report.txt." })
    )
  })

  it("downloads and ingests a Teams personal-chat file", async () => {
    useTeamsAttachment()

    await processConversationAttachmentJob({
      workspaceId: "workspace_1",
      conversationId: "chat_1",
      turnId: "turn_1",
    })

    expect(mockFilesInfo).not.toHaveBeenCalled()
    expect(conversation.attachments?.[0]).toEqual(
      expect.objectContaining({
        provider: AgentChannelProvider.MSTEAMS,
        size: Buffer.byteLength("content"),
        status: ConversationAttachmentStatus.READY,
      })
    )
    expect(conversation.attachments?.[0].encryptedDownloadUrl).toBeUndefined()
    expect(mockReply).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: expect.objectContaining({
          provider: AgentChannelProvider.MSTEAMS,
        }),
      })
    )
  })

  it("rejects Teams downloads that exceed the file limit", async () => {
    useTeamsAttachment()
    jest.mocked(globalThis.fetch).mockResolvedValue(
      new Response("content", {
        status: 200,
        headers: { "content-length": String(20 * 1024 * 1024 + 1) },
      })
    )

    await processConversationAttachmentJob({
      workspaceId: "workspace_1",
      conversationId: "chat_1",
      turnId: "turn_1",
    })

    expect(conversation.attachments?.[0]).toEqual(
      expect.objectContaining({
        status: ConversationAttachmentStatus.FAILED,
        errorMessage: "report.txt exceeds the 20 MB file limit",
      })
    )
    expect(conversation.attachments?.[0].encryptedDownloadUrl).toBeUndefined()
    expect(mockIngestFile).not.toHaveBeenCalled()
  })

  it("rejects unsafe Teams download targets", async () => {
    useTeamsAttachment()
    jest.mocked(blacklist.isBlacklisted).mockResolvedValueOnce(true)

    await processConversationAttachmentJob({
      workspaceId: "workspace_1",
      conversationId: "chat_1",
      turnId: "turn_1",
    })

    expect(globalThis.fetch).not.toHaveBeenCalled()
    expect(conversation.attachments?.[0]).toEqual(
      expect.objectContaining({
        status: ConversationAttachmentStatus.FAILED,
        errorMessage: "report.txt has an unsafe download URL",
      })
    )
  })
})

const mockTryGet = jest.fn()
const mockPut = jest.fn()
const mockFilesInfo = jest.fn()
const mockPersistAttachment = jest.fn()
const mockCreateVectorStore = jest.fn()
const mockIngestFile = jest.fn()
const mockDeleteVectorStore = jest.fn()
const mockWebhookChat = jest.fn()
const mockReply = jest.fn()
const mockTeamsReply = jest.fn()
const mockFormatReply = jest.fn()
const mockGetFileUrlForAgent = jest.fn()

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
  }
})

jest.mock("@slack/web-api", () => ({
  ErrorCode: {
    PlatformError: "slack_webapi_platform_error",
  },
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
      rag: {
        getFileUrlForAgent: (agentId: string, fileId: string) =>
          mockGetFileUrlForAgent(agentId, fileId),
      },
    },
  },
}))

jest.mock("../../../utilities/global", () => ({
  getGlobalUser: jest.fn(),
}))

jest.mock("../ai/chatConversations", () => ({
  webhookChat: (args: object) => mockWebhookChat(args),
}))

jest.mock("../../../escalation/notifications/slack", () => ({
  replyToConversation: (args: object) => mockReply(args),
}))

jest.mock("../../../escalation/notifications/ms-teams", () => ({
  replyToConversation: (args: object) => mockTeamsReply(args),
}))

jest.mock("./slack", () => ({
  formatSlackAssistantReply: (args: object) => mockFormatReply(args),
}))

import nock from "nock"
import { encryption } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type ChatConversation,
  type WebhookChatSourceMetadata,
  ConversationAttachmentStatus,
  ConversationAttachmentTurnStatus,
} from "@budibase/types"
import { processConversationAttachmentJob } from "./conversationAttachmentProcessor"
import { getTeamsAttachments, getTeamsFileData } from "./teamsAttachments"

describe("conversation attachment processor", () => {
  let conversation: ChatConversation
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>

  beforeEach(() => {
    jest.clearAllMocks()
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation()
    const now = new Date().toISOString()
    conversation = {
      _id: "chat_1",
      _rev: "1-a",
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
    mockTryGet.mockImplementation(async () => conversation)
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
    mockTeamsReply.mockReset().mockResolvedValue(undefined)
    mockGetFileUrlForAgent
      .mockReset()
      .mockResolvedValue("https://example.com/signed/policy.pdf")
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it.each([true, false])(
    "processes Teams personal files with question=%s",
    async question => {
      conversation.channel = {
        provider: AgentChannelProvider.MSTEAMS,
        conversationType: "personal",
        conversationId: "teams_conversation",
      }
      conversation.attachments![0] = {
        ...conversation.attachments![0],
        provider: AgentChannelProvider.MSTEAMS,
        encryptedDownloadUrl: encryption.encrypt(
          "https://example.sharepoint.com/report.txt"
        ),
        size: 0,
      }
      if (!question) {
        conversation.pendingAttachmentTurns![0].message.parts = [
          { type: "text", text: "[Attached files: report.txt]" },
        ]
      }
      nock("https://example.sharepoint.com")
        .get("/report.txt")
        .reply(200, "content")

      await processConversationAttachmentJob({
        workspaceId: "workspace_1",
        conversationId: "chat_1",
        turnId: "turn_1",
      })

      expect(conversation.attachments![0]).toEqual(
        expect.objectContaining({
          status: ConversationAttachmentStatus.READY,
          size: 7,
          encryptedDownloadUrl: undefined,
        })
      )
      expect(mockTeamsReply).toHaveBeenCalledWith(
        expect.objectContaining({
          text: question ? "The report says content." : "Ready: report.txt.",
        })
      )
      expect(mockReply).not.toHaveBeenCalled()
      expect(mockFilesInfo).not.toHaveBeenCalled()
    }
  )

  it("sends a fallback when a queued Teams answer is empty", async () => {
    conversation.channel = {
      provider: AgentChannelProvider.MSTEAMS,
      conversationType: "personal",
      conversationId: "teams_conversation",
    }
    conversation.attachments![0] = {
      ...conversation.attachments![0],
      provider: AgentChannelProvider.MSTEAMS,
      status: ConversationAttachmentStatus.READY,
    }
    mockWebhookChat.mockResolvedValueOnce({
      messages: conversation.messages,
      assistantText: "",
    })

    await processConversationAttachmentJob({
      workspaceId: "workspace_1",
      conversationId: "chat_1",
      turnId: "turn_1",
    })

    expect(mockTeamsReply).toHaveBeenCalledWith(
      expect.objectContaining({ text: "No response generated." })
    )
    expect(conversation.pendingAttachmentTurns).toEqual([
      expect.objectContaining({
        status: ConversationAttachmentTurnStatus.COMPLETED,
        responseText: "No response generated.",
      }),
    ])
  })

  describe("Teams knowledge sources", () => {
    const responseSources: WebhookChatSourceMetadata = {
      ragSources: [
        {
          sourceId: "source_1",
          fileId: "file_1",
          filename: "Policy [One]\n@Draft.pdf",
        },
      ],
      allowKnowledgeSourceDownload: true,
    }
    const job = {
      workspaceId: "workspace_1",
      conversationId: "chat_1",
      turnId: "turn_1",
    }

    beforeEach(() => {
      conversation.channel = {
        provider: AgentChannelProvider.MSTEAMS,
        conversationType: "personal",
        conversationId: "teams_conversation",
      }
      conversation.attachments![0] = {
        ...conversation.attachments![0],
        provider: AgentChannelProvider.MSTEAMS,
        status: ConversationAttachmentStatus.READY,
      }
      mockWebhookChat.mockResolvedValue({
        messages: conversation.messages,
        assistantText: "The report follows the policy.",
        ...responseSources,
      })
    })

    it("includes a Sources card with a queued answer", async () => {
      await processConversationAttachmentJob(job)

      expect(mockTeamsReply).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "The report follows the policy.",
          sourceCard: {
            type: "card",
            title: "Sources",
            children: [
              {
                type: "actions",
                children: [
                  {
                    type: "link_button",
                    label: "Policy One Draft.pdf",
                    url: "https://example.com/signed/policy.pdf",
                  },
                ],
              },
            ],
          },
        })
      )
      expect(conversation.pendingAttachmentTurns).toEqual([
        expect.objectContaining({
          status: ConversationAttachmentTurnStatus.COMPLETED,
          responseSources,
        }),
      ])
    })

    it("regenerates source links on delivery retry without rerunning the model", async () => {
      mockTeamsReply.mockRejectedValueOnce(new Error("Teams unavailable"))
      mockGetFileUrlForAgent
        .mockResolvedValueOnce("https://example.com/signed/first")
        .mockResolvedValueOnce("https://example.com/signed/retry")

      await expect(
        processConversationAttachmentJob(job, false)
      ).rejects.toThrow("Teams unavailable")
      await processConversationAttachmentJob(job)

      expect(mockWebhookChat).toHaveBeenCalledTimes(1)
      expect(mockGetFileUrlForAgent).toHaveBeenCalledTimes(2)
      expect(mockGetFileUrlForAgent).toHaveBeenLastCalledWith(
        "agent_1",
        "file_1"
      )
      expect(mockTeamsReply).toHaveBeenLastCalledWith(
        expect.objectContaining({
          sourceCard: expect.objectContaining({
            children: [
              {
                type: "actions",
                children: [
                  expect.objectContaining({
                    url: "https://example.com/signed/retry",
                  }),
                ],
              },
            ],
          }),
        })
      )
      expect(conversation.pendingAttachmentTurns![0].status).toBe(
        ConversationAttachmentTurnStatus.COMPLETED
      )
    })

    it.each(["channel", "groupChat", undefined])(
      "omits source links for conversation type %s",
      async conversationType => {
        conversation.channel!.conversationType = conversationType

        await processConversationAttachmentJob(job)

        expect(mockGetFileUrlForAgent).not.toHaveBeenCalled()
        expect(mockTeamsReply).toHaveBeenCalledWith(
          expect.objectContaining({ sourceCard: undefined })
        )
      }
    )

    it("preserves disabled downloads on a delivery retry", async () => {
      mockWebhookChat.mockResolvedValueOnce({
        messages: conversation.messages,
        assistantText: "The report follows the policy.",
        ...responseSources,
        allowKnowledgeSourceDownload: false,
      })
      mockTeamsReply.mockRejectedValueOnce(new Error("Teams unavailable"))

      await expect(
        processConversationAttachmentJob(job, false)
      ).rejects.toThrow("Teams unavailable")
      await processConversationAttachmentJob(job)

      expect(mockGetFileUrlForAgent).not.toHaveBeenCalled()
      expect(mockTeamsReply).toHaveBeenLastCalledWith(
        expect.objectContaining({ sourceCard: undefined })
      )
      expect(conversation.pendingAttachmentTurns![0].status).toBe(
        ConversationAttachmentTurnStatus.COMPLETED
      )
    })

    it("still delivers the answer if a source link cannot be generated", async () => {
      mockGetFileUrlForAgent.mockRejectedValueOnce(
        new Error("File unavailable")
      )

      await processConversationAttachmentJob(job)

      expect(mockTeamsReply).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "The report follows the policy.",
          sourceCard: undefined,
        })
      )
      expect(conversation.pendingAttachmentTurns![0].status).toBe(
        ConversationAttachmentTurnStatus.COMPLETED
      )
    })
  })

  it("rejects Teams download URLs outside SharePoint", async () => {
    await expect(
      getTeamsFileData({
        ...conversation.attachments![0],
        encryptedDownloadUrl: encryption.encrypt(
          "https://example.com/report.txt"
        ),
      })
    ).rejects.toThrow("Invalid Teams file download URL")
  })

  it.each([401, 403])(
    "directs users to their admin when Teams denies file access (%s)",
    async status => {
      conversation.channel = {
        provider: AgentChannelProvider.MSTEAMS,
        conversationType: "personal",
        conversationId: "teams_conversation",
      }
      conversation.attachments![0] = {
        ...conversation.attachments![0],
        provider: AgentChannelProvider.MSTEAMS,
        encryptedDownloadUrl: encryption.encrypt(
          "https://example.sharepoint.com/report.txt"
        ),
      }
      nock("https://example.sharepoint.com").get("/report.txt").reply(status)

      await processConversationAttachmentJob(
        {
          workspaceId: "workspace_1",
          conversationId: "chat_1",
          turnId: "turn_1",
        },
        false
      )

      expect(mockTeamsReply).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "I couldn't access report.txt. Use /new and upload the file again. If it still fails, ask your Teams admin to check this app's file access and update it with the latest app package from Budibase.",
        })
      )
    }
  )

  it("rejects oversized Teams downloads", async () => {
    nock("https://example.sharepoint.com")
      .get("/large.txt")
      .reply(200, Buffer.alloc(20 * 1024 * 1024 + 1))
    await expect(
      getTeamsFileData({
        ...conversation.attachments![0],
        encryptedDownloadUrl: encryption.encrypt(
          "https://example.sharepoint.com/large.txt"
        ),
      })
    ).rejects.toThrow("exceeds the 20 MB file limit")
  })

  it.each(["personal", "channel", "groupChat"])(
    "extracts files only for personal chats: %s",
    conversationType => {
      expect(
        getTeamsAttachments({
          conversation: { conversationType },
          attachments: [
            {
              contentType: "application/vnd.microsoft.teams.file.download.info",
              name: "report.txt",
              content: {
                uniqueId: "file_1",
                downloadUrl: "https://example.com/report.txt",
              },
            },
          ],
        })
      ).toEqual(
        conversationType === "personal"
          ? [
              {
                providerFileId: "file_1",
                filename: "report.txt",
                mimetype: "text/plain",
                downloadUrl: "https://example.com/report.txt",
              },
            ]
          : []
      )
    }
  )

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

  it("explains how to grant the missing Slack file permission", async () => {
    mockFilesInfo.mockRejectedValue(
      Object.assign(new Error("An API error occurred: missing_scope"), {
        code: "slack_webapi_platform_error",
        data: {
          ok: false,
          error: "missing_scope",
          needed: "files:read",
          provided: "chat:write",
        },
      })
    )

    await processConversationAttachmentJob(
      {
        workspaceId: "workspace_1",
        conversationId: "chat_1",
        turnId: "turn_1",
      },
      false
    )

    expect(conversation.attachments?.[0]).toEqual(
      expect.objectContaining({
        status: ConversationAttachmentStatus.FAILED,
        errorCode: "slack_missing_files_read_scope",
      })
    )
    expect(conversation.pendingAttachmentTurns?.[0].status).toEqual(
      ConversationAttachmentTurnStatus.COMPLETED
    )
    expect(mockReply).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "I couldn't access report.txt because this Slack app is missing the `files:read` permission. Ask a Slack workspace admin to reinstall the app, then upload the file again.",
      })
    )
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Conversation attachment processing failed",
      expect.objectContaining({
        conversationId: "chat_1",
        providerFileId: "F1",
        errorCode: "slack_missing_files_read_scope",
      })
    )
  })
})
